import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { calculateTradeMetrics } from "@/lib/calculations"

export async function GET() {

 const trades = await prisma.trade.findMany({
  orderBy: { createdAt: "desc" },
  include: {
   setup: true,
   tags: true
  }
 })

 return NextResponse.json(trades)

}

export async function POST(req: Request) {

 const data = await req.json()

 const metrics = calculateTradeMetrics(
  data.entry,
  data.stopLoss,
  data.exit,
  data.size
 )

 const trade = await prisma.trade.create({
  data: {
   symbol: data.symbol,
   side: data.side,
   entry: data.entry,
   stopLoss: data.stopLoss,
   takeProfit: data.takeProfit,
   exit: data.exit,
   size: data.size,

   risk: metrics.risk,
   pnl: metrics.pnl,
   result: metrics.result,

   accountId: data.accountId
  }
 })

 return NextResponse.json(trade)

}