import prisma from "@/lib/prisma"
import { calculateTradeMetrics } from "@/lib/tradeCalculator"

import { auth } from "@/lib/auth"

export async function createTrade(data: any) {
  const session = await auth()

  if (!session) {
    throw new Error("Unauthorized")
  }

  const metrics = calculateTradeMetrics(
    data.entry,
    data.stopLoss,
    data.exit,
    data.size
  )

return prisma.trade.create({
  data: {
    ...data,
    accountId: data.accountId, 
    risk: metrics.risk,
    pnl: metrics.pnl,
    result: metrics.result
  }
})
}

export async function getTrades() {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  return prisma.trade.findMany({
    where: {
      account: {
        userId: session.user.id
      }
    },
    orderBy: { createdAt: "desc" },
    include: {
      setup: true,
      tags: true
    }
  })
}
export async function getTrade(id: string) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  return prisma.trade.findFirst({
    where: {
      id,
      account: {
        userId: session.user.id
      }
    },
    include: {
      setup: true,
      tags: true
    }
  })
}

export async function updateTrade(id: string, data: any) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

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

  const entry = data.entry ?? existing.entry
  const stopLoss = data.stopLoss ?? existing.stopLoss
  const exit = data.exit ?? existing.exit
  const size = data.size ?? existing.size

  const metrics = calculateTradeMetrics(
    entry,
    stopLoss,
    exit,
    size
  )

  return prisma.trade.update({
    where: { id },
    data: {
      ...data,
      risk: metrics.risk,
      pnl: metrics.pnl,
      result: metrics.result
    }
  })
}

export async function deleteTrade(id: string) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const existing = await prisma.trade.findFirst({
    where: {
      id,
      account: {
        userId: session.user.id // ✅ correcto
      }
    }
  })

  if (!existing) {
    throw new Error("Trade not found")
  }

  return prisma.trade.delete({
    where: { id }
  })
}