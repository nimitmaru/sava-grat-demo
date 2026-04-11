"use client"

import type { GRAT } from "@/lib/types"

const STATUS_COLORS: Record<string, string> = {
  active: "#001b44",
  maturing: "#fbbc00",
  pending_rollover: "#224583",
  rolled: "#eae8e7",
  completed: "#eae8e7",
  underperforming: "#ba1a1a",
}

export function GratTimeline({ grats }: { grats: GRAT[] }) {
  if (grats.length === 0) return null

  const allDates = grats.flatMap(g => [new Date(g.startDate), new Date(g.maturityDate)])
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())))
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())))

  minDate.setMonth(minDate.getMonth() - 1)
  maxDate.setMonth(maxDate.getMonth() + 3)

  const totalMs = maxDate.getTime() - minDate.getTime()
  const toPercent = (date: Date) => ((date.getTime() - minDate.getTime()) / totalMs) * 100

  const today = new Date("2026-04-11")
  const todayPercent = toPercent(today)

  const sortedGrats = [...grats].sort((a, b) => {
    const statusOrder: Record<string, number> = {
      active: 0,
      maturing: 1,
      underperforming: 2,
      pending_rollover: 3,
      rolled: 4,
      completed: 5,
    }
    return (
      (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9) ||
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
  })

  const barHeight = 28
  const barGap = 8
  const labelWidth = 140
  const chartHeight = sortedGrats.length * (barHeight + barGap) + 40

  const months: { label: string; percent: number }[] = []
  const cursor = new Date(minDate)
  cursor.setDate(1)
  while (cursor <= maxDate) {
    months.push({
      label: cursor.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      percent: toPercent(cursor),
    })
    cursor.setMonth(cursor.getMonth() + 3)
  }

  return (
    <div className="rounded-xl bg-surface-container-lowest p-6">
      <h3 className="font-headline text-base font-extrabold text-primary mb-4">
        Rolling Strategy Timeline
      </h3>
      <div className="overflow-x-auto">
        <svg
          width="100%"
          viewBox={`0 0 800 ${chartHeight}`}
          className="min-w-[600px]"
        >
          {/* Grid lines and month labels */}
          {months.map((m, i) => (
            <g key={i}>
              <line
                x1={labelWidth + (800 - labelWidth) * m.percent / 100}
                y1={0}
                x2={labelWidth + (800 - labelWidth) * m.percent / 100}
                y2={chartHeight - 25}
                stroke="#c4c7c7"
                strokeWidth={0.5}
                strokeDasharray="4,4"
                opacity={0.3}
              />
              <text
                x={labelWidth + (800 - labelWidth) * m.percent / 100}
                y={chartHeight - 8}
                textAnchor="middle"
                fontSize={10}
                fill="#434750"
                fontFamily="var(--font-geist-sans)"
              >
                {m.label}
              </text>
            </g>
          ))}

          {/* Today line */}
          <line
            x1={labelWidth + (800 - labelWidth) * todayPercent / 100}
            y1={0}
            x2={labelWidth + (800 - labelWidth) * todayPercent / 100}
            y2={chartHeight - 25}
            stroke="#ba1a1a"
            strokeWidth={1.5}
            strokeDasharray="6,3"
          />
          <text
            x={labelWidth + (800 - labelWidth) * todayPercent / 100}
            y={chartHeight - 8}
            textAnchor="middle"
            fontSize={9}
            fill="#ba1a1a"
            fontWeight="bold"
          >
            Today
          </text>

          {/* GRAT bars */}
          {sortedGrats.map((grat, i) => {
            const y = i * (barHeight + barGap) + 8
            const startPct = toPercent(new Date(grat.startDate))
            const endPct = toPercent(new Date(grat.maturityDate))
            const x = labelWidth + (800 - labelWidth) * startPct / 100
            const width = (800 - labelWidth) * (endPct - startPct) / 100
            const color = STATUS_COLORS[grat.status] || "#001b44"
            const isHistorical = ["rolled", "completed"].includes(grat.status)

            return (
              <g key={grat.id} opacity={isHistorical ? 0.4 : 1}>
                <text
                  x={labelWidth - 8}
                  y={y + barHeight / 2 + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill={isHistorical ? "#9e9e9e" : "#1b1c1c"}
                  fontFamily="var(--font-geist-mono)"
                  fontWeight={500}
                >
                  {grat.name}
                </text>
                <rect
                  x={x}
                  y={y}
                  width={Math.max(width, 4)}
                  height={barHeight}
                  rx={4}
                  fill={color}
                />
                {grat.rolledToId && (
                  <text
                    x={x + width + 4}
                    y={y + barHeight / 2 + 4}
                    fontSize={14}
                    fill="#434750"
                  >
                    →
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
