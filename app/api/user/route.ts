// app/api/users/route.ts
import { userService } from "@/services/userService"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const users = await userService.getAll()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  
  try {
    const body = await req.json()
    const { name, email, password, phone } = body
    console.log("POST /api/users", body)

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const user = await userService.create({ name, email, password, phone })
    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Email o teléfono ya registrado" }, { status: 409 })
    }
    console.error(error)

    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })


  }
}