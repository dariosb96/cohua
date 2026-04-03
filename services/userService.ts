import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

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

  async create(data: CreateUserDTO) {
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
    return prisma.user.findMany({
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
    if (!id) throw new Error("ID requerido")

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
    if (!id) throw new Error("ID requerido")

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
    if (!id) throw new Error("ID requerido")

    return prisma.user.delete({
      where: { id }
    })
  }
}