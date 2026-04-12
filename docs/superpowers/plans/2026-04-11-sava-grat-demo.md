# Sava Auto-GRAT Demo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully interactive demo of Sava's Auto-GRAT platform that shows a wealth management advisor what the product looks like — complete with live GRAT modeling, rollover approval, asset substitution, and Sava Trust Company presence throughout.

**Architecture:** Next.js 16 App Router with server actions mutating an in-memory store seeded from JSON fixtures. No database, no auth. Client components for interactive elements (modeling sliders, charts), server components for data display. Recharts for visualizations.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Recharts, Manrope + Geist fonts, Material Symbols Outlined icons, Bun

**Design System:** See `DESIGN.md` at project root — deep navy sidebar, no-line rule, tonal layering, Manrope headlines, Geist Sans/Mono body/data.

**Spec:** See `docs/superpowers/specs/2026-04-11-sava-grat-demo-design.md`

---

## File Map

### Foundation Layer
| File | Responsibility |
|------|---------------|
| `app/globals.css` | Tailwind import + all design tokens (colors, fonts, spacing, scrollbar) |
| `app/layout.tsx` | Root layout: Manrope + Geist fonts, HTML shell, AppShell wrapper |
| `app/page.tsx` | Redirect to `/dashboard` |
| `lib/types.ts` | All TypeScript type definitions |
| `lib/format.ts` | Currency, percentage, date formatting utilities |
| `lib/grat_math.ts` | GRAT calculation engine (PV, annuities, projections, risk profile) |

### Data Layer
| File | Responsibility |
|------|---------------|
| `lib/data/fixtures.ts` | All mock data: 5 households, their GRATs, annuity payments, rollover proposals, activities, documents, rate history |
| `lib/data/store.ts` | In-memory mutable store: load from fixtures, expose getters |
| `lib/data/actions.ts` | Server actions: approveRollover, createGrat, executeSubstitution, requestValuation, resetDemo |

### Layout Components
| File | Responsibility |
|------|---------------|
| `components/layout/sidebar.tsx` | Navy sidebar: Sava logo, nav items, user profile |
| `components/layout/header.tsx` | Top header bar: breadcrumbs, page title, 7520 rate badge, actions |
| `components/layout/app_shell.tsx` | Composes sidebar + header + scrollable content area |
| `components/layout/sava_footer.tsx` | "Administered by Sava Trust Company · Nevada Trust Charter" |

### UI Components
| File | Responsibility |
|------|---------------|
| `components/ui/stat_card.tsx` | Hero (gradient) and light stat card variants |
| `components/ui/status_pill.tsx` | Color-coded status pills with signal dots |
| `components/ui/asset_type_badge.tsx` | Asset type pills: Public Equity, Private Co., RE LLC, PE Fund |
| `components/ui/workflow_tracker.tsx` | 6-step trust execution timeline |
| `components/ui/metric_block.tsx` | Simple label + value block for use in modals |

### Pages
| File | Responsibility |
|------|---------------|
| `app/dashboard/page.tsx` | Dashboard: stat cards, needs attention, activity feed |
| `app/clients/page.tsx` | Client household list table |
| `app/clients/[id]/page.tsx` | Client detail: header, metrics, tabbed content |
| `app/clients/[id]/components/client_header.tsx` | Client name, custodian, trustee, action buttons |
| `app/clients/[id]/components/grat_ladder.tsx` | GRAT table + expandable workflow tracker |
| `app/clients/[id]/components/grat_timeline.tsx` | Gantt-style rolling strategy visualization (Recharts) |
| `app/clients/[id]/components/cumulative_chart.tsx` | Area chart of wealth transferred over time (Recharts) |
| `app/clients/[id]/components/annuity_schedule.tsx` | Annuity payment timeline table |
| `app/clients/[id]/components/client_history.tsx` | Activity feed filtered to household |
| `app/clients/[id]/components/tax_documents.tsx` | Tax & Documents listing |
| `app/modeling/page.tsx` | GRAT modeling page shell |
| `app/modeling/components/parameter_form.tsx` | Left panel: client, amount, term, asset, return inputs |
| `app/modeling/components/projection_panel.tsx` | Right panel: projected outcome + annuity schedule |
| `app/modeling/components/risk_profile.tsx` | "Free option" win/no-lose comparison card |
| `app/reports/page.tsx` | Reports: metrics, per-client table, advisor impact, Sava summary |
| `app/reports/components/advisor_impact.tsx` | "Your Practice Economics" card |
| `app/rate_monitor/page.tsx` | 7520 rate monitor: current rate, chart, impact analysis |
| `app/settings/page.tsx` | Settings: firm profile, defaults, Reset Demo button |

### Interactive Flows
| File | Responsibility |
|------|---------------|
| `components/ui/rollover_modal.tsx` | Rollover approval modal/sheet |
| `components/ui/substitution_modal.tsx` | Asset substitution modal/sheet |
| `components/ui/valuation_modal.tsx` | Stale valuation request modal |
| `components/ui/modal_shell.tsx` | Glassmorphism overlay container |
| `components/ui/toast.tsx` | Toast notification component |

---

## Task Breakdown

### Task 1: Project Setup — Dependencies & Design Tokens

**Files:**
- Modify: `package.json`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/nimit/conductor/workspaces/sava-grat-demo/buffalo
bun add recharts
```

- [ ] **Step 2: Add Manrope font and Material Symbols to layout.tsx**

Read the Next.js docs at `node_modules/next/dist/docs/` for the `next/font/google` API to confirm syntax. Then update `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Manrope } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Sava Auto-GRAT Platform",
  description: "Automated Rolling GRAT Administration — Sava Trust Company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-background text-on-background font-body">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Replace globals.css with full design token system**

Replace `app/globals.css` with the complete design token configuration. Reference `DESIGN.md` section 11 (Tailwind Configuration Reference) for all color values. The file should:

1. Import Tailwind
2. Define the `@theme inline` block with all color tokens, font families, border-radius scale, and letter-spacing tokens from DESIGN.md
3. Add base styles for body, headings (font-manrope), and custom scrollbar
4. Remove the dark mode media query (this demo is light-only)

All color tokens from DESIGN.md section 2 go into the `@theme inline` block. Font families: `--font-headline: var(--font-manrope)`, `--font-body: var(--font-geist-sans)`, `--font-mono: var(--font-geist-mono)`.

- [ ] **Step 4: Verify the dev server starts**

```bash
bun run dev
```

