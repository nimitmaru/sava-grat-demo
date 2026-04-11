"use client"

import { useState } from "react"
import type { GRAT, Household } from "@/lib/types"
import { ModalShell } from "./modal_shell"
import { AssetTypeBadge } from "./asset_type_badge"
import { executeSubstitution } from "@/lib/data/actions"
import { formatCurrency, formatPercent } from "@/lib/format"
import { useToast } from "./toast"

type SubstitutionModalProps = {
  grat: GRAT
  household: Household
  open: boolean
  onClose: () => void
}

export function SubstitutionModal({ grat, household, open, onClose }: SubstitutionModalProps) {
  const { showToast } = useToast()
  const [selectedAssetIndex, setSelectedAssetIndex] = useState<string>("")
  const [fmv, setFmv] = useState<string>("")
  const [loading, setLoading] = useState(false)

  // Filter out the current GRAT asset from available holdings
  const availableHoldings = household.holdings.filter(
    (h) => h.name !== grat.fundingAsset
  )

  const selectedHolding = selectedAssetIndex !== ""
    ? availableHoldings[parseInt(selectedAssetIndex)]
    : null

  const fmvNumber = parseFloat(fmv)
  const isFmvValid = !isNaN(fmvNumber) && Math.abs(fmvNumber - grat.currentValue) <= 1
  const isFormValid = isFmvValid && selectedHolding !== null

  const returnGap = grat.expectedReturn - grat.hurdle7520Rate

  const handleExecute = async () => {
    if (!isFormValid || !selectedHolding) return
    setLoading(true)
    await executeSubstitution(grat.id, selectedHolding.name, selectedHolding.type, fmvNumber)
    showToast(
      `Asset substitution executed for ${grat.name}. Sava Trust Company will document.`,
      "success"
    )
    setLoading(false)
    onClose()
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={`${household.name} — ${grat.name}`}
      subtitle="Asset Substitution — IRC 675(4)"
    >
      <div className="space-y-6">
        {/* Section label */}
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
          Current Performance
        </p>

        {/* Current Performance card */}
        <div className="rounded-xl bg-gradient-to-br from-primary to-primary-container p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] opacity-60 mb-3">
            Underperforming Asset
          </p>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-headline text-base font-extrabold">{grat.fundingAsset}</p>
              <div className="mt-1">
                <AssetTypeBadge type={grat.assetType} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide opacity-60">Current FMV</p>
              <p className="font-headline text-xl font-extrabold">{formatCurrency(grat.currentValue)}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide opacity-60">Expected Return</p>
              <p className="font-mono text-base font-bold">{formatPercent(grat.expectedReturn)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide opacity-60">Hurdle Rate</p>
              <p className="font-mono text-base font-bold">{formatPercent(grat.hurdle7520Rate)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide opacity-60">Gap</p>
              <p className={`font-mono text-base font-bold ${returnGap < 0 ? "text-error-container" : "text-secondary-container"}`}>
                {returnGap >= 0 ? "+" : ""}{formatPercent(returnGap)}
              </p>
            </div>
          </div>
        </div>

        {/* Proposed Replacement section */}
        <div className="rounded-xl bg-surface-container-low p-5 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
            Proposed Replacement Asset
          </p>

          {/* Asset dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wide text-on-surface-variant">
              Select Replacement Asset
            </label>
            {availableHoldings.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic">
                No other holdings available in this household.
              </p>
            ) : (
              <select
                value={selectedAssetIndex}
                onChange={(e) => setSelectedAssetIndex(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">— Choose a holding —</option>
                {availableHoldings.map((holding, idx) => (
                  <option key={idx} value={idx.toString()}>
                    {holding.name} ({holding.type.replace(/_/g, " ")})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* FMV input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wide text-on-surface-variant">
              Fair Market Value (FMV)
            </label>
            <input
              type="number"
              value={fmv}
              onChange={(e) => setFmv(e.target.value)}
              placeholder={grat.currentValue.toString()}
              className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className={`text-[11px] ${fmv !== "" && !isFmvValid ? "text-error" : "text-on-surface-variant"}`}>
              Equal value swap required per IRC 675(4). FMV must equal {formatCurrency(grat.currentValue)}.
            </p>
            {fmv !== "" && isFmvValid && (
              <p className="text-[11px] text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>check_circle</span>
                FMV validated
              </p>
            )}
          </div>
        </div>

        {/* Sava Trust note */}
        <div className="flex items-start gap-2 rounded-xl bg-surface-container-low/60 border border-outline-variant/10 px-4 py-3">
          <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: "16px" }}>verified</span>
          <p className="text-sm text-on-surface-variant">
            Sava Trust Company will document the substitution. $500 fee applies.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-outline-variant/20 px-4 py-2.5 text-sm font-bold text-on-surface-variant"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            disabled={!isFormValid || loading}
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary disabled:opacity-50"
          >
            {loading ? "Executing..." : "Execute Substitution"}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
