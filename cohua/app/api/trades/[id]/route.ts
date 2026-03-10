import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
 req: Request,
 { params }: { params: { id: string } }
){

 const trade = await prisma.trade.findUnique({
  where: { id: params.id },
  include: {
   setup: true,
   tags: true
  }
 })

 if (!trade) {
  return NextResponse.json(
   { error: "Trade not found" },
   { status: 404 }
  )
 }

 return NextResponse.json(trade)

}

import { calculateTradeMetrics } from "@/lib/calculations"

export async function PATCH(
 req: Request,
 { params }: { params: { id: string } }
){

 const data = await req.json()

 const metrics = calculateTradeMetrics(
  data.entry,
  data.stopLoss,
  data.exit,
  data.size
 )

 const trade = await prisma.trade.update({
  where: { id: params.id },
  data: {
   ...data,
   risk: metrics.risk,
   pnl: metrics.pnl,
   result: metrics.result
  }
 })

 return NextResponse.json(trade)

}

export async function DELETE(
 req: Request,
 { params }: { params: { id: string } }
){

 await prisma.trade.delete({
  where: { id: params.id }
 })

 return NextResponse.json({
  message: "Trade deleted"
 })

}