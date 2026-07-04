// app/api/trade/[id]/route.ts

import { NextRequest, NextResponse } from "next/server"

import {
  getTrade,
  updateTrade,
  deleteTrade
} from "@/src/modules/trades/services/tradeService"

interface Params {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  _: NextRequest,
  { params }: Params
) {
  try {
    const { id } =
      await params

    const trade =
      await getTrade(id)

    return NextResponse.json(
      trade
    )
  } catch (error: any) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          error.message ||
          "Trade not found"
      },
      {
        status: 404
      }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: Params
) {
  try {
    const { id } =
      await params

    const body = await req.json()

    const trade =
      await updateTrade(
        id,
        body
      )

    return NextResponse.json(
      trade
    )
  } catch (error: any) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          error.message ||
          "Error updating trade"
      },
      {
        status: 500
      }
    )
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: Params
) {
  try {
    const { id } =
      await params

    await deleteTrade(id)

    return NextResponse.json({
      success: true
    })
  } catch (error: any) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          error.message ||
          "Error deleting trade"
      },
      {
        status: 500
      }
    )
  }
}