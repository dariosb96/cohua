// components/trade/TradeCreationForm.tsx

"use client"

import {
  useEffect,
  useState
} from "react"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import {
  tradeSchema,
  TradeFormData
} from "@/lib/validations/tradeSchema"

interface Account {
  id: string
  name: string
  balance: number
  exchange?: string | null
}

export default function TradeCreationForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm<TradeFormData>({
    resolver: zodResolver(tradeSchema)
  })

  const [accounts, setAccounts] =
    useState<Account[]>([])

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await fetch(
          "/api/accounts"
        )

        if (!res.ok) {
          throw new Error(
            "Failed to fetch accounts"
          )
        }

        const data = await res.json()

        const formatted =
          data.map((account: any) => ({
            id: account.id,
            name: account.name,
            balance: Number(
              account.balance
            ),
            exchange:
              account.exchange
          }))

        setAccounts(formatted)
      } catch (error) {
        console.error(error)
      }
    }

    fetchAccounts()
  }, [])

  // =========================
  // LIVE VALUES
  // =========================

  const entry = Number(
    watch("entryPrice") || 0
  )

  const stop = Number(
    watch("stopLoss") || 0
  )

  const tp = Number(
    watch("takeProfit") || 0
  )

  const size = Number(
    watch("size") || 0
  )

  // =========================
  // LIVE CALCULATIONS
  // =========================

  const risk =
    Math.abs(entry - stop) * size

  const reward =
    Math.abs(tp - entry) * size

  const rr =
    risk > 0
      ? reward / risk
      : 0

  const exposure = entry * size

  // =========================
  // SUBMIT
  // =========================

  async function onSubmit(
    data: TradeFormData
  ) {
    try {
      const res = await fetch(
        "/api/trade",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(data)
        }
      )

      if (!res.ok) {
        throw new Error(
          "Failed to create trade"
        )
      }

      const trade = await res.json()

      console.log(trade)

      alert("Trade created")
    } catch (error) {
      console.error(error)

      alert("Error creating trade")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Create Trade
          </h1>

          <p className="text-zinc-400 mt-2">
            Institutional execution
            journal
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* LEFT PANEL */}

          <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SYMBOL */}

              <div>
                <label className="text-sm text-zinc-400">
                  Symbol
                </label>

                <input
                  {...register("symbol")}
                  placeholder="BTCUSDT"
                  className="w-full mt-2 rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none"
                />

                {errors.symbol && (
                  <p className="text-red-500 text-sm mt-1">
                    Invalid symbol
                  </p>
                )}
              </div>

              {/* SIDE */}

              <div>
                <label className="text-sm text-zinc-400">
                  Side
                </label>

                <select
                  {...register("side")}
                  className="w-full mt-2 rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none"
                >
                  <option value="LONG">
                    LONG
                  </option>

                  <option value="SHORT">
                    SHORT
                  </option>
                </select>
              </div>

              {/* ACCOUNT */}

              <div>
                <label className="text-sm text-zinc-400">
                  Account
                </label>

                <select
                  {...register("accountId")}
                  className="w-full mt-2 rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none"
                >
                  <option value="">
                    Select account
                  </option>

                  {accounts.map(
                    (account) => (
                      <option
                        key={account.id}
                        value={
                          account.id
                        }
                      >
                        {
                          account.name
                        }{" "}
                        — $
                        {account.balance.toFixed(
                          2
                        )}
                      </option>
                    )
                  )}
                </select>

                {errors.accountId && (
                  <p className="text-red-500 text-sm mt-1">
                    Select an account
                  </p>
                )}
              </div>

              {/* LEVERAGE */}

              <div>
                <label className="text-sm text-zinc-400">
                  Leverage
                </label>

                <input
                  type="number"
                  {...register(
                    "leverage"
                  )}
                  className="w-full mt-2 rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none"
                />
              </div>

              {/* ENTRY */}

              <div>
                <label className="text-sm text-zinc-400">
                  Entry Price
                </label>

                <input
                  type="number"
                  step="0.0001"
                  {...register(
                    "entryPrice"
                  )}
                  className="w-full mt-2 rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none"
                />
              </div>

              {/* STOP */}

              <div>
                <label className="text-sm text-zinc-400">
                  Stop Loss
                </label>

                <input
                  type="number"
                  step="0.0001"
                  {...register(
                    "stopLoss"
                  )}
                  className="w-full mt-2 rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none"
                />
              </div>

              {/* TAKE PROFIT */}

              <div>
                <label className="text-sm text-zinc-400">
                  Take Profit
                </label>

                <input
                  type="number"
                  step="0.0001"
                  {...register(
                    "takeProfit"
                  )}
                  className="w-full mt-2 rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none"
                />
              </div>

              {/* SIZE */}

              <div>
                <label className="text-sm text-zinc-400">
                  Position Size
                </label>

                <input
                  type="number"
                  step="0.01"
                  {...register("size")}
                  className="w-full mt-2 rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none"
                />
              </div>
            </div>

            {/* NOTES */}

            <div>
              <label className="text-sm text-zinc-400">
                Notes
              </label>

              <textarea
                rows={6}
                placeholder="Describe liquidity behavior..."
                className="w-full mt-2 rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none resize-none"
              />
            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-white text-black py-4 font-semibold hover:opacity-90 transition"
            >
              {isSubmitting
                ? "Creating..."
                : "Create Trade"}
            </button>
          </div>

          {/* RIGHT PANEL */}

          <div className="space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-2xl font-semibold mb-6">
                Live Risk Engine
              </h2>

              <div className="space-y-4">
                <Metric
                  title="Risk"
                  value={`$${risk.toFixed(
                    2
                  )}`}
                />

                <Metric
                  title="Reward"
                  value={`$${reward.toFixed(
                    2
                  )}`}
                />

                <Metric
                  title="Risk / Reward"
                  value={`${rr.toFixed(
                    2
                  )} RR`}
                />

                <Metric
                  title="Exposure"
                  value={`$${exposure.toFixed(
                    2
                  )}`}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function Metric({
  title,
  value
}: {
  title: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <h3 className="text-2xl font-bold mt-1">
        {value}
      </h3>
    </div>
  )
}