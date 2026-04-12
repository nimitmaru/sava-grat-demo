"use client"

import { useState } from "react"
import type { GRAT, Household } from "@/lib/types"
import { ModalShell } from "./modal_shell"
import { WorkflowTracker } from "./workflow_tracker"
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

const STEPS = [
  { label: "Request Analysis" },
  { label: "Valuation Review" },
  { label: "Attorney Review" },
  { label: "Custodian Coordination" },
  { label: "Execution" },
]

export function SubstitutionModal({ grat, household, open, onClose }: SubstitutionModalProps) {
  const { showToast } = useToast()
  const [step, setStep] = useState(0)
  const [selectedAssetIndex, setSelectedAssetIndex] = useState<string>("")
  const [fmv, setFmv] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const availableHoldings = household.holdings.filter(
    (h) => h.name !== grat.fundingAsset
  )

  const selectedHolding = selectedAssetIndex !== ""
    ? availableHoldings[parseInt(selectedAssetIndex)]
    : null

  const fmvNumber = parseFloat(fmv)
  const isFmvValid = !isNaN(fmvNumber) && Math.abs(fmvNumber - grat.currentValue) <= 1
  const returnGap = grat.expectedReturn - grat.hurdle7520Rate

  const workflowSteps = STEPS.map((s, i) => ({
    label: s.label,
    status: i < step ? "completed" as const : i === step ? "active" as const : "pending" as const,
  }))

  const handleExecute = async () => {
    if (!selectedHolding) return
    setLoading(true)
    await executeSubstitution(grat.id, selectedHolding.name, selectedHolding.type, fmvNumber)
    showToast(
      `Asset substitution completed for ${grat.name}. Documented by Sava Trust Company.`,
      "success"
    )
    setLoading(false)
    onClose()
    setStep(0)
  }

  const canAdvanceFromStep0 = selectedHolding !== null
  const canAdvanceFromStep1 = isFmvValid

  const handleNext = () => {
    if (step === STEPS.length - 1) {
      handleExecute()
      return
    }
    setStep(s => s + 1)
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={`${household.name} — ${grat.name}`}
      subtitle="Asset Substitution — IRC 675(4)"
    >
      <div className="space-y-6">
        <WorkflowTracker steps={workflowSteps} compact />

        {step === 0 && (
          <div>
            <h3 className="font-headline text-base font-extrabold text-primary mb-1">Request Substitution Analysis</h3>
            <p className="text-sm text-on-surface-variant mb-5">Select a replacement asset for the underperforming holding</p>

            {/* Current asset performance */}
            <div className="rounded-xl bg-gradient-to-br from-primary to-primary-container p-5 text-white mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] opacity-60 mb-3">Underperforming Asset</p>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-headline text-base font-extrabold">{grat.fundingAsset}</p>
                  <div className="mt-1"><AssetTypeBadge type={grat.assetType} /></div>
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

            {/* Replacement selection */}
            <div className="rounded-xl bg-surface-container-low p-5">
              <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-2">
                Select Replacement Asset
              </label>
              {availableHoldings.length === 0 ? (
                <p className="text-sm text-on-surface-variant italic">No other holdings available.</p>
              ) : (
                <select
                  value={selectedAssetIndex}
                  onChange={(e) => setSelectedAssetIndex(e.target.value)}
                  className="w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">— Choose a holding —</option>
                  {availableHoldings.map((holding, idx) => (
                    <option key={idx} value={idx.toString()}>
                      {holding.name} ({holding.type.replace(/_/g, " ")}) — {formatCurrency(holding.value)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="font-headline text-base font-extrabold text-primary mb-1">Valuation Review</h3>
            <p className="text-sm text-on-surface-variant mb-5">
              IRC 675(4) requires equal fair market value for asset substitution
            </p>

            <div className="rounded-xl bg-surface-container-low p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-surface-container-lowest p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1">Current Asset FMV</p>
                  <p className="font-mono text-xl font-bold text-primary">{formatCurrency(grat.currentValue)}</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">{grat.fundingAsset}</p>
                </div>
                <div className="rounded-lg bg-surface-container-lowest p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1">Replacement Asset</p>
                  <p className="font-mono text-xl font-bold text-primary">{selectedHolding ? formatCurrency(selectedHolding.value) : "—"}</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">{selectedHolding?.name ?? "Not selected"}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">
                  Confirm Fair Market Value
                </label>
                <input
                  type="number"
                  value={fmv}
                  onChange={(e) => setFmv(e.target.value)}
                  placeholder={grat.currentValue.toString()}
                  className="w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className={`text-[11px] mt-1 ${fmv !== "" && !isFmvValid ? "text-error" : "text-on-surface-variant"}`}>
                  Must equal {formatCurrency(grat.currentValue)} for IRC 675(4) compliance
                </p>
                {fmv !== "" && isFmvValid && (
                  <p className="text-[11px] text-secondary flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>check_circle</span>
                    FMV validated — equal value confirmed
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-headline text-base font-extrabold text-primary mb-1">Attorney Review</h3>
            <p className="text-sm text-on-surface-variant mb-5">Substitution requires attorney approval</p>

            <div className="rounded-xl bg-surface-container-low p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: "18px" }}>check</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Review Approved</p>
                  <p className="text-[11px] text-on-surface-variant">
                    {household.attorney.name} approved the asset substitution
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-surface-container-lowest p-4 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Reviewer</span>
                  <span className="font-medium text-on-surface">{household.attorney.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">IRC 675(4) Compliance</span>
                  <span className="font-semibold text-secondary">Confirmed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Substitution Fee</span>
                  <span className="font-mono font-medium text-on-surface">$500</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="font-headline text-base font-extrabold text-primary mb-1">Custodian Coordination</h3>
            <p className="text-sm text-on-surface-variant mb-5">Transfer instructions prepared for {household.custodian}</p>

            <div className="rounded-xl bg-surface-container-low p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Custodian</span>
                <span className="font-medium text-on-surface">{household.custodian}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Outgoing Asset</span>
                <span className="font-medium text-on-surface">{grat.fundingAsset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Incoming Asset</span>
                <span className="font-medium text-on-surface">{selectedHolding?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Transfer Value</span>
                <span className="font-mono font-semibold text-primary">{formatCurrency(grat.currentValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Account</span>
                <span className="font-medium text-on-surface">Sava Trust Co. FBO {household.name}</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-secondary-container/10 border border-secondary/20 p-4">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: "18px" }}>check_circle</span>
                <p className="text-sm text-on-surface-variant">
                  Transfer instructions sent to {household.custodian}. Outgoing asset will be returned to grantor&apos;s personal account.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="font-headline text-base font-extrabold text-primary mb-1">Confirm Execution</h3>
            <p className="text-sm text-on-surface-variant mb-5">Review the substitution details and confirm</p>

            <div className="rounded-xl bg-surface-container-low p-5 space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">GRAT</span>
                <span className="font-medium text-on-surface">{grat.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Removing</span>
                <span className="font-medium text-error">{grat.fundingAsset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Replacing With</span>
                <span className="font-medium text-secondary">{selectedHolding?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">FMV</span>
                <span className="font-mono font-semibold text-primary">{formatCurrency(grat.currentValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Attorney Review</span>
                <span className="font-semibold text-secondary">Approved</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Substitution Fee</span>
                <span className="font-mono font-medium text-on-surface">$500</span>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-surface-container-low/60 px-4 py-3">
              <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: "16px" }}>verified</span>
              <p className="text-sm text-on-surface-variant">
                Sava Trust Company will document the substitution and update all trust records.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
          <button
            onClick={step === 0 ? onClose : () => setStep(s => s - 1)}
            className="rounded-xl bg-surface-container-low px-4 py-2 text-sm font-bold text-on-surface-variant"
          >
            {step === 0 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={handleNext}
            disabled={
              loading ||
              (step === 0 && !canAdvanceFromStep0) ||
              (step === 1 && !canAdvanceFromStep1)
            }
            className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-on-primary disabled:opacity-40"
          >
            {loading ? "Executing..." : step === STEPS.length - 1 ? "Execute Substitution" : "Continue"}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
