import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export default async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET
  })

  const pathname = req.nextUrl.pathname

  const isAuthRoute = pathname.startsWith("/api/auth")
  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/api/users")

  if (isAuthRoute || isPublicRoute) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}
// VERSION ! FUNCIONANDO
// export const config = {
//   matcher: ["/dashboard/:path*", "/api/:path*"]
// }

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"]
}
