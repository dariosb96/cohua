"use client"

import Link from "next/link"

import { usePathname } from "next/navigation"

import {
  LayoutDashboard,
  CandlestickChart,
  BarChart3,
  NotebookPen,
  Settings,
  Wallet
} from "lucide-react"

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },

  {
    label: "Trades",
    href: "/trades",
    icon: CandlestickChart
  },

  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3
  },

  {
    label: "Journal",
    href: "/journal",
    icon: NotebookPen
  },

  {
    label: "Accounts",
    href: "/accounts",
    icon: Wallet
  },

  {
    label: "Settings",
    href: "/settings",
    icon: Settings
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="
        hidden
        md:flex
        fixed
        left-0
        top-0
        z-40
        h-screen
        w-72
        flex-col
        border-r
        border-zinc-800
        bg-zinc-950
      "
    >
      {/* LOGO */}

      <div className="border-b border-zinc-800 p-8">
        <h1 className="text-3xl font-bold">
          COHUA
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Institutional Trading Analytics
        </p>
      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 space-y-2 p-4">
        {links.map((link) => {
          const Icon = link.icon

          const active =
            pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex
                items-center
                gap-3
                rounded-2xl
                px-4
                py-3
                transition-all
                duration-200

                ${
                  active
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }
              `}
            >
              <Icon size={20} />

              <span className="font-medium">
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* FOOTER */}

      <div className="border-t border-zinc-800 p-4 text-sm text-zinc-500">
        COHUA v1.0
      </div>
    </aside>
  )
}