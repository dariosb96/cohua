import { z } from "zod"


export const registerSchema =
z.object({

 name:
 z.string()
 .min(2)
 .max(50)
 .regex(
  /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  "Nombre inválido"
 ),


 username:
 z.string()
 .min(4)
 .max(20)
 .regex(
  /^[a-zA-Z0-9_]+$/,
  "Username inválido"
 ),


 email:
 z.string()
 .email()
 .max(120),


 password:
 z.string()
 .min(8)
 .max(72)
 .regex(
  /^(?=.*[A-Z])(?=.*[0-9]).+$/,
  "Debe contener mayúscula y número"
 ),


 phone:
 z.string()
 .max(20)
 .optional()

})