import { prisma } from "@/lib/prisma"

export async function getStats() {

 const trades = await prisma.trade.findMany()

 const totalTrades = trades.length

 const wins = trades.filter(t => t.result === "WIN").length
 const losses = trades.filter(t => t.result === "LOSS").length
 const breakeven = trades.filter(t => t.result === "BE").length

 const totalPnl = trades.reduce(
  (sum,t) => sum + (t.pnl || 0),
  0
 )

 const totalRisk = trades.reduce(
  (sum,t) => sum + (t.risk || 0),
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