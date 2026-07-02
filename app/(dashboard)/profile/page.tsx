import { userService } from "@/services/userService"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import ProfileClient from "./ProfileClient"


export default async function ProfilePage(){


const session =
 await getServerSession(authOptions)


if(!session){
 redirect("/login")
}



const user =
 await userService.getMe()



return (
 <ProfileClient user={user}/>
)

}