"use client"

import Link from "next/link"

import { motion, AnimatePresence } from "framer-motion"

import {
  LayoutDashboard,
  CandlestickChart,
  BarChart3,
  NotebookPen,
  Settings,
  Wallet,
  X
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

interface Props {
  open: boolean

  onClose: () => void
}

export default function MobileSidebar({
  open,
  onClose
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* OVERLAY */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed
              inset-0
              z-40
              bg-black/70
              backdrop-blur-sm
            "
          />

          {/* SIDEBAR */}

          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{
              type: "spring",
              damping: 25
            }}
            className="
              fixed
              left-0
              top-0
              z-50
              flex
              h-screen
              w-72
              flex-col
              border-r
              border-zinc-800
              bg-zinc-950
            "
          >
            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-zinc-800
                p-6
              "
            >
              <div>
                <h1 className="text-2xl font-bold">
                  COHUA
                </h1>

                <p className="text-sm text-zinc-500">
                  Trading Analytics
                </p>
              </div>

              <button
                onClick={onClose}
                className="
                  rounded-xl
                  border
                  border-zinc-800
                  p-2
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* LINKS */}

            <nav className="flex-1 space-y-2 p-4">
              {links.map((link) => {
                const Icon = link.icon

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      px-4
                      py-3
                      text-zinc-400
                      transition
                      hover:bg-zinc-900
                      hover:text-white
                    "
                  >
                    <Icon size={20} />

                    <span>
                      {link.label}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}