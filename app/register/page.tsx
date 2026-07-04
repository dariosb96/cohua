// app/register/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/shared/auth/authOptions"
import { redirect } from "next/navigation"
import RegisterForm from "./RegisterForm"


export default async function RegisterPage() {
  const session = await getServerSession(authOptions)


  if (session) {
    redirect("/dashboard")
  }

  return <RegisterForm />
}