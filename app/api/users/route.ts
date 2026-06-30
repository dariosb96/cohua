import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"


export async function GET(){


const users =
await prisma.user.findMany({

select:{

id:true,

name:true,

username:true,

email:true,

role:true,

plan:true,

isActive:true,

isBanned:true,

createdAt:true

}

})


return NextResponse.json(users)

}