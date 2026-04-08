import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export default async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET
  })

  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute =
    req.nextUrl.pathname === "/login" ||
    req.nextUrl.pathname === "/register"

  if (isAuthRoute || isPublicRoute) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"]
}