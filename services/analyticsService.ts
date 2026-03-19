import prisma from "@/lib/prisma"

type TradeWithSetup = Awaited<
 ReturnType<typeof prisma.trade.findMany>
>[number]


export async function getEquityCurve() {

 const trades = await prisma.trade.findMany({
  orderBy: { createdAt: "asc" }
 })

 let equity = 10000

 const curve = trades.map((trade: typeof trades[number]) => {

  equity += trade.pnl ?? 0

  return {
   date: trade.createdAt,
   equity
  }

 })

 return curve
}


export async function getSetupAnalytics() {

 const trades = await prisma.trade.findMany({
  include: { setup: true }
 })

 const setups: Record<
  string,
  { trades: number; wins: number; pnl: number }
 > = {}

 trades.forEach((trade: typeof trades[number]) => {

  const name = trade.setup?.name ?? "Unknown"

  if (!setups[name]) {
   setups[name] = {
    trades: 0,
    wins: 0,
    pnl: 0
   }
  }

  setups[name].trades++

  if (trade.result === "WIN") {
   setups[name].wins++
  }

  setups[name].pnl += trade.pnl ?? 0

 })

 return Object.entries(setups).map(([name, data]) => ({
  setup: name,
  trades: data.trades,
  winrate: (data.wins / data.trades) * 100,
  pnl: data.pnl
 }))
}