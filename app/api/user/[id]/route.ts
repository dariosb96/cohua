// app/api/users/[id]/route.ts
import { userService } from "@/services/accountService"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await userService.getById(params.id)
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const user = await userService.update(params.id, body)
    return NextResponse.json(user)
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Email o teléfono ya registrado" }, { status: 409 })
    }
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await userService.delete(params.id)
    return NextResponse.json({ message: "Usuario eliminado" })
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}