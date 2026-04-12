"use client"

import type { RateDataPoint } from "@/lib/types"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts"

export function RateChart({ rateHistory, avgRate }: { rateHistory: RateDataPoint[]; avgRate: number }) {
  const data = rateHistory.map((d, i) => ({
    ...d,
    ratePercent: d.rate * 100,
    fill: i === rateHistory.length - 1 ? "#006d43" : "#aec6ff",
  }))

  return (
    <div className="rounded-xl bg-surface-container-lowest p-6">
      <h3 className="font-headline text-base font-extrabold text-primary mb-1">Historical 7520 Rate</h3>
      <p className="text-sm text-on-surface-variant mb-4">Monthly rates over the last 24 months</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c4c7c7" strokeOpacity={0.2} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 9, fill: "#434750" }}
              axisLine={false}
              tickLine={false}
              interval={2}
            />
            <YAxis
              domain={[4, 6.5]}
              tickFormatter={(v: number) => `${v.toFixed(1)}%`}
              tick={{ fontSize: 10, fill: "#434750" }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(2)}%`, "7520 Rate"]}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,27,68,0.08)",
                fontSize: "12px",
              }}
            />
            <ReferenceLine
              y={avgRate * 100}
              stroke="#001b44"
              strokeDasharray="6 3"
              strokeWidth={1.5}
              label={{ value: "12-mo avg", position: "right", fontSize: 10, fill: "#001b44" }}
            />
            <Bar dataKey="ratePercent" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
