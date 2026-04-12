"use server"

import { revalidatePath } from "next/cache"
import * as store from "./store"
import { calculateAnnuityPayment, generateAnnuitySchedule } from "../grat_math"
import type { GRAT, WorkflowStep, AssetType } from "../types"

export async function approveRollover(proposalId: string): Promise<void> {
  const proposal = store.getRolloverProposal(proposalId)
  if (!proposal) return

  const sourceGrat = store.getGrat(proposal.sourceGratId)
  if (!sourceGrat) return

  const household = store.getHousehold(proposal.householdId)
  if (!household) return

  const now = new Date().toISOString().split("T")[0]
  const newGratId = `${proposal.householdId}-grat-${now.slice(0, 4)}-rollover`

  // Calculate annuity for new GRAT
  const annualPayment = calculateAnnuityPayment(
    proposal.proposedFundingAmount,
    proposal.current7520Rate,
    proposal.proposedTerm
  )

  const startDate = now
  const maturityDate = new Date()
  maturityDate.setFullYear(maturityDate.getFullYear() + proposal.proposedTerm)

  const newGrat: GRAT = {
    id: newGratId,
    householdId: proposal.householdId,
    name: `GRAT-${now.slice(0, 4)}-Rollover`,
    status: "active",
    termYears: proposal.proposedTerm,
    fundingAmount: proposal.proposedFundingAmount,
    fundingAsset: proposal.proposedAsset,
    assetType: proposal.proposedAssetType,
    startDate: now,
    maturityDate: maturityDate.toISOString().split("T")[0],
    hurdle7520Rate: proposal.current7520Rate,
    expectedReturn: sourceGrat.expectedReturn,
    currentValue: proposal.proposedFundingAmount,
    remainderEstimate: 0,
    annuityPayments: generateAnnuitySchedule(newGratId, now, annualPayment, proposal.proposedTerm),
    rolledFromId: sourceGrat.id,
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    workflow: buildCompletedWorkflow(now, household.primaryContact, household.custodian, proposal.proposedFundingAmount),
    attorneyName: "J. Martinez, Esq.",
  }

  // Update source GRAT
  store.updateGrat(sourceGrat.id, { status: "rolled", rolledToId: newGratId })

  // Add new GRAT
  store.addGrat(newGrat)

  // Update proposal
  store.updateRolloverProposal(proposalId, { status: "approved" })

  // Add activities
  store.addActivity({
    id: `act-${Date.now()}-1`,
    householdId: proposal.householdId,
    type: "rollover_approved",
    description: `Rollover approved: ${sourceGrat.name} → ${newGrat.name} for ${household.name}`,
    timestamp: now,
  })
  store.addActivity({
    id: `act-${Date.now()}-2`,
    householdId: proposal.householdId,
    type: "trust_accepted",
    description: `Sava Trust Company accepted ${newGrat.name} for ${household.name}`,
    timestamp: now,
  })

  revalidatePath("/", "layout")
}

export async function declineRollover(proposalId: string): Promise<void> {
  const proposal = store.getRolloverProposal(proposalId)
  if (!proposal) return

  const household = store.getHousehold(proposal.householdId)

  store.updateRolloverProposal(proposalId, { status: "declined" })

  store.addActivity({
    id: `act-${Date.now()}`,
    householdId: proposal.householdId,
    type: "rollover_approved", // reuse type — no "declined" type in our model
    description: `Rollover proposal declined for ${household?.name ?? "household"}`,
    timestamp: new Date().toISOString().split("T")[0],
  })

  revalidatePath("/", "layout")
}

