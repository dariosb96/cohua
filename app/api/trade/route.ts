import { NextResponse } from "next/server"
import { createTrade, getTrades } from "@/services/tradeService"

// GET -> listar todos
export async function GET() {
  try {
    const trades = await getTrades()
    return NextResponse.json(trades)
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching trades" },
      { status: 500 }
    )
  }
}

// POST -> crear trade
export async function POST(req: Request) {
  try {
    const data = await req.json()

    const trade = await createTrade(data)

    return NextResponse.json(trade, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating trade" },
      { status: 500 }
    )
  }
}