import type { AnnuityPayment } from "./types"

/** Present value annuity factor: (1 - (1 + r)^(-n)) / r */
export function pvAnnuityFactor(rate: number, years: number): number {
  if (rate === 0) return years
  return (1 - Math.pow(1 + rate, -years)) / rate
}

/**
 * Calculate zeroed-out annuity payment for a GRAT.
 * Total PV of payments must equal funding amount.
 * Returns the annual payment amount.
 */
export function calculateAnnuityPayment(
  fundingAmount: number,
  rate7520: number,
  termYears: number
): number {
  return fundingAmount / pvAnnuityFactor(rate7520, termYears)
}

/** Project the GRAT end value: funding * (1 + expectedReturn)^term */
export function projectEndValue(
  fundingAmount: number,
  expectedReturn: number,
  termYears: number
): number {
  return fundingAmount * Math.pow(1 + expectedReturn, termYears)
}

/** Calculate remainder (tax-free transfer): endValue - sum of annuity payments */
export function calculateRemainder(
  endValue: number,
  annualPayment: number,
  termYears: number
): number {
  return Math.max(0, endValue - annualPayment * termYears)
}

/** Gift tax saved at 40% rate */
export function calculateTaxSaved(remainder: number): number {
  return remainder * 0.4
}

/**
 * Full GRAT projection — the main function used by the modeling UI.
 * Returns all calculated values from a single set of inputs.
 */
export function projectGrat(params: {
  fundingAmount: number
  rate7520: number
  termYears: number
  expectedReturn: number
  advisorFeeRate: number
}): {
  annualPayment: number
  projectedEndValue: number
  totalAnnuityPayments: number
  remainder: number
  taxSaved: number
  excessOverHurdle: number
  advisorAumFee: number
  savaAdminFee: number
} {
  const { fundingAmount, rate7520, termYears, expectedReturn, advisorFeeRate } = params

  const annualPayment = calculateAnnuityPayment(fundingAmount, rate7520, termYears)
  const projectedEndValue = projectEndValue(fundingAmount, expectedReturn, termYears)
  const totalAnnuityPayments = annualPayment * termYears
  const remainder = calculateRemainder(projectedEndValue, annualPayment, termYears)
  const taxSaved = calculateTaxSaved(remainder)
  const excessOverHurdle = (expectedReturn - rate7520) * 100
  const savaAdminFee = fundingAmount * 0.0025
  const advisorAumFee = fundingAmount * advisorFeeRate

  return {
    annualPayment,
    projectedEndValue,
    totalAnnuityPayments,
    remainder,
    taxSaved,
    excessOverHurdle,
    advisorAumFee,
    savaAdminFee,
  }
}

/**
 * Generate annuity schedule for a new GRAT.
 * Returns array of AnnuityPayment objects with calculated amounts and due dates.
 */
export function generateAnnuitySchedule(
  gratId: string,
  startDate: string,
  annualPayment: number,
  termYears: number
): AnnuityPayment[] {
  const start = new Date(startDate)
  const payments: AnnuityPayment[] = []

  for (let year = 1; year <= termYears; year++) {
    const dueDate = new Date(start)
    dueDate.setFullYear(start.getFullYear() + year)

    payments.push({
      id: `${gratId}-pmt-${year}`,
      gratId,
      year,
      dueDate: dueDate.toISOString().split("T")[0],
      amount: annualPayment,
      status: "scheduled",
    })
  }

  return payments
}
