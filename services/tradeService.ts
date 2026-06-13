import prisma from "@/lib/prisma"

import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/authOptions"

export async function createTrade(
  data: any
) {
  const session =
    await getServerSession(
      authOptions
    )

  if (!session?.user?.id) {
    throw new Error(
      "Unauthorized"
    )
  }

  const account =
    await prisma.account.findFirst({
      where: {
        id: data.accountId,

        userId:
          session.user.id
      }
    })

  if (!account) {
    throw new Error(
      "Account not found"
    )
  }

  const trade =
    await prisma.trade.create({
      data: {
        symbol: data.symbol,

        side: data.side,

        leverage:
          data.leverage,

        status: "OPEN",

        entryPrice:
          data.entryPrice,

        stopLoss:
          data.stopLoss,

        takeProfit:
          data.takeProfit,

        size: data.size,

        riskAmount:
          data.riskAmount,

        rr: data.rr,

        pnl: data.pnl || 0,

        pnlPercent:
          data.pnlPercent || 0,

        balanceBefore:
          account.balance,

        conviction:
          data.confluenceScore >=
          80
            ? "HIGH"
            : data.confluenceScore >=
              50
            ? "MEDIUM"
            : "LOW",

        accountId:
          data.accountId,

        context: {
          create: {
            liquiditySweep:
              data.confluences
                ?.liquiditySweep,

            reclaim:
              data.confluences
                ?.reclaim,

            displacement:
              data.confluences
                ?.displacement,

            bos:
              data.confluences
                ?.bos,

            choch:
              data.confluences
                ?.choch,

            ema15mTouch:
              data.confluences
                ?.ema15mTouch,

            ema1hTouch:
              data.confluences
                ?.ema1hTouch,

           obVisible:
  data.confluences
    ?.obTouched,

            followedSetup:
              data.confluences
                ?.htfAligned
          }
        }
      },

      include: {
        context: true,

        account: true
      }
    })

  return trade
}

export async function getTrades() {
  const session =
    await getServerSession(
      authOptions
    )

  if (!session?.user?.id) {
    throw new Error(
      "Unauthorized"
    )
  }

  return prisma.trade.findMany({
    where: {
      account: {
        userId:
          session.user.id
      }
    },

    include: {
      context: true,

      setup: true,

      account: true,

      tags: {
        include: {
          tag: true
        }
      }
    },

    orderBy: {
      createdAt: "desc"
    }
  })
}

export async function getTrade(
  id: string
) {
  const session =
    await getServerSession(
      authOptions
    )

  if (!session?.user?.id) {
    throw new Error(
      "Unauthorized"
    )
  }

  const trade =
    await prisma.trade.findFirst({
      where: {
        id,

        account: {
          userId:
            session.user.id
        }
      },

      include: {
        context: true,

        setup: true,

        account: true,

        tags: {
          include: {
            tag: true
          }
        },

        executions: true,

        marketSnapshot: true
      }
    })

  if (!trade) {
    throw new Error(
      "Trade not found"
    )
  }

  return trade
}

export async function updateTrade(
  id: string,
  data: any
) {
  const session =
    await getServerSession(
      authOptions
    )

  if (!session?.user?.id) {
    throw new Error(
      "Unauthorized"
    )
  }

  const existing =
    await prisma.trade.findFirst({
      where: {
        id,

        account: {
          userId:
            session.user.id
        }
      },

      include: {
        context: true
      }
    })

  if (!existing) {
    throw new Error(
      "Trade not found"
    )
  }

  const updated =
    await prisma.trade.update({
      where: {
        id
      },

      data: {
        symbol:
          data.symbol ??
          existing.symbol,

        side:
          data.side ??
          existing.side,

        leverage:
          data.leverage ??
          existing.leverage,

        entryPrice:
          data.entryPrice ??
          existing.entryPrice,

        stopLoss:
          data.stopLoss ??
          existing.stopLoss,

        takeProfit:
          data.takeProfit ??
          existing.takeProfit,

        size:
          data.size ??
          existing.size,

        pnl:
          data.pnl ??
          existing.pnl,

        pnlPercent:
          data.pnlPercent ??
          existing.pnlPercent,

        rr:
          data.rr ??
          existing.rr,

        result:
          data.result ??
          existing.result,

        status:
          data.status ??
          existing.status,

        notes:
          data.notes ??
          existing.notes,

        emotion:
          data.emotion ??
          existing.emotion,

        closedAt:
          data.closedAt ??
          existing.closedAt,

        context:
          data.confluences
            ? {
                update: {
                  liquiditySweep:
                    data
                      .confluences
                      ?.liquiditySweep,

                  reclaim:
                    data
                      .confluences
                      ?.reclaim,

                  displacement:
                    data
                      .confluences
                      ?.displacement,

                  bos:
                    data
                      .confluences
                      ?.bos,

                  choch:
                    data
                      .confluences
                      ?.choch,

                  ema15mTouch:
                    data
                      .confluences
                      ?.ema15mTouch,

                  ema1hTouch:
                    data
                      .confluences
                      ?.ema1hTouch,

                  obVisible:
  data.confluences
    ?.obTouched,
                }
              }
            : undefined
      },

      include: {
        context: true,

        account: true
      }
    })

  return updated
}

export async function deleteTrade(
  id: string
) {
  const session =
    await getServerSession(
      authOptions
    )

  if (!session?.user?.id) {
    throw new Error(
      "Unauthorized"
    )
  }

  const existing =
    await prisma.trade.findFirst({
      where: {
        id,

        account: {
          userId:
            session.user.id
        }
      }
    })

  if (!existing) {
    throw new Error(
      "Trade not found"
    )
  }

  await prisma.trade.delete({
    where: {
      id
    }
  })

  return {
    success: true
  }
}