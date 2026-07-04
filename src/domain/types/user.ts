import { UserPlan, UserRole } from "@prisma/client"

export interface AccountDTO {
  id: string
  name: string
  balance: number
  createdAt: Date
}

export interface ProfileUser {
  id: string

  name: string

  username: string

  email: string

  phone: string | null

  avatar: string | null

  bio: string | null

  role: UserRole

  plan: UserPlan

  createdAt: Date

  accounts: AccountDTO[]
}

export interface CreateUserDTO {
  name: string
  username: string
  email: string
  password: string
  phone?: string
}

export interface UpdateUserDTO {
  name?: string
  email?: string
  phone?: string
  password?: string
  avatar?: string
  bio?: string
}