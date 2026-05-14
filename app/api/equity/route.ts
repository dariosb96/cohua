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

    if (!trades.length) {
      return NextResponse.json({
        equity: [],
        stats: {
          totalTrades: 0,
          wins: 0,
          losses: 0,
          breakeven: 0,
          winRate: 0,
          totalPnl: 0,
          averageWin: 0,
          averageLoss: 0,
          profitFactor: 0,
          maxDrawdown: 0,
          bestTrade: 0,
          worstTrade: 0,
          consecutiveWins: 0,
          consecutiveLosses: 0,
          expectancy: 0
        }
      })
    }

    let cumulative = 0
    let peak = 0
    let maxDrawdown = 0

    let wins = 0
    let losses = 0
    let breakeven = 0

    let grossProfit = 0
    let grossLoss = 0

    let bestTrade = -Infinity
    let worstTrade = Infinity

    let currentWinStreak = 0
    let currentLossStreak = 0

    let maxWinStreak = 0
    let maxLossStreak = 0

    const equity = trades.map((trade: typeof trades[number]) => {
      const pnl = Number(trade.pnl || 0)

      cumulative += pnl

      // Peak Equity
      if (cumulative > peak) {
        peak = cumulative
      }

      // Drawdown
      const drawdown = peak - cumulative

      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown
      }

      // Win/Loss tracking
      if (pnl > 0) {
        wins++
        grossProfit += pnl

        currentWinStreak++
        currentLossStreak = 0

        if (currentWinStreak > maxWinStreak) {
          maxWinStreak = currentWinStreak
        }
      } else if (pnl < 0) {
        losses++
        grossLoss += Math.abs(pnl)

        currentLossStreak++
        currentWinStreak = 0

        if (currentLossStreak > maxLossStreak) {
          maxLossStreak = currentLossStreak
        }
      } else {
        breakeven++
      }

      // Best/Worst trade
      if (pnl > bestTrade) {
        bestTrade = pnl
      }

      if (pnl < worstTrade) {
        worstTrade = pnl
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

    const totalTrades = trades.length

    const winRate =
      totalTrades > 0
        ? (wins / totalTrades) * 100
        : 0

    const averageWin =
      wins > 0
        ? grossProfit / wins
        : 0

    const averageLoss =
      losses > 0
        ? grossLoss / losses
        : 0

    const profitFactor =
      grossLoss > 0
        ? grossProfit / grossLoss
        : grossProfit

    // Expectancy Formula
    const expectancy =
      totalTrades > 0
        ? (
            (winRate / 100) *
              averageWin -
            ((100 - winRate) / 100) *
              averageLoss
          )
        : 0

    return NextResponse.json({
      equity,

      stats: {
        totalTrades,

        wins,

        losses,

        breakeven,

        winRate,

        totalPnl: cumulative,

        grossProfit,

        grossLoss,

        averageWin,

        averageLoss,

        profitFactor,

        maxDrawdown,

        bestTrade,

        worstTrade,

        consecutiveWins:
          maxWinStreak,

        consecutiveLosses:
          maxLossStreak,

        expectancy
      }
    })
  } catch (error: any) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          error.message ||
          "Internal Server Error"
      },
      {
        status: 500
      }
    )
  }
}