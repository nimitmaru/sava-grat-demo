"use client"

import { useState } from "react"
import { ModalShell } from "./modal_shell"
import { formatCurrency } from "@/lib/format"
import { useToast } from "./toast"

type AttorneyInviteProps = {
  open: boolean
  onClose: () => void
  householdName: string
  existingAttorney?: { name: string; firm: string; initials: string }
}

const STEPS = ["Invite Attorney", "Preview Pitch", "Attorney Portal Preview"]

export function AttorneyInviteModal({ open, onClose, householdName, existingAttorney }: AttorneyInviteProps) {
  const [step, setStep] = useState(0)
  const [sending, setSending] = useState(false)
  const { showToast } = useToast()
  const [form, setForm] = useState({
    name: existingAttorney?.name ?? "",
    firm: existingAttorney?.firm ?? "",
    email: "",
    specialization: "Trust & Estate",
  })

  const handleSendInvite = () => {
    setSending(true)
    setTimeout(() => {
      setSending(false)
      showToast(`Invitation sent to ${form.name} at ${form.email}`, "success")
      onClose()
      setStep(0)
    }, 1200)
  }

  return (
    <ModalShell open={open} title="Invite Attorney" subtitle={householdName} onClose={onClose}>
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((label, i) => (
          <button
            key={label}
            onClick={() => i < step && setStep(i)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
              i === step
                ? "bg-primary text-on-primary"
                : i < step
                ? "bg-secondary-container text-on-secondary-container cursor-pointer"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            {i < step && (
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>check</span>
            )}
            {label}
          </button>
        ))}
      </div>

      {step === 0 && (
        <StepInviteForm
          form={form}
          onChange={setForm}
          onNext={() => setStep(1)}
          onCancel={onClose}
          hasExisting={!!existingAttorney}
        />
      )}
      {step === 1 && (
        <StepPreviewPitch
          form={form}
          householdName={householdName}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <StepAttorneyPortalPreview
          form={form}
          onBack={() => setStep(1)}
          onSend={handleSendInvite}
          sending={sending}
        />
      )}
    </ModalShell>
  )
}

function StepInviteForm({
  form,
  onChange,
  onNext,
  onCancel,
  hasExisting,
}: {
  form: { name: string; firm: string; email: string; specialization: string }
  onChange: (f: typeof form) => void
  onNext: () => void
  onCancel: () => void
  hasExisting: boolean
}) {
  const canContinue = form.name && form.firm && form.email

  return (
    <div>
      <h3 className="font-headline text-base font-extrabold text-primary mb-1">Attorney Details</h3>
      <p className="text-sm text-on-surface-variant mb-5">
        {hasExisting
          ? "This household already has a linked attorney. Send them an invitation to join the platform."
          : "Add the client's T&E attorney to enable trust instrument review and earn recurring review income."
        }
      </p>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Attorney Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => onChange({ ...form, name: e.target.value })}
            placeholder="Sarah Kim, Esq."
            className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Law Firm</label>
          <input
            type="text"
            value={form.firm}
            onChange={e => onChange({ ...form, firm: e.target.value })}
            placeholder="Kim & Associates"
            className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={e => onChange({ ...form, email: e.target.value })}
            placeholder="sarah@kimassociates.com"
            className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Specialization</label>
          <select
            value={form.specialization}
            onChange={e => onChange({ ...form, specialization: e.target.value })}
            className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option>Trust & Estate</option>
            <option>Tax Planning</option>
            <option>Wealth Transfer</option>
            <option>Corporate Trust</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 mt-6 border-t border-outline-variant/10">
        <button onClick={onCancel} className="rounded-xl bg-surface-container-low px-4 py-2 text-sm font-bold text-on-surface-variant">
          Cancel
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-on-primary disabled:opacity-40"
        >
          Preview Pitch
        </button>
      </div>
    </div>
  )
}

