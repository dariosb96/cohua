import { NextResponse } from "next/server"
import { getTrade, updateTrade, deleteTrade } from "@/services/tradeService"

export async function GET(
 req:Request,
 { params }: { params:{ id:string }}
){

 const trade = await getTrade(params.id)

 if(!trade){

  return NextResponse.json(
   { error:"Trade not found" },
   { status:404 }
  )

 }

 return NextResponse.json(trade)

}