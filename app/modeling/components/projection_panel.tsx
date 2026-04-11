"use client"

import { projectGrat } from "@/lib/grat_math"
import { formatCurrency, formatCompactCurrency } from "@/lib/format"
import { MetricBlock } from "@/components/ui/metric_block"
import { RiskProfile } from "./risk_profile"
import type { AssetType } from "@/lib/types"

type ModelingParams = {
  householdId: string
  fundingAmount: number
  termYears: number
  fundingAsset: string
  assetType: AssetType
  expectedReturn: number
  rate7520: number
  custodian: string
  advisorFeeRate: number
}

export function ProjectionPanel({ params }: { params: ModelingParams }) {
  const projection = projectGrat({
    fundingAmount: params.fundingAmount,
    rate7520: params.rate7520,
    termYears: params.termYears,
    expectedReturn: params.expectedReturn,
    advisorFeeRate: params.advisorFeeRate,
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-headline text-base font-extrabold text-primary">Projected Outcome</h3>
        <p className="text-sm text-on-surface-variant">Based on current parameters</p>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-secondary-container/30 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-secondary-container mb-1">Est. Tax-Free Transfer</p>
          <p className="font-headline text-4xl font-extrabold tracking-tight text-secondary">{formatCompactCurrency(projection.remainder)}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-primary to-primary-container p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/60 mb-1">Gift Tax Saved</p>
          <p className="font-headline text-4xl font-extrabold tracking-tight text-white">{formatCompactCurrency(projection.taxSaved)}</p>
        </div>
      </div>

      {/* Detail metrics */}
      <div className="grid grid-cols-3 gap-4">
        <MetricBlock label="Total Annuity Payments" value={formatCompactCurrency(projection.totalAnnuityPayments)} />
        <MetricBlock label="Projected End Value" value={formatCompactCurrency(projection.projectedEndValue)} />
        <MetricBlock label="Excess Over Hurdle" value={`+${projection.excessOverHurdle.toFixed(1)}pp`} variant="success" />
      </div>

      {/* Risk Profile */}
      <RiskProfile remainder={projection.remainder} rate7520={params.rate7520} />

      {/* Annuity Schedule Preview */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Annuity Schedule Preview</h4>
        <div className="rounded-xl bg-surface-container-low overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Year</th>
                <th className="px-4 py-2 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {Array.from({ length: params.termYears }, (_, i) => (
                <tr key={i} className="bg-surface-container-lowest">
                  <td className="px-4 py-2 text-sm text-on-surface">Year {i + 1}</td>
                  <td className="px-4 py-2 text-right font-mono text-sm font-medium text-primary">{formatCurrency(projection.annualPayment)}</td>
                </tr>
              ))}
              <tr className="bg-surface-container-low">
                <td className="px-4 py-2 text-sm font-semibold text-on-surface">Remainder to Beneficiaries</td>
                <td className="px-4 py-2 text-right font-mono text-sm font-bold text-secondary">{formatCurrency(projection.remainder)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Advisor Economics */}
      <div className="rounded-xl bg-surface-container-low p-5">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Advisor Economics</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Your AUM fee</span>
            <span className="font-mono font-semibold text-on-surface">{formatCurrency(projection.advisorAumFee)}/year</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">Preserved — assets remain at {params.custodian}</p>
          <div className="flex justify-between mt-2">
            <span className="text-on-surface-variant">Sava trust admin</span>
            <span className="font-mono font-semibold text-on-surface">{formatCurrency(projection.savaAdminFee)}/year</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">Billed to client separately, not from your fee</p>
          <div className="flex justify-between mt-2 pt-2 border-t border-outline-variant/10">
            <span className="font-semibold text-on-surface">Client net tax savings</span>
            <span className="font-mono font-bold text-secondary">{formatCurrency(projection.taxSaved)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
