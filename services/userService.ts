import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { auth } from "@/lib/auth"

type CreateUserDTO = {
  name: string
  email: string
  password: string
  phone?: string
}

type UpdateUserDTO = {
  name?: string
  email?: string
  phone?: string
  password?: string
}

export const userService = {

  // 🔥 REGISTRO
  async create(data: CreateUserDTO) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existing) {
      throw new Error("Email already in use")
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true
      }
    })
  },

  async getAll() {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true
      }
    })
  },


  async getMe() {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    return prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        accounts: {
          select: {
            id: true,
            name: true,
            balance: true,
            createdAt: true
          }
        }
      }
    })
  },

  async getById(id: string) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    if (session.user.id !== id) {
      throw new Error("Forbidden")
    }

    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        accounts: {
          select: {
            id: true,
            name: true,
            balance: true,
            createdAt: true
          }
        }
      }
    })
  },

  async update(id: string, data: UpdateUserDTO) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    if (session.user.id !== id) {
      throw new Error("Forbidden")
    }

    const updateData: UpdateUserDTO = { ...data }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10)
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        updatedAt: true
      }
    })
  },
  async delete(id: string) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    if (session.user.id !== id) {
      throw new Error("Forbidden")
    }

    return prisma.user.delete({
      where: { id }
    })
  }
}