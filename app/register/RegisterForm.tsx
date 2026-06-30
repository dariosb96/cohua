// app/register/RegisterForm.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function RegisterForm() {
  const router = useRouter()

const [form, setForm] = useState({
  name: "",
  username: "",
  email: "",
  password: "",
  phone: "",
})

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const validate = () => {
    if (!form.name || !form.username || !form.email || !form.password) {
      return "Nombre, username, email y contraseña son obligatorios"
    }

    if (form.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres"
    }

    if (form.name.length < 2) {
      return "El nombre debe tener al menos 2 caracteres"
    }

    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al registrarse")
        setLoading(false)
        return
      }

      // Auto login después de registro
      const loginRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (loginRes?.error) {
        router.push("/login")
      } else {
        router.push("/dashboard")
      }

    } catch (err) {
      setError("Error inesperado")
    } finally {
      setLoading(false)
    }
  }

return (
  <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#12372a33,transparent_40%)]" />

    <form
      onSubmit={handleSubmit}
      className="
        relative
        w-full max-w-md
        bg-zinc-900/80
        backdrop-blur
        border border-zinc-800
        p-8
        rounded-2xl
        shadow-2xl
        space-y-5
      "
    >

      <div className="text-center space-y-2">

        <h1 className="
          text-3xl 
          font-bold 
          text-white
        ">
          Cohua
        </h1>

        <p className="text-zinc-400 text-sm">
          Crea tu cuenta
        </p>

      </div>


      <input
        name="name"
        placeholder="Nombre"
        className="
          w-full
          bg-zinc-950
          border border-zinc-800
          text-white
          placeholder:text-zinc-600
          p-3
          rounded-xl
          outline-none
          focus:border-emerald-500
          transition
        "
        onChange={handleChange}
      />
      
      <input
        name="username"
        placeholder="Nombre de usuario"
        className="
          w-full
          bg-zinc-950
          border border-zinc-800
          text-white
          placeholder:text-zinc-600
          p-3
          rounded-xl
          outline-none
          focus:border-emerald-500
          transition
        "
        onChange={handleChange}
      />


      <input
        name="email"
        type="email"
        placeholder="Correo"
        className="
          w-full bg-zinc-950
          border border-zinc-800
          text-white
          placeholder:text-zinc-600
          p-3 rounded-xl
          outline-none
          focus:border-emerald-500
        "
        onChange={handleChange}
      />


      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        className="
          w-full bg-zinc-950
          border border-zinc-800
          text-white
          p-3 rounded-xl
          outline-none
          focus:border-emerald-500
        "
        onChange={handleChange}
      />


      <input
        name="phone"
        placeholder="Teléfono"
        className="
          w-full bg-zinc-950
          border border-zinc-800
          text-white
          p-3 rounded-xl
        "
        onChange={handleChange}
      />


      {error && (
        <p className="text-red-400 text-sm text-center">
          {error}
        </p>
      )}


      <button
        disabled={loading}
        className="
          w-full
          bg-emerald-500
          hover:bg-emerald-400
          text-zinc-800
          font-semibold
          py-3
          rounded-xl
          transition
        "
      >
        {loading ? "Creando..." : "Crear cuenta"}
      </button>


      <p className="text-center text-zinc-300 text-sm">
        ¿Ya tienes cuenta?{" "}
        <span
          onClick={() => router.push('/login')}
          className="
            text-emerald-400
            cursor-pointer
          "
        >
          Entrar
        </span>
      </p>

    </form>

  </div>
)
}