"use client"

import { useState } from "react"
import { projectGrat } from "@/lib/grat_math"
import { formatCurrency, formatCompactCurrency } from "@/lib/format"

type Scenario = {
  label: string
  cadence: string
  termYears: number
  gratsPerYear: number
}

const SCENARIOS: Scenario[] = [
  { label: "Quarterly Rolling", cadence: "Every 3 months", termYears: 2, gratsPerYear: 4 },
  { label: "Semi-Annual Rolling", cadence: "Every 6 months", termYears: 2, gratsPerYear: 2 },
  { label: "Annual Rolling", cadence: "Once per year", termYears: 2, gratsPerYear: 1 },
]

const TERMS = [
  { label: "2-Year GRATs", termYears: 2 },
  { label: "3-Year GRATs", termYears: 3 },
  { label: "5-Year GRATs", termYears: 5 },
]

export function StrategyComparison({ currentRate }: { currentRate: number }) {
  const [fundingAmount, setFundingAmount] = useState(5_000_000)
  const [expectedReturn, setExpectedReturn] = useState(0.12)
  const [comparisonMode, setComparisonMode] = useState<"cadence" | "term">("cadence")

  const scenarios = comparisonMode === "cadence" ? SCENARIOS : TERMS.map(t => ({
    label: t.label,
    cadence: "Quarterly",
    termYears: t.termYears,
    gratsPerYear: 4,
  }))

  return (
    <div className="rounded-xl bg-surface-container-lowest p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-headline text-lg font-extrabold text-primary">Strategy Comparison</h3>
        <div className="flex rounded-lg bg-surface-container-low text-[11px] font-bold">
          <button
            onClick={() => setComparisonMode("cadence")}
            className={`rounded-lg px-3 py-1.5 ${comparisonMode === "cadence" ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}
          >
            By Cadence
          </button>
          <button
            onClick={() => setComparisonMode("term")}
            className={`rounded-lg px-3 py-1.5 ${comparisonMode === "term" ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}
          >
            By Term
          </button>
        </div>
      </div>
      <p className="text-sm text-on-surface-variant mb-6">
        Compare rolling GRAT strategies over a 10-year horizon at the current 7520 rate
      </p>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">
            Funding Amount
          </label>
          <p className="text-lg font-headline font-extrabold text-primary mb-1">{formatCurrency(fundingAmount)}</p>
          <input
            type="range"
            min={1_000_000}
            max={50_000_000}
            step={500_000}
            value={fundingAmount}
            onChange={e => setFundingAmount(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">
            Expected Return
          </label>
          <p className="text-lg font-headline font-extrabold text-primary mb-1">{(expectedReturn * 100).toFixed(1)}%</p>
          <input
            type="range"
            min={0}
            max={0.30}
            step={0.005}
            value={expectedReturn}
            onChange={e => setExpectedReturn(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Comparison cards */}
      <div className="grid grid-cols-3 gap-4">
        {scenarios.map((scenario, i) => {
          const projection = projectGrat({
            fundingAmount,
            rate7520: currentRate,
            termYears: scenario.termYears,
            expectedReturn,
            advisorFeeRate: 0.0085,
          })

          const cycles = Math.floor(10 / scenario.termYears)
          const successRate = 0.75
          const totalGrats = scenario.gratsPerYear * 10
          const cumulativeTransfer = projection.remainder * cycles * successRate
          const cumulativeTaxSaved = cumulativeTransfer * 0.4
          const totalFees = totalGrats * 1500 + fundingAmount * 0.0025 * 10

          const isRecommended = i === 0

          return (
            <div
              key={scenario.label}
              className={`rounded-xl p-5 ${
                isRecommended
                  ? "bg-secondary-container/20 border-2 border-secondary/30"
                  : "bg-surface-container-low border-2 border-transparent"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-on-surface">{scenario.label}</p>
                {isRecommended && (
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">Best</span>
                )}
              </div>

              <p className="text-[11px] text-on-surface-variant mb-4">{scenario.cadence} &middot; {scenario.termYears}-year terms</p>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">10-Year Tax-Free Transfer</p>
                  <p className={`font-headline text-2xl font-extrabold tracking-tight ${isRecommended ? "text-secondary" : "text-primary"}`}>
                    {formatCompactCurrency(cumulativeTransfer)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Tax Saved</p>
                  <p className="font-mono text-base font-bold text-secondary">{formatCompactCurrency(cumulativeTaxSaved)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Per-GRAT Remainder</p>
                  <p className="font-mono text-sm font-medium text-on-surface">{formatCurrency(projection.remainder)}</p>
                </div>
                <div className="pt-3 border-t border-outline-variant/10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Total GRATs (10yr)</p>
                  <p className="text-sm font-semibold text-on-surface">{totalGrats}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Est. Total Fees</p>
                  <p className="font-mono text-sm font-medium text-on-surface-variant">{formatCompactCurrency(totalFees)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-[11px] text-on-surface-variant">
        Projections assume {(expectedReturn * 100).toFixed(1)}% annual return, {(currentRate * 100).toFixed(2)}% hurdle rate, and 75% GRAT success rate. Actual results will vary.
      </p>
    </div>
  )
}
