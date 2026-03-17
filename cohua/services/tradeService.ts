import  prisma from "@/lib/prisma"

import { calculateTradeMetrics } from "@/lib/tradeCalculator"

export async function createTrade(data:any){

 const metrics = calculateTradeMetrics(
  data.entry,
  data.stopLoss,
  data.exit,
  data.size
 )

 return prisma.trade.create({
  data:{
   ...data,
   risk: metrics.risk,
   pnl: metrics.pnl,
   result: metrics.result
  }
 })
}

export async function getTrades(){

 return prisma.trade.findMany({
  orderBy:{ createdAt:"desc" },
  include:{
   setup:true,
   tags:true
  }
 })

}

export async function getTrade(id:string){

 return prisma.trade.findUnique({
  where:{ id },
  include:{
   setup:true,
   tags:true
  }
 })

}

export async function updateTrade(id:string,data:any){

 const metrics = calculateTradeMetrics(
  data.entry,
  data.stopLoss,
  data.exit,
  data.size
 )

 return prisma.trade.update({
  where:{ id },
  data:{
   ...data,
   risk: metrics.risk,
   pnl: metrics.pnl,
   result: metrics.result
  }
 })

}

export async function deleteTrade(id:string){

 return prisma.trade.delete({
  where:{ id }
 })

}