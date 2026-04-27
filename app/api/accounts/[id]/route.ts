import { accountService } from "@/services/accountService"
import { NextResponse } from "next/server"

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const account = await accountService.getById(id)

    return NextResponse.json(account)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Cuenta no encontrada" },
      { status: 404 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()

    const updated = await accountService.update(id, body)

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al actualizar" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await accountService.delete(id)

    return NextResponse.json({ message: "Cuenta eliminada" })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al eliminar" },
      { status: 500 }
    )
  }
}