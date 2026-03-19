import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {

 const trades = await prisma.trade.findMany()

 const total = trades.length

 const wins = trades.filter(t => t.result === "WIN").length
 const losses = trades.filter(t => t.result === "LOSS").length

 const winRate = total ? wins / total : 0

 const pnl = trades.reduce((acc, t) => acc + (t.pnl || 0), 0)

 return NextResponse.json({
  total,
  wins,
  losses,
  winRate,
  pnl
 })

}