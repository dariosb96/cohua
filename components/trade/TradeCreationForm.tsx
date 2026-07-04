// components/trade/TradeCreationForm.tsx

"use client"

import {
  useEffect,
  useMemo,
  useState
} from "react"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import {
  tradeSchema,
  TradeFormData
} from "@/src/application/validations/tradeSchema"

interface Account {
  id: string
  name: string
  balance: number
  exchange?: string | null
}

const CONFLUENCE_WEIGHTS = {
  liquiditySweep: 15,
  reclaim: 15,
  displacement: 10,
  bos: 10,
  choch: 10,
  ema15mTouch: 10,
  ema1hTouch: 15,
  obTouched: 10,
  htfAligned: 5
}

export default function TradeCreationForm() {
  // ====================================
  // FORM
  // ====================================

const {
  register,
  handleSubmit,
  watch,
  reset,
  formState: {
    errors,
    isSubmitting
  }
} =useForm({
  resolver: zodResolver(tradeSchema),

  defaultValues: {
    side: "LONG",

    riskPercent: 1
  }
})

  // ====================================
  // ACCOUNTS
  // ====================================

  const [accounts, setAccounts] =
    useState<Account[]>([])

  const [loadingAccounts, setLoadingAccounts] =
    useState(true)

  // ====================================
  // CONFLUENCES
  // ====================================

  const [
    confluences,
    setConfluences
  ] = useState({
    liquiditySweep: false,

    reclaim: false,

    displacement: false,

    bos: false,

    choch: false,

    ema15mTouch: false,

    ema1hTouch: false,

    obTouched: false,

    htfAligned: false
  })

  // ====================================
  // FETCH ACCOUNTS
  // ====================================

  useEffect(() => {
    async function fetchAccounts() {
      try {
        setLoadingAccounts(true)

        const res = await fetch(
          "/api/accounts"
        )

        if (!res.ok) {
          throw new Error(
            "Failed to fetch accounts"
          )
        }

        const data =
          await res.json()

        const formatted =
          data.map(
            (account: any) => ({
              id: account.id,

              name:
                account.name,

              balance: Number(
                account.balance
              ),

              exchange:
                account.exchange
            })
          )

        setAccounts(formatted)
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingAccounts(false)
      }
    }

    fetchAccounts()
  }, [])

  // ====================================
  // WATCH VALUES
  // ====================================

  const symbol = watch("symbol")

  const side = watch("side")

  const entry = Number(
    watch("entryPrice") || 0
  )

  const stop = Number(
    watch("stopLoss") || 0
  )

  const tp = Number(
    watch("takeProfit") || 0
  )

  const leverage = Number(
    watch("leverage") || 1
  )

  const riskPercent = Number(
    watch("riskPercent") || 0
  )

  const selectedAccountId =
    watch("accountId")

  // ====================================
  // ACCOUNT
  // ====================================

  const selectedAccount =
    accounts.find(
      (acc) =>
        acc.id ===
        selectedAccountId
    )

  const balance =
    selectedAccount?.balance ||
    0

  // ====================================
  // CORE CALCULATIONS
  // ====================================

  const riskAmount =
    balance *
    (riskPercent / 100)

  const stopDistance =
    Math.abs(entry - stop)

  const calculatedSize =
    stopDistance > 0
      ? riskAmount /
        stopDistance
      : 0

  const reward =
    Math.abs(tp - entry) *
    calculatedSize

  const rr =
    riskAmount > 0
      ? reward /
        riskAmount
      : 0

  const exposure =
    calculatedSize * entry

  const marginUsed =
    leverage > 0
      ? exposure / leverage
      : 0

  const pnlAtTp =
    side === "LONG"
      ? (tp - entry) *
        calculatedSize
      : (entry - tp) *
        calculatedSize

  const pnlAtSl =
    side === "LONG"
      ? (stop - entry) *
        calculatedSize
      : (entry - stop) *
        calculatedSize

  // ====================================
  // CONFLUENCE SCORE
  // ====================================

  const confluenceScore =
    useMemo(() => {
      let score = 0

      Object.entries(
        confluences
      ).forEach(
        ([key, value]) => {
          if (value) {
            score +=
              CONFLUENCE_WEIGHTS[
                key as keyof typeof CONFLUENCE_WEIGHTS
              ]
          }
        }
      )

      return score
    }, [confluences])

  // ====================================
  // SETUP QUALITY
  // ====================================

  const setupQuality =
    confluenceScore >= 80
      ? "A+"
      : confluenceScore >= 65
      ? "A"
      : confluenceScore >= 50
      ? "B"
      : confluenceScore >= 35
      ? "C"
      : "D"

  // ====================================
  // TOGGLE CONFLUENCE
  // ====================================

  function toggleConfluence(
    key: keyof typeof confluences
  ) {
    setConfluences((prev) => ({
      ...prev,

      [key]: !prev[key]
    }))
  }

  // ====================================
  // SUBMIT
  // ====================================
async function onSubmit(
  data: TradeFormData
) {
  console.log(
    "ON SUBMIT EXECUTED",
    data
  )

  try {
    const payload = {
      ...data,

      size: calculatedSize,

      riskAmount,

      rr,

      confluenceScore,

      confluences,

      exposure,

      marginUsed,

      pnlAtTp,

      pnlAtSl
    }

    console.log(
      "PAYLOAD",
      payload
    )

    const res = await fetch(
      "/api/trade",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify(
          payload
        )
      }
    )

    console.log(
      "STATUS",
      res.status
    )

    const responseData =
      await res.json()

    console.log(
      "RESPONSE",
      responseData
    )

    if (!res.ok) {
      throw new Error(
        responseData.error ||
          "Failed to create trade"
      )
    }

    alert("Trade created")

    reset()
  } catch (error) {
    console.error(
      "SUBMIT ERROR",
      error
    )

    alert(
      "Error creating trade"
    )
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
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* LEFT */}

          <div className="lg:col-span-2 space-y-6">
            {/* TRADE PANEL */}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 space-y-6">
              <h2 className="text-2xl font-semibold">
                Trade Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SYMBOL */}

                <Field
                  label="Symbol"
                  error={
                    errors.symbol
                      ?.message
                  }
                >
                  <input
                    {...register(
                      "symbol"
                    )}
                    placeholder="BTCUSDT"
                    className={inputClass}
                  />
                </Field>

                {/* SIDE */}

                <Field label="Side">
                  <select
                    {...register(
                      "side"
                    )}
                    className={inputClass}
                  >
                    <option value="LONG">
                      LONG
                    </option>

                    <option value="SHORT">
                      SHORT
                    </option>
                  </select>
                </Field>

                {/* ACCOUNT */}

                <Field label="Account">
                  <select
                    {...register(
                      "accountId"
                    )}
                    className={inputClass}
                  >
                    <option value="">
                      {loadingAccounts
                        ? "Loading..."
                        : "Select account"}
                    </option>

                    {accounts.map(
                      (
                        account
                      ) => (
                        <option
                          key={
                            account.id
                          }
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
                </Field>

                {/* LEVERAGE */}

                <Field label="Leverage">
                  <input
                    type="number"
                    {...register(
                      "leverage"
                    )}
                    className={inputClass}
                  />
                </Field>

                {/* RISK */}

                <Field label="Risk %">
                  <input
                    type="number"
                    step="0.1"
                    {...register(
                      "riskPercent"
                    )}
                    className={inputClass}
                  />
                </Field>

                {/* ENTRY */}

                <Field label="Entry">
                  <input
                    type="number"
                    step="0.0001"
                    {...register(
                      "entryPrice"
                    )}
                    className={inputClass}
                  />
                </Field>

                {/* SL */}

                <Field label="Stop Loss">
                  <input
                    type="number"
                    step="0.0001"
                    {...register(
                      "stopLoss"
                    )}
                    className={inputClass}
                  />
                </Field>

                {/* TP */}

                <Field label="Take Profit">
                  <input
                    type="number"
                    step="0.0001"
                    {...register(
                      "takeProfit"
                    )}
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="w-full rounded-2xl bg-white text-black py-4 font-semibold hover:opacity-90 transition"
              >
                {isSubmitting
                  ? "Creating..."
                  : "Create Trade"}
              </button>
            </div>

            {/* CONFLUENCE PANEL */}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  Confluences
                </h2>

                <div className="rounded-xl bg-white text-black px-4 py-2 font-bold">
                  {confluenceScore}
                  /100
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(
                  confluences
                ).map(
                  ([
                    key,
                    value
                  ]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() =>
                        toggleConfluence(
                          key as keyof typeof confluences
                        )
                      }
                      className={`rounded-2xl border px-4 py-3 text-sm transition ${
                        value
                          ? "bg-white text-black border-white"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      {formatLabel(
                        key
                      )}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="space-y-6">
            {/* RISK ENGINE */}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-2xl font-semibold mb-6">
                Risk Engine
              </h2>

              <div className="space-y-4">
                <Metric
                  title="Balance"
                  value={`$${balance.toFixed(
                    2
                  )}`}
                />

                <Metric
                  title="Risk Amount"
                  value={`$${riskAmount.toFixed(
                    2
                  )}`}
                />

                <Metric
                  title="Position Size"
                  value={calculatedSize.toFixed(
                    4
                  )}
                />

                <Metric
                  title="Exposure"
                  value={`$${exposure.toFixed(
                    2
                  )}`}
                />

                <Metric
                  title="Margin Used"
                  value={`$${marginUsed.toFixed(
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
                  title="RR"
                  value={`${rr.toFixed(
                    2
                  )} RR`}
                />

                <Metric
                  title="Setup Grade"
                  value={
                    setupQuality
                  }
                />
              </div>
            </div>

            {/* MARKET SUMMARY */}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-2xl font-semibold mb-6">
                Trade Summary
              </h2>

              <div className="space-y-4 text-sm">
                <SummaryItem
                  label="Symbol"
                  value={
                    symbol ||
                    "-"
                  }
                />

                <SummaryItem
                  label="Direction"
                  value={
                    side || "-"
                  }
                />

                <SummaryItem
                  label="Potential TP"
                  value={`$${pnlAtTp.toFixed(
                    2
                  )}`}
                />

                <SummaryItem
                  label="Potential SL"
                  value={`$${pnlAtSl.toFixed(
                    2
                  )}`}
                />

                <SummaryItem
                  label="Confluences"
                  value={`${Object.values(
                    confluences
                  ).filter(Boolean)
                    .length}`}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ====================================
// HELPERS
// ====================================

const inputClass =
  "w-full mt-2 rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none"

function formatLabel(
  value: string
) {
  return value
    .replace(
      /([A-Z])/g,
      " $1"
    )
    .replace(/^./, (str) =>
      str.toUpperCase()
    )
}

function Field({
  label,
  children,
  error
}: {
  label: string

  children: React.ReactNode

  error?: string
}) {
  return (
    <div>
      <label className="text-sm text-zinc-400">
        {label}
      </label>

      {children}

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
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

function SummaryItem({
  label,
  value
}: {
  label: string

  value: string
}) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
      <span className="text-zinc-500">
        {label}
      </span>

      <span className="font-medium">
        {value}
      </span>
    </div>
  )
}