"use client"

import { useState } from "react"
import { ModalShell } from "./modal_shell"
import { formatCurrency, formatCompactCurrency } from "@/lib/format"
import { projectGrat } from "@/lib/grat_math"
import { useToast } from "./toast"

type ProposalParams = {
  householdName: string
  primaryContact: string
  fundingAmount: number
  termYears: number
  fundingAsset: string
  expectedReturn: number
  rate7520: number
  advisorFeeRate: number
  attorneyName: string
  attorneyFirm: string
  custodian: string
}

export function ProposalPreview({
  open,
  onClose,
  params,
}: {
  open: boolean
  onClose: () => void
  params: ProposalParams
}) {
  const { showToast } = useToast()
  const [sharing, setSharing] = useState(false)

  const projection = projectGrat({
    fundingAmount: params.fundingAmount,
    rate7520: params.rate7520,
    termYears: params.termYears,
    expectedReturn: params.expectedReturn,
    advisorFeeRate: params.advisorFeeRate,
  })

  // 10-year rolling projections (5 cycles of 2-year GRATs)
  const rollingCycles = Math.floor(10 / params.termYears)
  const cumulativeTransfer = projection.remainder * rollingCycles * 0.75 // 75% success rate
  const cumulativeTaxSaved = cumulativeTransfer * 0.4

  // "Do Nothing" scenario
  const doNothingTransfer = 0
  const doNothingTaxCost = params.fundingAmount * 0.4 // Full estate tax on assets

  // Single GRAT scenario
  const singleTransfer = projection.remainder
  const singleTaxSaved = projection.taxSaved

  const handleShare = () => {
    setSharing(true)
    setTimeout(() => {
      setSharing(false)
      showToast("Shareable link copied to clipboard", "success")
    }, 800)
  }

  return (
    <ModalShell open={open} onClose={onClose} title="Client Proposal" subtitle={`Prepared for ${params.householdName}`}>
      <div className="space-y-6">
        {/* Proposal header */}
        <div className="rounded-xl bg-gradient-to-br from-primary to-primary-container p-6 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] opacity-60 mb-1">Wealth Transfer Proposal</p>
          <p className="font-headline text-2xl font-extrabold mb-1">{params.householdName}</p>
          <p className="text-sm opacity-80">
            Prepared by Michael Reynolds, CFP&reg; &middot; Reynolds Wealth Management
          </p>
          <p className="text-sm opacity-60 mt-1">April 12, 2026</p>
        </div>

        {/* Strategy comparison */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">
            10-Year Wealth Transfer Comparison
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {/* Do Nothing */}
            <div className="rounded-xl bg-error-container/10 border border-error/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-error mb-2">Do Nothing</p>
              <p className="font-headline text-2xl font-extrabold text-error tracking-tight">{formatCompactCurrency(doNothingTransfer)}</p>
              <p className="text-[11px] text-on-surface-variant mt-1">Tax-free transfer</p>
              <div className="mt-3 pt-3 border-t border-error/10">
                <p className="text-[11px] text-error font-semibold">
                  Estate tax exposure: {formatCompactCurrency(doNothingTaxCost)}
                </p>
              </div>
            </div>

            {/* Single GRAT */}
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">Single GRAT</p>
              <p className="font-headline text-2xl font-extrabold text-primary tracking-tight">{formatCompactCurrency(singleTransfer)}</p>
              <p className="text-[11px] text-on-surface-variant mt-1">Tax-free transfer</p>
              <div className="mt-3 pt-3 border-t border-outline-variant/10">
                <p className="text-[11px] text-secondary font-semibold">
                  Tax saved: {formatCompactCurrency(singleTaxSaved)}
                </p>
              </div>
            </div>

            {/* Rolling GRAT */}
            <div className="rounded-xl bg-secondary-container/20 border border-secondary/20 p-4">
              <div className="flex items-center gap-1 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-secondary">Rolling GRATs</p>
                <span className="rounded bg-secondary px-1 py-0.5 text-[8px] font-bold uppercase text-white">Recommended</span>
              </div>
              <p className="font-headline text-2xl font-extrabold text-secondary tracking-tight">{formatCompactCurrency(cumulativeTransfer)}</p>
              <p className="text-[11px] text-on-surface-variant mt-1">Tax-free transfer</p>
              <div className="mt-3 pt-3 border-t border-secondary/10">
                <p className="text-[11px] text-secondary font-semibold">
                  Tax saved: {formatCompactCurrency(cumulativeTaxSaved)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Program details */}
        <div className="rounded-xl bg-surface-container-low p-5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">
            Proposed Rolling GRAT Program
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Initial Funding</span>
              <span className="font-mono font-semibold text-on-surface">{formatCurrency(params.fundingAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">GRAT Term</span>
              <span className="font-medium text-on-surface">{params.termYears} years (rolling quarterly)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Funding Asset</span>
              <span className="font-medium text-on-surface">{params.fundingAsset}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Annuity Payment</span>
              <span className="font-mono font-semibold text-on-surface">{formatCurrency(projection.annualPayment)}/year</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Custodian</span>
              <span className="font-medium text-on-surface">{params.custodian}</span>
            </div>
          </div>
        </div>

        {/* Fee transparency */}
        <div className="rounded-xl bg-surface-container-low p-5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">
            Fee Breakdown
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Trust administration (Sava)</span>
              <span className="font-mono font-medium text-on-surface">0.25% annually ({formatCurrency(params.fundingAmount * 0.0025)}/yr)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Per-GRAT fee</span>
              <span className="font-mono font-medium text-on-surface">$1,500 per GRAT</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-outline-variant/10">
              <span className="font-semibold text-on-surface">Projected 10-year tax savings</span>
              <span className="font-mono font-bold text-secondary">{formatCurrency(cumulativeTaxSaved)}</span>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="rounded-xl bg-surface-container-low p-5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Your Team</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-white">MR</div>
              <div>
                <p className="text-sm font-semibold text-on-surface">Michael Reynolds, CFP&reg;</p>
                <p className="text-[11px] text-on-surface-variant">Wealth Advisor &middot; Reynolds Wealth Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-white">
                {params.attorneyName.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">{params.attorneyName}</p>
                <p className="text-[11px] text-on-surface-variant">T&amp;E Attorney &middot; {params.attorneyFirm}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>verified</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">Sava Trust Company</p>
                <p className="text-[11px] text-on-surface-variant">Corporate Trustee &middot; Nevada Charter</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/10">
          <button onClick={onClose} className="rounded-xl bg-surface-container-low px-4 py-2 text-sm font-bold text-on-surface-variant">
            Close
          </button>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary disabled:opacity-50"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>share</span>
            {sharing ? "Copying..." : "Share Proposal"}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
