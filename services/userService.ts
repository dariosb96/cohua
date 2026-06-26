import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"

type CreateUserDTO = {
  name:string
  username:string
  email:string
  password:string
  phone?:string
}

type UpdateUserDTO = {
  name?: string
  username?: string
  email?: string
  phone?: string
  password?: string
}

export const userService = {

  // 🔥 REGISTRO
  async create(data: CreateUserDTO) {
    const existing = await prisma.user.findFirst({
  where:{
    OR:[
      {email:data.email},
      {username:data.username}
    ]
  }
})


if(existing){
 throw new Error("Email or username already exists")
}

    const hashedPassword = await bcrypt.hash(data.password, 10)

    return prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        createdAt: true
      }
    })
  },

  async getAll() {
    
   
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true
      }
    })
  },


 async getMe() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      phone: true,
      createdAt: true,
      accounts: {
        select: {
          id: true,
          name: true,
          balance: true,
          createdAt: true
        }
      }
    }
  })
},

  async getById(id: string) {
    const session = await getServerSession(authOptions) 
    if (!session) throw new Error("Unauthorized")

    if (session.user.id !== id) {
      throw new Error("Forbidden")
    }

    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        createdAt: true,
        accounts: {
          select: {
            id: true,
            name: true,
            balance: true,
            createdAt: true
          }
        }
      }
    })
  },

  async update(id:string,data:UpdateUserDTO){

const session =
 await getServerSession(authOptions)


if(!session?.user?.id)
 throw new Error("Unauthorized")


if(session.user.id !== id)
 throw new Error("Forbidden")


const updateData:any={}


if(data.name)
 updateData.name=data.name


if(data.email)
 updateData.email=data.email


if(data.phone)
 updateData.phone=data.phone


if(data.password){

 updateData.password =
 await bcrypt.hash(data.password,10)

}



return prisma.user.update({

where:{id},

data:updateData,


select:{
 id:true,
 name:true,
 username:true,
 email:true,
 phone:true,
 updatedAt:true
}

})

},
  async delete(id: string) {
    const session = await getServerSession(authOptions) 
    if (!session) throw new Error("Unauthorized")

    if (session.user.id !== id) {
      throw new Error("Forbidden")
    }

    return prisma.user.delete({
      where: { id }
    })
  }
}