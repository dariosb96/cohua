export const profileSelect = {

  id: true,

  name: true,

  username: true,

  email: true,

  phone: true,

  avatar: true,

  bio: true,

  role: true,

  plan: true,

  createdAt: true,

  accounts: {

    select: {

      id: true,

      name: true,

      balance: true,

      createdAt: true

    }

  }

} as const