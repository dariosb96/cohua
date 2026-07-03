import { Prisma } from "@prisma/client"
import { ProfileUser } from "@/types/user"

type PrismaProfile = Prisma.UserGetPayload<{
  select: typeof import("@/lib/prisma/user.select").profileSelect
}>

export function toProfileUser(
  user: PrismaProfile
): ProfileUser {

  return {

    ...user,

    accounts: user.accounts.map(account => ({

      ...account,

      balance: Number(account.balance)

    }))

  }

}