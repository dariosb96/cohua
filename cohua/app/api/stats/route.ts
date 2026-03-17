import { NextResponse } from "next/server"
import { getStats } from "@/services/statsService"

export async function GET(){

 const stats = await getStats()

 return NextResponse.json(stats)

}