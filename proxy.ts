import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // 🔥 EXCLUIR auth ANTES de cualquier lógica
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/api/users")

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // 🔐 ahora sí validas token
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET
  })

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*"
  ]
}