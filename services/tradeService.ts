import prisma from "@/lib/prisma"

import { calculateTradeMetrics } from "@/lib/tradeCalculator"

import { authOptions } from "@/lib/authOptions"

import { getServerSession } from "next-auth"

export async function createTrade(data: any) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const metrics = calculateTradeMetrics(
    Number(data.entryPrice),
    Number(data.stopLoss),
    Number(data.exitPrice),
    Number(data.size)
  )

  return prisma.trade.create({
    data: {
      ...data,

      riskAmount: metrics.risk,

      pnl: metrics.pnl,

      result: metrics.result
    },

    include: {
      setup: true,

      tags: {
        include: {
          tag: true
        }
      },

      context: true,

      marketSnapshot: true,

      executions: true,

      confluences: true,

      allocation: true
    }
  })
}

export async function getTrades() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  return prisma.trade.findMany({
    where: {
      account: {
        userId: session.user.id
      }
    },

    orderBy: {
      createdAt: "desc"
    },

    include: {
      setup: true,

      tags: {
        include: {
          tag: true
        }
      },

      context: true,

      marketSnapshot: true,

      executions: true,

      confluences: true,

      allocation: true
    }
  })
}

export async function getTrade(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const trade = await prisma.trade.findFirst({
    where: {
      id,

      account: {
        userId: session.user.id
      }
    },

    include: {
      setup: true,

      ob: true,

      tags: {
        include: {
          tag: true
        }
      },

      context: true,

      marketSnapshot: true,

      executions: true,

      confluences: true,

      allocation: true
    }
  })

  if (!trade) {
    throw new Error("Trade not found")
  }

  return trade
}

export async function updateTrade(
  id: string,
  data: any
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const existing = await prisma.trade.findFirst({
    where: {
      id,

      account: {
        userId: session.user.id
      }
    }
  })

  if (!existing) {
    throw new Error("Trade not found")
  }

  const entryPrice =
    data.entryPrice ?? existing.entryPrice

  const stopLoss =
    data.stopLoss ?? existing.stopLoss

  const exitPrice =
    data.exitPrice ?? existing.exitPrice

  const size =
    data.size ?? existing.size

  const metrics = calculateTradeMetrics(
    Number(entryPrice),
    Number(stopLoss),
    Number(exitPrice),
    Number(size)
  )

  return prisma.trade.update({
    where: {
      id
    },

    data: {
      ...data,

      riskAmount: metrics.risk,

      pnl: metrics.pnl,

      result: metrics.result
    },

    include: {
      setup: true,

      tags: {
        include: {
          tag: true
        }
      },

      context: true,

      marketSnapshot: true,

      executions: true,

      confluences: true,

      allocation: true
    }
  })
}

export async function deleteTrade(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const existing = await prisma.trade.findFirst({
    where: {
      id,

      account: {
        userId: session.user.id
      }
    }
  })

  if (!existing) {
    throw new Error("Trade not found")
  }

  return prisma.trade.delete({
    where: {
      id
    }
  })
}