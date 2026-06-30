import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"


type CreateUserDTO = {
  name: string
  username: string
  email: string
  password: string
  phone?: string
}


type UpdateUserDTO = {
  name?: string
  email?: string
  phone?: string
  password?: string
  avatar?: string
  bio?: string
}



export const userService = {


  async create(data: CreateUserDTO) {


    const exists =
      await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email },
            { username: data.username }
          ]
        }
      })


    if (exists) {
      throw new Error("USER_EXISTS")
    }



    const hashedPassword =
      await bcrypt.hash(data.password, 10)



    return prisma.user.create({

      data: {

        name: data.name,

        username: data.username,

        email: data.email,

        phone: data.phone,

        password: hashedPassword,

        role: "USER",

        plan: "FREE"

      },


      select: {

        id: true,

        name: true,

        username: true,

        email: true,

        phone: true,

        role: true,

        plan: true,

        createdAt: true

      }

    })

  },





  async getMe() {


    const session =
      await getServerSession(authOptions)


    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }



    return prisma.user.findUnique({

      where: {
        id: session.user.id
      },


      select: {

        id: true,

        name: true,

        username: true,

        email: true,

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

      }

    })

  },





  async getById(id:string) {


    const session =
      await getServerSession(authOptions)



    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }



    if (
      session.user.id !== id &&
      session.user.role !== "ADMIN"
    ) {

      throw new Error("Forbidden")

    }



    return prisma.user.findUnique({

      where:{
        id
      },


      select:{

        id:true,

        name:true,

        username:true,

        email:true,

        phone:true,

        avatar:true,

        bio:true,

        role:true,

        plan:true,

        isActive:true,

        isBanned:true,

        createdAt:true,

        updatedAt:true

      }

    })

  },





  async update(
    id:string,
    data:UpdateUserDTO
  ){


    const session =
      await getServerSession(authOptions)



    if(!session?.user?.id){
      throw new Error("Unauthorized")
    }



    if(session.user.id !== id){
      throw new Error("Forbidden")
    }



    const updateData:any = {}



    if(data.name)
      updateData.name=data.name


    if(data.email)
      updateData.email=data.email


    if(data.phone)
      updateData.phone=data.phone


    if(data.avatar)
      updateData.avatar=data.avatar


    if(data.bio)
      updateData.bio=data.bio



    if(data.password){

      updateData.password =
        await bcrypt.hash(
          data.password,
          10
        )

    }



    return prisma.user.update({

      where:{
        id
      },


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





  async delete(id:string) {


    const session =
      await getServerSession(authOptions)



    if(!session?.user?.id){
      throw new Error("Unauthorized")
    }



    if(session.user.id !== id){
      throw new Error("Forbidden")
    }



    return prisma.user.delete({

      where:{
        id
      }

    })

  }

}