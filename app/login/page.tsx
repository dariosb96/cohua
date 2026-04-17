// app/login/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import LoginForm from "./LoginForm"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  // Si ya está logueado → dashboard
  if (session) {
    redirect("/dashboard")
  }

  return <LoginForm />
}