Open `http://localhost:3000` — should show the current page with the new background color (#fbf9f8).

- [ ] **Step 5: Commit**

```bash
git add package.json bun.lock app/globals.css app/layout.tsx
git commit -m "Set up design tokens, fonts, and dependencies"
```

---

### Task 2: Type Definitions

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Create type definitions**

Create `lib/types.ts` with all types from the spec's Data Model section. This includes: `AssetType`, `AssetHolding`, `Household`, `WorkflowStep`, `GRAT`, `AnnuityPayment`, `RolloverProposal`, `Activity`, `TrustDocument`, `RateDataPoint`, `CumulativeTransferPoint`. Copy types exactly as defined in the spec — they are complete and correct.

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit lib/types.ts
```

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "Add type definitions for GRAT data model"
```

---

### Task 3: Formatting Utilities

**Files:**
- Create: `lib/format.ts`

- [ ] **Step 1: Create formatting utilities**

Create `lib/format.ts` with these functions:

```typescript
/** Format as $1,234,567 (no decimals for values >= 1000) */
export function formatCurrency(value: number): string

/** Format as $1.2M or $680K for display metrics */
export function formatCompactCurrency(value: number): string

/** Format as 5.20% (one decimal place) */
export function formatPercent(value: number): string

/** Format as +8.3% or -2.1% with sign */
export function formatPercentChange(value: number): string

/** Format as "Apr 11, 2026" */
export function formatDate(dateStr: string): string

/** Format as "Apr 2026" */
export function formatMonthYear(dateStr: string): string

/** Days between two dates */
export function daysBetween(date1: string, date2: string): number
```

Use `Intl.NumberFormat` for currency. No external date library — the mock dates are simple ISO strings and `Date` is sufficient.

- [ ] **Step 2: Commit**

```bash
git add lib/format.ts
git commit -m "Add formatting utilities for currency, percent, dates"
```

---

### Task 4: GRAT Math Engine

**Files:**
- Create: `lib/grat_math.ts`

- [ ] **Step 1: Create the GRAT calculation engine**

Create `lib/grat_math.ts` with these functions:

```typescript
import type { AnnuityPayment } from "./types"

/** Present value annuity factor: (1 - (1 + r)^(-n)) / r */
export function pvAnnuityFactor(rate: number, years: number): number

/**
 * Calculate zeroed-out annuity payment for a GRAT.
 * Total PV of payments must equal funding amount.
 * Returns the annual payment amount.
 */
export function calculateAnnuityPayment(fundingAmount: number, rate7520: number, termYears: number): number

/** Project the GRAT end value: funding * (1 + expectedReturn)^term */
export function projectEndValue(fundingAmount: number, expectedReturn: number, termYears: number): number

/** Calculate remainder (tax-free transfer): endValue - sum of annuity payments */
export function calculateRemainder(endValue: number, annualPayment: number, termYears: number): number

/** Gift tax saved at 40% rate */
export function calculateTaxSaved(remainder: number): number

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
): AnnuityPayment[]
```

Implementation notes:
- `pvAnnuityFactor`: `(1 - Math.pow(1 + rate, -years)) / rate`
- `calculateAnnuityPayment`: `fundingAmount / pvAnnuityFactor(rate, years)`
- `savaAdminFee`: `fundingAmount * 0.0025` (0.25% annually)
- `advisorAumFee`: `fundingAmount * advisorFeeRate`
- `excessOverHurdle`: `(expectedReturn - rate7520) * 100` expressed as percentage points

- [ ] **Step 2: Commit**

```bash
git add lib/grat_math.ts
git commit -m "Add GRAT math engine for projections and annuity calculations"
```

---

### Task 5: Mock Data Fixtures

**Files:**
- Create: `lib/data/fixtures.ts`

- [ ] **Step 1: Create fixture data**

Create `lib/data/fixtures.ts` with all mock data. This is the largest single file. It exports:

```typescript
import type { Household, GRAT, RolloverProposal, Activity, TrustDocument, RateDataPoint } from "../types"

export const households: Household[]        // 5 archetypes from spec
export const grats: GRAT[]                  // ~12 GRATs across all households
export const rolloverProposals: RolloverProposal[]  // 1-2 pending
export const activities: Activity[]          // 15-20 recent activities
export const trustDocuments: TrustDocument[] // 10-15 documents
export const rateHistory: RateDataPoint[]   // 24 months of 7520 rates
export const currentRate: number            // 0.052 (5.20%)
```

Follow the spec's "5 Client Archetypes" section exactly for household data. Each GRAT needs a complete `workflow` array with 6 steps (all completed for existing GRATs). Key data points:

**Chen Family (id: "chen"):** 3 active GRATs + 1 maturing (GRAT-2024-Q3, maturity Apr 18) + 1 historical rolled GRAT. Holdings: NVDA (concentrated_stock), AAPL (public_equity), VTI (diversified). Advisor fee: 0.85%.

**Ambani Trust (id: "ambani"):** 2 active GRATs + 1 rollover proposal pending. Holdings: Vertex AI Inc. (private_co, lastValuationDate 90+ days ago, valuationStale: true), QQQ (public_equity), BND (diversified). Advisor fee: 0.75%.

**Morrison Family (id: "morrison"):** 2 active GRATs, 1 underperforming. Holdings: Morrison RE Holdings LLC — Unit B (re_llc), Morrison RE Holdings LLC — Unit D (re_llc), VTI (diversified). Advisor fee: 0.90%.

**Nakamura Trust (id: "nakamura"):** 4 active GRATs in staggered rolling ladder + 2 historical rolled GRATs. Holdings: VTI, BND, AAPL, VXUS (all public_equity/diversified). Advisor fee: 0.80%.

**Whitfield Family (id: "whitfield"):** 1 active GRAT, recently created. Holdings: SPY, QQQ, BND (all public_equity/diversified). Advisor fee: 0.85%.

Rate history: use exact values from spec section "7520 Rate Data". Activities should include Sava-sourced events ("Trust accepted by Sava Trust Company").

Trust documents: generate realistic doc entries per spec's Tax & Documents section for Chen and Nakamura (the two deep clients). Other households get 2-3 docs each.

- [ ] **Step 2: Commit**

```bash
git add lib/data/fixtures.ts
git commit -m "Add mock data fixtures for 5 client archetypes"
```

---

### Task 6: In-Memory Store

**Files:**
- Create: `lib/data/store.ts`

- [ ] **Step 1: Create the mutable in-memory store**

Create `lib/data/store.ts`:

```typescript
import { households as fixtureHouseholds, grats as fixtureGrats, /* ...all fixture imports */ } from "./fixtures"
import type { Household, GRAT, RolloverProposal, Activity, TrustDocument, RateDataPoint } from "../types"

// Mutable copies — initialized from fixtures
let households: Household[] = structuredClone(fixtureHouseholds)
let grats: GRAT[] = structuredClone(fixtureGrats)
let rolloverProposals: RolloverProposal[] = structuredClone(/* ... */)
let activities: Activity[] = structuredClone(/* ... */)
let trustDocuments: TrustDocument[] = structuredClone(/* ... */)

// Getters
export function getHouseholds(): Household[]
export function getHousehold(id: string): Household | undefined
export function getGratsByHousehold(householdId: string): GRAT[]
export function getGrat(id: string): GRAT | undefined
export function getActiveGrats(): GRAT[]
export function getPendingRollovers(): RolloverProposal[]
export function getRolloverProposal(id: string): RolloverProposal | undefined
export function getActivities(householdId?: string): Activity[]
export function getDocuments(householdId: string): TrustDocument[]
export function getRateHistory(): RateDataPoint[]
export function getCurrentRate(): number
export function getNeedsAttention(): Array<{ household: Household; description: string; action: string; type: "maturing" | "rollover" | "underperforming" | "valuation" }>
export function getDashboardStats(): { activeGrats: number; wealthTransferred: number; pendingRollovers: number; totalHouseholds: number; totalAUM: number }

// Mutators (called by server actions)
export function addGrat(grat: GRAT): void
export function updateGrat(id: string, updates: Partial<GRAT>): void
export function updateHousehold(id: string, updates: Partial<Household>): void
export function updateRolloverProposal(id: string, updates: Partial<RolloverProposal>): void
export function addActivity(activity: Activity): void
export function resetStore(): void  // Reload all fixtures via structuredClone
```

`getNeedsAttention()` scans GRATs for maturing (maturityDate within 30 days), pending rollovers, underperforming status, and stale valuations. Returns sorted by urgency.

- [ ] **Step 2: Commit**

```bash
git add lib/data/store.ts
git commit -m "Add in-memory mutable store with getters and mutators"
```

---

### Task 7: Server Actions

**Files:**
- Create: `lib/data/actions.ts`

- [ ] **Step 1: Create server actions**

Create `lib/data/actions.ts` with `"use server"` directive at top:

```typescript
"use server"

import { revalidatePath } from "next/cache"
import * as store from "./store"
import { generateAnnuitySchedule, calculateAnnuityPayment } from "../grat_math"
import type { GRAT, WorkflowStep } from "../types"

export async function approveRollover(proposalId: string): Promise<void>
// 1. Get proposal from store
// 2. Update source GRAT: status → "rolled", set rolledToId
// 3. Create new GRAT with: status "active", rolledFromId, new workflow steps (all completed),
//    annuity schedule generated from grat_math, trustee "Sava Trust Company", jurisdiction "Nevada"
// 4. Update proposal status → "approved"
// 5. Add activities: "Rollover approved", "Trust accepted by Sava Trust Company"
// 6. revalidatePath("/") to refresh all pages

export async function declineRollover(proposalId: string): Promise<void>
// Update proposal status → "declined", add activity, revalidatePath

export async function createGrat(params: {
  householdId: string
  fundingAmount: number
  termYears: number
  fundingAsset: string
  assetType: AssetType
  expectedReturn: number
  rate7520: number
}): Promise<void>
// 1. Generate GRAT ID (e.g., "GRAT-2026-Q2")
// 2. Calculate annuity payment from grat_math
// 3. Generate annuity schedule
// 4. Create GRAT with full workflow steps (all completed with timestamps)
// 5. Add activities: "GRAT created", "Trust accepted by Sava Trust Company"
// 6. revalidatePath("/")

export async function executeSubstitution(
  gratId: string,
  newAsset: string,
  newAssetType: AssetType,
  fmv: number
): Promise<void>
// 1. Update GRAT: fundingAsset, assetType, status → "active"
// 2. Add activity: "Asset substitution validated by Sava Trust Company"
// 3. revalidatePath("/")

export async function requestValuation(householdId: string, assetName: string): Promise<void>
// 1. Add activity: "Valuation update requested — Sava Trust Company coordinating"
// 2. revalidatePath("/")

export async function resetDemo(): Promise<void>
// 1. store.resetStore()
// 2. revalidatePath("/")
```

- [ ] **Step 2: Commit**

```bash
git add lib/data/actions.ts
git commit -m "Add server actions for rollover, creation, substitution, reset"
```

---

### Task 8: UI Components — Stat Card, Status Pill, Asset Badge

**Files:**
- Create: `components/ui/stat_card.tsx`
- Create: `components/ui/status_pill.tsx`
- Create: `components/ui/asset_type_badge.tsx`
- Create: `components/ui/metric_block.tsx`

- [ ] **Step 1: Create StatCard component**

Create `components/ui/stat_card.tsx` — a client component (`"use client"`) with two variants:

```typescript
type StatCardProps = {
  label: string
  value: string
  trend?: string
  trendDirection?: "up" | "down" | "neutral"
  variant: "hero" | "light"
  icon?: string // Material Symbols icon name
}
```

**Hero variant:** `bg-gradient-to-br from-primary to-primary-container`, white text, label in `text-[10px] font-bold uppercase tracking-[0.08em] opacity-60`, value in `font-headline text-5xl font-extrabold tracking-tightest`, decorative blur circle.

**Light variant:** `bg-surface-container-lowest`, border `outline-variant/10`, same label/value treatment but with `text-primary` for value and `text-on-surface-variant` for label.

Follow DESIGN.md section 6 "Stat Cards" exactly for classes.

- [ ] **Step 2: Create StatusPill component**

Create `components/ui/status_pill.tsx`:

```typescript
type StatusPillProps = {
  status: "active" | "maturing" | "pending_rollover" | "rolled" | "underperforming" | "completed" | "new" |
          "action_needed" | "rollover_ready" | "on_track" | "scheduled" | "paid" | "overdue"
  animate?: boolean // For live alerts — pulsing dot
}
```

Maps status to color system per DESIGN.md section 9 "GRAT Status Mapping". Uses `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight` with colored dot.

- [ ] **Step 3: Create AssetTypeBadge component**

Create `components/ui/asset_type_badge.tsx`:

```typescript
type AssetTypeBadgeProps = {
  type: AssetType
}
```

Maps asset type to label and styling:
- `public_equity` / `concentrated_stock` / `diversified` → standard neutral pill
- `private_co` / `pe_fund` / `hedge_fund` → distinctive primary-fixed pill (shows Sava handles alt assets)
- `re_llc` → distinctive primary-fixed pill

- [ ] **Step 4: Create MetricBlock component**

Create `components/ui/metric_block.tsx` — simple label + value for use inside modals and cards:

```typescript
type MetricBlockProps = {
  label: string
  value: string
  variant?: "default" | "success" | "primary"
}
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/stat_card.tsx components/ui/status_pill.tsx components/ui/asset_type_badge.tsx components/ui/metric_block.tsx
git commit -m "Add UI components: stat card, status pill, asset badge, metric block"
```

---

### Task 9: UI Components — Workflow Tracker, Toast, Modal Shell

**Files:**
- Create: `components/ui/workflow_tracker.tsx`
- Create: `components/ui/toast.tsx`
- Create: `components/ui/modal_shell.tsx`

- [ ] **Step 1: Create WorkflowTracker component**

Create `components/ui/workflow_tracker.tsx` — displays the 6-step trust execution timeline:

```typescript
import type { WorkflowStep } from "@/lib/types"

type WorkflowTrackerProps = {
  steps: WorkflowStep[]
  compact?: boolean // For inline display in modals
}
```

Renders a vertical stepper: each step shows a circle (green check if completed, blue dot if active, gray if pending), the label, and the detail text. Connected by vertical lines. Compact mode uses smaller text and tighter spacing.

- [ ] **Step 2: Create ModalShell component**

Create `components/ui/modal_shell.tsx` — glassmorphism overlay container (`"use client"`):

```typescript
type ModalShellProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}
```

Overlay: `fixed inset-0 bg-primary/40 backdrop-blur-sm z-50`. Modal panel: `bg-surface-container-lowest rounded-xl shadow-2xl max-w-2xl mx-auto mt-20 max-h-[80vh] overflow-y-auto`. Title in `font-headline text-lg font-extrabold text-primary`. Close button in top-right corner.

- [ ] **Step 3: Create Toast component**

Create `components/ui/toast.tsx` — simple toast notification (`"use client"`). Uses React state + setTimeout to auto-dismiss. Positioned fixed bottom-right. Provides a `useToast` hook or a `ToastProvider` context.

```typescript
type Toast = {
  id: string
  message: string
  type: "success" | "info" | "error"
}
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/workflow_tracker.tsx components/ui/toast.tsx components/ui/modal_shell.tsx
git commit -m "Add UI components: workflow tracker, toast, modal shell"
```

---

### Task 10: Layout — Sidebar, Header, AppShell, Footer

**Files:**
- Create: `components/layout/sidebar.tsx`
- Create: `components/layout/header.tsx`
- Create: `components/layout/app_shell.tsx`
- Create: `components/layout/sava_footer.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create Sidebar component**

Create `components/layout/sidebar.tsx` (`"use client"` — needs `usePathname`):

- `w-64 bg-primary text-on-primary flex flex-col shrink-0 h-full`
- Top: Sava logo (icon in `rounded-lg bg-primary-container` + "SAVA" in `text-xl font-extrabold tracking-tight`) + "Auto-GRAT Platform" subtitle
- Nav items with Material Symbols icons: Dashboard (`dashboard`), Clients (`group`), GRAT Modeling (`calculate`), Reports (`analytics`), 7520 Rate (`monitoring`), Settings (`settings`)
- Active state via `usePathname()`: `bg-primary-container text-white`, inactive: `text-on-primary-container hover:bg-white/5`
- Each nav item: `px-4 py-3 rounded-xl flex items-center gap-3 font-medium text-sm transition-colors`
- Bottom: user avatar + "Michael Reynolds" + "Reynolds Wealth Mgmt", separated by `border-t border-white/10`

Nav route mapping:
- Dashboard → `/dashboard`
- Clients → `/clients`
- GRAT Modeling → `/modeling`
- Reports → `/reports`
- 7520 Rate → `/rate_monitor`
- Settings → `/settings`

- [ ] **Step 2: Create Header component**

Create `components/layout/header.tsx`:

```typescript
type HeaderProps = {
  title: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  actions?: React.ReactNode
}
```

- `h-16 bg-surface-container-lowest flex items-center justify-between px-8 border-b border-outline-variant/10 shrink-0`
- Left: breadcrumbs (`text-[11px] text-on-surface-variant`) + title (`font-headline text-lg font-extrabold text-primary`)
- Right: 7520 rate badge (`bg-surface-container-low rounded-full px-4 py-1.5 text-sm`, rate value in `font-mono font-bold text-secondary`) + action buttons passed via props
- Notification bell with red dot

- [ ] **Step 3: Create SavaFooter component**

Create `components/layout/sava_footer.tsx`:

- `px-8 py-3 bg-surface-container-low text-on-surface-variant text-[11px] tracking-wide shrink-0`
- Text: "Administered by Sava Trust Company · Nevada Trust Charter"

- [ ] **Step 4: Create AppShell component**

Create `components/layout/app_shell.tsx`:

```typescript
type AppShellProps = {
  children: React.ReactNode
}
```

Composes the full layout:
```
<div className="flex h-screen overflow-hidden">
  <Sidebar />
  <main className="flex-1 flex flex-col overflow-hidden">
    {children}  {/* Each page renders its own Header + content */}
  </main>
</div>
```

- [ ] **Step 5: Update root layout to use AppShell**

Modify `app/layout.tsx` to wrap `{children}` in `<AppShell>`. Import and add the `ToastProvider` if toast uses context.

- [ ] **Step 6: Create redirect page**

Update `app/page.tsx` to redirect to `/dashboard`:

```typescript
import { redirect } from "next/navigation"

export default function Home() {
  redirect("/dashboard")
}
```

- [ ] **Step 7: Verify layout renders**

```bash
bun run dev
```

Navigate to `http://localhost:3000` — should redirect to `/dashboard` and show sidebar + empty content area. Check that the sidebar nav links work (pages don't exist yet — will show 404, that's fine).

- [ ] **Step 8: Commit**

```bash
git add components/layout/ app/layout.tsx app/page.tsx
git commit -m "Add app shell layout: sidebar, header, footer"
```

---

### Task 11: Dashboard Page

**Files:**
- Create: `app/dashboard/page.tsx`

- [ ] **Step 1: Build the dashboard page**

Create `app/dashboard/page.tsx` as a server component that:

1. Imports `getDashboardStats`, `getNeedsAttention`, `getActivities` from store
2. Renders `<Header>` with title "Dashboard" and breadcrumbs ["Home", "Dashboard"]
3. Header actions: 7520 rate badge + "+ New GRAT" link button (navigates to `/modeling`)
4. Content area (`p-6 space-y-6 bg-background overflow-y-auto flex-1`):
   - **Stat cards row** (grid-cols-4 gap-6): Active GRATs (hero), Wealth Transferred (hero), Pending Rollovers (light), Client Households (light) — values from `getDashboardStats()`
   - **Two-column grid** (grid-cols-2 gap-6):
     - Left: "Needs Attention" card — `bg-surface-container-lowest rounded-xl p-6`. Title in `font-headline text-lg font-extrabold text-primary`. List of items from `getNeedsAttention()` — each with colored background (amber/red/blue), household name bold, description, action link. Link to client detail page.
     - Right: "Recent Activity" card — same container styling. List of 8 most recent activities with date + description.
5. `<SavaFooter />` at bottom of content area

- [ ] **Step 2: Verify dashboard renders with real data**

```bash
bun run dev
```

Navigate to `/dashboard` — should show stat cards with values from fixtures, attention items, and activity feed.

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "Add dashboard page with stats, alerts, and activity feed"
```

---

### Task 12: Clients List Page

**Files:**
- Create: `app/clients/page.tsx`

- [ ] **Step 1: Build the clients list page**

Create `app/clients/page.tsx` as a server component:

1. Imports `getHouseholds` from store
2. Renders `<Header>` with title "Clients", breadcrumbs ["Home", "Clients"]
3. Header actions: search input (decorative — no filtering needed for 5 clients) + "+ New Client" button (decorative)
4. Full-width data table following DESIGN.md table specs:
   - Container: `bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden`
   - Column headers: `bg-surface-container-low/50`, `text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant`
   - Columns per spec: Household (name + description), Custodian ("Assets at Schwab"), Active GRATs count, Asset Types (badges), Trust AUM (mono, right), Wealth Transferred (mono, right, green), Status (pill)
   - Rows: `hover:bg-primary-fixed/20 transition-colors`, linked to `/clients/[id]` via `<Link>`
   - Row dividers: `divide-y divide-outline-variant/10`
   - Financial values: `font-mono` for alignment

Count active GRATs per household by filtering `getGratsByHousehold()` for non-rolled/non-completed status.

- [ ] **Step 2: Verify client list renders**

Navigate to `/clients` — should show 5 rows with correct data, asset type badges, status pills.

- [ ] **Step 3: Commit**

```bash
git add app/clients/page.tsx
git commit -m "Add clients list page with household table"
```

---

### Task 13: Client Detail — Header & Metrics

**Files:**
- Create: `app/clients/[id]/page.tsx`
- Create: `app/clients/[id]/components/client_header.tsx`

- [ ] **Step 1: Create ClientHeader component**

Create `app/clients/[id]/components/client_header.tsx`:

- Receives `household: Household` prop
- Card with: name (headline-lg), description, "Assets held at [Custodian]" (prominent), "Trustee: Sava Trust Company, NV" (subtle attribution), established date
- Action buttons: "Request Valuation" (if any holding has `valuationStale: true`), "Asset Substitution" (secondary), "+ New GRAT" (primary link to `/modeling?client=[id]`)

- [ ] **Step 2: Create client detail page shell**

Create `app/clients/[id]/page.tsx` as a server component:

1. Read `params.id`, get household and GRATs from store
2. If household not found, call `notFound()`
3. Render `<Header>` with title = household name, breadcrumbs ["Home", "Clients", household name]
4. Content: `<ClientHeader>`, metrics row (4 stat cards: Trust AUM, Wealth Transferred, Active GRATs, Avg Return vs Hurdle)
5. Tab navigation (using URL search params or client-side state): GRAT Ladder | Annuity Schedule | History | Tax & Documents
6. Tab content area (renders selected tab component)

For now, create the page with header and metrics. Tabs will render placeholder text until tab components are built in subsequent tasks.

- [ ] **Step 3: Verify client detail renders**

Navigate to `/clients/chen` — should show Chen Family header with metrics.

- [ ] **Step 4: Commit**

```bash
git add app/clients/\[id\]/page.tsx app/clients/\[id\]/components/client_header.tsx
git commit -m "Add client detail page with header and metrics"
```

---

### Task 14: GRAT Ladder — Timeline + Table

**Files:**
- Create: `app/clients/[id]/components/grat_timeline.tsx`
- Create: `app/clients/[id]/components/grat_ladder.tsx`

- [ ] **Step 1: Create GratTimeline component**

Create `app/clients/[id]/components/grat_timeline.tsx` (`"use client"` — uses Recharts):

- Receives `grats: GRAT[]` prop
- Gantt-style horizontal bar chart using Recharts `BarChart` or custom `ComposedChart`
- Each GRAT is a bar: x-axis = time (months), bar spans startDate → maturityDate
- Bar colors by status: active = `#001b44` (primary), maturing = `#fbbc00` (tertiary-fixed-dim), rolled = `#eae8e7` (surface-container-high, faded), underperforming = `#ba1a1a` (error)
- Current date shown as a vertical reference line (dashed, red)
- GRAT names as y-axis labels
- Arrows connecting rolled GRATs to their successors (use Recharts customized labels or SVG overlay)
- Container: `bg-surface-container-lowest rounded-xl p-6`
- Title: "Rolling Strategy Timeline" in `font-headline text-base font-extrabold text-primary`

If Recharts doesn't support Gantt natively, implement as a `ComposedChart` with custom `Bar` shapes or as a custom SVG component using the GRAT date ranges mapped to pixel positions.

- [ ] **Step 2: Create GratLadder component**

Create `app/clients/[id]/components/grat_ladder.tsx` (`"use client"` — expandable rows):

- Receives `grats: GRAT[]` and `householdId: string` props
- Table with columns per spec: GRAT name + date range, Asset (with AssetTypeBadge), Funded, Term, Hurdle, Current Value, Est. Remainder, Trustee ("Sava Trust Co."), Status (StatusPill)
- Maturing GRATs: amber background row with "Rollover recommended" subtitle, click opens rollover modal (modal built in later task — for now, just track which GRAT is selected via state)
- Historical GRATs (rolled/completed): `opacity-60`, show "→ [successor GRAT name]" link
- Expandable rows: clicking a GRAT row toggles showing the WorkflowTracker for that GRAT
- Financial values: `font-mono text-sm`, right-aligned
- Remainder column: `text-secondary font-bold` for positive values

- [ ] **Step 3: Wire into client detail page**

Update `app/clients/[id]/page.tsx` to render `<GratTimeline>` and `<GratLadder>` in the GRAT Ladder tab.

- [ ] **Step 4: Verify timeline and ladder render**

Navigate to `/clients/nakamura` — should show 4 overlapping bars in the timeline and a full GRAT table. Navigate to `/clients/chen` — should show maturing GRAT highlighted.

- [ ] **Step 5: Commit**

```bash
git add app/clients/\[id\]/components/grat_timeline.tsx app/clients/\[id\]/components/grat_ladder.tsx app/clients/\[id\]/page.tsx
git commit -m "Add GRAT ladder table and rolling strategy timeline visualization"
```

---

### Task 15: Cumulative Wealth Transfer Chart

**Files:**
- Create: `app/clients/[id]/components/cumulative_chart.tsx`

- [ ] **Step 1: Create CumulativeChart component**

Create `app/clients/[id]/components/cumulative_chart.tsx` (`"use client"`):

- Receives `grats: GRAT[]` prop
- Computes cumulative transfer data: sort completed/rolled GRATs by maturity date, build running sum of `remainderEstimate` values
- Recharts `AreaChart`: X-axis = time, Y-axis = cumulative $ transferred
- Area fill: `fill="#75f8b3"` (secondary-container) at 30% opacity, stroke `#006d43` (secondary)
- Step-ups annotated with GRAT names using Recharts `Label` or `ReferenceDot`
- Container: `bg-surface-container-lowest rounded-xl p-6 mt-4`
- Title: "Cumulative Wealth Transferred" in `font-headline text-base font-extrabold text-primary`
- Show only for clients with at least 1 completed/rolled GRAT. Hide for Whitfield.

- [ ] **Step 2: Wire into client detail page**

Add `<CumulativeChart>` below the GRAT ladder in the GRAT Ladder tab.

- [ ] **Step 3: Commit**

```bash
git add app/clients/\[id\]/components/cumulative_chart.tsx app/clients/\[id\]/page.tsx
git commit -m "Add cumulative wealth transfer chart"
```

---

### Task 16: Remaining Client Detail Tabs

**Files:**
- Create: `app/clients/[id]/components/annuity_schedule.tsx`
- Create: `app/clients/[id]/components/client_history.tsx`
- Create: `app/clients/[id]/components/tax_documents.tsx`

- [ ] **Step 1: Create AnnuitySchedule component**

Create `app/clients/[id]/components/annuity_schedule.tsx`:

- Receives `grats: GRAT[]` prop
- Flattens all annuity payments from all active GRATs, sorts by due date
- Table: GRAT name, Payment #, Due Date, Amount (mono, right), Status (pill: paid=green, scheduled=gray, overdue=red)
- Footer: "Annuity payments processed by Sava Trust Company"

- [ ] **Step 2: Create ClientHistory component**

Create `app/clients/[id]/components/client_history.tsx`:

- Receives `activities: Activity[]` prop (pre-filtered to household)
- Chronological list: each item shows timestamp (formatted), description
- Sava-sourced events highlighted subtly (e.g., "Trust accepted by Sava Trust Company" with a small Sava icon/badge)

- [ ] **Step 3: Create TaxDocuments component**

Create `app/clients/[id]/components/tax_documents.tsx` (`"use client"` — uses toast):

- Receives `documents: TrustDocument[]` prop
- Grouped by year, then by type
- Each row: document type icon (Material Symbol), name, date, "Download" button
- Download click: shows toast "PDF generation available in production environment"
- Footer: "All trust documents prepared and maintained by Sava Trust Company"

- [ ] **Step 4: Wire all tabs into client detail page**

Update `app/clients/[id]/page.tsx` to render the correct component for each tab. Tab switching can use query params (`?tab=annuity`) or client-side state.

- [ ] **Step 5: Verify all tabs work**

Navigate through all tabs on `/clients/chen` — GRAT Ladder, Annuity Schedule, History, Tax & Documents should all render with data.

- [ ] **Step 6: Commit**

```bash
git add app/clients/\[id\]/components/annuity_schedule.tsx app/clients/\[id\]/components/client_history.tsx app/clients/\[id\]/components/tax_documents.tsx app/clients/\[id\]/page.tsx
git commit -m "Add annuity schedule, history, and tax documents tabs"
```

---

### Task 17: GRAT Modeling — Parameter Form

**Files:**
- Create: `app/modeling/page.tsx`
- Create: `app/modeling/components/parameter_form.tsx`

- [ ] **Step 1: Create ParameterForm component**

Create `app/modeling/components/parameter_form.tsx` (`"use client"`):

- State: `clientId`, `fundingAmount`, `termYears`, `fundingAsset`, `assetType`, `expectedReturn`
- Client selector: dropdown populated from households
- Funding Amount: number input + range slider ($1M–$50M). Format display as currency.
- GRAT Term: button group (2 / 3 / 5 years), active button styled with `bg-primary text-on-primary`
- Funding Asset: dropdown populated from selected client's `holdings`, each option shows asset type badge. Alternative assets show last valuation date.
- Expected Annual Return: number input + range slider (0–30%)
- Current 7520 Rate: read-only display of `currentRate` from store, with advisory signal card (green "Favorable" per spec)
- Trustee info block: "Corporate Trustee: Sava Trust Company | Jurisdiction: Nevada | Assets held at: [custodian]"
- Buttons: "Generate Proposal" (primary, triggers create flow), "Save Draft" (secondary, decorative)
- Exposes current parameter values via callback prop `onParamsChange`
- Reads `?client=` query param to pre-select client when navigating from client detail

- [ ] **Step 2: Create modeling page shell**

Create `app/modeling/page.tsx`:

- Server component that fetches households and current rate from store
- Passes data to a client wrapper component that manages state between ParameterForm and ProjectionPanel
- Renders Header with title "GRAT Modeling", breadcrumbs, "+ New GRAT" action
- Split layout: `grid grid-cols-12 gap-6` — left panel (col-span-5) for params, right panel (col-span-7) for projections

- [ ] **Step 3: Verify parameter form renders**

Navigate to `/modeling` — should show the parameter form with working dropdowns and sliders. Right panel will be empty until ProjectionPanel is built.

- [ ] **Step 4: Commit**

```bash
git add app/modeling/page.tsx app/modeling/components/parameter_form.tsx
git commit -m "Add GRAT modeling page with parameter form"
```

---

### Task 18: GRAT Modeling — Projections, Risk Profile, Advisor Economics

**Files:**
- Create: `app/modeling/components/projection_panel.tsx`
- Create: `app/modeling/components/risk_profile.tsx`

- [ ] **Step 1: Create ProjectionPanel component**

Create `app/modeling/components/projection_panel.tsx` (`"use client"`):

- Receives current parameter values as props
- Calls `projectGrat()` from `grat_math.ts` on every param change
- **Section 1 — Projected Outcome:**
  - Two hero cards side by side: "Est. Tax-Free Transfer" (green bg), "Gift Tax Saved" (primary bg)
  - Detail row (3 metric blocks): Total Annuity Payments, Projected End Value, Excess Over Hurdle
- **Section 2 — Risk Profile:** Renders `<RiskProfile>` component
- **Section 3 — Annuity Schedule Preview:** year-by-year payment table + remainder
- **Section 4 — Advisor Economics Note:**
  - "Your AUM fee: $X/year (preserved — assets remain at [custodian])"
  - "Sava trust admin: $Y/year (billed to client separately)"
  - "Client net tax savings: $Z"
  - Values from `projectGrat()` result

- [ ] **Step 2: Create RiskProfile component**

Create `app/modeling/components/risk_profile.tsx`:

- Receives `remainder: number`, `fundingAmount: number` props
- Side-by-side comparison card:
  - **Left (green accent):** "Assets Outperform Hurdle" — shows remainder as tax-free transfer, $0 gift tax, $0 cost
  - **Right (neutral):** "Assets Underperform Hurdle" — $0 transferred, $0 tax, $0 cost — "nothing is lost"
- Headline: "A call option with zero premium" in `font-headline font-extrabold`
- Subtext: "If the GRAT outperforms the [rate]% hurdle, the excess passes tax-free. If it doesn't, everything returns to the grantor."

- [ ] **Step 3: Wire projections into modeling page**

Update the modeling page's client wrapper to pass params from ParameterForm to ProjectionPanel.

- [ ] **Step 4: Verify live projections**

Navigate to `/modeling`, select a client, adjust sliders — projections should update in real-time. The risk profile should show the win/no-lose comparison.

- [ ] **Step 5: Commit**

```bash
git add app/modeling/components/projection_panel.tsx app/modeling/components/risk_profile.tsx app/modeling/page.tsx
git commit -m "Add live GRAT projections, risk profile, and advisor economics"
```

---

### Task 19: Reports Page

**Files:**
- Create: `app/reports/page.tsx`
- Create: `app/reports/components/advisor_impact.tsx`

- [ ] **Step 1: Create AdvisorImpact component**

Create `app/reports/components/advisor_impact.tsx`:

- "Your Practice Economics" card with headline in `font-headline text-lg font-extrabold text-primary`
- Metric rows: Your AUM Fee on Trust Assets, Sava Trust Admin Fee, Total Client Tax Savings, Client Retention Value (touchpoint count)
- Values calculated from store data: sum `household.advisorFeeRate * household.totalAUM` across all households for advisor fee, sum `household.totalAUM * 0.0025` for Sava fee, sum `household.wealthTransferred * 0.4` for tax savings
- Subtext: "Sava holds all trust assets at your clients' existing custodians. Your advisory relationship and fee structure are fully preserved."

- [ ] **Step 2: Create Reports page**

Create `app/reports/page.tsx` as a server component:

1. Header with title "Wealth Transfer Summary", date range toggle (decorative — always shows "All Time" data), "Export PDF" button (shows toast)
2. **Metrics row** (4 hero stat cards): Total Wealth Transferred, Gift Tax Saved, GRATs Completed, Avg Excess Return
3. **Per-Client Performance Table**: household name, Trust AUM, Transferred, Tax Saved, Avg Return, GRATs (active + matured). Data from store. Styled per DESIGN.md table spec.
4. **Advisor Impact** card: `<AdvisorImpact>` component
5. **Sava Trust Administration Summary** card: Active Trusts Administered, Rollovers Processed, Annuity Payments Processed, Trust Documents Generated, Alternative Assets Under Administration. Values computed from store.

- [ ] **Step 3: Verify reports page**

Navigate to `/reports` — should show all sections with calculated data.

- [ ] **Step 4: Commit**

```bash
git add app/reports/page.tsx app/reports/components/advisor_impact.tsx
git commit -m "Add reports page with advisor impact and Sava summary"
```

---

### Task 20: 7520 Rate Monitor Page

**Files:**
- Create: `app/rate_monitor/page.tsx`

- [ ] **Step 1: Build the rate monitor page**

Create `app/rate_monitor/page.tsx` — server component shell with client chart component inline (or extracted):

1. Header: title "7520 Rate Monitor", breadcrumbs
2. **Metrics row** (3 cards): Current Rate (5.20%, large display, ↓0.20% trend), 12-Month Average (5.45%), Advisory Signal ("Favorable" green card)
3. **Historical Chart** (`"use client"` section — Recharts `BarChart`):
   - Data from `getRateHistory()`
   - Each bar is a month. Current month (`Apr 2026`) highlighted with `fill="#006d43"` (secondary). Others use `fill="#aec6ff"` (primary-fixed-dim).
   - Horizontal reference line at 12-month average
   - X-axis: month labels. Y-axis: rate %.
   - Container: `bg-surface-container-lowest rounded-xl p-6`
4. **Impact Analysis Table**:
   - For each household: name, active GRAT count, their hurdle rates, spread vs current rate, recommendation
   - Recommendation: "Favorable — consider new GRAT" if current rate < avg, "Neutral" otherwise

- [ ] **Step 2: Verify rate monitor**

Navigate to `/rate_monitor` — should show rate display, chart, and impact table.

- [ ] **Step 3: Commit**

```bash
git add app/rate_monitor/page.tsx
git commit -m "Add 7520 rate monitor with historical chart and impact analysis"
```

---

### Task 21: Settings Page

**Files:**
- Create: `app/settings/page.tsx`

- [ ] **Step 1: Build the settings page**

Create `app/settings/page.tsx` (`"use client"` for Reset Demo button):

1. Header: title "Settings", breadcrumbs
2. **Firm Profile** (read-only card): "Reynolds Wealth Management", "Michael Reynolds, CFP", "San Francisco, CA"
3. **Default GRAT Parameters** (decorative form): default term (2 years), default annuity structure (level), default modeling return assumption (12%)
4. **Trust Company Info** (read-only card): "Corporate Trustee: Sava Trust Company | Charter: Nevada | Trust Administration: 0.25% annually | Per-GRAT Fee: $1,500"
5. **Notification Preferences** (decorative toggles): rollover alerts, valuation reminders, annuity confirmations
6. **Reset Demo** section: red-outlined button "Reset All Demo Data". On click, calls `resetDemo()` server action, shows success toast.

- [ ] **Step 2: Verify settings and reset**

Navigate to `/settings`, click Reset Demo — should reload page with fresh data.

- [ ] **Step 3: Commit**

```bash
git add app/settings/page.tsx
git commit -m "Add settings page with Reset Demo functionality"
```

---

### Task 22: Rollover Approval Modal

**Files:**
- Create: `components/ui/rollover_modal.tsx`
- Modify: `app/clients/[id]/components/grat_ladder.tsx`
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Create RolloverModal component**

Create `components/ui/rollover_modal.tsx` (`"use client"`):

- Receives: `proposal: RolloverProposal`, `sourceGrat: GRAT`, `household: Household`, `open: boolean`, `onClose: () => void`
- Uses `<ModalShell>` as container
- Content per spec "Rollover Approval Flow":
  1. Header: "ROLLOVER PROPOSAL" label, household name, GRAT ID, maturity date
  2. Maturing GRAT Performance (gradient card): 3 MetricBlocks — Current Value, Annuities Paid, Remainder
  3. Proposed New GRAT (light card): funding amount, term, 7520 rate, asset with badge, "Trustee: Sava Trust Company, NV"
  4. Recommendation signal: green info card with rate advisory text
  5. Trust Execution Preview: compact list of what Sava will do upon approval
  6. Action buttons: "Modify Parameters" (link to `/modeling`), "Decline" (calls `declineRollover`), "Approve Rollover" (calls `approveRollover`)
- On approve: calls server action, closes modal, page revalidates via `revalidatePath`

- [ ] **Step 2: Wire rollover modal into GRAT ladder**

Update `grat_ladder.tsx`: clicking a maturing GRAT row opens `<RolloverModal>` with the corresponding proposal and GRAT data.

- [ ] **Step 3: Wire rollover links from dashboard**

Update `app/dashboard/page.tsx`: "Needs Attention" items for rollover-ready clients link to `/clients/[id]?tab=ladder&grat=[gratId]`. The client detail page reads this query param and auto-opens the rollover modal on mount.

- [ ] **Step 4: Test rollover flow end-to-end**

1. Navigate to dashboard → click "Approve →" on Ambani Trust
2. Should navigate to client detail with rollover modal open
3. Click "Approve Rollover"
4. Modal closes, GRAT ladder updates (source GRAT → "rolled", new GRAT appears)
5. Dashboard pending count should decrement on next visit

- [ ] **Step 5: Commit**

```bash
git add components/ui/rollover_modal.tsx app/clients/\[id\]/components/grat_ladder.tsx app/dashboard/page.tsx app/clients/\[id\]/page.tsx
git commit -m "Add rollover approval modal with full workflow"
```

---

### Task 23: Asset Substitution Modal

**Files:**
- Create: `components/ui/substitution_modal.tsx`

- [ ] **Step 1: Create SubstitutionModal component**

Create `components/ui/substitution_modal.tsx` (`"use client"`):

- Receives: `grat: GRAT`, `household: Household`, `open: boolean`, `onClose: () => void`
- Uses `<ModalShell>` as container
- Content per spec:
  1. Header: household name, GRAT ID, "Asset Substitution — IRC 675(4)"
  2. Current Performance: asset name + badge, current value, return vs hurdle (gap shown)
  3. Proposed Replacement: dropdown from household's other holdings (with badges), FMV input
  4. FMV validation message: "Equal value swap required. FMV must equal $[current value]"
  5. Client-side validation: FMV input must match current GRAT value (within $1 tolerance)
  6. Sava note: "Sava Trust Company will document the substitution. $500 fee applies."
  7. Actions: "Cancel", "Execute Substitution" (disabled until FMV validates)
- On execute: calls `executeSubstitution` server action, shows success toast

- [ ] **Step 2: Wire substitution modal into GRAT ladder and dashboard**

Update `grat_ladder.tsx`: underperforming GRATs show a "Substitute" button that opens the modal. Update dashboard: "Substitute →" link navigates to client detail with param to auto-open substitution modal.

- [ ] **Step 3: Test substitution flow**

1. Navigate to `/clients/morrison`
2. Click "Substitute" on the underperforming GRAT
3. Select a replacement asset, enter matching FMV
4. Click "Execute Substitution"
5. GRAT status should update to "active", asset should change

- [ ] **Step 4: Commit**

```bash
git add components/ui/substitution_modal.tsx app/clients/\[id\]/components/grat_ladder.tsx
git commit -m "Add asset substitution modal with FMV validation"
```

---

### Task 24: Stale Valuation Request Modal

**Files:**
- Create: `components/ui/valuation_modal.tsx`

- [ ] **Step 1: Create ValuationModal component**

Create `components/ui/valuation_modal.tsx` (`"use client"`):

- Receives: `household: Household`, `asset: AssetHolding`, `open: boolean`, `onClose: () => void`
- Simple modal per spec: asset info, days since last valuation, explanation text about alt asset compliance, Sava coordination message
- Actions: "Cancel", "Request Valuation"
- On request: calls `requestValuation` server action, shows toast "Valuation request sent."

- [ ] **Step 2: Wire into dashboard and client header**

Update dashboard's "Needs Attention" items: stale valuation alerts open the valuation modal (or navigate to client detail). Update `client_header.tsx`: "Request Valuation" button opens the modal.

- [ ] **Step 3: Commit**

```bash
git add components/ui/valuation_modal.tsx app/dashboard/page.tsx app/clients/\[id\]/components/client_header.tsx
git commit -m "Add stale valuation request modal"
```

---

### Task 25: Create GRAT Flow

**Files:**
- Modify: `app/modeling/page.tsx`
- Modify: `app/modeling/components/parameter_form.tsx`

- [ ] **Step 1: Add GRAT creation to modeling page**

Update the modeling page:

- "Generate Proposal" button in ParameterForm transitions the right panel from live projections to a "Proposal Summary" view — the same projections but with a "Create GRAT — Sava Trust Company will serve as trustee" primary button at the bottom
- On clicking "Create GRAT": calls `createGrat` server action with current parameters
- After creation: shows success toast "GRAT created. Trust accepted by Sava Trust Company."
- Optionally: brief CSS animation on the workflow tracker showing steps completing (opacity transition over 1-2 seconds)

- [ ] **Step 2: Test create GRAT flow**

1. Navigate to `/modeling`
2. Select Whitfield Family, set $5M, 2-year term, SPY, 12% return
3. Click "Generate Proposal" → see full projections with risk profile
4. Click "Create GRAT" → success toast
5. Navigate to `/clients/whitfield` → new GRAT should appear in the ladder

- [ ] **Step 3: Commit**

```bash
git add app/modeling/page.tsx app/modeling/components/parameter_form.tsx
git commit -m "Add GRAT creation flow from modeling page"
```

---

### Task 26: Polish & Integration Testing

**Files:**
- Various touch-ups across pages

- [ ] **Step 1: Verify all navigation flows**

Walk through the complete demo flow:
1. Land on Dashboard → check stat cards, attention items, activity feed
2. Click a client in attention panel → navigates to client detail
3. Client detail → check all 4 tabs work
4. Approve a rollover → verify GRAT ladder updates
5. Execute an asset substitution → verify GRAT updates
6. Request a valuation → verify toast + activity
7. Navigate to Modeling → create a new GRAT → verify it appears in client detail
8. Check Reports → verify advisor impact numbers
9. Check 7520 Rate Monitor → verify chart and impact table
10. Settings → Reset Demo → verify everything resets

- [ ] **Step 2: Fix any layout/styling issues**

Check each page against DESIGN.md:
- No 1px borders for sectioning (only `outline-variant/10` dividers)
- Manrope only on headlines, Geist Sans on body, Geist Mono on financial data
- KPI labels at 10px uppercase tracked, values at 36-48px bold
- Tinted navy shadows, not default CSS shadows
- Status pills with colored dots
- Asset type badges on alternative assets

- [ ] **Step 3: Verify all Sava Trust Company mentions**

Check the presence table from spec:
- Sidebar: "SAVA" logo ✓
- Footer: "Administered by Sava Trust Company" ✓
- Every GRAT row: "Sava Trust Co." column ✓
- Workflow tracker: step 4 ✓
- Rollover modal: execution preview ✓
- Substitution modal: Sava note ✓
- Modeling tool: trustee info block ✓
- Reports: Sava summary card ✓
- Annuity tab footer ✓
- Tax & Documents footer ✓
- Activity feed: Sava events ✓
- Settings: trust company info ✓

- [ ] **Step 4: Run build to verify no errors**

```bash
bun run build
```

Fix any TypeScript or build errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Polish layout, verify all flows, fix build errors"
```

---

## Task Dependency Graph

```
Task 1 (Setup) ─────────────────────────────────────────────────────────
    │
Task 2 (Types) ──── Task 3 (Format) ──── Task 4 (Math) ────────────────
    │                                         │
Task 5 (Fixtures) ───────────────────────────────────────────────────────
    │
Task 6 (Store) ──────────────────────────────────────────────────────────
    │
Task 7 (Actions) ────────────────────────────────────────────────────────
    │
Task 8 (UI: Cards) ──── Task 9 (UI: Modals) ────────────────────────────
    │                         │
Task 10 (Layout) ────────────────────────────────────────────────────────
    │
    ├── Task 11 (Dashboard) ──────── Task 22 (Rollover Modal) ──────────
    ├── Task 12 (Clients List) ──── Task 13 (Client Detail) ────────────
    │                                    │
    │                               Task 14 (GRAT Ladder + Timeline) ───
    │                                    │
    │                               Task 15 (Cumulative Chart) ─────────
    │                                    │
    │                               Task 16 (Remaining Tabs) ───────────
    │
    ├── Task 17 (Modeling Params) ──── Task 18 (Projections + Risk) ────
    ├── Task 19 (Reports) ──────────────────────────────────────────────
    ├── Task 20 (Rate Monitor) ─────────────────────────────────────────
    ├── Task 21 (Settings) ─────────────────────────────────────────────
    │
    ├── Task 23 (Substitution Modal) ───────────────────────────────────
    ├── Task 24 (Valuation Modal) ──────────────────────────────────────
    ├── Task 25 (Create GRAT Flow) ─────────────────────────────────────
    │
    └── Task 26 (Polish) ──────────────────────────────────────────────
```

**Parallelizable groups after Task 10:**
- Tasks 11, 12, 17, 19, 20, 21 can all start in parallel (independent pages)
- Tasks 13-16 are sequential (client detail builds up)
- Tasks 22-25 depend on their respective pages existing
- Task 26 is last
