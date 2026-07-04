import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/src/shared/auth/authOptions"
import { userService } from "@/src/application/services/userService"

export async function GET() {

  try {

    const session =
      await getServerSession(authOptions)

    if (!session?.user?.id) {

      return NextResponse.json(
        {
          error: "No autorizado"
        },
        {
          status: 401
        }
      )

    }

    const user =
      await userService.getMe(
        session.user.id
      )

    return NextResponse.json(user)

  } catch (error) {

    return NextResponse.json(
      {
        error: "Error obteniendo perfil"
      },
      {
        status: 500
      }
    )

  }

}