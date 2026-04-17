import NextAuth from "next-auth"
import { authOptions } from "./authOptions"

export const { GET, POST } = NextAuth(authOptions)