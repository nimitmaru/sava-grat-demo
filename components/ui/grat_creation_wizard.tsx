"use client"

import { useState } from "react"
import { ModalShell } from "./modal_shell"
import { WorkflowTracker } from "./workflow_tracker"
import { formatCurrency } from "@/lib/format"
import { createGrat } from "@/lib/data/actions"
import { useToast } from "./toast"
import type { AssetType } from "@/lib/types"

type WizardParams = {
  householdId: string
  householdName: string
  fundingAmount: number
  termYears: number
  fundingAsset: string
  assetType: AssetType
  expectedReturn: number
  rate7520: number
  attorneyName: string
  attorneyFirm: string
  custodian: string
}

const STEPS = [
  { label: "Review Parameters" },
  { label: "Attorney Assignment" },
  { label: "Attorney Review" },
  { label: "Trust Execution" },
  { label: "Sava Trust Acceptance" },
  { label: "Custodian Funding" },
]

export function GratCreationWizard({
  params,
  onClose,
  onComplete,
}: {
  params: WizardParams
  onClose: () => void
  onComplete: () => void
}) {
  const [step, setStep] = useState(0)
  const [processing, setProcessing] = useState(false)
  const { showToast } = useToast()

  const workflowSteps = STEPS.map((s, i) => ({
    label: s.label,
    status: i < step ? "completed" as const : i === step ? "active" as const : "pending" as const,
  }))

  const handleNext = async () => {
    if (step === STEPS.length - 1) {
      setProcessing(true)
      await createGrat({
        householdId: params.householdId,
        fundingAmount: params.fundingAmount,
        termYears: params.termYears,
        fundingAsset: params.fundingAsset,
        assetType: params.assetType,
        expectedReturn: params.expectedReturn,
        rate7520: params.rate7520,
      })
      showToast("GRAT created successfully. Trust accepted by Sava Trust Company.", "success")
      setProcessing(false)
      onComplete()
      return
    }
    setStep(s => s + 1)
  }

  return (
    <ModalShell open title="Create GRAT" subtitle={params.householdName} onClose={onClose}>
      <div className="p-6 space-y-6">
        <WorkflowTracker steps={workflowSteps} />

        <div className="min-h-[320px]">
          {step === 0 && <StepReviewParams params={params} />}
          {step === 1 && <StepAttorneyAssignment params={params} />}
          {step === 2 && <StepAttorneyReview params={params} />}
          {step === 3 && <StepTrustExecution params={params} />}
          {step === 4 && <StepSavaAcceptance />}
          {step === 5 && <StepCustodianFunding params={params} />}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
          <button
            onClick={step === 0 ? onClose : () => setStep(s => s - 1)}
            className="rounded-xl bg-surface-container-low px-4 py-2 text-sm font-bold text-on-surface-variant"
          >
            {step === 0 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={handleNext}
            disabled={processing}
            className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-on-primary disabled:opacity-50"
          >
            {processing ? "Creating..." : step === STEPS.length - 1 ? "Create GRAT" : "Continue"}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

function StepReviewParams({ params }: { params: WizardParams }) {
  return (
    <div>
      <h3 className="font-headline text-base font-extrabold text-primary mb-1">Review GRAT Parameters</h3>
      <p className="text-sm text-on-surface-variant mb-5">Confirm the details before proceeding to attorney review</p>

      <div className="rounded-xl bg-surface-container-low p-5 space-y-3">
        <Row label="Client" value={params.householdName} />
        <Row label="Funding Amount" value={formatCurrency(params.fundingAmount)} mono />
        <Row label="Term" value={`${params.termYears} Years`} />
        <Row label="Funding Asset" value={params.fundingAsset} />
        <Row label="Expected Return" value={`${(params.expectedReturn * 100).toFixed(1)}%`} mono />
        <Row label="7520 Hurdle Rate" value={`${(params.rate7520 * 100).toFixed(2)}%`} mono />
        <Row label="Custodian" value={params.custodian} />
        <Row label="Trustee" value="Sava Trust Company" />
        <Row label="Jurisdiction" value="Nevada" />
      </div>
    </div>
  )
}

function StepAttorneyAssignment({ params }: { params: WizardParams }) {
  return (
    <div>
      <h3 className="font-headline text-base font-extrabold text-primary mb-1">Attorney Assignment</h3>
      <p className="text-sm text-on-surface-variant mb-5">A T&amp;E attorney must review the trust instrument before creation</p>

      <div className="rounded-xl border border-secondary/20 bg-secondary-container/10 p-5 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-white">
            {params.attorneyName.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">{params.attorneyName}</p>
            <p className="text-[12px] text-on-surface-variant">{params.attorneyFirm}</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-secondary-container px-2.5 py-1 text-[10px] font-bold uppercase text-on-secondary-container">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            Linked
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-surface-container-low p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">What happens next</p>
        <div className="space-y-2 text-sm text-on-surface-variant">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: "16px" }}>send</span>
            <span>Trust instrument will be sent to {params.attorneyName} for review</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: "16px" }}>schedule</span>
            <span>Typical review time: 1-2 business days</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: "16px" }}>attach_money</span>
            <span>$500 review fee paid by Sava — no cost to your client</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-on-surface-variant">
        Need to assign a different attorney? Update the household&apos;s attorney in the client settings.
      </p>
    </div>
  )
}

