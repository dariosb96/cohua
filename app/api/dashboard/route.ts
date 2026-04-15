import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {

  const trades = await prisma.trade.findMany({
    orderBy: { createdAt: "asc" }
  })

  const totalTrades = trades.length

  const wins = trades.filter(t => t.result === "WIN").length
  const losses = trades.filter(t => t.result === "LOSS").length

  const winRate = totalTrades
    ? wins / totalTrades
    : 0

  const netPnL = trades.reduce(
    (acc, t) => acc + Number(t.pnl ?? 0),
    0
  )

  const grossProfit = trades
    .filter(t => Number(t.pnl ?? 0) > 0)
    .reduce((acc, t) => acc + Number(t.pnl ?? 0), 0)

  const grossLoss = trades
    .filter(t => Number(t.pnl ?? 0) < 0)
    .reduce((acc, t) => acc + Math.abs(Number(t.pnl ?? 0)), 0)

  const profitFactor =
    grossLoss === 0
      ? 0
      : grossProfit / grossLoss

const rrValues = trades
  .map(t => Number(t.rr ?? 0)) 
  .filter(rr => rr !== 0)      

  const averageRR =
  rrValues.length
    ? rrValues.reduce((a, b) => a + b, 0) / rrValues.length
    : 0
    
  let cumulative = 0

  const equityCurve = trades.map(trade => {
    cumulative += Number(trade.pnl ?? 0)

    return {
      date: trade.createdAt,
      equity: cumulative
    }
  })

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