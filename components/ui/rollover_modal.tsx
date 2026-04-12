"use client"

import { useState } from "react"
import type { RolloverProposal, GRAT, Household } from "@/lib/types"
import { ModalShell } from "./modal_shell"
import { AssetTypeBadge } from "./asset_type_badge"
import { approveRollover, declineRollover } from "@/lib/data/actions"
import { formatCurrency, formatDate, formatPercent } from "@/lib/format"
import { useToast } from "./toast"
import Link from "next/link"

type RolloverModalProps = {
  proposal: RolloverProposal
  sourceGrat: GRAT
  household: Household
  open: boolean
  onClose: () => void
}

export function RolloverModal({ proposal, sourceGrat, household, open, onClose }: RolloverModalProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    setLoading(true)
    await approveRollover(proposal.id)
    showToast(`Rollover approved. Sava Trust Company accepted new GRAT for ${household.name}.`, "success")
    setLoading(false)
    onClose()
  }

  const handleDecline = async () => {
    await declineRollover(proposal.id)
    showToast("Rollover proposal declined.", "info")
    onClose()
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={`${household.name} — Rollover Proposal`}
      subtitle={`${sourceGrat.name} · Maturity: ${formatDate(sourceGrat.maturityDate)}`}
    >
      <div className="space-y-6">
        {/* Label */}
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Rollover Proposal</p>

        {/* Maturing GRAT Performance */}
        <div className="rounded-xl bg-gradient-to-br from-primary to-primary-container p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] opacity-60 mb-3">Maturing GRAT Performance</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide opacity-60">Current Value</p>
              <p className="font-headline text-xl font-extrabold">{formatCurrency(sourceGrat.currentValue)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide opacity-60">Annuities Paid</p>
              <p className="font-headline text-xl font-extrabold">
                {formatCurrency(sourceGrat.annuityPayments.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0))}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide opacity-60">Remainder</p>
              <p className="font-headline text-xl font-extrabold text-secondary-container">
                {formatCurrency(Math.max(0, sourceGrat.remainderEstimate))}
              </p>
            </div>
          </div>
        </div>

        {/* Proposed New GRAT */}
        <div className="rounded-xl bg-surface-container-low p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Proposed New GRAT</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">Funding Amount</p>
              <p className="font-mono text-lg font-bold text-primary">{formatCurrency(proposal.proposedFundingAmount)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">Term</p>
              <p className="text-lg font-bold text-primary">{proposal.proposedTerm} Years</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">7520 Rate</p>
              <p className="font-mono text-lg font-bold text-primary">{formatPercent(proposal.current7520Rate)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">Funding Asset</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-on-surface">{proposal.proposedAsset}</span>
                <AssetTypeBadge type={proposal.proposedAssetType} />
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>verified</span>
            Trustee: Sava Trust Company, NV
          </div>
        </div>

        {/* Recommendation */}
        <div className="rounded-xl bg-secondary-container/20 border border-secondary/20 p-4">
          <p className="text-sm text-on-secondary-container">{proposal.recommendation}</p>
        </div>

        {/* Trust Execution Preview */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">Upon approval, Sava Trust Company will:</p>
          <div className="space-y-2 text-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>check_circle</span>
              Generate successor trust instrument
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>check_circle</span>
              Coordinate attorney review ({sourceGrat.attorneyName ?? "J. Martinez, Esq."})
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>check_circle</span>
              Process e-signature
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>check_circle</span>
              Accept trust and issue funding instructions to {household.custodian}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Link href="/modeling" className="rounded-xl bg-surface-container-low px-4 py-2.5 text-sm font-bold text-on-surface-variant">
            Modify Parameters
          </Link>
          <button onClick={handleDecline} className="rounded-xl border border-outline-variant/20 px-4 py-2.5 text-sm font-bold text-on-surface-variant">
            Decline
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary disabled:opacity-50"
          >
            {loading ? "Processing..." : "Approve Rollover"}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
