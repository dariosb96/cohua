"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

interface EquityPoint {
  id: string

  symbol: string

  pnl: number

  equity: number

  drawdown: number

  createdAt: string
}

interface Props {
  data: EquityPoint[]
}

export default function EquityChart({
  data
}: Props) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Equity Curve
        </h2>

        <p className="text-zinc-500 mt-1">
          Account growth over time
        </p>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
            />

            <XAxis
              dataKey="createdAt"
              stroke="#71717a"
              tickFormatter={(
                value
              ) =>
                new Date(
                  value
                ).toLocaleDateString()
              }
            />

            <YAxis stroke="#71717a" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="equity"
              stroke="#ffffff"
              fill="#18181b"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}