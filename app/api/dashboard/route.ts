import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

type Trade = Awaited<
  ReturnType<typeof prisma.trade.findMany>
>[number]

export async function GET() {
  const trades = await prisma.trade.findMany({
    orderBy: {
      createdAt: "asc"
    }
  })

  const totalTrades = trades.length

  const wins = trades.filter(
    (t: Trade) => t.result === "WIN"
  ).length

  const losses = trades.filter(
    (t: Trade) => t.result === "LOSS"
  ).length

  const winRate =
    totalTrades > 0
      ? wins / totalTrades
      : 0

  const netPnL = trades.reduce(
    (acc: number, t: Trade) =>
      acc + Number(t.pnl ?? 0),
    0
  )

  const grossProfit = trades
    .filter(
      (t: Trade) =>
        Number(t.pnl ?? 0) > 0
    )
    .reduce(
      (acc: number, t: Trade) =>
        acc + Number(t.pnl ?? 0),
      0
    )

  const grossLoss = trades
    .filter(
      (t: Trade) =>
        Number(t.pnl ?? 0) < 0
    )
    .reduce(
      (acc: number, t: Trade) =>
        acc +
        Math.abs(
          Number(t.pnl ?? 0)
        ),
      0
    )

  const profitFactor =
    grossLoss === 0
      ? 0
      : grossProfit / grossLoss

  const rrValues = trades
    .map(
      (t: Trade) =>
        Number(t.rr ?? 0)
    )
    .filter(
      (rr: number) => rr !== 0
    )

  const averageRR =
    rrValues.length > 0
      ? rrValues.reduce(
          (
            a: number,
            b: number
          ) => a + b,
          0
        ) / rrValues.length
      : 0

  let cumulative = 0

  const equityCurve = trades.map(
    (trade: Trade) => {
      cumulative += Number(
        trade.pnl ?? 0
      )

      return {
        date: trade.createdAt,
        equity: cumulative
      }
    }
  )

  return NextResponse.json({
    totalTrades,
    wins,
    losses,
    winRate,
    netPnL,
    profitFactor,
    averageRR,
    equityCurve
  })
}