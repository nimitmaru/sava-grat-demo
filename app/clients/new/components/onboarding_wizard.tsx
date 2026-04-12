"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import { formatCurrency, formatCompactCurrency } from "@/lib/format"
import { projectGrat } from "@/lib/grat_math"
import type { AssetType } from "@/lib/types"

type HouseholdForm = {
  name: string
  primaryContact: string
  custodian: "Schwab" | "Fidelity" | "Pershing"
  description: string
}

type HoldingEntry = {
  name: string
  type: AssetType
  value: number
  lastValuationDate: string
}

type AttorneyForm = {
  name: string
  firm: string
  email: string
}

const STEPS = [
  "Household Details",
  "Import Holdings",
  "Strategy Recommendation",
  "Model & Preview",
  "Invite Attorney",
  "Review & Create",
]

export function OnboardingWizard() {
  const { showToast } = useToast()
  const router = useRouter()
  const [step, setStep] = useState(0)

  const [household, setHousehold] = useState<HouseholdForm>({
    name: "",
    primaryContact: "",
    custodian: "Schwab",
    description: "",
  })

  const [holdings, setHoldings] = useState<HoldingEntry[]>([
    { name: "", type: "public_equity", value: 0, lastValuationDate: "" },
  ])

  const [strategy, setStrategy] = useState<"quarterly" | "semiannual" | "annual">("quarterly")
  const [termYears, setTermYears] = useState(2)
  const [fundingAmount, setFundingAmount] = useState(5_000_000)
  const [expectedReturn, setExpectedReturn] = useState(0.12)

  const [attorney, setAttorney] = useState<AttorneyForm>({
    name: "",
    firm: "",
    email: "",
  })

  const totalAUM = holdings.reduce((s, h) => s + h.value, 0)

  const handleComplete = () => {
    showToast(`${household.name} onboarding complete. GRAT program ready to launch.`, "success")
    router.push("/clients")
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                i < step
                  ? "bg-secondary text-white"
                  : i === step
                  ? "bg-primary text-white"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}>
                {i < step ? (
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>check</span>
                ) : (
                  i + 1
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-2 h-0.5 w-8 ${i < step ? "bg-secondary" : "bg-surface-container-high"}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm font-semibold text-primary">{STEPS[step]}</p>
        <p className="text-[12px] text-on-surface-variant">Step {step + 1} of {STEPS.length}</p>
      </div>

      <div className="rounded-xl bg-surface-container-lowest p-6 mb-6 min-h-[400px]">
        {step === 0 && (
          <StepHousehold household={household} onChange={setHousehold} />
        )}
        {step === 1 && (
          <StepHoldings holdings={holdings} onChange={setHoldings} />
        )}
        {step === 2 && (
          <StepStrategy
            strategy={strategy}
            onChangeStrategy={setStrategy}
            termYears={termYears}
            onChangeTerm={setTermYears}
            totalAUM={totalAUM}
          />
        )}
        {step === 3 && (
          <StepModel
            fundingAmount={fundingAmount}
            onChangeFunding={setFundingAmount}
            expectedReturn={expectedReturn}
            onChangeReturn={setExpectedReturn}
            termYears={termYears}
            holdings={holdings}
          />
        )}
        {step === 4 && (
          <StepAttorney attorney={attorney} onChange={setAttorney} />
        )}
        {step === 5 && (
          <StepReview
            household={household}
            holdings={holdings}
            strategy={strategy}
            termYears={termYears}
            fundingAmount={fundingAmount}
            expectedReturn={expectedReturn}
            attorney={attorney}
            totalAUM={totalAUM}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={step === 0 ? () => router.push("/clients") : () => setStep(s => s - 1)}
          className="rounded-xl bg-surface-container-low px-5 py-2.5 text-sm font-bold text-on-surface-variant"
        >
          {step === 0 ? "Cancel" : "Back"}
        </button>
        <button
          onClick={step === STEPS.length - 1 ? handleComplete : () => setStep(s => s + 1)}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary"
        >
          {step === STEPS.length - 1 ? "Create Client & Launch Program" : "Continue"}
        </button>
      </div>
    </div>
  )
}

function StepHousehold({ household, onChange }: { household: HouseholdForm; onChange: (h: HouseholdForm) => void }) {
  return (
    <div>
      <h3 className="font-headline text-lg font-extrabold text-primary mb-1">Household Details</h3>
      <p className="text-sm text-on-surface-variant mb-6">Basic information about the client family</p>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Household Name</label>
          <input
            type="text"
            value={household.name}
            onChange={e => onChange({ ...household, name: e.target.value })}
            placeholder="e.g., Johnson Family Trust"
            className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Primary Contact</label>
          <input
            type="text"
            value={household.primaryContact}
            onChange={e => onChange({ ...household, primaryContact: e.target.value })}
            placeholder="Robert Johnson"
            className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Custodian</label>
          <select
            value={household.custodian}
            onChange={e => onChange({ ...household, custodian: e.target.value as HouseholdForm["custodian"] })}
            className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="Schwab">Charles Schwab</option>
            <option value="Fidelity">Fidelity</option>
            <option value="Pershing">Pershing</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Description</label>
          <input
            type="text"
            value={household.description}
            onChange={e => onChange({ ...household, description: e.target.value })}
            placeholder="e.g., Tech executive — concentrated AAPL position"
            className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </div>
  )
}

function StepHoldings({ holdings, onChange }: { holdings: HoldingEntry[]; onChange: (h: HoldingEntry[]) => void }) {
  const addHolding = () => {
    onChange([...holdings, { name: "", type: "public_equity", value: 0, lastValuationDate: "" }])
  }

  const updateHolding = (index: number, updates: Partial<HoldingEntry>) => {
    onChange(holdings.map((h, i) => i === index ? { ...h, ...updates } : h))
  }

  const removeHolding = (index: number) => {
    if (holdings.length === 1) return
    onChange(holdings.filter((_, i) => i !== index))
  }

  const total = holdings.reduce((s, h) => s + h.value, 0)

  return (
    <div>
      <h3 className="font-headline text-lg font-extrabold text-primary mb-1">Import Holdings</h3>
      <p className="text-sm text-on-surface-variant mb-6">Add the client&apos;s assets that may be used in GRAT funding</p>

      <div className="space-y-3 mb-4">
        {holdings.map((holding, i) => (
          <div key={i} className="rounded-xl bg-surface-container-low p-4">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1">Asset Name</label>
                <input
                  type="text"
                  value={holding.name}
                  onChange={e => updateHolding(i, { name: e.target.value })}
                  placeholder="AAPL Concentrated"
                  className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="col-span-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1">Type</label>
                <select
                  value={holding.type}
                  onChange={e => updateHolding(i, { type: e.target.value as AssetType })}
                  className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="public_equity">Public Equity</option>
                  <option value="concentrated_stock">Concentrated Stock</option>
                  <option value="private_co">Private Company</option>
                  <option value="re_llc">Real Estate LLC</option>
                  <option value="pe_fund">PE Fund</option>
                  <option value="hedge_fund">Hedge Fund</option>
                  <option value="diversified">Diversified</option>
                </select>
              </div>
              <div className="col-span-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1">Value ($)</label>
                <input
                  type="number"
                  value={holding.value || ""}
                  onChange={e => updateHolding(i, { value: Number(e.target.value) })}
                  placeholder="5000000"
                  className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="col-span-2 flex items-end">
                <button
                  onClick={() => removeHolding(i)}
                  disabled={holdings.length === 1}
                  className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addHolding}
        className="flex items-center gap-2 rounded-xl bg-surface-container-low px-4 py-2.5 text-sm font-bold text-primary"
      >
        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
        Add Holding
      </button>

      {total > 0 && (
        <div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between">
          <span className="text-sm font-semibold text-on-surface">Total Portfolio Value</span>
          <span className="font-mono text-lg font-bold text-primary">{formatCurrency(total)}</span>
        </div>
      )}
    </div>
  )
}

function StepStrategy({
  strategy,
  onChangeStrategy,
  termYears,
  onChangeTerm,
  totalAUM,
}: {
  strategy: string
  onChangeStrategy: (s: "quarterly" | "semiannual" | "annual") => void
  termYears: number
  onChangeTerm: (t: number) => void
  totalAUM: number
}) {
  const strategies = [
    { id: "quarterly" as const, label: "Quarterly Rolling", desc: "4 GRATs/year — maximum diversification of timing risk", recommended: true },
    { id: "semiannual" as const, label: "Semi-Annual Rolling", desc: "2 GRATs/year — balanced approach for moderate portfolios", recommended: false },
    { id: "annual" as const, label: "Annual Rolling", desc: "1 GRAT/year — simpler but less diversified", recommended: false },
  ]

  return (
    <div>
      <h3 className="font-headline text-lg font-extrabold text-primary mb-1">Strategy Recommendation</h3>
      <p className="text-sm text-on-surface-variant mb-6">
        Based on {formatCompactCurrency(totalAUM)} in holdings, we recommend a rolling GRAT strategy
      </p>

      <div className="space-y-3 mb-6">
        {strategies.map(s => (
          <button
            key={s.id}
            onClick={() => onChangeStrategy(s.id)}
            className={`w-full rounded-xl p-5 text-left transition-colors ${
              strategy === s.id
                ? "bg-primary-fixed/30 border-2 border-primary"
                : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container-high"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-on-surface">{s.label}</p>
              {s.recommended && (
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Recommended</span>
              )}
            </div>
            <p className="text-[13px] text-on-surface-variant">{s.desc}</p>
          </button>
        ))}
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-2">GRAT Term</label>
        <div className="flex gap-2">
          {[2, 3, 5].map(term => (
            <button
              key={term}
              onClick={() => onChangeTerm(term)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                termYears === term
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {term} Years
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepModel({
  fundingAmount,
  onChangeFunding,
  expectedReturn,
  onChangeReturn,
  termYears,
  holdings,
}: {
  fundingAmount: number
  onChangeFunding: (v: number) => void
  expectedReturn: number
  onChangeReturn: (v: number) => void
  termYears: number
  holdings: HoldingEntry[]
}) {
  const rate7520 = 0.048
  const projection = projectGrat({
    fundingAmount,
    rate7520,
    termYears,
    expectedReturn,
    advisorFeeRate: 0.0085,
  })

  const selectedAsset = holdings.find(h => h.value > 0)?.name || "Primary Holding"

  return (
    <div>
      <h3 className="font-headline text-lg font-extrabold text-primary mb-1">Model &amp; Preview</h3>
      <p className="text-sm text-on-surface-variant mb-6">Configure the first GRAT parameters</p>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Funding Amount</label>
            <p className="text-xl font-headline font-extrabold text-primary mb-2">{formatCurrency(fundingAmount)}</p>
            <input
              type="range"
              min={1_000_000}
              max={50_000_000}
              step={500_000}
              value={fundingAmount}
              onChange={e => onChangeFunding(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Expected Return</label>
            <p className="text-xl font-headline font-extrabold text-primary mb-2">{(expectedReturn * 100).toFixed(1)}%</p>
            <input
              type="range"
              min={0}
              max={0.30}
              step={0.005}
              value={expectedReturn}
              onChange={e => onChangeReturn(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div className="rounded-xl bg-surface-container-low p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Funding Asset</span>
              <span className="font-medium text-on-surface">{selectedAsset}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-on-surface-variant">7520 Rate</span>
              <span className="font-mono font-medium text-on-surface">4.80%</span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-secondary-container/30 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-secondary-container mb-1">Est. Tax-Free Transfer</p>
            <p className="font-headline text-3xl font-extrabold tracking-tight text-secondary">{formatCompactCurrency(projection.remainder)}</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-primary to-primary-container p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/60 mb-1">Gift Tax Saved</p>
            <p className="font-headline text-3xl font-extrabold tracking-tight text-white">{formatCompactCurrency(projection.taxSaved)}</p>
          </div>
          <div className="rounded-xl bg-surface-container-low p-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Annual Annuity</span>
              <span className="font-mono font-medium text-on-surface">{formatCurrency(projection.annualPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Excess Over Hurdle</span>
              <span className="font-mono font-bold text-secondary">+{projection.excessOverHurdle.toFixed(1)}pp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepAttorney({ attorney, onChange }: { attorney: AttorneyForm; onChange: (a: AttorneyForm) => void }) {
  return (
    <div>
      <h3 className="font-headline text-lg font-extrabold text-primary mb-1">Invite Attorney</h3>
      <p className="text-sm text-on-surface-variant mb-6">
        A T&amp;E attorney is required to review trust instruments. They&apos;ll earn $500 per review.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Attorney Name</label>
          <input
            type="text"
            value={attorney.name}
            onChange={e => onChange({ ...attorney, name: e.target.value })}
            placeholder="Jane Smith, Esq."
            className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Law Firm</label>
          <input
            type="text"
            value={attorney.firm}
            onChange={e => onChange({ ...attorney, firm: e.target.value })}
            placeholder="Smith & Partners"
            className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant block mb-1.5">Email Address</label>
          <input
            type="email"
            value={attorney.email}
            onChange={e => onChange({ ...attorney, email: e.target.value })}
            placeholder="jane@smithpartners.com"
            className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="rounded-xl bg-primary-fixed/20 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-primary mb-2">Attorney Earning Potential</p>
        <p className="text-sm text-on-surface-variant">
          With a quarterly rolling program, this attorney earns approximately <span className="font-semibold text-secondary">{formatCurrency(4 * 500)}/year</span> from this client alone.
          Across 10 clients, that&apos;s <span className="font-semibold text-secondary">{formatCurrency(10 * 4 * 500)}/year</span> in passive review income.
        </p>
      </div>
    </div>
  )
}

function StepReview({
  household,
  holdings,
  strategy,
  termYears,
  fundingAmount,
  expectedReturn,
  attorney,
  totalAUM,
}: {
  household: HouseholdForm
  holdings: HoldingEntry[]
  strategy: string
  termYears: number
  fundingAmount: number
  expectedReturn: number
  attorney: AttorneyForm
  totalAUM: number
}) {
  const strategyLabel = strategy === "quarterly" ? "Quarterly" : strategy === "semiannual" ? "Semi-Annual" : "Annual"

  return (
    <div>
      <h3 className="font-headline text-lg font-extrabold text-primary mb-1">Review &amp; Create</h3>
      <p className="text-sm text-on-surface-variant mb-6">Confirm all details before creating the client and launching their GRAT program</p>

      <div className="space-y-4">
        <div className="rounded-xl bg-surface-container-low p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">Household</p>
          <p className="text-sm font-semibold text-on-surface">{household.name || "—"}</p>
          <p className="text-[12px] text-on-surface-variant">{household.primaryContact} &middot; {household.custodian}</p>
        </div>

        <div className="rounded-xl bg-surface-container-low p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">Holdings ({holdings.filter(h => h.value > 0).length} assets)</p>
          <p className="font-mono text-lg font-bold text-primary">{formatCurrency(totalAUM)}</p>
          <div className="mt-2 space-y-1">
            {holdings.filter(h => h.name).map((h, i) => (
              <p key={i} className="text-[12px] text-on-surface-variant">
                {h.name} ({h.type.replace(/_/g, " ")}) — {formatCurrency(h.value)}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-surface-container-low p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">GRAT Strategy</p>
          <p className="text-sm font-semibold text-on-surface">{strategyLabel} Rolling &middot; {termYears}-Year Term</p>
          <p className="text-[12px] text-on-surface-variant">
            Initial funding: {formatCurrency(fundingAmount)} &middot; Expected return: {(expectedReturn * 100).toFixed(1)}%
          </p>
        </div>

        {attorney.name && (
          <div className="rounded-xl bg-surface-container-low p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">Attorney</p>
            <p className="text-sm font-semibold text-on-surface">{attorney.name}</p>
            <p className="text-[12px] text-on-surface-variant">{attorney.firm} &middot; {attorney.email}</p>
          </div>
        )}

        <div className="rounded-xl bg-gradient-to-br from-primary to-primary-container p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>verified</span>
            <p className="text-sm font-semibold">Sava Trust Company — Nevada Charter</p>
          </div>
          <p className="text-[12px] opacity-80">Corporate trustee &middot; Trust administration &middot; Annuity processing &middot; Compliance</p>
        </div>
      </div>
    </div>
  )
}
