import prisma from "@/src/infrastructure/database/prisma"
import { Decimal } from "@prisma/client/runtime/library"

type CreateAccountInput = {
  userId: string
  name: string
  balance: number
  exchange?: "BINANCE" | "BYBIT" | "OKX" | "BITGET" | "KUCOIN" | "MEXC"
  apiKey?: string
  apiSecret?: string
}

type UpdateAccountInput = {
  name?: string
  balance?: number
  balanceHigh?: number
  balanceLow?: number
  exchange?: "BINANCE" | "BYBIT" | "OKX" | "BITGET" | "KUCOIN" | "MEXC"
  apiKey?: string
  apiSecret?: string
  isActive?: boolean
}

export const accountService = {
  async getAll(userId: string) {
    return prisma.account.findMany({
      where: {
        userId
      },
      include: {
        _count: {
          select: {
            trades: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  },

  async getById(id: string, userId: string) {
    const account = await prisma.account.findFirst({
      where: {
        id,
        userId
      },
      include: {
        trades: {
          take: 20,
          orderBy: {
            createdAt: "desc"
          }
        },
        allocations: true,
        _count: {
          select: {
            trades: true
          }
        }
      }
    })

    if (!account) {
      throw new Error("Account not found")
    }

    return account
  },

  async create(data: CreateAccountInput) {
    return prisma.account.create({
      data: {
        userId: data.userId,
        name: data.name,
        balance: new Decimal(data.balance),
        balanceHigh: new Decimal(data.balance),
        balanceLow: new Decimal(data.balance),
        exchange: data.exchange || null,
        apiKey: data.apiKey,
        apiSecret: data.apiSecret
      }
    })
  },

  async update(
    id: string,
    userId: string,
    data: UpdateAccountInput
  ) {
    const existing = await prisma.account.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!existing) {
      throw new Error("Account not found")
    }

    return prisma.account.update({
      where: {
        id
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name
        }),
        ...(data.balance !== undefined && {
          balance: new Decimal(data.balance)
        }),
        ...(data.balanceHigh !== undefined && {
          balanceHigh: new Decimal(data.balanceHigh)
        }),
        ...(data.balanceLow !== undefined && {
          balanceLow: new Decimal(data.balanceLow)
        }),
        ...(data.exchange !== undefined && {
          exchange: data.exchange || null
        }),
        ...(data.apiKey !== undefined && {
          apiKey: data.apiKey
        }),
        ...(data.apiSecret !== undefined && {
          apiSecret: data.apiSecret
        }),
        ...(data.isActive !== undefined && {
          isActive: data.isActive
        })
      }
    })
  },

  async delete(id: string, userId: string) {
    const existing = await prisma.account.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!existing) {
      throw new Error("Account not found")
    }

    return prisma.account.delete({
      where: {
        id
      }
    })
  }
}