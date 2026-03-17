import { NextResponse } from "next/server"
import { createTrade, getTrades } from "@/services/tradeService"

export async function GET(){

 const trades = await getTrades()

 return NextResponse.json(trades)

}

export async function POST(req:Request){

 const data = await req.json()

 const trade = await createTrade(data)

 return NextResponse.json(trade)

}