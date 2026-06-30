"use client"


import { useEffect, useState } from "react"



type User = {

 id:string

 name:string

 username:string

 email:string

 phone?:string

 avatar?:string

 bio?:string

 role:string

 plan:string

 createdAt:string

 accounts:any[]

}



export default function ProfileClient(){


const [user,setUser] =
 useState<User|null>(null)


const [loading,setLoading]=
 useState(true)



async function loadProfile(){


 const res =
 await fetch("/api/users/me")


 const data =
 await res.json()


 setUser(data)

 setLoading(false)

}



useEffect(()=>{

 loadProfile()

},[])



if(loading){

 return (

 <div className="text-white">
  Cargando...
 </div>

 )

}



if(!user){

 return null

}




return (

<div className="
min-h-screen
bg-[#050505]
text-white
p-6
">


<div className="
max-w-3xl
mx-auto
bg-zinc-900
border
border-zinc-800
rounded-2xl
p-8
space-y-8
">



<div className="
flex
items-center
gap-5
">


<div className="
w-20
h-20
rounded-full
bg-emerald-500
flex
items-center
justify-center
text-3xl
font-bold
text-black
">

{
 user.name
 .charAt(0)
 .toUpperCase()
}

</div>



<div>

<h1 className="
text-3xl
font-bold
">

{user.name}

</h1>


<p className="text-zinc-400">

@{user.username}

</p>


</div>


</div>





<div className="
grid
md:grid-cols-2
gap-4
">



<Info
title="Email"
value={user.email}
/>


<Info
title="Teléfono"
value={user.phone || "Sin teléfono"}
/>


<Info
title="Rol"
value={user.role}
/>


<Info
title="Plan"
value={user.plan}
/>


<Info
title="Registro"
value={
 new Date(
 user.createdAt
 ).toLocaleDateString()
}
/>



</div>





<div>

<h2 className="
font-semibold
mb-2
">

Biografía

</h2>


<div className="
bg-black
rounded-xl
p-4
text-zinc-300
">

{
 user.bio ||
 "Sin descripción"
}

</div>

</div>





<div>

<h2 className="
font-semibold
mb-3
">

Cuentas

</h2>


{
 user.accounts.length === 0 ? (

<p className="text-zinc-500">

No hay cuentas conectadas

</p>


):(

<div className="space-y-2">


{
user.accounts.map(acc=>(

<div
key={acc.id}
className="
bg-black
p-4
rounded-xl
flex
justify-between
"
>


<span>

{acc.name}

</span>


<span className="text-emerald-400">

${acc.balance}

</span>


</div>

))

}


</div>

)

}



</div>




</div>


</div>

)


}





function Info({
title,
value
}:{
title:string,
value:string
}){


return (

<div className="
bg-black
rounded-xl
p-4
">


<p className="
text-xs
text-zinc-500
">

{title}

</p>


<p className="
text-zinc-200
">

{value}

</p>


</div>

)

}