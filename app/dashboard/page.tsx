"use client"

import {
  useEffect,
  useState
} from "react"

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

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(
      null
    )

  const [equity, setEquity] =
    useState<any[]>([])

  const [stats, setStats] =
    useState<any>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          dashboardRes,
          equityRes
        ] = await Promise.all([
          fetch(
            "/api/dashboard"
          ),

          fetch("/api/equity")
        ])

        const dashboardJson =
          await dashboardRes.json()

        const equityJson =
          await equityRes.json()

        setDashboard(
          dashboardJson
        )

        setEquity(
          equityJson.equity
        )

        setStats(
          equityJson.stats
        )
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Error loading dashboard
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="mb-12">
          <h1 className="text-5xl font-bold">
            COHUA
          </h1>

          <p className="text-zinc-500 mt-2">
            Institutional Trading
            Analytics
          </p>
        </div>

        {/* METRICS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card
            title="Trades"
            value={
              dashboard.totalTrades
            }
          />

          <Card
            title="Win Rate"
            value={`${dashboard.winRate.toFixed(
              2
            )}%`}
          />

          <Card
            title="PnL"
            value={`$${dashboard.totalPnl.toFixed(
              2
            )}`}
          />

          <Card
            title="Avg RR"
            value={dashboard.avgRR.toFixed(
              2
            )}
          />

          <Card
            title="Peak Equity"
            value={`$${stats?.peak?.toFixed(
              2
            )}`}
          />

          <Card
            title="Max Drawdown"
            value={`$${stats?.maxDrawdown?.toFixed(
              2
            )}`}
          />

          <Card
            title="Wins"
            value={
              dashboard.wins
            }
          />

          <Card
            title="Losses"
            value={
              dashboard.losses
            }
          />
        </div>

        {/* CHART */}

        <EquityChart
          data={equity}
        />
      </div>
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
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <p className="text-zinc-500">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-4">
        {value}
      </h2>
    </div>
  )
}