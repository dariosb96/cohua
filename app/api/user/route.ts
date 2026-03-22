import { NextResponse } from "next/server"
import { userService } from "@/services/accountService"

export async function GET() {
  try {
    const users = await userService.getAll()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const user = await userService.create(body)

    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error creating user" },
      { status: 500 }
    )
  }
}