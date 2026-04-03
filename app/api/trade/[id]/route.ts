import { NextResponse } from "next/server"
import { getTrade, updateTrade, deleteTrade } from "@/services/tradeService"

// GET -> obtener uno
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const trade = await getTrade(params.id)

    if (!trade) {
      return NextResponse.json(
        { error: "Trade not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(trade)
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching trade" },
      { status: 500 }
    )
  }
}

// PUT -> actualizar completo
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json()

    const updatedTrade = await updateTrade(params.id, data)

    return NextResponse.json(updatedTrade)
  } catch (error: any) {
    if (error.message === "Trade not found") {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Error updating trade" },
      { status: 500 }
    )
  }
}

// PATCH -> actualización parcial
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json()

    const updatedTrade = await updateTrade(params.id, data)

    return NextResponse.json(updatedTrade)
  } catch (error: any) {
    if (error.message === "Trade not found") {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Error updating trade" },
      { status: 500 }
    )
  }
}

// DELETE -> eliminar
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteTrade(params.id)

    return NextResponse.json({
      message: "Trade deleted successfully"
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting trade" },
      { status: 500 }
    )
  }
}