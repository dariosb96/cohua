import prisma from "@/src/infrastructure/database/prisma"

import { getServerSession } from "next-auth"

import { authOptions } from "@/src/shared/auth/authOptions"

export async function createTrade(
  data:any
) {

  const session =
    await getServerSession(authOptions)


  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }


  const account =
    await prisma.account.findFirst({
      where:{
        id:data.accountId,
        userId:session.user.id
      }
    })


  if(!account){
    throw new Error("Account not found")
  }



  return prisma.trade.create({

    data:{

      symbol:data.symbol,

      side:data.side,

      leverage:
        data.leverage
        ? Math.round(data.leverage)
        : null,


      status:"OPEN",


      entryPrice:
        data.entryPrice,


      stopLoss:
        data.stopLoss,


      takeProfit:
        data.takeProfit,


      size:
        data.size,


      riskAmount:
        data.riskAmount,


      rr:
        data.rr,


      pnl:
        data.pnl ?? 0,


      pnlPercent:
        data.pnlPercent ?? 0,



      balanceBefore:
        account.balance,



      conviction:
        data.confluenceScore >= 80
        ? "HIGH"
        : data.confluenceScore >= 50
        ? "MEDIUM"
        : "LOW",



      accountId:
        data.accountId,



      context:{


        create:{


          sweep:
            data.sweep ?? false,


          liquiditySweep:
            data.confluences
            ?.liquiditySweep
            ?? false,


          reclaim:
            data.confluences
            ?.reclaim
            ?? false,


          displacement:
            data.confluences
            ?.displacement
            ?? false,


          bos:
            data.confluences
            ?.bos
            ?? false,


          choch:
            data.confluences
            ?.choch
            ?? false,


          ema15mTouch:
            data.confluences
            ?.ema15mTouch
            ?? false,


          ema1hTouch:
            data.confluences
            ?.ema1hTouch
            ?? false,


          htfAligned:
            data.confluences
            ?.htfAligned
            ?? false,


          obVisible:
            data.confluences
            ?.obTouched
            ?? false,


          notes:
            data.notes ?? null

        }

      }

    },


    include:{
      context:true,
      account:true
    }

  })

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


  sweep:
    data.sweep
    ?? existing.context?.sweep,


  liquiditySweep:
    data.confluences.liquiditySweep
    ?? existing.context?.liquiditySweep,


  reclaim:
    data.confluences.reclaim
    ?? existing.context?.reclaim,


  displacement:
    data.confluences.displacement
    ?? existing.context?.displacement,


  bos:
    data.confluences.bos
    ?? existing.context?.bos,


  choch:
    data.confluences.choch
    ?? existing.context?.choch,


  ema15mTouch:
    data.confluences.ema15mTouch
    ?? existing.context?.ema15mTouch,


  ema1hTouch:
    data.confluences.ema1hTouch
    ?? existing.context?.ema1hTouch,


  htfAligned:
    data.confluences.htfAligned
    ?? existing.context?.htfAligned,


  obVisible:
    data.confluences.obTouched
    ?? existing.context?.obVisible

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