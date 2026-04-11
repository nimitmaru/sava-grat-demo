"use client"

import type { Household, AssetType } from "@/lib/types"
import { formatCurrency, formatPercent } from "@/lib/format"

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

export function ParameterForm({
  households,
  currentRate,
  params,
  onParamsChange,
  proposalMode,
  onGenerateProposal,
}: {
  households: Household[]
  currentRate: number
  params: ModelingParams
  onParamsChange: (params: ModelingParams) => void
  proposalMode: boolean
  onGenerateProposal: () => void
}) {
  const selectedHousehold = households.find(h => h.id === params.householdId) ?? households[0]

  const handleHouseholdChange = (householdId: string) => {
    const household = households.find(h => h.id === householdId)!
    onParamsChange({
      ...params,
      householdId,
      fundingAsset: household.holdings[0]?.name ?? "",
      assetType: household.holdings[0]?.type ?? "diversified",
      custodian: household.custodian,
      advisorFeeRate: household.advisorFeeRate,
    })
  }

  const handleAssetChange = (assetName: string) => {
    const holding = selectedHousehold.holdings.find(h => h.name === assetName)
    onParamsChange({
      ...params,
      fundingAsset: assetName,
      assetType: holding?.type ?? "diversified",
    })
  }

  return (
    <div className="rounded-xl bg-surface-container-lowest p-6 space-y-6">
      <div>
        <h3 className="font-headline text-base font-extrabold text-primary">GRAT Parameters</h3>
        <p className="text-sm text-on-surface-variant">Configure the proposed GRAT structure</p>
      </div>

      {/* Client Selector */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Client Household</label>
        <select
          value={params.householdId}
          onChange={(e) => handleHouseholdChange(e.target.value)}
          className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
        >
          {households.map(h => (
            <option key={h.id} value={h.id}>{h.name} — {h.description}</option>
          ))}
        </select>
      </div>

      {/* Funding Amount */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Funding Amount</label>
        <p className="text-2xl font-headline font-extrabold text-primary mb-2">{formatCurrency(params.fundingAmount)}</p>
        <input
          type="range"
          min={1_000_000}
          max={50_000_000}
          step={500_000}
          value={params.fundingAmount}
          onChange={(e) => onParamsChange({ ...params, fundingAmount: Number(e.target.value) })}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-[10px] text-on-surface-variant mt-1">
          <span>$1M</span><span>$50M</span>
        </div>
      </div>

      {/* GRAT Term */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">GRAT Term</label>
        <div className="flex gap-2">
          {[2, 3, 5].map(term => (
            <button
              key={term}
              onClick={() => onParamsChange({ ...params, termYears: term })}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                params.termYears === term
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {term} Years
            </button>
          ))}
        </div>
      </div>

      {/* Funding Asset */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Funding Asset</label>
        <select
          value={params.fundingAsset}
          onChange={(e) => handleAssetChange(e.target.value)}
          className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
        >
          {selectedHousehold.holdings.map(h => (
            <option key={h.name} value={h.name}>
              {h.name} ({h.type.replace(/_/g, " ")}) — {formatCurrency(h.value)}
              {h.lastValuationDate ? ` · Valued ${h.lastValuationDate}` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Expected Return */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Expected Annual Return</label>
        <p className="text-2xl font-headline font-extrabold text-primary mb-2">{(params.expectedReturn * 100).toFixed(1)}%</p>
        <input
          type="range"
          min={0}
          max={0.30}
          step={0.005}
          value={params.expectedReturn}
          onChange={(e) => onParamsChange({ ...params, expectedReturn: Number(e.target.value) })}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-[10px] text-on-surface-variant mt-1">
          <span>0%</span><span>30%</span>
        </div>
      </div>

      {/* Current 7520 Rate */}
      <div className="rounded-xl bg-secondary-container/20 p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Current 7520 Rate</span>
          <span className="text-sm font-bold text-secondary">Favorable</span>
        </div>
        <p className="font-mono text-2xl font-bold text-primary">{formatPercent(currentRate)}</p>
        <p className="text-[11px] text-on-surface-variant mt-1">Below 12-month average — favorable for new GRAT origination</p>
      </div>

      {/* Trustee Info */}
      <div className="rounded-xl bg-surface-container-low p-4 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>verified</span>
          <span className="font-semibold text-on-surface">Trust Administration</span>
        </div>
        <div className="space-y-1 text-on-surface-variant text-[13px]">
          <p>Corporate Trustee: <span className="text-on-surface font-medium">Sava Trust Company</span></p>
          <p>Jurisdiction: <span className="text-on-surface font-medium">Nevada</span></p>
          <p>Assets held at: <span className="text-on-surface font-medium">{selectedHousehold.custodian}</span></p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onGenerateProposal}
          className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-colors hover:opacity-90"
        >
          {proposalMode ? "Edit Parameters" : "Generate Proposal"}
        </button>
        <button className="rounded-xl bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface-variant">
          Save Draft
        </button>
      </div>
    </div>
  )
}
