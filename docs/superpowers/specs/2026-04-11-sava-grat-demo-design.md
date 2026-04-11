# Sava Auto-GRAT Platform — Demo Spec

## Overview

A fully interactive demo of Sava's Auto-GRAT platform, designed to convince a wealth management advisor that this product is real, polished, and worth adopting. The demo presents the advisor's perspective only — no attorney or client portals. No login required.

The demo runs on mock data with a thin server layer (Next.js server actions mutating in-memory state) so that actions like "Approve Rollover" persist across page navigation within a session.

---

## Architecture

### Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 with custom design tokens (see DESIGN.md)
- **Fonts:** Manrope (Google Fonts, headlines), Geist Sans + Geist Mono (next/font, body/data)
- **Icons:** Material Symbols Outlined (Google Fonts)
- **Data:** Static JSON fixtures loaded into in-memory store on server start
- **State:** Server actions mutate in-memory state; "Reset Demo" restores fixtures
- **Charts:** Recharts (lightweight, React-native charting)
- **Package manager:** Bun

### File Structure (snake_case files, PascalCase components)

```
app/
├── layout.tsx                     # Root layout: fonts, sidebar shell
├── page.tsx                       # Redirect to /dashboard
├── globals.css                    # Tailwind + design tokens
├── dashboard/
│   └── page.tsx                   # Dashboard page
├── clients/
│   ├── page.tsx                   # Client household list
│   └── [id]/
│       ├── page.tsx               # Client detail (GRAT ladder, tabs)
│       └── components/
│           ├── grat_ladder.tsx
│           ├── annuity_schedule.tsx
│           ├── client_history.tsx
│           └── client_header.tsx
├── modeling/
│   ├── page.tsx                   # GRAT modeling tool
│   └── components/
│       ├── parameter_form.tsx
│       ├── projection_panel.tsx
│       └── annuity_preview.tsx
├── reports/
│   └── page.tsx                   # Wealth transfer reports
├── rate_monitor/
│   └── page.tsx                   # 7520 rate monitor
├── settings/
│   └── page.tsx                   # Settings (with Reset Demo)
components/
├── layout/
│   ├── sidebar.tsx
│   ├── header.tsx
│   └── app_shell.tsx
├── ui/
│   ├── stat_card.tsx              # Hero + light variants
│   ├── status_pill.tsx
│   ├── data_table.tsx
│   ├── metric_block.tsx
│   └── glass_overlay.tsx
lib/
├── data/
│   ├── fixtures.ts                # All mock data definitions
│   ├── store.ts                   # In-memory mutable store
│   └── actions.ts                 # Server actions (approve, create, substitute, reset)
├── grat_math.ts                   # GRAT calculation engine (PV, annuities, projections)
├── format.ts                      # Currency, percentage, date formatting
└── types.ts                       # TypeScript type definitions
```

---

## Data Model

### Types

```typescript
type Household = {
  id: string
  name: string
  description: string              // "Tech founder — Concentrated NVDA"
  primaryContact: string
  custodian: "Schwab" | "Fidelity" | "Pershing"
  totalAUM: number
  wealthTransferred: number
  status: "action_needed" | "rollover_ready" | "underperforming" | "on_track" | "new"
  createdAt: string
}

type GRAT = {
  id: string
  householdId: string
  name: string                     // "GRAT-2026-Q1"
  status: "active" | "maturing" | "pending_rollover" | "rolled" | "underperforming" | "completed"
  termYears: number
  fundingAmount: number
  fundingAsset: string             // "NVDA — Concentrated Stock"
  startDate: string
  maturityDate: string
  hurdle7520Rate: number
  expectedReturn: number
  currentValue: number
  remainderEstimate: number
  annuityPayments: AnnuityPayment[]
  rolledFromId?: string            // Link to predecessor GRAT
  rolledToId?: string              // Link to successor GRAT
}

type AnnuityPayment = {
  id: string
  gratId: string
  year: number
  dueDate: string
  amount: number
  status: "scheduled" | "paid" | "overdue"
}

type RolloverProposal = {
  id: string
  sourceGratId: string
  householdId: string
  proposedFundingAmount: number
  proposedTerm: number
  proposedAsset: string
  current7520Rate: number
  recommendation: string
  status: "pending" | "approved" | "declined"
  createdAt: string
}

type Activity = {
  id: string
  householdId?: string
  type: "grat_created" | "rollover_approved" | "annuity_paid" | "substitution" | "rollover_proposed"
  description: string
  timestamp: string
}

type RateDataPoint = {
  month: string                    // "Apr 2026"
  rate: number
}
```

