// app/api/trade/route.ts

import { NextRequest, NextResponse } from "next/server"

import {
  createTrade,
  getTrades
} from "@/services/tradeService"

export async function GET() {
  try {
    const trades =
      await getTrades()

    return NextResponse.json(
      trades
    )
  } catch (error: any) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          error.message ||
          "Error fetching trades"
      },
      {
        status: 500
      }
    )
  }
}

export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json()

    console.log(
      "BODY RECEIVED",
      body
    )

    const trade =
      await createTrade(body)

    return NextResponse.json(
      trade,
      {
        status: 201
      }
    )
  } catch (error: any) {
    console.error(
      "CREATE TRADE ERROR",
      error
    )

    return NextResponse.json(
      {
        error:
          error.message
      },
      {
        status: 500
      }
    )
  }
}