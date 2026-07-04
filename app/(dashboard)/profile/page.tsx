import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/src/shared/auth/authOptions"
import { userService } from "@/src/application/services/userService"

import ProfileClient from "@/components/profile/ProfileClient"

export default async function ProfilePage() {

  const session =
    await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user =
    await userService.getMe(
      session.user.id
    )

  return (
    <ProfileClient
      user={user}
    />
  )

}