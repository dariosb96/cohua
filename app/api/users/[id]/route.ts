import { userService } from "@/services/userService"
import { NextResponse } from "next/server"



export async function GET(
_:Request,
{params}:{params:Promise<{id:string}>}
){


try{


const {id}=await params


const user =
await userService.getById(id)



if(!user){

return NextResponse.json(
{
error:"Usuario no encontrado"
},
{
status:404
}
)

}



return NextResponse.json(user)



}catch(error:any){


return NextResponse.json(
{
error:error.message
},
{
status:500
}
)


}

}





export async function PATCH(
req:Request,
{params}:{params:Promise<{id:string}>}
){


try{


const {id}=await params


const body =
await req.json()



const user =
await userService.update(
id,
body
)



return NextResponse.json(user)



}catch(error:any){


return NextResponse.json(
{
error:error.message
},
{
status:500
}
)


}

}





export async function DELETE(
_:Request,
{params}:{params:Promise<{id:string}>}
){


try{


const {id}=await params


await userService.delete(id)



return NextResponse.json(
{
message:"Usuario eliminado"
}
)



}catch(error:any){


return NextResponse.json(
{
error:error.message
},
{
status:500
}
)

}


}