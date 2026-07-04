import NextAuth from "next-auth"
import { authOptions } from "../shared/auth/authOptions"

export const { GET, POST } = NextAuth(authOptions)