import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
 req: Request,
 { params }: { params: { id: string } }
) {

 const user = await prisma.user.findUnique({
  where: { id: params.id }
 })

 if (!user) {
  return NextResponse.json(
   { error: "User not found" },
   { status: 404 }
  )
 }

 return NextResponse.json(user)

}

export async function PATCH(
 req: Request,
 { params }: { params: { id: string } }
) {

 const data = await req.json()

 const user = await prisma.user.update({
  where: { id: params.id },
  data
 })

 return NextResponse.json(user)

}

export async function DELETE(
 req: Request,
 { params }: { params: { id: string } }
) {

 await prisma.user.delete({
  where: { id: params.id }
 })

 return NextResponse.json({
  message: "User deleted"
 })

}
