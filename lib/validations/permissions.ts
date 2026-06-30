import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/authOptions"


export async function requireRole(
 roles:string[]
){


 const session =
  await getServerSession(authOptions)



 if(!session?.user){

  throw new Error("UNAUTHORIZED")

 }



 if(
  !roles.includes(
    session.user.role
  )
 ){

  throw new Error("FORBIDDEN")

 }



 return session

}