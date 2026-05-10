import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import LogoutButton from "./logOutButton"
import { accountService } from "@/services/accountService"
import { Decimal } from "@prisma/client/runtime/library"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (!session.user?.id) {
    redirect("/login")
  }

  const accounts = await accountService.getAll(session.user.id)

  const totalBalance = accounts.reduce(
    (acc: number, accItem: any) => acc + parseFloat(accItem.balance.toString()),
    0
  )

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>

      {/* User */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="font-semibold">Usuario</h2>
        <p>{session.user?.email}</p>
      </div>

      {/* 💰 Total Balance */}
      <div className="bg-black text-white p-6 rounded-xl shadow">
        <h2 className="text-lg">Balance total</h2>
        <p className="text-3xl font-bold">
          ${totalBalance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>

      {/* 🏦 Accounts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Cuentas</h2>

        {accounts.length === 0 && (
          <p className="text-gray-500">No tienes cuentas aún</p>
        )}

        {accounts.map((acc: any) => (
          <div
            key={acc.id}
            className="bg-white shadow rounded p-4 flex justify-between"
          >
            <div>
              <p className="font-semibold">{acc.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(acc.createdAt).toLocaleDateString()}
              </p>
            </div>

            <p className="font-bold">
              ${parseFloat(acc.balance.toString()).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}