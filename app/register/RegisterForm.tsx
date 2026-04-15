// app/register/RegisterForm.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function RegisterForm() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
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
    if (!form.name || !form.email || !form.password) {
      return "Nombre, email y contraseña son obligatorios"
    }

    if (form.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres"
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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96 space-y-4"
      >
        <h1 className="text-xl font-bold text-black text-center">Crear cuenta</h1>

        <input
          name="name"
          placeholder="Nombre"
          className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none text-gray-800"
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Correo"
          className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none text-gray-800"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none text-gray-800"
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Teléfono (opcional)"
          className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none text-gray-800"
          onChange={handleChange}
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>

        <p className="text-sm text-center">
          ¿Ya tienes cuenta?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Inicia sesión
          </span>
        </p>
      </form>
    </div>
  )
}