function StepAttorneyReview({ params }: { params: WizardParams }) {
  return (
    <div>
      <h3 className="font-headline text-base font-extrabold text-primary mb-1">Attorney Review</h3>
      <p className="text-sm text-on-surface-variant mb-5">Trust instrument sent for review</p>

      <div className="rounded-xl bg-surface-container-low p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: "18px" }}>check</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">Review Approved</p>
            <p className="text-[11px] text-on-surface-variant">
              {params.attorneyName} approved the trust instrument
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-surface-container-lowest p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">Review Details</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Reviewer</span>
              <span className="font-medium text-on-surface">{params.attorneyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Firm</span>
              <span className="font-medium text-on-surface">{params.attorneyFirm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Reviewed</span>
              <span className="font-medium text-on-surface">Apr 12, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Status</span>
              <span className="font-semibold text-secondary">Approved — no changes requested</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepTrustExecution({ params }: { params: WizardParams }) {
  return (
    <div>
      <h3 className="font-headline text-base font-extrabold text-primary mb-1">Trust Execution</h3>
      <p className="text-sm text-on-surface-variant mb-5">Electronic signature required from grantor</p>

      <div className="rounded-xl bg-surface-container-low p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: "18px" }}>draw</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">Trust Instrument Signed</p>
            <p className="text-[11px] text-on-surface-variant">E-signature completed by {params.householdName.replace(" Family", "").replace(" Trust", "")}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>check_circle</span>
            <span className="text-on-surface">Irrevocable trust instrument executed</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>check_circle</span>
            <span className="text-on-surface">Grantor retained annuity interest established</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>check_circle</span>
            <span className="text-on-surface">Beneficiary designations confirmed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepSavaAcceptance() {
  return (
    <div>
      <h3 className="font-headline text-base font-extrabold text-primary mb-1">Sava Trust Acceptance</h3>
      <p className="text-sm text-on-surface-variant mb-5">Corporate trustee acceptance</p>

      <div className="rounded-xl bg-gradient-to-br from-primary to-primary-container p-6 text-white mb-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>verified</span>
          <div>
            <p className="text-base font-extrabold">Sava Trust Company</p>
            <p className="text-sm opacity-80">Nevada Trust Charter</p>
          </div>
        </div>
        <p className="text-sm opacity-90">
          Sava Trust Company accepts appointment as corporate trustee. Trust administration, annuity payment processing, and compliance reporting will be managed by Sava.
        </p>
      </div>

      <div className="rounded-xl bg-surface-container-low p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">Included Services</p>
        <div className="space-y-1.5 text-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>check</span>
            Trust administration &amp; compliance
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>check</span>
            Annuity payment scheduling &amp; processing
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>check</span>
            Rollover monitoring &amp; proposals
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>check</span>
            Tax reporting (Form 709 support, trust returns)
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>check</span>
            Alternative asset administration
          </div>
        </div>
      </div>
    </div>
  )
}

function StepCustodianFunding({ params }: { params: WizardParams }) {
  return (
    <div>
      <h3 className="font-headline text-base font-extrabold text-primary mb-1">Custodian Funding</h3>
      <p className="text-sm text-on-surface-variant mb-5">Transfer assets to the trust account</p>

      <div className="rounded-xl bg-surface-container-low p-5 mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Funding Instructions</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Custodian</span>
            <span className="font-medium text-on-surface">{params.custodian}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Transfer Type</span>
            <span className="font-medium text-on-surface">In-Kind Transfer</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Asset</span>
            <span className="font-medium text-on-surface">{params.fundingAsset}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Amount</span>
            <span className="font-mono font-semibold text-primary">{formatCurrency(params.fundingAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Receiving Account</span>
            <span className="font-medium text-on-surface">Sava Trust Co. FBO {params.householdName}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-secondary-container/10 border border-secondary/20 p-4">
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-secondary" style={{ fontSize: "18px" }}>info</span>
          <p className="text-sm text-on-surface-variant">
            Funding instructions will be sent to {params.custodian}. Assets remain at your existing custodian — your AUM billing is fully preserved.
          </p>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-sm text-on-surface-variant">{label}</span>
      <span className={`text-sm font-medium text-on-surface ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  )
}
