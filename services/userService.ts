import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

import { profileSelect } from "@/lib/prisma/user.select"

import { toProfileUser } from "@/mappers/user.mapper"

import type {
  CreateUserDTO,
  UpdateUserDTO,
  ProfileUser,
} from "@/types/user"

export const userService = {
  async create(
    data: CreateUserDTO
  ): Promise<ProfileUser> {
    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: data.email,
          },
          {
            username: data.username,
          },
        ],
      },
    })

    if (exists) {
      throw new Error("USER_EXISTS")
    }

    const password = await bcrypt.hash(
      data.password,
      10
    )

    const user = await prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        phone: data.phone,
        password,
        role: "USER",
        plan: "FREE",
      },
      select: profileSelect,
    })

    return toProfileUser(user)
  },

  async getMe(
    userId: string
  ): Promise<ProfileUser> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: profileSelect,
    })

    if (!user) {
      throw new Error("USER_NOT_FOUND")
    }

    return toProfileUser(user)
  },

  async getById(
    userId: string
  ): Promise<ProfileUser> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: profileSelect,
    })

    if (!user) {
      throw new Error("USER_NOT_FOUND")
    }

    return toProfileUser(user)
  },

  async update(
    userId: string,
    data: UpdateUserDTO
  ): Promise<ProfileUser> {
    const updateData: Record<string, unknown> = {}

    if (data.name !== undefined) {
      updateData.name = data.name
    }

    if (data.email !== undefined) {
      updateData.email = data.email
    }

    if (data.phone !== undefined) {
      updateData.phone = data.phone
    }

    if (data.avatar !== undefined) {
      updateData.avatar = data.avatar
    }

    if (data.bio !== undefined) {
      updateData.bio = data.bio
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(
        data.password,
        10
      )
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      select: profileSelect,
    })

    return toProfileUser(user)
  },

  async delete(userId: string) {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    })
  },
}