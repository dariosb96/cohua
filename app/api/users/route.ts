import { NextResponse } from "next/server"
import prisma from "@/src/infrastructure/database/prisma"
import { userService } from "@/src/application/services/userService"
import { registerSchema } from "@/src/application/validations/user"
import { requireRole } from "@/src/application/validations/permissions"



export async function POST(req: Request) {


  try {


    const body = await req.json()


    const validation =
      registerSchema.safeParse(body)



    if (!validation.success) {


      return NextResponse.json(
        {
          error: "Datos inválidos",
          details:
            validation.error.flatten()
        },
        {
          status: 400
        }
      )

    }



    const data = validation.data



    const user =
      await userService.create({

        name: data.name,

        username:
          data.username.toLowerCase(),

        email:
          data.email.toLowerCase(),

        password:data.password,

        phone:data.phone

      })



    return NextResponse.json(
      user,
      {
        status:201
      }
    )



  } catch(error:any) {


    console.error(error)



    if(
      error.message === "USER_EXISTS"
    ){


      return NextResponse.json(
        {
          error:
          "Usuario o email ya registrado"
        },
        {
          status:409
        }
      )

    }



    return NextResponse.json(
      {
        error:
        "Error creando usuario"
      },
      {
        status:500
      }
    )

  }

}







export async function GET() {


  try {


    await requireRole([
      "ADMIN",
      "SUPERADMIN"
    ])




    const users =
      await prisma.user.findMany({

        select:{


          id:true,

          name:true,

          username:true,

          email:true,

          phone:true,


          role:true,

          plan:true,


          isActive:true,

          isBanned:true,


          createdAt:true,

          updatedAt:true


        },


        orderBy:{
          createdAt:"desc"
        }

      })




    return NextResponse.json(
      users
    )




  } catch(error:any) {



    if(
      error.message === "UNAUTHORIZED"
    ){

      return NextResponse.json(
        {
          error:"No autorizado"
        },
        {
          status:401
        }
      )

    }




    if(
      error.message === "FORBIDDEN"
    ){

      return NextResponse.json(
        {
          error:"Sin permisos"
        },
        {
          status:403
        }
      )

    }




    return NextResponse.json(
      {
        error:"Error obteniendo usuarios"
      },
      {
        status:500
      }
    )

  }

}