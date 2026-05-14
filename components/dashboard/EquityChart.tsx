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

type EquityPoint = {
  id: string
  symbol: string
  pnl: number
  equity: number
  drawdown: number
  createdAt: string
}

type Props = {
  data: EquityPoint[]
}

export default function EquityChart({
  data
}: Props) {
  const formattedData = data.map(
    (item) => ({
      ...item,

      date: new Date(
        item.createdAt
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      })
    })
  )

  return (
    <div
      className="
        w-full
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-5
      "
    >
      <div className="mb-6">
        <h2
          className="
            text-xl
            font-semibold
            text-white
          "
        >
          Equity Curve
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-zinc-400
          "
        >
          Cumulative account performance
        </p>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient
                id="equity"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#22c55e"
                  stopOpacity={0.4}
                />

                <stop
                  offset="95%"
                  stopColor="#22c55e"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
            />

            <XAxis
              dataKey="date"
              stroke="#a1a1aa"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#a1a1aa"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                `$${value}`
              }
            />

            <Tooltip
              contentStyle={{
                backgroundColor:
                  "#18181b",

                border:
                  "1px solid #27272a",

                borderRadius: "12px"
              }}
            />

            <Area
              type="monotone"
              dataKey="equity"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#equity)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}