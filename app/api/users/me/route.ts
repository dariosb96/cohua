import { NextResponse } from "next/server"
import { userService } from "@/services/userService"


export async function GET(){

  try{

    const user =
      await userService.getMe()


    return NextResponse.json(user)


  }catch(error:any){


    if(error.message === "Unauthorized"){

      return NextResponse.json(
        {
          error:"No autorizado"
        },
        {
          status:401
        }
      )

    }


    return NextResponse.json(
      {
        error:"Error obteniendo perfil"
      },
      {
        status:500
      }
    )

  }

}