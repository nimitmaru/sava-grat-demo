import {
  households as fixtureHouseholds,
  grats as fixtureGrats,
  rolloverProposals as fixtureRolloverProposals,
  activities as fixtureActivities,
  trustDocuments as fixtureTrustDocuments,
  rateHistory as fixtureRateHistory,
  currentRate as fixtureCurrentRate,
} from "./fixtures"
import type { Household, GRAT, RolloverProposal, Activity, TrustDocument, RateDataPoint } from "../types"

// Mutable copies
let households = structuredClone(fixtureHouseholds)
let grats = structuredClone(fixtureGrats)
let rolloverProposals = structuredClone(fixtureRolloverProposals)
let activities = structuredClone(fixtureActivities)
let trustDocuments = structuredClone(fixtureTrustDocuments)

// --- Getters ---

export function getHouseholds(): Household[] {
  return households
}

export function getHousehold(id: string): Household | undefined {
  return households.find(h => h.id === id)
}

export function getGratsByHousehold(householdId: string): GRAT[] {
  return grats.filter(g => g.householdId === householdId)
}

export function getGrat(id: string): GRAT | undefined {
  return grats.find(g => g.id === id)
}

export function getActiveGrats(): GRAT[] {
  return grats.filter(g => !["rolled", "completed"].includes(g.status))
}

export function getPendingRollovers(): RolloverProposal[] {
  return rolloverProposals.filter(r => r.status === "pending")
}

export function getRolloverProposal(id: string): RolloverProposal | undefined {
  return rolloverProposals.find(r => r.id === id)
}

export function getActivities(householdId?: string): Activity[] {
  if (householdId) return activities.filter(a => a.householdId === householdId)
  return activities
}

export function getDocuments(householdId: string): TrustDocument[] {
  return trustDocuments.filter(d => d.householdId === householdId)
}

export function getRateHistory(): RateDataPoint[] {
  return fixtureRateHistory // immutable — no need to clone
}

export function getCurrentRate(): number {
  return fixtureCurrentRate
}

export function getNeedsAttention(): Array<{
  household: Household
  description: string
  action: string
  actionUrl: string
  type: "maturing" | "rollover" | "underperforming" | "valuation"
}> {
  const today = new Date("2026-04-11")
  const thirtyDaysLater = new Date(today)
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)

  const items: Array<{
    household: Household
    description: string
    action: string
    actionUrl: string
    type: "maturing" | "rollover" | "underperforming" | "valuation"
  }> = []

  // 1. Maturing GRATs (maturityDate within 30 days of today)
  for (const grat of grats) {
    const maturity = new Date(grat.maturityDate)
    if (maturity >= today && maturity <= thirtyDaysLater) {
      const household = households.find(h => h.id === grat.householdId)
      if (!household) continue
      const maturityLabel = maturity.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      items.push({
        household,
        description: `${grat.name} maturing ${maturityLabel}`,
        action: "Review →",
        actionUrl: `/clients/${household.id}`,
        type: "maturing",
      })
    }
  }

  // 2. Pending rollovers
  for (const proposal of rolloverProposals) {
    if (proposal.status !== "pending") continue
    const household = households.find(h => h.id === proposal.householdId)
    if (!household) continue
    items.push({
      household,
      description: "Rollover proposal ready",
      action: "Approve →",
      actionUrl: `/clients/${household.id}`,
      type: "rollover",
    })
  }

  // 3. Underperforming GRATs
  for (const grat of grats) {
    if (grat.status !== "underperforming") continue
    const household = households.find(h => h.id === grat.householdId)
    if (!household) continue
    items.push({
      household,
      description: "GRAT underperforming hurdle rate",
      action: "Substitute →",
      actionUrl: `/clients/${household.id}`,
      type: "underperforming",
    })
  }

  // 4. Stale valuations on holdings
  for (const household of households) {
    for (const holding of household.holdings) {
      if (holding.valuationStale) {
        items.push({
          household,
          description: `${holding.name} valuation is 95 days old`,
          action: "Request Update →",
          actionUrl: `/clients/${household.id}`,
          type: "valuation",
        })
        break // one alert per household
      }
    }
  }

  return items
}

export function getDashboardStats(): {
  activeGrats: number
  wealthTransferred: number
  pendingRollovers: number
  totalHouseholds: number
  totalAUM: number
} {
  return {
    activeGrats: getActiveGrats().length,
    wealthTransferred: households.reduce((sum, h) => sum + h.wealthTransferred, 0),
    pendingRollovers: getPendingRollovers().length,
    totalHouseholds: households.length,
    totalAUM: households.reduce((sum, h) => sum + h.totalAUM, 0),
  }
}

// --- Mutators ---

export function addGrat(grat: GRAT): void {
  grats.push(grat)
}

export function updateGrat(id: string, updates: Partial<GRAT>): void {
  const idx = grats.findIndex(g => g.id === id)
  if (idx !== -1) grats[idx] = { ...grats[idx], ...updates }
}

export function updateHousehold(id: string, updates: Partial<Household>): void {
  const idx = households.findIndex(h => h.id === id)
  if (idx !== -1) households[idx] = { ...households[idx], ...updates }
}

export function updateRolloverProposal(id: string, updates: Partial<RolloverProposal>): void {
  const idx = rolloverProposals.findIndex(r => r.id === id)
  if (idx !== -1) rolloverProposals[idx] = { ...rolloverProposals[idx], ...updates }
}

export function addActivity(activity: Activity): void {
  activities.unshift(activity) // newest first
}

export function resetStore(): void {
  households = structuredClone(fixtureHouseholds)
  grats = structuredClone(fixtureGrats)
  rolloverProposals = structuredClone(fixtureRolloverProposals)
  activities = structuredClone(fixtureActivities)
  trustDocuments = structuredClone(fixtureTrustDocuments)
}
