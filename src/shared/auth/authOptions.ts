import { type AuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/src/infrastructure/database/prisma"
import bcrypt from "bcryptjs"


export const authOptions: AuthOptions = {

  session:{
    strategy:"jwt"
  },


  providers:[

    Credentials({

      name:"Credentials",

      credentials:{

        email:{
          label:"Email",
          type:"email"
        },

        password:{
          label:"Password",
          type:"password"
        }

      },


      async authorize(credentials){

        try{

          if(
            !credentials?.email ||
            !credentials?.password
          ){
            return null
          }



          const user =
            await prisma.user.findUnique({
              where:{
                email:credentials.email
              }
            })



          if(!user)
            return null



          if(!user.isActive || user.isBanned){
            return null
          }



          const isValid =
            await bcrypt.compare(
              credentials.password,
              user.password
            )



          if(!isValid)
            return null



          return {

            id:user.id,

            name:user.name,

            username:user.username,

            email:user.email,

            role:user.role,

            plan:user.plan

          }


        }catch(error){

          console.error(
            "AUTH ERROR:",
            error
          )

          return null

        }

      }

    })

  ],



  callbacks:{


    async jwt({token,user}){


      if(user){

        token.id =
          user.id


        token.username =
          user.username


        token.role =
          user.role


        token.plan =
          user.plan

      }


      return token

    },



    async session({session,token}){


      if(session.user){

        session.user.id =
          token.id as string


        session.user.username =
          token.username as string


        session.user.role =
          token.role as string


        session.user.plan =
          token.plan as string

      }


      return session

    }


  },


  pages:{

    signIn:"/login",

    error:"/login"

  },


  secret:process.env.NEXTAUTH_SECRET

}