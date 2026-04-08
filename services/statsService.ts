import  prisma from "@/lib/prisma"



import { Trade } from "@prisma/client"

export async function getStats() {

  const trades: Trade[] = await prisma.trade.findMany()

  const totalTrades = trades.length

  const wins = trades.filter((t: Trade) => t.result === "WIN").length
  const losses = trades.filter((t: Trade) => t.result === "LOSS").length
  const breakeven = trades.filter((t: Trade) => t.result === "BE").length

const totalPnl = trades.reduce(
  (sum: number, t) => sum + Number(t.pnl ?? 0),
  0
)

const totalRisk = trades.reduce(
  (sum: number, t) => sum + Number(t.risk ?? 0),
  0
)

  return {
    totalTrades,
    wins,
    losses,
    breakeven,
    winrate: totalTrades
      ? (wins / totalTrades) * 100
      : 0,
    totalPnl,
    avgRisk: totalTrades
      ? totalRisk / totalTrades
      : 0
  }
}