export type AssetType = "public_equity" | "concentrated_stock" | "private_co" | "re_llc" | "pe_fund" | "hedge_fund" | "diversified"

export type AssetHolding = {
  name: string                     // "NVDA", "Morrison RE Holdings LLC — Unit B"
  type: AssetType
  value: number
  lastValuationDate?: string       // Required for alternative assets
  valuationStale?: boolean         // True if lastValuationDate > 90 days ago
}

export type Household = {
  id: string
  name: string
  description: string              // "Tech founder — Concentrated NVDA"
  primaryContact: string
  custodian: "Schwab" | "Fidelity" | "Pershing"
  totalAUM: number
  wealthTransferred: number
  status: "action_needed" | "rollover_ready" | "underperforming" | "on_track" | "new"
  holdings: AssetHolding[]
  advisorFeeRate: number           // e.g. 0.0085 (0.85%)
  createdAt: string
}

export type WorkflowStep = {
  label: string                    // "Attorney Review"
  status: "completed" | "active" | "pending"
  completedAt?: string
  detail?: string                  // "Approved by J. Martinez, Esq."
}

export type GRAT = {
  id: string
  householdId: string
  name: string                     // "GRAT-2026-Q1"
  status: "active" | "maturing" | "pending_rollover" | "rolled" | "underperforming" | "completed"
  termYears: number
  fundingAmount: number
  fundingAsset: string             // "NVDA — Concentrated Stock"
  assetType: AssetType
  startDate: string
  maturityDate: string
  hurdle7520Rate: number
  expectedReturn: number
  currentValue: number
  remainderEstimate: number
  annuityPayments: AnnuityPayment[]
  rolledFromId?: string
  rolledToId?: string
  trustee: "Sava Trust Company"
  jurisdiction: "Nevada"
  workflow: WorkflowStep[]
  attorneyName?: string            // "J. Martinez, Esq."
}

export type AnnuityPayment = {
  id: string
  gratId: string
  year: number
  dueDate: string
  amount: number
  status: "scheduled" | "paid" | "overdue"
}

export type RolloverProposal = {
  id: string
  sourceGratId: string
  householdId: string
  proposedFundingAmount: number
  proposedTerm: number
  proposedAsset: string
  proposedAssetType: AssetType
  current7520Rate: number
  recommendation: string
  status: "pending" | "approved" | "declined"
  createdAt: string
}

export type Activity = {
  id: string
  householdId?: string
  type: "grat_created" | "rollover_approved" | "annuity_paid" | "substitution" | "rollover_proposed" | "valuation_requested" | "trust_accepted"
  description: string
  timestamp: string
}

export type TrustDocument = {
  id: string
  gratId?: string
  householdId: string
  name: string                     // "Form 709 — Gift Tax Return (2025)"
  type: "trust_instrument" | "form_709" | "trust_return" | "annuity_confirmation" | "funding_instructions"
  date: string
  downloadable: boolean            // false in demo
}

export type RateDataPoint = {
  month: string                    // "Apr 2026"
  rate: number
}

export type CumulativeTransferPoint = {
  date: string
  totalTransferred: number
  gratName: string                 // Which GRAT maturity caused this step-up
}