function StepPreviewPitch({
  form,
  householdName,
  onBack,
  onNext,
}: {
  form: { name: string; firm: string; email: string }
  householdName: string
  onBack: () => void
  onNext: () => void
}) {
  const clientsPerYear = 10
  const gratsPerClient = 4
  const feePerReview = 500

  return (
    <div>
      <h3 className="font-headline text-base font-extrabold text-primary mb-1">Preview: What {form.name.split(",")[0]} Will See</h3>
      <p className="text-sm text-on-surface-variant mb-5">
        This is the pitch email and landing page the attorney will receive
      </p>

      {/* Mock email preview */}
      <div className="rounded-xl border border-outline-variant/15 overflow-hidden mb-5">
        <div className="bg-surface-container-low px-5 py-3 border-b border-outline-variant/10">
          <p className="text-[11px] text-on-surface-variant">
            <span className="font-semibold">To:</span> {form.email}
          </p>
          <p className="text-[11px] text-on-surface-variant">
            <span className="font-semibold">Subject:</span> Michael Reynolds invited you to Sava Auto-GRAT — earn recurring review income
          </p>
        </div>
        <div className="bg-surface-container-lowest p-5 space-y-4">
          <p className="text-sm text-on-surface">Dear {form.name.split(",")[0]},</p>
          <p className="text-sm text-on-surface-variant">
            Michael Reynolds at Reynolds Wealth Management has invited you to join Sava&apos;s Auto-GRAT platform as the reviewing attorney for the <span className="font-semibold text-on-surface">{householdName}</span> GRAT program.
          </p>
          <p className="text-sm text-on-surface-variant">
            As a reviewing attorney on Sava, you earn <span className="font-semibold text-on-surface">{formatCurrency(feePerReview)} per GRAT review</span> — paid by Sava, not your client. Each GRAT creation and rollover includes a review, generating passive recurring income.
          </p>

          {/* Earnings calculator */}
          <div className="rounded-xl bg-gradient-to-br from-primary to-primary-container p-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] opacity-60 mb-1">Your Potential Annual Income</p>
            <p className="font-headline text-4xl font-extrabold tracking-tight">
              {formatCurrency(clientsPerYear * gratsPerClient * feePerReview)}
            </p>
            <p className="text-sm opacity-80 mt-1">
              Based on {clientsPerYear} client households &times; {gratsPerClient} GRATs/year &times; {formatCurrency(feePerReview)}/review
            </p>
          </div>

          <div className="space-y-2 text-sm text-on-surface-variant">
            <p className="font-semibold text-on-surface">How it works:</p>
            <div className="flex items-start gap-2">
              <span className="text-secondary font-bold">1.</span>
              <span>Review trust instruments when GRATs are created or rolled</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-secondary font-bold">2.</span>
              <span>Approve or request changes through your Sava portal</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-secondary font-bold">3.</span>
              <span>Earn {formatCurrency(feePerReview)} per review — paid automatically by Sava</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
        <button onClick={onBack} className="rounded-xl bg-surface-container-low px-4 py-2 text-sm font-bold text-on-surface-variant">
          Back
        </button>
        <button onClick={onNext} className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-on-primary">
          Preview Attorney Portal
        </button>
      </div>
    </div>
  )
}

function StepAttorneyPortalPreview({
  form,
  onBack,
  onSend,
  sending,
}: {
  form: { name: string; firm: string }
  onBack: () => void
  onSend: () => void
  sending: boolean
}) {
  return (
    <div>
      <h3 className="font-headline text-base font-extrabold text-primary mb-1">Attorney Portal Preview</h3>
      <p className="text-sm text-on-surface-variant mb-5">
        What {form.name.split(",")[0]} will see after accepting the invitation
      </p>

      {/* Mock attorney portal */}
      <div className="rounded-xl border border-outline-variant/15 overflow-hidden mb-5">
        <div className="bg-gradient-to-br from-primary to-primary-container p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/60 mb-1">Attorney Portal</p>
          <p className="font-headline text-lg font-extrabold text-white">{form.name}</p>
          <p className="text-sm text-white/70">{form.firm}</p>
        </div>

        <div className="bg-surface-container-lowest p-5 space-y-5">
          {/* Earnings dashboard */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-surface-container-low p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Reviews YTD</p>
              <p className="font-headline text-2xl font-extrabold text-primary">0</p>
            </div>
            <div className="rounded-lg bg-surface-container-low p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Income YTD</p>
              <p className="font-headline text-2xl font-extrabold text-secondary">{formatCurrency(0)}</p>
            </div>
            <div className="rounded-lg bg-surface-container-low p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Households</p>
              <p className="font-headline text-2xl font-extrabold text-primary">1</p>
            </div>
          </div>

          {/* Review queue */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">Pending Reviews</p>
            <div className="rounded-lg bg-tertiary-fixed/15 border border-tertiary-fixed-dim/30 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontSize: "18px" }}>description</span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Trust instrument pending review</p>
                  <p className="text-[11px] text-on-surface-variant">Will appear here when a GRAT is created</p>
                </div>
              </div>
              <span className="rounded-full bg-tertiary-fixed/30 px-2.5 py-0.5 text-[10px] font-bold uppercase text-on-tertiary-container">
                Awaiting First GRAT
              </span>
            </div>
          </div>

          {/* Earnings history placeholder */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">Earnings History</p>
            <div className="rounded-lg bg-surface-container-low p-4 text-center">
              <p className="text-sm text-on-surface-variant">Earnings will appear here after your first review</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
        <button onClick={onBack} className="rounded-xl bg-surface-container-low px-4 py-2 text-sm font-bold text-on-surface-variant">
          Back
        </button>
        <button
          onClick={onSend}
          disabled={sending}
          className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-on-primary disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send Invitation"}
        </button>
      </div>
    </div>
  )
}
