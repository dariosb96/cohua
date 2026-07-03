import type { ReactNode } from "react"

import Sidebar from "@/components/layout/sideBard"
import Topbar from "@/components/layout/TopBar"
import Providers from "@/lib/providers"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-black text-white">
        <div className="flex">
          <Sidebar />

          <div className="flex-1 md:ml-72">
            <Topbar />

            <main className="p-4 md:p-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </Providers>
  )
}