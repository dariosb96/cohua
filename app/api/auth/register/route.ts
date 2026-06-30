import { NextResponse } from "next/server"
import { userService } from "@/services/userService"


export async function POST(req:Request){


try{


const body = await req.json()


const {
 name,
 username,
 email,
 password,
 phone
}=body



if(
 !name ||
 !username ||
 !email ||
 !password
){

return NextResponse.json(
{
error:"Faltan campos obligatorios"
},
{
status:400
}
)

}



const user =
await userService.create({

name,

username,

email,

password,

phone

})



return NextResponse.json(
user,
{
status:201
}
)



}catch(error:any){


if(error.message==="USER_EXISTS"){

return NextResponse.json(
{
error:"Usuario o email ya registrado"
},
{
status:409
}
)

}



return NextResponse.json(
{
error:"Error creando usuario"
},
{
status:500
}
)


}

}