export async function createGrat(params: {
  householdId: string
  fundingAmount: number
  termYears: number
  fundingAsset: string
  assetType: AssetType
  expectedReturn: number
  rate7520: number
}): Promise<void> {
  const household = store.getHousehold(params.householdId)
  if (!household) return

  const now = new Date().toISOString().split("T")[0]
  const quarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`
  const year = now.slice(0, 4)
  const gratId = `${params.householdId}-grat-${year}-${quarter.toLowerCase()}-new`
  const gratName = `GRAT-${year}-${quarter}`

  const annualPayment = calculateAnnuityPayment(params.fundingAmount, params.rate7520, params.termYears)

  const maturityDate = new Date()
  maturityDate.setFullYear(maturityDate.getFullYear() + params.termYears)

  const newGrat: GRAT = {
    id: gratId,
    householdId: params.householdId,
    name: gratName,
    status: "active",
    termYears: params.termYears,
    fundingAmount: params.fundingAmount,
    fundingAsset: params.fundingAsset,
    assetType: params.assetType,
    startDate: now,
    maturityDate: maturityDate.toISOString().split("T")[0],
    hurdle7520Rate: params.rate7520,
    expectedReturn: params.expectedReturn,
    currentValue: params.fundingAmount,
    remainderEstimate: 0,
    annuityPayments: generateAnnuitySchedule(gratId, now, annualPayment, params.termYears),
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    workflow: buildCompletedWorkflow(now, household.primaryContact, household.custodian, params.fundingAmount),
    attorneyName: "J. Martinez, Esq.",
  }

  store.addGrat(newGrat)

  store.addActivity({
    id: `act-${Date.now()}-1`,
    householdId: params.householdId,
    type: "grat_created",
    description: `${gratName} created for ${household.name} — $${(params.fundingAmount / 1_000_000).toFixed(1)}M in ${params.fundingAsset}`,
    timestamp: now,
  })
  store.addActivity({
    id: `act-${Date.now()}-2`,
    householdId: params.householdId,
    type: "trust_accepted",
    description: `Sava Trust Company accepted ${gratName} for ${household.name}`,
    timestamp: now,
  })

  revalidatePath("/", "layout")
}

export async function executeSubstitution(
  gratId: string,
  newAsset: string,
  newAssetType: AssetType,
  fmv: number
): Promise<void> {
  const grat = store.getGrat(gratId)
  if (!grat) return

  const oldAsset = grat.fundingAsset

  store.updateGrat(gratId, {
    fundingAsset: newAsset,
    assetType: newAssetType,
    currentValue: fmv,
    status: "active",
  })

  store.addActivity({
    id: `act-${Date.now()}`,
    householdId: grat.householdId,
    type: "substitution",
    description: `Asset substitution: ${oldAsset} → ${newAsset} for ${grat.name}, validated by Sava Trust Company`,
    timestamp: new Date().toISOString().split("T")[0],
  })

  revalidatePath("/", "layout")
}

export async function requestValuation(householdId: string, assetName: string): Promise<void> {
  store.addActivity({
    id: `act-${Date.now()}`,
    householdId,
    type: "valuation_requested",
    description: `Valuation update requested for ${assetName} — Sava Trust Company coordinating`,
    timestamp: new Date().toISOString().split("T")[0],
  })

  revalidatePath("/", "layout")
}

export async function resetDemo(): Promise<void> {
  store.resetStore()
  revalidatePath("/", "layout")
}

function buildCompletedWorkflow(
  startDate: string,
  contactName: string,
  custodian: string,
  amount: number
): WorkflowStep[] {
  const start = new Date(startDate)
  const fmt = (d: Date) => d.toISOString().split("T")[0]
  const offset = (days: number) => {
    const d = new Date(start)
    d.setDate(d.getDate() - days)
    return fmt(d)
  }

  return [
    { label: "Proposal Created", status: "completed", completedAt: offset(30), detail: "Created by Michael Reynolds" },
    { label: "Attorney Review", status: "completed", completedAt: offset(25), detail: "Approved by J. Martinez, Esq." },
    { label: "E-Signature", status: "completed", completedAt: offset(20), detail: `Signed by ${contactName}` },
    { label: "Trust Accepted", status: "completed", completedAt: offset(15), detail: "Sava Trust Company, Nevada" },
    { label: "Funding Instructions", status: "completed", completedAt: offset(10), detail: `Sent to ${custodian}` },
    { label: "Trust Funded", status: "completed", completedAt: offset(5), detail: `Funded $${amount.toLocaleString()}` },
  ]
}
