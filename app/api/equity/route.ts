import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const trades = await prisma.trade.findMany({
      where: {
        account: {
          userId: session.user.id
        },
        pnl: {
          not: null
        }
      },
      orderBy: {
        createdAt: "asc"
      },
      select: {
        id: true,
        symbol: true,
        pnl: true,
        createdAt: true
      }
    })

    let cumulative = 0
    let peak = 0
    let maxDrawdown = 0

    const equity = trades.map((trade: typeof trades[number]) => {
      const pnl = Number(trade.pnl || 0)

      cumulative += pnl

      if (cumulative > peak) {
        peak = cumulative
      }

      const drawdown = peak - cumulative

      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown
      }

      return {
        id: trade.id,
        symbol: trade.symbol,
        pnl,
        equity: cumulative,
        drawdown,
        createdAt: trade.createdAt
      }
    })

    return NextResponse.json({
      equity,
      stats: {
        totalPnl: cumulative,
        peak,
        maxDrawdown
      }
    })
  } catch (error: any) {
    console.error(error)

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}