### 5 Client Archetypes

| # | Household | Profile | AUM | Active GRATs | Status | Key Demo Moment |
|---|-----------|---------|-----|-------------|--------|-----------------|
| 1 | Chen Family | Tech founder, concentrated NVDA | $12M | 3 (+ 1 maturing) | Action needed | Deep client: full GRAT history, maturing GRAT with rollover recommendation |
| 2 | Ambani Trust | Pre-IPO exec, private co. + public equities | $45M | 2 (+ 1 rollover pending) | Rollover ready | High-value client, demonstrates alternative asset handling |
| 3 | Morrison Family | RE investor, LLCs + diversified | $10M | 2 (1 underperforming) | Underperforming | Asset substitution alert and workflow |
| 4 | Nakamura Trust | Retiree, diversified portfolio | $7.5M | 4 (mature rolling ladder) | On track | Steady-state rolling strategy — the "it works" proof |
| 5 | Whitfield Family | New client, diversified | $10M | 1 | New | Getting started state — shows onboarding simplicity |

---

## Pages

### 1. Dashboard (`/dashboard`)

The advisor's home screen. Shows portfolio-level metrics and surfaces items that need attention.

**Layout:**
- 4 metric stat cards in a row (grid-cols-4)
- 2-column grid below: "Needs Attention" panel (left) + "Recent Activity" feed (right)

**Stat Cards:**
| Card | Value | Trend | Variant |
|------|-------|-------|---------|
| Active GRATs | 12 | +3 this quarter | Hero (gradient) |
| Wealth Transferred | $11.06M | +$2.5M YTD | Hero (gradient) |
| Pending Rollovers | 4 | 2 due this week | Light |
| Client Households | 5 | $84.5M total AUM | Light |

**Needs Attention Panel:**
- List of 3-4 action items pulled from GRAT statuses
- Each item: household name, description, action link ("Review →", "Approve →", "Substitute →")
- Color-coded backgrounds: amber for maturing/pending, red for underperforming
- Clicking an action link navigates to the relevant client detail page

**Recent Activity Feed:**
- Chronological list of recent actions across all clients
- Each item: date + description
- 6-8 items visible

### 2. Clients List (`/clients`)

**Layout:**
- Search bar + status filter dropdown + "New Client" button
- Full-width data table

**Table Columns:**
| Column | Alignment | Font |
|--------|-----------|------|
| Household (name + description) | Left | Geist Sans, name semibold, desc label-md muted |
| Custodian | Left | Geist Sans body |
| Active GRATs | Left | Geist Mono bold |
| Trust AUM | Right | Geist Mono |
| Wealth Transferred | Right | Geist Mono, color secondary |
| Status | Left | Status pill |

- Rows are clickable → navigate to `/clients/[id]`
- Hover state: `bg-primary-fixed/20`

### 3. Client Detail (`/clients/[id]`)

**Header Card:**
- Household name (headline-lg), description, custodian, established date
- Action buttons: "Asset Substitution" (secondary), "+ New GRAT" (primary)

**Metrics Row (4 cards):**
- Trust AUM, Wealth Transferred, Active GRATs, Avg Return vs Hurdle

**Tabbed Content:**

