"use client"

import { useState } from "react"

import {
  Bell,
  Menu,
  Search,
  User,
  X
} from "lucide-react"

import MobileSidebar from "./MobileSideBar"

export default function Topbar() {
  const [open, setOpen] =
    useState(false)

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-30
          flex
          h-20
          items-center
          justify-between
          border-b
          border-zinc-800
          bg-black/80
          px-4
          backdrop-blur-xl
          md:px-8
        "
      >
        {/* LEFT */}

        <div className="flex items-center gap-4">
          {/* MOBILE MENU */}

          <button
            onClick={() =>
              setOpen(true)
            }
            className="
              flex
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-950
              p-3
              text-zinc-400
              md:hidden
            "
          >
            <Menu size={20} />
          </button>

          {/* SEARCH */}

          <div
            className="
              hidden
              md:flex
              items-center
              gap-3
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-950
              px-4
              py-3
              w-full
              max-w-md
            "
          >
            <Search
              size={18}
              className="text-zinc-500"
            />

            <input
              placeholder="Search..."
              className="
                w-full
                bg-transparent
                text-sm
                outline-none
                placeholder:text-zinc-500
              "
            />
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">
          <button
            className="
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-950
              p-3
              text-zinc-400
            "
          >
            <Bell size={18} />
          </button>

          <button
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-950
              px-4
              py-2
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white
                text-black
              "
            >
              <User size={18} />
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-medium">
                Trader
              </p>

              <p className="text-xs text-zinc-500">
                Premium
              </p>
            </div>
          </button>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}

      <MobileSidebar
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />
    </>
  )
}



//esto es parw verificar