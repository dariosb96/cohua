import { NextResponse } from "next/server"
import { getEquityCurve } from "@/services/analyticsService"

export async function GET(){

 const equity = await getEquityCurve()

 return NextResponse.json(equity)

}