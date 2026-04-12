import type {
  Household,
  GRAT,
  RolloverProposal,
  Activity,
  TrustDocument,
  RateDataPoint,
  WorkflowStep,
} from "../types"

// ---------------------------------------------------------------------------
// Households
// ---------------------------------------------------------------------------

export const households: Household[] = [
  {
    id: "chen",
    name: "Chen Family",
    description: "Tech founder — Concentrated NVDA",
    primaryContact: "David Chen",
    custodian: "Schwab",
    totalAUM: 12_000_000,
    wealthTransferred: 3_200_000,
    status: "action_needed",
    advisorFeeRate: 0.0085,
    createdAt: "2024-01-15",
    holdings: [
      { name: "NVDA", type: "concentrated_stock", value: 6_000_000 },
      { name: "AAPL", type: "public_equity", value: 3_000_000 },
      { name: "VTI", type: "diversified", value: 3_000_000 },
    ],
  },
  {
    id: "ambani",
    name: "Ambani Trust",
    description: "Pre-IPO exec — Private company + public equities",
    primaryContact: "Priya Ambani",
    custodian: "Fidelity",
    totalAUM: 45_000_000,
    wealthTransferred: 4_800_000,
    status: "rollover_ready",
    advisorFeeRate: 0.0075,
    createdAt: "2023-06-01",
    holdings: [
      {
        name: "Vertex AI Inc.",
        type: "private_co",
        value: 25_000_000,
        lastValuationDate: "2026-01-06",
        valuationStale: true,
      },
      { name: "QQQ", type: "public_equity", value: 12_000_000 },
      { name: "BND", type: "diversified", value: 8_000_000 },
    ],
  },
  {
    id: "morrison",
    name: "Morrison Family",
    description: "Real estate investor — LLCs + diversified",
    primaryContact: "James Morrison",
    custodian: "Pershing",
    totalAUM: 10_000_000,
    wealthTransferred: 1_200_000,
    status: "underperforming",
    advisorFeeRate: 0.009,
    createdAt: "2024-09-01",
    holdings: [
      {
        name: "Morrison RE Holdings LLC — Unit B",
        type: "re_llc",
        value: 4_000_000,
      },
      {
        name: "Morrison RE Holdings LLC — Unit D",
        type: "re_llc",
        value: 3_000_000,
      },
      { name: "VTI", type: "diversified", value: 3_000_000 },
    ],
  },
  {
    id: "nakamura",
    name: "Nakamura Trust",
    description: "Retiree — Diversified rolling ladder",
    primaryContact: "Kenji Nakamura",
    custodian: "Schwab",
    totalAUM: 7_500_000,
    wealthTransferred: 1_860_000,
    status: "on_track",
    advisorFeeRate: 0.008,
    createdAt: "2023-01-10",
    holdings: [
      { name: "VTI", type: "public_equity", value: 3_000_000 },
      { name: "BND", type: "diversified", value: 1_500_000 },
      { name: "AAPL", type: "public_equity", value: 1_500_000 },
      { name: "VXUS", type: "diversified", value: 1_500_000 },
    ],
  },
  {
    id: "whitfield",
    name: "Whitfield Family",
    description: "New client — Getting started",
    primaryContact: "Sarah Whitfield",
    custodian: "Fidelity",
    totalAUM: 10_000_000,
    wealthTransferred: 0,
    status: "new",
    advisorFeeRate: 0.0085,
    createdAt: "2026-03-01",
    holdings: [
      { name: "SPY", type: "public_equity", value: 4_000_000 },
      { name: "QQQ", type: "public_equity", value: 3_000_000 },
      { name: "BND", type: "diversified", value: 3_000_000 },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helper: build a standard completed workflow
// ---------------------------------------------------------------------------

function completedWorkflow(
  startDate: string,
  primaryContact: string,
  custodian: string,
  fundingAmount: number
): WorkflowStep[] {
  const d = new Date(startDate)
  const offset = (days: number) => {
    const t = new Date(d)
    t.setDate(t.getDate() - days)
    return t.toISOString().slice(0, 10)
  }
  return [
    {
      label: "Proposal Created",
      status: "completed" as const,
      completedAt: offset(30),
      detail: "Created by Michael Reynolds",
    },
    {
      label: "Attorney Review",
      status: "completed" as const,
      completedAt: offset(25),
      detail: "Approved by J. Martinez, Esq.",
    },
    {
      label: "E-Signature",
      status: "completed" as const,
      completedAt: offset(20),
      detail: `Signed by ${primaryContact}`,
    },
    {
      label: "Trust Accepted",
      status: "completed" as const,
      completedAt: offset(15),
      detail: "Sava Trust Company, Nevada",
    },
    {
      label: "Funding Instructions",
      status: "completed" as const,
      completedAt: offset(10),
      detail: `Sent to ${custodian}`,
    },
    {
      label: "Trust Funded",
      status: "completed" as const,
      completedAt: offset(5),
      detail: `Funded $${fundingAmount.toLocaleString()}`,
    },
  ]
}

// Whitfield's GRAT workflow — step 6 is "active" (recently created)
function whitfieldWorkflow(
  startDate: string,
  primaryContact: string,
  custodian: string,
  fundingAmount: number
) {
  const steps = completedWorkflow(startDate, primaryContact, custodian, fundingAmount)
  // Override last step — in progress, not yet completed
  steps[5] = {
    label: "Trust Funded",
    status: "active",
    detail: `Pending — $${fundingAmount.toLocaleString()} transfer in progress`,
  }
  return steps
}

// ---------------------------------------------------------------------------
// Annuity payment amount helper (simplified IRS formula approximation)
// For a 2-year GRAT: annuity ≈ principal * hurdle / (1 - (1+hurdle)^-2)
// We pre-calculate specific values below to keep numbers clean.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// GRATs
// ---------------------------------------------------------------------------

export const grats: GRAT[] = [
  // -----------------------------------------------------------------------
  // Chen Family
  // -----------------------------------------------------------------------
  {
    id: "chen-grat-2024-q1",
    householdId: "chen",
    name: "GRAT-2024-Q1",
    status: "rolled",
    termYears: 2,
    fundingAmount: 4_000_000,
    fundingAsset: "NVDA",
    assetType: "concentrated_stock",
    startDate: "2024-03-01",
    maturityDate: "2026-03-01",
    hurdle7520Rate: 0.054,
    expectedReturn: 0.18,
    currentValue: 4_000_000,
    remainderEstimate: 0,
    rolledToId: "chen-grat-2026-q1",
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: completedWorkflow("2024-03-01", "David Chen", "Schwab", 4_000_000),
    annuityPayments: [
      {
        id: "chen-grat-2024-q1-pmt-1",
        gratId: "chen-grat-2024-q1",
        year: 1,
        dueDate: "2025-03-01",
        amount: 2_164_810,
        status: "paid",
      },
      {
        id: "chen-grat-2024-q1-pmt-2",
        gratId: "chen-grat-2024-q1",
        year: 2,
        dueDate: "2026-03-01",
        amount: 2_164_810,
        status: "paid",
      },
    ],
  },
  {
    id: "chen-grat-2024-q3",
    householdId: "chen",
    name: "GRAT-2024-Q3",
    status: "maturing",
    termYears: 2,
    fundingAmount: 3_000_000,
    fundingAsset: "NVDA",
    assetType: "concentrated_stock",
    startDate: "2024-07-01",
    maturityDate: "2026-04-18",
    hurdle7520Rate: 0.054,
    expectedReturn: 0.16,
    currentValue: 3_960_000,
    remainderEstimate: 680_000,
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: completedWorkflow("2024-07-01", "David Chen", "Schwab", 3_000_000),
    annuityPayments: [
      {
        id: "chen-grat-2024-q3-pmt-1",
        gratId: "chen-grat-2024-q3",
        year: 1,
        dueDate: "2025-07-01",
        amount: 1_623_608,
        status: "paid",
      },
      {
        id: "chen-grat-2024-q3-pmt-2",
        gratId: "chen-grat-2024-q3",
        year: 2,
        dueDate: "2026-04-18",
        amount: 1_623_608,
        status: "scheduled",
      },
    ],
  },
  {
    id: "chen-grat-2026-q1",
    householdId: "chen",
    name: "GRAT-2026-Q1",
    status: "active",
    termYears: 2,
    fundingAmount: 4_000_000,
    fundingAsset: "NVDA",
    assetType: "concentrated_stock",
    startDate: "2026-03-15",
    maturityDate: "2028-03-15",
    hurdle7520Rate: 0.054,
    expectedReturn: 0.18,
    currentValue: 4_280_000,
    remainderEstimate: 920_000,
    rolledFromId: "chen-grat-2024-q1",
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: completedWorkflow("2026-03-15", "David Chen", "Schwab", 4_000_000),
    annuityPayments: [
      {
        id: "chen-grat-2026-q1-pmt-1",
        gratId: "chen-grat-2026-q1",
        year: 1,
        dueDate: "2027-03-15",
        amount: 2_164_810,
        status: "scheduled",
      },
      {
        id: "chen-grat-2026-q1-pmt-2",
        gratId: "chen-grat-2026-q1",
        year: 2,
        dueDate: "2028-03-15",
        amount: 2_164_810,
        status: "scheduled",
      },
    ],
  },
  {
    id: "chen-grat-2025-q2",
    householdId: "chen",
    name: "GRAT-2025-Q2",
    status: "active",
    termYears: 2,
    fundingAmount: 2_500_000,
    fundingAsset: "AAPL",
    assetType: "public_equity",
    startDate: "2025-04-01",
    maturityDate: "2027-04-01",
    hurdle7520Rate: 0.05,
    expectedReturn: 0.14,
    currentValue: 2_720_000,
    remainderEstimate: 380_000,
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: completedWorkflow("2025-04-01", "David Chen", "Schwab", 2_500_000),
    annuityPayments: [
      {
        id: "chen-grat-2025-q2-pmt-1",
        gratId: "chen-grat-2025-q2",
        year: 1,
        dueDate: "2026-04-01",
        amount: 1_344_280,
        status: "paid",
      },
      {
        id: "chen-grat-2025-q2-pmt-2",
        gratId: "chen-grat-2025-q2",
        year: 2,
        dueDate: "2027-04-01",
        amount: 1_344_280,
        status: "scheduled",
      },
    ],
  },

  // -----------------------------------------------------------------------
  // Ambani Trust
  // -----------------------------------------------------------------------
  {
    id: "ambani-grat-2024-q2",
    householdId: "ambani",
    name: "GRAT-2024-Q2",
    status: "pending_rollover",
    termYears: 2,
    fundingAmount: 10_000_000,
    fundingAsset: "Vertex AI Inc.",
    assetType: "private_co",
    startDate: "2024-06-15",
    maturityDate: "2026-06-15",
    hurdle7520Rate: 0.056,
    expectedReturn: 0.22,
    currentValue: 14_200_000,
    remainderEstimate: 3_400_000,
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: completedWorkflow("2024-06-15", "Priya Ambani", "Fidelity", 10_000_000),
    annuityPayments: [
      {
        id: "ambani-grat-2024-q2-pmt-1",
        gratId: "ambani-grat-2024-q2",
        year: 1,
        dueDate: "2025-06-15",
        amount: 5_471_595,
        status: "paid",
      },
      {
        id: "ambani-grat-2024-q2-pmt-2",
        gratId: "ambani-grat-2024-q2",
        year: 2,
        dueDate: "2026-06-15",
        amount: 5_471_595,
        status: "scheduled",
      },
    ],
  },
  {
    id: "ambani-grat-2025-q1",
    householdId: "ambani",
    name: "GRAT-2025-Q1",
    status: "active",
    termYears: 2,
    fundingAmount: 8_000_000,
    fundingAsset: "QQQ",
    assetType: "public_equity",
    startDate: "2025-01-15",
    maturityDate: "2027-01-15",
    hurdle7520Rate: 0.052,
    expectedReturn: 0.15,
    currentValue: 9_100_000,
    remainderEstimate: 1_400_000,
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: completedWorkflow("2025-01-15", "Priya Ambani", "Fidelity", 8_000_000),
    annuityPayments: [
      {
        id: "ambani-grat-2025-q1-pmt-1",
        gratId: "ambani-grat-2025-q1",
        year: 1,
        dueDate: "2026-01-15",
        amount: 4_302_580,
        status: "paid",
      },
      {
        id: "ambani-grat-2025-q1-pmt-2",
        gratId: "ambani-grat-2025-q1",
        year: 2,
        dueDate: "2027-01-15",
        amount: 4_302_580,
        status: "scheduled",
      },
    ],
  },

  // -----------------------------------------------------------------------
  // Morrison Family
  // -----------------------------------------------------------------------
  {
    id: "morrison-grat-2025-q1",
    householdId: "morrison",
    name: "GRAT-2025-Q1",
    status: "underperforming",
    termYears: 2,
    fundingAmount: 4_000_000,
    fundingAsset: "Morrison RE Holdings LLC — Unit B",
    assetType: "re_llc",
    startDate: "2025-01-15",
    maturityDate: "2027-01-15",
    hurdle7520Rate: 0.05,
    expectedReturn: 0.08,
    currentValue: 3_720_000,
    remainderEstimate: -120_000,
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: completedWorkflow("2025-01-15", "James Morrison", "Pershing", 4_000_000),
    annuityPayments: [
      {
        id: "morrison-grat-2025-q1-pmt-1",
        gratId: "morrison-grat-2025-q1",
        year: 1,
        dueDate: "2026-01-15",
        amount: 2_151_290,
        status: "paid",
      },
      {
        id: "morrison-grat-2025-q1-pmt-2",
        gratId: "morrison-grat-2025-q1",
        year: 2,
        dueDate: "2027-01-15",
        amount: 2_151_290,
        status: "scheduled",
      },
    ],
  },
  {
    id: "morrison-grat-2025-q3",
    householdId: "morrison",
    name: "GRAT-2025-Q3",
    status: "active",
    termYears: 2,
    fundingAmount: 3_000_000,
    fundingAsset: "VTI",
    assetType: "diversified",
    startDate: "2025-07-01",
    maturityDate: "2027-07-01",
    hurdle7520Rate: 0.056,
    expectedReturn: 0.11,
    currentValue: 3_180_000,
    remainderEstimate: 280_000,
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: completedWorkflow("2025-07-01", "James Morrison", "Pershing", 3_000_000),
    annuityPayments: [
      {
        id: "morrison-grat-2025-q3-pmt-1",
        gratId: "morrison-grat-2025-q3",
        year: 1,
        dueDate: "2026-07-01",
        amount: 1_627_920,
        status: "scheduled",
      },
      {
        id: "morrison-grat-2025-q3-pmt-2",
        gratId: "morrison-grat-2025-q3",
        year: 2,
        dueDate: "2027-07-01",
        amount: 1_627_920,
        status: "scheduled",
      },
    ],
  },

  // -----------------------------------------------------------------------
  // Nakamura Trust
  // -----------------------------------------------------------------------
  {
    id: "nakamura-grat-2023-q1",
    householdId: "nakamura",
    name: "GRAT-2023-Q1",
    status: "rolled",
    termYears: 2,
    fundingAmount: 1_500_000,
    fundingAsset: "VTI",
    assetType: "public_equity",
    startDate: "2023-01-15",
    maturityDate: "2025-01-15",
    hurdle7520Rate: 0.048,
    expectedReturn: 0.12,
    currentValue: 1_500_000,
    remainderEstimate: 0,
    rolledToId: "nakamura-grat-2025-q1",
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: completedWorkflow("2023-01-15", "Kenji Nakamura", "Schwab", 1_500_000),
    annuityPayments: [
      {
        id: "nakamura-grat-2023-q1-pmt-1",
        gratId: "nakamura-grat-2023-q1",
        year: 1,
        dueDate: "2024-01-15",
        amount: 806_734,
        status: "paid",
      },
      {
        id: "nakamura-grat-2023-q1-pmt-2",
        gratId: "nakamura-grat-2023-q1",
        year: 2,
        dueDate: "2025-01-15",
        amount: 806_734,
        status: "paid",
      },
    ],
  },
  {
    id: "nakamura-grat-2023-q3",
    householdId: "nakamura",
    name: "GRAT-2023-Q3",
    status: "rolled",
    termYears: 2,
    fundingAmount: 1_500_000,
    fundingAsset: "AAPL",
    assetType: "public_equity",
    startDate: "2023-07-01",
    maturityDate: "2025-07-01",
    hurdle7520Rate: 0.052,
    expectedReturn: 0.14,
    currentValue: 1_500_000,
    remainderEstimate: 0,
    rolledToId: "nakamura-grat-2025-q3",
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: completedWorkflow("2023-07-01", "Kenji Nakamura", "Schwab", 1_500_000),
    annuityPayments: [
      {
        id: "nakamura-grat-2023-q3-pmt-1",
        gratId: "nakamura-grat-2023-q3",
        year: 1,
        dueDate: "2024-07-01",
        amount: 812_250,
        status: "paid",
      },
      {
        id: "nakamura-grat-2023-q3-pmt-2",
        gratId: "nakamura-grat-2023-q3",
        year: 2,
        dueDate: "2025-07-01",
        amount: 812_250,
        status: "paid",
      },
    ],
  },
  {
    id: "nakamura-grat-2025-q1",
    householdId: "nakamura",
    name: "GRAT-2025-Q1",
    status: "active",
    termYears: 2,
    fundingAmount: 1_800_000,
    fundingAsset: "VTI",
    assetType: "public_equity",
    startDate: "2025-01-15",
    maturityDate: "2027-01-15",
    hurdle7520Rate: 0.052,
    expectedReturn: 0.11,
    currentValue: 1_920_000,
    remainderEstimate: 220_000,
    rolledFromId: "nakamura-grat-2023-q1",
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: completedWorkflow("2025-01-15", "Kenji Nakamura", "Schwab", 1_800_000),
    annuityPayments: [
      {
        id: "nakamura-grat-2025-q1-pmt-1",
        gratId: "nakamura-grat-2025-q1",
        year: 1,
        dueDate: "2026-01-15",
        amount: 968_081,
        status: "paid",
      },
      {
        id: "nakamura-grat-2025-q1-pmt-2",
        gratId: "nakamura-grat-2025-q1",
        year: 2,
        dueDate: "2027-01-15",
        amount: 968_081,
        status: "scheduled",
      },
    ],
  },
  {
    id: "nakamura-grat-2025-q3",
    householdId: "nakamura",
    name: "GRAT-2025-Q3",
    status: "active",
    termYears: 2,
    fundingAmount: 1_800_000,
    fundingAsset: "AAPL",
    assetType: "public_equity",
    startDate: "2025-07-01",
    maturityDate: "2027-07-01",
    hurdle7520Rate: 0.054,
    expectedReturn: 0.13,
    currentValue: 1_940_000,
    remainderEstimate: 260_000,
    rolledFromId: "nakamura-grat-2023-q3",
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: completedWorkflow("2025-07-01", "Kenji Nakamura", "Schwab", 1_800_000),
    annuityPayments: [
      {
        id: "nakamura-grat-2025-q3-pmt-1",
        gratId: "nakamura-grat-2025-q3",
        year: 1,
        dueDate: "2026-07-01",
        amount: 975_892,
        status: "scheduled",
      },
      {
        id: "nakamura-grat-2025-q3-pmt-2",
        gratId: "nakamura-grat-2025-q3",
        year: 2,
        dueDate: "2027-07-01",
        amount: 975_892,
        status: "scheduled",
      },
    ],
  },
  {
    id: "nakamura-grat-2026-q1",
    householdId: "nakamura",
    name: "GRAT-2026-Q1",
    status: "active",
    termYears: 2,
    fundingAmount: 2_000_000,
    fundingAsset: "BND",
    assetType: "diversified",
    startDate: "2026-01-15",
    maturityDate: "2028-01-15",
    hurdle7520Rate: 0.05,
    expectedReturn: 0.07,
    currentValue: 2_060_000,
    remainderEstimate: 80_000,
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: completedWorkflow("2026-01-15", "Kenji Nakamura", "Schwab", 2_000_000),
    annuityPayments: [
      {
        id: "nakamura-grat-2026-q1-pmt-1",
        gratId: "nakamura-grat-2026-q1",
        year: 1,
        dueDate: "2027-01-15",
        amount: 1_075_610,
        status: "scheduled",
      },
      {
        id: "nakamura-grat-2026-q1-pmt-2",
        gratId: "nakamura-grat-2026-q1",
        year: 2,
        dueDate: "2028-01-15",
        amount: 1_075_610,
        status: "scheduled",
      },
    ],
  },
  {
    id: "nakamura-grat-2026-q3",
    householdId: "nakamura",
    name: "GRAT-2026-Q3",
    status: "active",
    termYears: 2,
    fundingAmount: 2_000_000,
    fundingAsset: "VXUS",
    assetType: "diversified",
    startDate: "2026-04-01",
    maturityDate: "2028-04-01",
    hurdle7520Rate: 0.052,
    expectedReturn: 0.1,
    currentValue: 2_020_000,
    remainderEstimate: 160_000,
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: completedWorkflow("2026-04-01", "Kenji Nakamura", "Schwab", 2_000_000),
    annuityPayments: [
      {
        id: "nakamura-grat-2026-q3-pmt-1",
        gratId: "nakamura-grat-2026-q3",
        year: 1,
        dueDate: "2027-04-01",
        amount: 1_081_195,
        status: "scheduled",
      },
      {
        id: "nakamura-grat-2026-q3-pmt-2",
        gratId: "nakamura-grat-2026-q3",
        year: 2,
        dueDate: "2028-04-01",
        amount: 1_081_195,
        status: "scheduled",
      },
    ],
  },

  // -----------------------------------------------------------------------
  // Whitfield Family
  // -----------------------------------------------------------------------
  {
    id: "whitfield-grat-2026-q2",
    householdId: "whitfield",
    name: "GRAT-2026-Q2",
    status: "active",
    termYears: 2,
    fundingAmount: 5_000_000,
    fundingAsset: "SPY",
    assetType: "public_equity",
    startDate: "2026-04-01",
    maturityDate: "2028-04-01",
    hurdle7520Rate: 0.052,
    expectedReturn: 0.12,
    currentValue: 5_050_000,
    remainderEstimate: 420_000,
    trustee: "Sava Trust Company",
    jurisdiction: "Nevada",
    attorneyName: "J. Martinez, Esq.",
    workflow: whitfieldWorkflow("2026-04-01", "Sarah Whitfield", "Fidelity", 5_000_000),
    annuityPayments: [
      {
        id: "whitfield-grat-2026-q2-pmt-1",
        gratId: "whitfield-grat-2026-q2",
        year: 1,
        dueDate: "2027-04-01",
        amount: 2_702_990,
        status: "scheduled",
      },
      {
        id: "whitfield-grat-2026-q2-pmt-2",
        gratId: "whitfield-grat-2026-q2",
        year: 2,
        dueDate: "2028-04-01",
        amount: 2_702_990,
        status: "scheduled",
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Rollover Proposals
// ---------------------------------------------------------------------------

export const rolloverProposals: RolloverProposal[] = [
  {
    id: "rp-ambani-2024-q2",
    sourceGratId: "ambani-grat-2024-q2",
    householdId: "ambani",
    proposedFundingAmount: 10_000_000,
    proposedTerm: 2,
    proposedAsset: "Vertex AI Inc.",
    proposedAssetType: "private_co",
    current7520Rate: 0.052,
    recommendation:
      "Current 7520 rate (5.20%) is below 12-month average. Rolling now locks in favorable conditions.",
    status: "pending",
    createdAt: "2026-04-05",
  },
  {
    id: "rp-chen-2024-q3",
    sourceGratId: "chen-grat-2024-q3",
    householdId: "chen",
    proposedFundingAmount: 3_000_000,
    proposedTerm: 2,
    proposedAsset: "NVDA",
    proposedAssetType: "concentrated_stock",
    current7520Rate: 0.052,
    recommendation:
      "GRAT-2024-Q3 maturing Apr 18. Remainder of ~$680K available for tax-free transfer. Recommend rolling into new 2-year GRAT.",
    status: "pending",
    createdAt: "2026-04-08",
  },
]

// ---------------------------------------------------------------------------
// Activities
// ---------------------------------------------------------------------------

export const activities: Activity[] = [
  {
    id: "act-001",
    householdId: "whitfield",
    type: "trust_accepted",
    description:
      "Sava Trust Company accepted GRAT-2026-Q2 for Whitfield Family",
    timestamp: "2026-04-07T09:15:00Z",
  },
  {
    id: "act-002",
    householdId: "chen",
    type: "rollover_proposed",
    description:
      "Rollover proposal generated for Chen Family GRAT-2024-Q3 — maturing Apr 18",
    timestamp: "2026-04-08T08:30:00Z",
  },
  {
    id: "act-003",
    householdId: "ambani",
    type: "rollover_proposed",
    description:
      "Rollover proposal generated for Ambani Trust GRAT-2024-Q2 — $3.4M remainder projected",
    timestamp: "2026-04-05T11:00:00Z",
  },
  {
    id: "act-004",
    householdId: "whitfield",
    type: "grat_created",
    description:
      "GRAT-2026-Q2 created for Whitfield Family — $5,000,000 in SPY",
    timestamp: "2026-04-01T14:22:00Z",
  },
  {
    id: "act-005",
    householdId: "nakamura",
    type: "grat_created",
    description:
      "GRAT-2026-Q3 created for Nakamura Trust — $2,000,000 in VXUS",
    timestamp: "2026-04-01T10:05:00Z",
  },
  {
    id: "act-006",
    householdId: "chen",
    type: "annuity_paid",
    description:
      "Annuity payment of $2,164,810 paid for Chen Family GRAT-2024-Q1 — Year 2",
    timestamp: "2026-03-01T09:00:00Z",
  },
  {
    id: "act-007",
    householdId: "chen",
    type: "grat_created",
    description:
      "GRAT-2026-Q1 created for Chen Family — $4,000,000 in NVDA (rollover from GRAT-2024-Q1)",
    timestamp: "2026-03-15T13:45:00Z",
  },
  {
    id: "act-008",
    householdId: "nakamura",
    type: "grat_created",
    description:
      "GRAT-2026-Q1 created for Nakamura Trust — $2,000,000 in BND",
    timestamp: "2026-01-15T10:30:00Z",
  },
  {
    id: "act-009",
    householdId: "ambani",
    type: "annuity_paid",
    description:
      "Annuity payment of $4,302,580 paid for Ambani Trust GRAT-2025-Q1 — Year 1",
    timestamp: "2026-01-15T09:00:00Z",
  },
  {
    id: "act-010",
    householdId: "morrison",
    type: "annuity_paid",
    description:
      "Annuity payment of $2,151,290 paid for Morrison Family GRAT-2025-Q1 — Year 1",
    timestamp: "2026-01-15T09:00:00Z",
  },
  {
    id: "act-011",
    householdId: "nakamura",
    type: "annuity_paid",
    description:
      "Annuity payment of $968,081 paid for Nakamura Trust GRAT-2025-Q1 — Year 1",
    timestamp: "2026-01-15T09:00:00Z",
  },
  {
    id: "act-012",
    householdId: "chen",
    type: "annuity_paid",
    description:
      "Annuity payment of $2,681,190 paid for Chen Family GRAT-2024-Q3 — Year 1",
    timestamp: "2025-07-01T09:00:00Z",
  },
  {
    id: "act-013",
    householdId: "nakamura",
    type: "grat_created",
    description:
      "GRAT-2025-Q3 created for Nakamura Trust — $1,800,000 in AAPL (rollover from GRAT-2023-Q3)",
    timestamp: "2025-07-01T10:00:00Z",
  },
  {
    id: "act-014",
    householdId: "nakamura",
    type: "rollover_approved",
    description:
      "Rollover approved — GRAT-2023-Q3 remainder transferred to GRAT-2025-Q3 for Nakamura Trust",
    timestamp: "2025-06-20T11:00:00Z",
  },
  {
    id: "act-015",
    householdId: "chen",
    type: "grat_created",
    description:
      "GRAT-2025-Q2 created for Chen Family — $2,500,000 in AAPL",
    timestamp: "2025-04-01T09:30:00Z",
  },
  {
    id: "act-016",
    householdId: "nakamura",
    type: "grat_created",
    description:
      "GRAT-2025-Q1 created for Nakamura Trust — $1,800,000 in VTI (rollover from GRAT-2023-Q1)",
    timestamp: "2025-01-15T10:00:00Z",
  },
  {
    id: "act-017",
    householdId: "nakamura",
    type: "rollover_approved",
    description:
      "Rollover approved — GRAT-2023-Q1 remainder transferred to GRAT-2025-Q1 for Nakamura Trust",
    timestamp: "2025-01-08T11:00:00Z",
  },
  {
    id: "act-018",
    householdId: "ambani",
    type: "valuation_requested",
    description:
      "Updated valuation requested for Vertex AI Inc. — last valuation Jan 6, 2026 (95 days ago)",
    timestamp: "2026-04-10T08:00:00Z",
  },
]

// ---------------------------------------------------------------------------
// Trust Documents
// ---------------------------------------------------------------------------

export const trustDocuments: TrustDocument[] = [
  // --- Chen Family (deep set: 7 docs) ---
  {
    id: "doc-chen-001",
    gratId: "chen-grat-2024-q1",
    householdId: "chen",
    name: "Trust Instrument — GRAT-2024-Q1",
    type: "trust_instrument",
    date: "2024-01-30",
    downloadable: false,
  },
  {
    id: "doc-chen-002",
    gratId: "chen-grat-2024-q3",
    householdId: "chen",
    name: "Trust Instrument — GRAT-2024-Q3",
    type: "trust_instrument",
    date: "2024-06-05",
    downloadable: false,
  },
  {
    id: "doc-chen-003",
    householdId: "chen",
    name: "Form 709 — Gift Tax Return (2024)",
    type: "form_709",
    date: "2025-04-10",
    downloadable: false,
  },
  {
    id: "doc-chen-004",
    gratId: "chen-grat-2024-q1",
    householdId: "chen",
    name: "Trust Income Tax Return — GRAT-2024-Q1 (2024)",
    type: "trust_return",
    date: "2025-03-15",
    downloadable: false,
  },
  {
    id: "doc-chen-005",
    gratId: "chen-grat-2024-q1",
    householdId: "chen",
    name: "Annuity Payment Confirmation — GRAT-2024-Q1 — Q1 2025",
    type: "annuity_confirmation",
    date: "2025-03-05",
    downloadable: false,
  },
  {
    id: "doc-chen-006",
    gratId: "chen-grat-2024-q3",
    householdId: "chen",
    name: "Funding Instructions — GRAT-2024-Q3 — Schwab",
    type: "funding_instructions",
    date: "2024-06-21",
    downloadable: false,
  },
  {
    id: "doc-chen-007",
    gratId: "chen-grat-2026-q1",
    householdId: "chen",
    name: "Trust Instrument — GRAT-2026-Q1",
    type: "trust_instrument",
    date: "2026-02-13",
    downloadable: false,
  },

  // --- Ambani Trust (3 docs) ---
  {
    id: "doc-ambani-001",
    gratId: "ambani-grat-2024-q2",
    householdId: "ambani",
    name: "Trust Instrument — GRAT-2024-Q2",
    type: "trust_instrument",
    date: "2024-05-15",
    downloadable: false,
  },
  {
    id: "doc-ambani-002",
    householdId: "ambani",
    name: "Form 709 — Gift Tax Return (2024)",
    type: "form_709",
    date: "2025-04-10",
    downloadable: false,
  },
  {
    id: "doc-ambani-003",
    gratId: "ambani-grat-2024-q2",
    householdId: "ambani",
    name: "Funding Instructions — GRAT-2024-Q2 — Fidelity",
    type: "funding_instructions",
    date: "2024-06-05",
    downloadable: false,
  },

  // --- Morrison Family (3 docs) ---
  {
    id: "doc-morrison-001",
    gratId: "morrison-grat-2025-q1",
    householdId: "morrison",
    name: "Trust Instrument — GRAT-2025-Q1",
    type: "trust_instrument",
    date: "2024-12-17",
    downloadable: false,
  },
  {
    id: "doc-morrison-002",
    householdId: "morrison",
    name: "Form 709 — Gift Tax Return (2025)",
    type: "form_709",
    date: "2026-04-01",
    downloadable: false,
  },
  {
    id: "doc-morrison-003",
    gratId: "morrison-grat-2025-q1",
    householdId: "morrison",
    name: "Funding Instructions — GRAT-2025-Q1 — Pershing",
    type: "funding_instructions",
    date: "2025-01-05",
    downloadable: false,
  },

  // --- Nakamura Trust (deep set: 8 docs) ---
  {
    id: "doc-nakamura-001",
    gratId: "nakamura-grat-2023-q1",
    householdId: "nakamura",
    name: "Trust Instrument — GRAT-2023-Q1",
    type: "trust_instrument",
    date: "2022-12-16",
    downloadable: false,
  },
  {
    id: "doc-nakamura-002",
    gratId: "nakamura-grat-2023-q3",
    householdId: "nakamura",
    name: "Trust Instrument — GRAT-2023-Q3",
    type: "trust_instrument",
    date: "2023-06-05",
    downloadable: false,
  },
  {
    id: "doc-nakamura-003",
    householdId: "nakamura",
    name: "Form 709 — Gift Tax Return (2023)",
    type: "form_709",
    date: "2024-04-10",
    downloadable: false,
  },
  {
    id: "doc-nakamura-004",
    householdId: "nakamura",
    name: "Form 709 — Gift Tax Return (2025)",
    type: "form_709",
    date: "2026-04-01",
    downloadable: false,
  },
  {
    id: "doc-nakamura-005",
    gratId: "nakamura-grat-2023-q1",
    householdId: "nakamura",
    name: "Trust Income Tax Return — GRAT-2023-Q1 (2023)",
    type: "trust_return",
    date: "2024-03-12",
    downloadable: false,
  },
  {
    id: "doc-nakamura-006",
    gratId: "nakamura-grat-2023-q1",
    householdId: "nakamura",
    name: "Annuity Payment Confirmation — GRAT-2023-Q1 — Q1 2024",
    type: "annuity_confirmation",
    date: "2024-01-18",
    downloadable: false,
  },
  {
    id: "doc-nakamura-007",
    gratId: "nakamura-grat-2023-q3",
    householdId: "nakamura",
    name: "Annuity Payment Confirmation — GRAT-2023-Q3 — Q3 2024",
    type: "annuity_confirmation",
    date: "2024-07-05",
    downloadable: false,
  },
  {
    id: "doc-nakamura-008",
    gratId: "nakamura-grat-2025-q1",
    householdId: "nakamura",
    name: "Funding Instructions — GRAT-2025-Q1 — Schwab",
    type: "funding_instructions",
    date: "2025-01-05",
    downloadable: false,
  },

  // --- Whitfield Family (2 docs) ---
  {
    id: "doc-whitfield-001",
    gratId: "whitfield-grat-2026-q2",
    householdId: "whitfield",
    name: "Trust Instrument — GRAT-2026-Q2",
    type: "trust_instrument",
    date: "2026-03-02",
    downloadable: false,
  },
  {
    id: "doc-whitfield-002",
    gratId: "whitfield-grat-2026-q2",
    householdId: "whitfield",
    name: "Funding Instructions — GRAT-2026-Q2 — Fidelity",
    type: "funding_instructions",
    date: "2026-03-22",
    downloadable: false,
  },
]

// ---------------------------------------------------------------------------
// Rate History
// ---------------------------------------------------------------------------

export const rateHistory: RateDataPoint[] = [
  { month: "Apr 2024", rate: 0.056 },
  { month: "May 2024", rate: 0.054 },
  { month: "Jun 2024", rate: 0.052 },
  { month: "Jul 2024", rate: 0.054 },
  { month: "Aug 2024", rate: 0.056 },
  { month: "Sep 2024", rate: 0.058 },
  { month: "Oct 2024", rate: 0.058 },
  { month: "Nov 2024", rate: 0.056 },
  { month: "Dec 2024", rate: 0.054 },
  { month: "Jan 2025", rate: 0.052 },
  { month: "Feb 2025", rate: 0.05 },
  { month: "Mar 2025", rate: 0.048 },
  { month: "Apr 2025", rate: 0.05 },
  { month: "May 2025", rate: 0.052 },
  { month: "Jun 2025", rate: 0.054 },
  { month: "Jul 2025", rate: 0.056 },
  { month: "Aug 2025", rate: 0.056 },
  { month: "Sep 2025", rate: 0.054 },
  { month: "Oct 2025", rate: 0.056 },
  { month: "Nov 2025", rate: 0.054 },
  { month: "Dec 2025", rate: 0.052 },
  { month: "Jan 2026", rate: 0.05 },
  { month: "Feb 2026", rate: 0.054 },
  { month: "Mar 2026", rate: 0.054 },
  { month: "Apr 2026", rate: 0.052 },
]

export const currentRate: number = 0.052
