import { accountService } from "@/services/accountService"
import { NextResponse } from "next/server"

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const account = await accountService.getById(id)
    return NextResponse.json(account)
  } catch {
    return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const updated = await accountService.update(id, body)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await accountService.delete(id)

    return NextResponse.json({ message: "Cuenta eliminada" })
  } catch {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}

// HAY QUE CHECAR EDNPOINT