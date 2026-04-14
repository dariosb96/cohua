// app/register/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import RegisterForm from "./RegisterForm"


export default async function RegisterPage() {
  const session = await getServerSession(authOptions)

  // Si ya está logueado → dashboard
  if (session) {
    redirect("/dashboard")
  }

  return <RegisterForm />
}