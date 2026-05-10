import prisma from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library"

export async function getStats() {
  const trades = await prisma.trade.findMany({
    include: {
      context: true
    }
  })

  const totalTrades = trades.length

  const wins = trades.filter((t: any) => t.result === "WIN").length
  const losses = trades.filter((t: any) => t.result === "LOSS").length
  const breakeven = trades.filter((t: any) => t.result === "BE").length

  const totalPnl = trades.reduce(
    (sum: number, t: any) => sum + (t.pnl ? parseFloat(t.pnl.toString()) : 0),
    0
  )

  const totalRisk = trades.reduce(
    (sum: number, t: any) => sum + (t.riskAmount ? parseFloat(t.riskAmount.toString()) : 0),
    0
  )

  const avgWinPnl = wins > 0
    ? trades
        .filter((t: any) => t.result === "WIN")
        .reduce((sum: number, t: any) => sum + (t.pnl ? parseFloat(t.pnl.toString()) : 0), 0) / wins
    : 0

  const avgLossPnl = losses > 0
    ? Math.abs(
        trades
          .filter((t: any) => t.result === "LOSS")
          .reduce((sum: number, t: any) => sum + (t.pnl ? parseFloat(t.pnl.toString()) : 0), 0) / losses
      )
    : 0

  const profitFactor = avgLossPnl > 0 ? avgWinPnl / avgLossPnl : 0

  const sweepTrades = trades.filter((t: any) => t.context?.sweepConfirmed).length
  const confluenceTrades = trades.filter((t: any) => t.context?.emaConfluenceAtExit).length

  return {
    totalTrades,
    wins,
    losses,
    breakeven,
    winrate: totalTrades ? (wins / totalTrades) * 100 : 0,
    totalPnl: totalPnl.toFixed(2),
    avgRisk: totalTrades ? (totalRisk / totalTrades).toFixed(2) : 0,
    avgWin: avgWinPnl.toFixed(2),
    avgLoss: avgLossPnl.toFixed(2),
    profitFactor: profitFactor.toFixed(2),
    
    // TUS MÉTRICAS NUEVAS
    sweepOccurrence: totalTrades ? ((sweepTrades / totalTrades) * 100).toFixed(1) : "0",
    confluenceExitRate: totalTrades ? ((confluenceTrades / totalTrades) * 100).toFixed(1) : "0",
  }
}