import { NextResponse } from "next/server"
import { userService } from "@/services/accountService"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await userService.getById(params.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    const updatedUser = await userService.update(params.id, body)

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: "Error updating user" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await userService.delete(params.id)

    return NextResponse.json({ message: "User deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 })
  }
}