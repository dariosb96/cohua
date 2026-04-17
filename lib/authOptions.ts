import { type AuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt"
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "correo@ejemplo.com"
        },
        password: {
          label: "Password",
          type: "password"
        }
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) return null

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isValid) return null

          // ⚠️ importante: regresar objeto plano
          return {
            id: user.id,
            email: user.email,
            name: user.name
          }

        } catch (error) {
          console.error("AUTH ERROR:", error)
          return null
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      // cuando el usuario inicia sesión
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },

  pages: {
    signIn: "/login",     // opcional (tu página)
    error: "/login"       // evita /api/auth/error
  },

  secret: process.env.NEXTAUTH_SECRET
}