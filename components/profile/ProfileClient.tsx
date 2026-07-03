"use client"

import type { ProfileUser } from "@/types/user"

interface Props {
  user: ProfileUser
}

export default function ProfileClient({
  user,
}: Props) {
  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* HEADER */}

      <section
        className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-8
        "
      >
        <div className="flex items-center gap-5">

          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-emerald-500
              text-3xl
              font-bold
              text-black
            "
          >
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>

            <h1 className="text-3xl font-bold">
              {user.name}
            </h1>

            <p className="text-zinc-500">
              @{user.username}
            </p>

          </div>

        </div>
      </section>

      {/* INFO */}

      <section
        className="
          grid
          gap-4
          md:grid-cols-2
        "
      >

        <Info
          title="Correo"
          value={user.email}
        />

        <Info
          title="Teléfono"
          value={user.phone || "Sin teléfono"}
        />

        <Info
          title="Rol"
          value={String(user.role)}
        />

        <Info
          title="Plan"
          value={String(user.plan)}
        />

        <Info
          title="Registro"
          value={new Date(user.createdAt).toLocaleDateString()}
        />

      </section>

      {/* BIO */}

      <section
        className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-6
        "
      >

        <h2 className="mb-4 font-semibold">
          Biografía
        </h2>

        <p className="text-zinc-400">
          {user.bio || "Sin descripción"}
        </p>

      </section>

      {/* ACCOUNTS */}

      <section
        className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-6
        "
      >

        <h2 className="mb-4 font-semibold">
          Cuentas
        </h2>

        {user.accounts.length === 0 ? (

          <p className="text-zinc-500">
            No hay cuentas creadas.
          </p>

        ) : (

          <div className="space-y-3">

            {user.accounts.map((account) => (

              <div
                key={account.id}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  bg-black
                  p-4
                "
              >

                <span>
                  {account.name}
                </span>

                <span className="text-emerald-400">

                  $
                  {Number(account.balance).toLocaleString(
                    "es-MX",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </span>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  )
}

interface InfoProps {
  title: string
  value: string
}

function Info({
  title,
  value,
}: InfoProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-5
      "
    >

      <p className="text-xs text-zinc-500">
        {title}
      </p>

      <p className="mt-1 text-white">
        {value}
      </p>

    </div>
  )
}