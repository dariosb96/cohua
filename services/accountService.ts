import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const userService = {
  async create(data: {
    name: string
    email: string
    password: string
    phone?: string
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword
      }
    })
  },

  async getAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        accounts: true
      }
    })
  },

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        accounts: true
      }
    })
  },

  async update(id: string, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10)
    }

    return prisma.user.update({
      where: { id },
      data
    })
  },

  async delete(id: string) {
    return prisma.user.delete({
      where: { id }
    })
  }
}