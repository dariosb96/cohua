import { NextRequest, NextResponse } from "next/server"
import { accountService } from "@/services/accountService"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const accounts = await accountService.getAll(session.user.id)

    return NextResponse.json(accounts)
  } catch (error: any) {
    console.error("GET ACCOUNTS ERROR:", error)

    return NextResponse.json(
      { error: error.message || "Error al obtener cuentas" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const {
      name,
      balance,
      exchange,
      apiKey,
      apiSecret
    } = body

    // VALIDACIONES
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      )
    }

    if (balance == null || Number(balance) < 0) {
      return NextResponse.json(
        { error: "Balance inválido" },
        { status: 400 }
      )
    }

    // Validar exchange si se proporciona
    const validExchanges = ["BINANCE", "BYBIT", "OKX", "BITGET", "KUCOIN", "MEXC"]
    if (exchange && !validExchanges.includes(exchange)) {
      return NextResponse.json(
        { error: "Exchange no válido" },
        { status: 400 }
      )
    }

    const account = await accountService.create({
      userId: session.user.id,
      name: name.trim(),
      balance: Number(balance),
      exchange: exchange || undefined,
      apiKey: apiKey || undefined,
      apiSecret: apiSecret || undefined
    })

    return NextResponse.json(account, {
      status: 201
    })
  } catch (error: any) {
    console.error("CREATE ACCOUNT ERROR:", error)

    return NextResponse.json(
      { error: error.message || "Error al crear cuenta" },
      { status: 500 }
    )
  }
}