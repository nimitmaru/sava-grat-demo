"use client"

import { useState } from "react"
import { projectGrat } from "@/lib/grat_math"
import { formatCurrency, formatCompactCurrency } from "@/lib/format"
import { MetricBlock } from "@/components/ui/metric_block"
import { RiskProfile } from "./risk_profile"
import { GratCreationWizard } from "@/components/ui/grat_creation_wizard"
import { ProposalPreview } from "@/components/ui/proposal_preview"
import type { AssetType } from "@/lib/types"

type ModelingParams = {
  householdId: string
  householdName: string
  fundingAmount: number
  termYears: number
  fundingAsset: string
  assetType: AssetType
  expectedReturn: number
  rate7520: number
  custodian: string
  advisorFeeRate: number
  attorneyName: string
  attorneyFirm: string
}

export function ProjectionPanel({
  params,
  proposalMode,
  onCreateSuccess,
}: {
  params: ModelingParams
  proposalMode: boolean
  onCreateSuccess: () => void
}) {
  const [showWizard, setShowWizard] = useState(false)
  const [showProposal, setShowProposal] = useState(false)

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
          <div className="flex justify-between mt-2">
            <span className="text-on-surface-variant">Attorney review fee</span>
            <span className="font-mono font-semibold text-on-surface">$500</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">Included in Sava per-GRAT fee — no additional client cost</p>
          <div className="flex justify-between mt-2 pt-2 border-t border-outline-variant/10">
            <span className="font-semibold text-on-surface">Client net tax savings</span>
            <span className="font-mono font-bold text-secondary">{formatCurrency(projection.taxSaved)}</span>
          </div>
        </div>
      </div>

      {/* Generate Client Proposal */}
      {proposalMode && (
        <button
          onClick={() => setShowProposal(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-surface-container-low px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary-fixed/20"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>description</span>
          Generate Client Proposal
        </button>
      )}

      {/* GRAT Creation Workflow */}
      {proposalMode && (
        <div className="rounded-xl bg-gradient-to-br from-primary to-primary-container p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>task_alt</span>
            <h4 className="font-headline text-lg font-extrabold">Ready to Create GRAT</h4>
          </div>
          <p className="text-sm opacity-80 mb-1">
            {params.fundingAsset} · {params.termYears}-Year Term · {formatCurrency(params.fundingAmount)}
          </p>
          <div className="flex items-center gap-1.5 text-sm opacity-80 mb-4">
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>verified</span>
            Sava Trust Company will serve as corporate trustee — Nevada charter
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-white/90"
          >
            Begin GRAT Creation Workflow
          </button>
          <p className="text-[11px] opacity-60 mt-2 text-center">
            6-step process: parameter review → attorney → e-signature → trust acceptance → funding
          </p>
        </div>
      )}

      {showWizard && (
        <GratCreationWizard
          params={{
            householdId: params.householdId,
            householdName: params.householdName,
            fundingAmount: params.fundingAmount,
            termYears: params.termYears,
            fundingAsset: params.fundingAsset,
            assetType: params.assetType,
            expectedReturn: params.expectedReturn,
            rate7520: params.rate7520,
            attorneyName: params.attorneyName,
            attorneyFirm: params.attorneyFirm,
            custodian: params.custodian,
          }}
          onClose={() => setShowWizard(false)}
          onComplete={() => {
            setShowWizard(false)
            onCreateSuccess()
          }}
        />
      )}

      <ProposalPreview
        open={showProposal}
        onClose={() => setShowProposal(false)}
        params={{
          householdName: params.householdName,
          primaryContact: "",
          fundingAmount: params.fundingAmount,
          termYears: params.termYears,
          fundingAsset: params.fundingAsset,
          expectedReturn: params.expectedReturn,
          rate7520: params.rate7520,
          advisorFeeRate: params.advisorFeeRate,
          attorneyName: params.attorneyName,
          attorneyFirm: params.attorneyFirm,
          custodian: params.custodian,
        }}
      />
    </div>
  )
}
