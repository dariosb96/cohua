import { NextRequest, NextResponse } from "next/server"
import { accountService } from "@/services/accountService"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

interface Params {
  params: {
    id: string
  }
}

export async function GET(
  _: NextRequest,
  { params }: Params
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const account = await accountService.getById(
      params.id,
      session.user.id
    )

    return NextResponse.json(account)
  } catch (error: any) {
    console.error("GET ACCOUNT ERROR:", error)

    return NextResponse.json(
      { error: error.message || "Cuenta no encontrada" },
      { status: 404 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: Params
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const updated = await accountService.update(
      params.id,
      session.user.id,
      body
    )

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("UPDATE ACCOUNT ERROR:", error)

    return NextResponse.json(
      { error: error.message || "Error al actualizar cuenta" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: Params
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    await accountService.delete(
      params.id,
      session.user.id
    )

    return NextResponse.json({
      success: true,
      message: "Cuenta eliminada"
    })
  } catch (error: any) {
    console.error("DELETE ACCOUNT ERROR:", error)

    return NextResponse.json(
      { error: error.message || "Error al eliminar cuenta" },
      { status: 500 }
    )
  }
}