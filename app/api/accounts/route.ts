import { accountService } from "@/services/accountService"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const accounts = await accountService.getAll()
    return NextResponse.json(accounts)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al obtener cuentas" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, balance } = body

    if (!name || balance == null) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      )
    }

    const account = await accountService.create({ name, balance })

    return NextResponse.json(account, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al crear cuenta" },
      { status: 500 }
    )
  }
}