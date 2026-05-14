"use client"

import { useEffect, useState } from "react"

import EquityChart from "@/components/dashboard/EquityChart"

interface DashboardData {
  totalTrades: number
  wins: number
  losses: number
  totalPnl: number
  winRate: number
  avgRR: number
  highConvictionWins: number
}

interface EquityPoint {
  id: string
  symbol: string
  pnl: number
  equity: number
  drawdown: number
  createdAt: string
}

interface EquityStats {
  peak: number
  maxDrawdown: number
}

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(
      null
    )

  const [equity, setEquity] =
    useState<EquityPoint[]>([])

  const [stats, setStats] =
    useState<EquityStats | null>(
      null
    )

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          dashboardRes,
          equityRes
        ] = await Promise.all([
          fetch("/api/dashboard"),

          fetch("/api/equity")
        ])

        const dashboardJson =
          await dashboardRes.json()

        const equityJson =
          await equityRes.json()

        setDashboard({
          totalTrades:
            dashboardJson.totalTrades ??
            0,

          wins:
            dashboardJson.wins ?? 0,

          losses:
            dashboardJson.losses ??
            0,

          totalPnl:
            dashboardJson.totalPnl ??
            0,

          winRate:
            dashboardJson.winRate ??
            0,

          avgRR:
            dashboardJson.avgRR ?? 0,

          highConvictionWins:
            dashboardJson.highConvictionWins ??
            0
        })

        setEquity(
          equityJson.equity ?? []
        )

        setStats({
          peak:
            equityJson.stats?.peak ??
            0,

          maxDrawdown:
            equityJson.stats
              ?.maxDrawdown ?? 0
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
        "
      >
        <p className="text-zinc-500">
          Loading dashboard...
        </p>
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
        "
      >
        <p className="text-red-500">
          Error loading dashboard
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-zinc-500">
          Track your trading
          performance and analytics.
        </p>
      </div>

      {/* METRICS */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <Card
          title="Trades"
          value={
            dashboard.totalTrades ?? 0
          }
        />

        <Card
          title="Win Rate"
          value={`${(
            dashboard.winRate ?? 0
          ).toFixed(2)}%`}
        />

        <Card
          title="PnL"
          value={`$${(
            dashboard.totalPnl ?? 0
          ).toFixed(2)}`}
        />

        <Card
          title="Avg RR"
          value={(
            dashboard.avgRR ?? 0
          ).toFixed(2)}
        />

        <Card
          title="Peak Equity"
          value={`$${(
            stats?.peak ?? 0
          ).toFixed(2)}`}
        />

        <Card
          title="Max Drawdown"
          value={`$${(
            stats?.maxDrawdown ?? 0
          ).toFixed(2)}`}
        />

        <Card
          title="Wins"
          value={dashboard.wins ?? 0}
        />

        <Card
          title="Losses"
          value={
            dashboard.losses ?? 0
          }
        />
      </div>

      {/* CHART */}

      <EquityChart data={equity} />
    </div>
  )
}

function Card({
  title,
  value
}: {
  title: string
  value: string | number
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-950
        p-6
        transition-all
        duration-200
        hover:border-zinc-700
      "
    >
      <p
        className="
          text-sm
          text-zinc-500
        "
      >
        {title}
      </p>

      <h2
        className="
          mt-4
          text-3xl
          font-bold
          tracking-tight
        "
      >
        {value}
      </h2>
    </div>
  )
}