**Tab 1: GRAT Ladder** (default)
- Table showing all GRATs for the household (active + historical)
- Columns: GRAT name + date range, Funded amount, Term, Hurdle rate, Current Value, Est. Remainder, Status
- Maturing GRATs highlighted with amber background + rollover recommendation
- Historical (rolled/completed) GRATs shown at reduced opacity
- Clicking a maturing GRAT opens the rollover approval flow

**Tab 2: Annuity Schedule**
- Timeline view of all upcoming and past annuity payments across active GRATs
- Columns: GRAT, Payment #, Due Date, Amount, Status
- Paid = green check, Scheduled = gray, Overdue = red

**Tab 3: History**
- Activity feed filtered to this household
- Shows GRAT creations, rollovers, payments, substitutions

**Tab 4: Documents** (static/decorative)
- List of trust documents with download icons (non-functional, for realism)

### 4. GRAT Modeling (`/modeling`)

The "wow" moment. Split layout — parameters on left, live projections on right.

**Left Panel: Parameters**
- Client selector (dropdown)
- Funding Amount (input + slider, $1M–$50M range)
- GRAT Term (button group: 2 years / 3 years / 5 years)
- Funding Asset (dropdown — populated from selected client's holdings)
- Expected Annual Return (input + slider, 0–30% range)
- Current 7520 Rate (read-only display with advisory signal)
- Buttons: "Generate Proposal" (primary) + "Save Draft" (secondary)

**Right Panel: Live Projections (updates on every parameter change)**
- Two hero metric cards:
  - Est. Tax-Free Transfer (green background)
  - Gift Tax Saved at 40% rate (blue/primary background)
- Detail metrics row (3 cards): Total Annuity Payments, Projected End Value, Excess Over Hurdle
- Annuity Schedule Preview: year-by-year payment breakdown + remainder to beneficiaries

**GRAT Math (implemented in `lib/grat_math.ts`):**
- Zeroed-out annuity calculation: PV of annuity payments = funding amount at 7520 rate
- For a 2-year GRAT: each annual payment = funding / PV annuity factor
- PV annuity factor = (1 - (1 + r)^(-n)) / r where r = 7520 rate, n = term
- Projected end value = funding * (1 + expectedReturn)^term
- Remainder = projected end value - sum of annuity payments
- Gift tax saved = remainder * 0.40

### 5. Reports (`/reports`)

Cross-client wealth transfer summary.

**Header:**
- Title + date range filters (This Quarter / YTD / All Time toggle) + "Export PDF" button

**Metrics Row (4 hero cards):**
- Total Wealth Transferred, Gift Tax Saved, GRATs Completed, Avg Excess Return

**Per-Client Performance Table:**
| Column | Details |
|--------|---------|
| Household | Name |
| Trust AUM | Right-aligned mono |
| Transferred | Right-aligned mono, color secondary |
| Tax Saved | Right-aligned mono, color secondary |
| Avg Return | Mono, colored (green positive, red negative) |
| GRATs | Count (active + matured breakdown) |

### 6. 7520 Rate Monitor (`/rate_monitor`)

**Metrics Row (3 cards):**
- Current Rate (Apr 2026): 5.20%, ↓0.20% from last month — large display
- 12-Month Average: 5.45%, range 4.80%–5.80%
- Advisory Signal: "Favorable" — green card with recommendation text

**Historical Chart:**
- Bar chart (Recharts) showing monthly 7520 rate for the last 24 months
- Current month highlighted in secondary (green), historical bars in primary-fixed-dim
- Y-axis: rate %, X-axis: month labels
- Horizontal reference line at 12-month average

**Impact Analysis (below chart):**
- Table: how the current rate affects each active client's GRAT program
- Columns: Household, Active GRATs, Current Hurdle Rates, Spread vs Current Rate, Recommendation

### 7. Settings (`/settings`)

Mostly decorative. Key functional element:

- **Reset Demo** button: server action that restores all data to initial fixtures
- Firm profile (read-only display)
- Default GRAT parameters (decorative form)
- Notification preferences (decorative toggles)

---

## Interactive Workflows

### Rollover Approval Flow

**Trigger:** Advisor clicks "Review" on a maturing GRAT (from dashboard or client detail)

**Modal/Sheet:**
1. Header: "ROLLOVER PROPOSAL" label, household name, GRAT ID, maturity date, original funding
2. Maturing GRAT Performance: current value, annuities paid, remainder to beneficiaries (3 metric blocks on gradient background)
3. Proposed New GRAT: pre-populated parameters (funding amount, term, 7520 rate, asset)
4. Recommendation signal: "Current 7520 rate (5.20%) is below 12-month average. Rolling now locks in favorable conditions."
5. Actions: "Modify Parameters" (secondary), "Decline" (outline), "Approve Rollover" (primary)

**On Approve (server action):**
- Source GRAT status → "rolled"
- New GRAT created with status "active"
- Activity entry added
- RolloverProposal status → "approved"
- Dashboard pending count decremented

### Asset Substitution Flow

**Trigger:** Advisor clicks "Substitute" on an underperforming GRAT

**Modal/Sheet:**
1. Header: household name, GRAT ID, current performance vs hurdle
2. Current Asset: name, current value, performance since funding
3. Proposed Replacement: asset selector + FMV input
4. Validation: FMV must equal current GRAT value (equal value swap requirement)
5. Actions: "Cancel", "Execute Substitution"

**On Execute (server action):**
- GRAT funding asset updated
- Activity entry added
- GRAT status → "active" (clears underperforming if replacement is better)

### Create New GRAT Flow

**Trigger:** "+ New GRAT" button (header, client detail, or modeling page)

**Path:** Navigates to `/modeling` with client pre-selected. Advisor fills parameters, clicks "Generate Proposal". Proposal view shown with "Create GRAT" button.

**On Create (server action):**
- New GRAT added to store with status "active"
- Activity entry added
- Client's active GRAT count incremented

---

## Server Actions (`lib/data/actions.ts`)

| Action | Input | Effect |
|--------|-------|--------|
| `approveRollover` | rolloverProposalId | Marks source GRAT as rolled, creates new GRAT, updates proposal status, adds activity |
| `declineRollover` | rolloverProposalId | Updates proposal status to declined |
| `createGrat` | householdId, params | Creates new GRAT and annuity schedule, adds activity |
| `executeSubstitution` | gratId, newAsset, fmv | Updates GRAT asset, adds activity |
| `resetDemo` | — | Reloads all fixtures to initial state |

All actions call `revalidatePath` to refresh the UI after mutation.

---

## 7520 Rate Data

Fixed mock data — 24 months of historical rates:

```
Apr 2024: 5.60%    Jul 2024: 5.40%    Oct 2024: 5.80%    Jan 2025: 5.20%
May 2024: 5.40%    Aug 2024: 5.60%    Nov 2024: 5.60%    Feb 2025: 5.00%
Jun 2024: 5.20%    Sep 2024: 5.80%    Dec 2024: 5.40%    Mar 2025: 4.80%
                                                          Apr 2025: 5.00%
May 2025: 5.20%    Aug 2025: 5.60%    Nov 2025: 5.40%    Feb 2026: 5.40%
Jun 2025: 5.40%    Sep 2025: 5.40%    Dec 2025: 5.20%    Mar 2026: 5.40%
Jul 2025: 5.60%    Oct 2025: 5.60%    Jan 2026: 5.00%    Apr 2026: 5.20% (current)
```

12-month average: 5.27%
Advisory signal: **Favorable** (current below average)

---

## Design Reference

All visual styling follows `DESIGN.md` at project root. Key principles:
- No-line rule: background shifts over borders
- Manrope for headlines only, Geist Sans for UI, Geist Mono for financial data
- Deep navy sidebar, warm off-white canvas
- Dramatic KPI sizing (10px label, 36-48px value)
- Status pills with signal dots
- Tinted navy shadows, tonal layering for depth
