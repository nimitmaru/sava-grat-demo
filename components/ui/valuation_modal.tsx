"use client"

import { useState } from "react"
import type { Household, AssetHolding } from "@/lib/types"
import { ModalShell } from "./modal_shell"
import { AssetTypeBadge } from "./asset_type_badge"
import { requestValuation } from "@/lib/data/actions"
import { formatCurrency, formatDate, daysBetween } from "@/lib/format"
import { useToast } from "./toast"

type ValuationModalProps = {
  household: Household
  asset: AssetHolding
  open: boolean
  onClose: () => void
}

export function ValuationModal({ household, asset, open, onClose }: ValuationModalProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split("T")[0]
  const daysSinceValuation = asset.lastValuationDate
    ? daysBetween(asset.lastValuationDate, today)
    : null

  const handleRequest = async () => {
    setLoading(true)
    await requestValuation(household.id, asset.name)
    showToast("Valuation request sent. Sava Trust Company coordinating.", "success")
    setLoading(false)
    onClose()
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={`${household.name} — Valuation Request`}
      subtitle="Stale alternative asset valuation"
    >
      <div className="space-y-6">
        {/* Asset info card */}
        <div className="rounded-xl bg-surface-container-low p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">
            Asset Requiring Valuation
          </p>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-headline text-base font-extrabold text-on-surface">{asset.name}</p>
              <div className="mt-1.5">
                <AssetTypeBadge type={asset.type} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">Current Value</p>
              <p className="font-mono text-lg font-bold text-primary">{formatCurrency(asset.value)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/10 pt-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                Last Valuation
              </p>
              <p className="mt-0.5 text-sm font-semibold text-on-surface">
                {asset.lastValuationDate ? formatDate(asset.lastValuationDate) : "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                Days Stale
              </p>
              {daysSinceValuation !== null ? (
                <p className="mt-0.5 text-sm font-bold text-tertiary-fixed-dim">
                  <span className="inline-flex items-center gap-1 rounded-md bg-tertiary-fixed/20 px-2 py-0.5">
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>schedule</span>
                    {daysSinceValuation} days ago
                  </span>
                </p>
              ) : (
                <p className="mt-0.5 text-sm text-on-surface-variant">Unknown</p>
              )}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-sm text-on-surface-variant">
          Alternative assets require periodic independent valuations for accurate GRAT remainder calculations.
          Stale valuations may affect annuity planning and remainder estimates.
        </p>

        {/* Sava coordination note */}
        <div className="flex items-start gap-2 rounded-xl bg-surface-container-low/60 border border-outline-variant/10 px-4 py-3">
          <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: "16px" }}>verified</span>
          <p className="text-sm text-on-surface-variant">
            Sava Trust Company will coordinate with the independent valuation firm and update trust records upon receipt.
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
            onClick={handleRequest}
            disabled={loading}
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary disabled:opacity-50"
          >
            {loading ? "Sending..." : "Request Valuation"}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
