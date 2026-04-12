"use client"

import type { GRAT } from "@/lib/types"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts"

export function CumulativeChart({ grats }: { grats: GRAT[] }) {
  // Only show for clients with completed/rolled GRATs that transferred wealth
  const completedGrats = grats
    .filter(g => ["rolled", "completed"].includes(g.status) && g.remainderEstimate > 0)
    .sort((a, b) => new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime())

  // Also include active GRATs with positive remainders as projected future transfers
  const activeGratsWithRemainder = grats
    .filter(g => !["rolled", "completed"].includes(g.status) && g.remainderEstimate > 0)
    .sort((a, b) => new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime())

  if (completedGrats.length === 0 && activeGratsWithRemainder.length === 0) return null

  // Build cumulative data points
  const dataPoints: Array<{ date: string; totalTransferred: number; label?: string }> = []
  let cumulative = 0

  // Start point
  if (completedGrats.length > 0) {
    const firstDate = new Date(completedGrats[0].maturityDate)
    firstDate.setMonth(firstDate.getMonth() - 1)
    dataPoints.push({ date: firstDate.toISOString().split("T")[0], totalTransferred: 0 })
  }

  // Completed transfers
  for (const grat of completedGrats) {
    cumulative += grat.remainderEstimate
    dataPoints.push({
      date: grat.maturityDate,
      totalTransferred: cumulative,
      label: grat.name,
    })
  }

  // Projected transfers (from active GRATs)
  for (const grat of activeGratsWithRemainder) {
    cumulative += grat.remainderEstimate
    dataPoints.push({
      date: grat.maturityDate,
      totalTransferred: cumulative,
      label: `${grat.name} (projected)`,
    })
  }

  const formatValue = (v: number) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
    if (v >= 1_000) return `$${Math.round(v / 1_000)}K`
    return `$${v}`
  }

  return (
    <div className="rounded-xl bg-surface-container-lowest p-6">
      <h3 className="font-headline text-base font-extrabold text-primary mb-1">Cumulative Wealth Transferred</h3>
      <p className="text-sm text-on-surface-variant mb-4">Tax-free transfers to beneficiaries over time</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataPoints} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
            <defs>
              <linearGradient id="transferGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#75f8b3" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#75f8b3" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#c4c7c7" strokeOpacity={0.2} vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
              tick={{ fontSize: 10, fill: "#434750" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatValue}
              tick={{ fontSize: 10, fill: "#434750" }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              formatter={(value) => [formatValue(Number(value ?? 0)), "Transferred"]}
              labelFormatter={(label) => new Date(String(label ?? "")).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,27,68,0.08)", fontSize: "12px" }}
            />
            <Area type="stepAfter" dataKey="totalTransferred" stroke="#006d43" strokeWidth={2} fill="url(#transferGradient)" />
            {/* Annotate step-ups */}
            {dataPoints.filter(d => d.label).map((d, i) => (
              <ReferenceDot key={i} x={d.date} y={d.totalTransferred} r={4} fill="#006d43" stroke="#fff" strokeWidth={2} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
