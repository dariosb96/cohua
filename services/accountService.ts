import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

type CreateAccountDTO = {
  name: string
  balance: number
}

type UpdateAccountDTO = {
  name?: string
  balance?: number
}

export const accountService = {
  // ✅ CREATE
  async create(data: CreateAccountDTO) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Unauthorized")

    return prisma.account.create({
      data: {
        name: data.name,
        balance: data.balance,
        userId: session.user.id
      },
      select: {
        id: true,
        name: true,
        balance: true,
        createdAt: true
      }
    })
  },

  // ✅ GET ALL (solo del usuario)
  async getAll() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Unauthorized")

    return prisma.account.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        name: true,
        balance: true,
        createdAt: true
      }
    })
  },

  // ✅ GET ONE
  async getById(id: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Unauthorized")

    const account = await prisma.account.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      select: {
        id: true,
        name: true,
        balance: true,
        createdAt: true,
        trades: {
          select: {
            id: true,
            symbol: true,
            pnl: true,
            createdAt: true
          }
        }
      }
    })

    if (!account) throw new Error("Not found")

    return account
  },

  // ✅ UPDATE
  async update(id: string, data: UpdateAccountDTO) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Unauthorized")

    // 🔥 validación de ownership
    const account = await prisma.account.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!account) throw new Error("Forbidden")

    return prisma.account.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        balance: true,
        updatedAt: true
      }
    })
  },

  // ✅ DELETE
  async delete(id: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Unauthorized")

    const account = await prisma.account.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!account) throw new Error("Forbidden")

    return prisma.account.delete({
      where: { id }
    })
  }
}