# Sava Auto-GRAT Platform — Demo Spec

## Overview

A fully interactive demo of Sava's Auto-GRAT platform, designed to convince a wealth management advisor that this product is real, polished, and worth adopting. The demo presents the advisor's perspective only — no attorney or client portals. No login required.

The demo runs on mock data with a thin server layer (Next.js server actions mutating in-memory state) so that actions like "Approve Rollover" persist across page navigation within a session.

**Core narrative to communicate through the UI:**
1. **Sava Trust Company is a real institutional trustee** — not a SaaS tool, but a Nevada-chartered corporate trustee with software that makes rolling GRATs effortless
2. **The advisor's economics are preserved** — assets stay at their custodian, their AUM fee is untouched
3. **GRATs are a free option** — upside transfers tax-free, downside costs nothing
4. **Alternative assets are Sava's killer differentiator** — PE, hedge funds, RE LLCs welcome here (unlike BNY Mellon)
5. **Rolling beats one-shot** — the timeline visualization and cumulative transfer chart prove this visually

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
├── layout.tsx                     # Root layout: fonts, sidebar shell, Sava footer
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
│           ├── grat_timeline.tsx   # Gantt-style rolling GRAT visualization
│           ├── cumulative_chart.tsx # Area chart of wealth transferred over time
│           ├── annuity_schedule.tsx
│           ├── client_history.tsx
│           ├── client_header.tsx
│           ├── tax_documents.tsx
│           └── workflow_tracker.tsx # Trust execution step tracker
├── modeling/
│   ├── page.tsx                   # GRAT modeling tool
│   └── components/
│       ├── parameter_form.tsx
│       ├── projection_panel.tsx
│       ├── risk_profile.tsx        # Win / no-lose scenario comparison
│       └── annuity_preview.tsx
├── reports/
│   ├── page.tsx                   # Wealth transfer reports
│   └── components/
│       └── advisor_impact.tsx      # AUM fee preserved, Sava fee separate
├── rate_monitor/
│   └── page.tsx                   # 7520 rate monitor
├── settings/
│   └── page.tsx                   # Settings (with Reset Demo)
components/
├── layout/
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── app_shell.tsx
│   └── sava_footer.tsx            # "Administered by Sava Trust Company | Nevada"
├── ui/
│   ├── stat_card.tsx              # Hero + light variants
│   ├── status_pill.tsx
│   ├── asset_type_badge.tsx       # Public Equity, Private Co., RE LLC, PE Fund
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
type AssetType = "public_equity" | "concentrated_stock" | "private_co" | "re_llc" | "pe_fund" | "hedge_fund" | "diversified"

type AssetHolding = {
  name: string                     // "NVDA", "Morrison RE Holdings LLC — Unit B"
  type: AssetType
  value: number
  lastValuationDate?: string       // Required for alternative assets
  valuationStale?: boolean         // True if lastValuationDate > 90 days ago
}

type Household = {
  id: string
  name: string
  description: string              // "Tech founder — Concentrated NVDA"
  primaryContact: string
  custodian: "Schwab" | "Fidelity" | "Pershing"
  totalAUM: number
  wealthTransferred: number
  status: "action_needed" | "rollover_ready" | "underperforming" | "on_track" | "new"
  holdings: AssetHolding[]         // Client's asset holdings for GRAT funding
  advisorFeeRate: number           // e.g. 0.0085 (0.85%) — advisor's AUM fee on trust assets
  createdAt: string
}

type WorkflowStep = {
  label: string                    // "Attorney Review"
  status: "completed" | "active" | "pending"
  completedAt?: string
  detail?: string                  // "Approved by J. Martinez, Esq."
}

type GRAT = {
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
  rolledFromId?: string            // Link to predecessor GRAT
  rolledToId?: string              // Link to successor GRAT
  trustee: "Sava Trust Company"    // Always Sava — shown on every GRAT
  jurisdiction: "Nevada"           // Always Nevada
  workflow: WorkflowStep[]         // Trust execution workflow tracker
  attorneyName?: string            // "J. Martinez, Esq."
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
  proposedAssetType: AssetType
  current7520Rate: number
  recommendation: string
  status: "pending" | "approved" | "declined"
  createdAt: string
}

type Activity = {
  id: string
  householdId?: string
  type: "grat_created" | "rollover_approved" | "annuity_paid" | "substitution" | "rollover_proposed" | "valuation_requested" | "trust_accepted"
  description: string
  timestamp: string
}

type TrustDocument = {
  id: string
  gratId?: string
  householdId: string
  name: string                     // "Form 709 — Gift Tax Return (2025)"
  type: "trust_instrument" | "form_709" | "trust_return" | "annuity_confirmation" | "funding_instructions"
  date: string
  downloadable: boolean            // false in demo — shows toast "Available in production"
}

type RateDataPoint = {
  month: string                    // "Apr 2026"
  rate: number
}

type CumulativeTransferPoint = {
  date: string
  totalTransferred: number
  gratName: string                 // Which GRAT maturity caused this step-up
}
```

### 5 Client Archetypes

| # | Household | Profile | AUM | Active GRATs | Holdings | Status | Key Demo Moment |
|---|-----------|---------|-----|-------------|----------|--------|-----------------|
| 1 | **Chen Family** | Tech founder, concentrated NVDA | $12M | 3 (+ 1 maturing) | NVDA (concentrated stock), AAPL, diversified index funds | Action needed | Deep client: full GRAT history, maturing GRAT with rollover recommendation, trust execution workflow visible |
| 2 | **Ambani Trust** | Pre-IPO exec, private co. + public equities | $45M | 2 (+ 1 rollover pending) | Vertex AI Inc. (private co. stock — **stale valuation**), QQQ, diversified bonds | Rollover ready | High-value client, demonstrates alternative asset handling, stale valuation alert triggers "Request Updated Valuation" |
| 3 | **Morrison Family** | RE investor, LLCs + diversified | $10M | 2 (1 underperforming) | Morrison RE Holdings LLC — Unit B (RE LLC), Morrison RE Holdings LLC — Unit D (RE LLC), VTI index | Underperforming | Asset substitution alert, RE LLC entities with real names, shows Sava handles what BNY Mellon won't |
| 4 | **Nakamura Trust** | Retiree, diversified portfolio | $7.5M | 4 (mature rolling ladder) | VTI, BND, AAPL, international index | On track | Steady-state rolling strategy — Gantt timeline shows beautiful overlapping pattern, cumulative transfer chart shows step-ups |
| 5 | **Whitfield Family** | New client, diversified | $10M | 1 | SPY, QQQ, BND, diversified | New | Getting started state — single GRAT with workflow tracker showing recent trust acceptance by Sava. No $10M minimum message implicit |

### GRAT Workflow Steps (pre-populated for existing GRATs)

Every GRAT shows a 6-step trust execution workflow:

```
1. Proposal Created          ✓  "Created by Michael Reynolds"
2. Attorney Review           ✓  "Approved by J. Martinez, Esq."
3. E-Signature               ✓  "Signed Mar 15, 2026"
4. Trust Accepted             ✓  "Sava Trust Company, Nevada"
5. Funding Instructions       ✓  "Sent to Schwab"
6. Trust Funded               ✓  "Funded $4,000,000"
```

For newly created GRATs in the demo, steps 1-3 auto-complete with a brief animation, step 4 shows "Sava Trust Company accepting..." momentarily, then all steps complete.

---

## Pages

### 1. Dashboard (`/dashboard`)

The advisor's home screen. Shows portfolio-level metrics and surfaces items that need attention.

**Layout:**
- 4 metric stat cards in a row (grid-cols-4)
- 2-column grid below: "Needs Attention" panel (left) + "Recent Activity" feed (right)
- Footer bar: "Administered by Sava Trust Company | Nevada Trust Charter | FDIC Custodied at Client's Broker"

**Stat Cards:**
| Card | Value | Trend | Variant |
|------|-------|-------|---------|
| Active GRATs | 12 | +3 this quarter | Hero (gradient) |
| Wealth Transferred | $11.06M | +$2.5M YTD | Hero (gradient) |
| Pending Rollovers | 4 | 2 due this week | Light |
| Client Households | 5 | $84.5M total AUM | Light |

**Needs Attention Panel:**
- List of 4-5 action items pulled from GRAT statuses and asset conditions
- Each item: household name, description, action link ("Review →", "Approve →", "Substitute →", "Update Valuation →")
- Color-coded backgrounds: amber for maturing/pending, red for underperforming, blue-tinted for valuation alerts
- Items:
  1. **Chen Family** — GRAT-2024-Q3 maturing Apr 18 → "Review →"
  2. **Ambani Trust** — Rollover proposal ready → "Approve →"
  3. **Morrison Family** — GRAT underperforming hurdle rate → "Substitute →"
  4. **Ambani Trust** — Vertex AI Inc. valuation is 95 days old → "Request Update →"
- Clicking an action link navigates to the relevant client detail page

**Recent Activity Feed:**
- Chronological list of recent actions across all clients
- Each item: date + description
- Includes Sava-sourced activities: "Sava Trust Company accepted GRAT-2026-Q2 for Chen Family"
- 6-8 items visible

### 2. Clients List (`/clients`)

**Layout:**
- Search bar + status filter dropdown + "New Client" button
- Full-width data table

**Table Columns:**
| Column | Alignment | Font | Notes |
|--------|-----------|------|-------|
| Household (name + description) | Left | Geist Sans, name semibold, desc label-md muted | |
| Custodian | Left | Geist Sans body | Shows "Assets held at [custodian]" — reinforces advisor AUM preservation |
| Active GRATs | Left | Geist Mono bold | |
| Asset Types | Left | Asset type badges | Shows distinct badges for asset types in active GRATs (e.g., "Public Equity" + "RE LLC") |
| Trust AUM | Right | Geist Mono | |
| Wealth Transferred | Right | Geist Mono, color secondary | |
| Status | Left | Status pill | |

- Rows are clickable → navigate to `/clients/[id]`
- Hover state: `bg-primary-fixed/20`
- Alternative asset badges (Private Co., RE LLC, PE Fund) get a distinctive visual treatment — slightly different pill style with a small icon to highlight that Sava handles these

### 3. Client Detail (`/clients/[id]`)

**Header Card:**
- Household name (headline-lg), description
- **"Assets held at [Custodian]"** — prominent display, reinforces advisor's AUM stays in place
- **"Trustee: Sava Trust Company, NV"** — subtle but persistent attribution
- Established date
- Action buttons: "Request Valuation" (if any holdings have stale valuations), "Asset Substitution" (secondary), "+ New GRAT" (primary)

**Metrics Row (4 cards):**
- Trust AUM, Wealth Transferred, Active GRATs, Avg Return vs Hurdle

**Tabbed Content:**

**Tab 1: GRAT Ladder** (default)

Two sub-sections stacked vertically:

**1a. Rolling Strategy Timeline** (visual)
- Gantt-style horizontal bar chart (Recharts or custom SVG)
- X-axis: time (months), spanning from the earliest GRAT start to ~6 months after the latest maturity
- Each GRAT is a horizontal bar spanning start → maturity date
- Bar colors by status: active = primary, maturing = tertiary-fixed-dim, rolled = surface-container-high (faded), underperforming = error
- Arrows connecting rolled GRATs to their successors show compounding
- This is the "rolling strategy proof" — Nakamura Trust's 4 overlapping bars look like a beautiful staggered pattern
- Current date shown as a vertical dashed line

**1b. GRAT Ladder Table** (data)
- Table showing all GRATs for the household (active + historical)
- Columns: GRAT name + date range, Asset (with asset type badge), Funded amount, Term, Hurdle rate, Current Value, Est. Remainder, Trustee, Status
- **Trustee column**: Always shows "Sava Trust Co." — reinforces institutional backing on every row
- **Asset type badges** inline: small pills like "Concentrated Stock", "RE LLC", "Private Co." — alternative assets are visually distinct
- Maturing GRATs highlighted with amber background + rollover recommendation
- Historical (rolled/completed) GRATs shown at reduced opacity with link to successor
- Clicking a GRAT row expands to show the **workflow tracker** (6-step trust execution timeline)
- Clicking a maturing GRAT opens the rollover approval flow

**Cumulative Wealth Transfer Chart** (below the ladder)
- Simple area chart (Recharts) showing total tax-free wealth transferred over time
- X-axis: time, Y-axis: cumulative $ transferred
- Each GRAT maturity creates a visible step-up in the chart
- GRAT names annotated at each step-up point
- This is the "it's working" proof — shows compounding value of the rolling strategy

**Tab 2: Annuity Schedule**
- Timeline view of all upcoming and past annuity payments across active GRATs
- Columns: GRAT, Payment #, Due Date, Amount, Status
- Paid = green check, Scheduled = gray, Overdue = red
- Footer note: "Annuity payments processed by Sava Trust Company"

**Tab 3: History**
- Activity feed filtered to this household
- Shows GRAT creations, rollovers, payments, substitutions
- Includes Sava-sourced events: "Trust accepted by Sava Trust Company", "Funding instructions sent to [Custodian]"

**Tab 4: Tax & Documents**
- Organized by year, then by document type
- Realistic document names with dates:
  - **2025 Tax Season:**
    - "Form 709 — Gift Tax Return (2025)" — type: form_709
    - "Trust Income Tax Return — GRAT-2025-Q1 (2025)" — type: trust_return
    - "Trust Income Tax Return — GRAT-2025-Q3 (2025)" — type: trust_return
  - **Trust Instruments:**
    - "Trust Instrument — GRAT-2026-Q1" — type: trust_instrument
    - "Trust Instrument — GRAT-2025-Q3" — type: trust_instrument
  - **Payment Confirmations:**
    - "Annuity Payment Confirmation — GRAT-2025-Q1 — Q1 2026" — type: annuity_confirmation
    - "Annuity Payment Confirmation — GRAT-2025-Q3 — Q1 2026" — type: annuity_confirmation
  - **Funding:**
    - "Funding Instructions — GRAT-2026-Q1 — Schwab" — type: funding_instructions
- Each row: document icon, name, date, "Download" button
- Download click shows toast: "PDF generation available in production environment"
- Section footer: "All trust documents prepared and maintained by Sava Trust Company"

### 4. GRAT Modeling (`/modeling`)

The "wow" moment. Split layout — parameters on left, live projections on right.

**Left Panel: Parameters**
- Client selector (dropdown)
- Funding Amount (input + slider, $1M–$50M range)
- GRAT Term (button group: 2 years / 3 years / 5 years)
- Funding Asset (dropdown — populated from selected client's holdings, with asset type badges)
  - Alternative assets show last valuation date: "Vertex AI Inc. (Private Co.) — Valued Jan 2, 2026"
- Expected Annual Return (input + slider, 0–30% range)
- Current 7520 Rate (read-only display with advisory signal)
- **Trustee info block:** "Corporate Trustee: Sava Trust Company | Jurisdiction: Nevada | Assets held at: [client's custodian]"
- Buttons: "Generate Proposal" (primary) + "Save Draft" (secondary)

**Right Panel: Live Projections (updates on every parameter change)**

**Section 1: Projected Outcome**
- Two hero metric cards:
  - Est. Tax-Free Transfer (green background)
  - Gift Tax Saved at 40% rate (blue/primary background)
- Detail metrics row (3 cards): Total Annuity Payments, Projected End Value, Excess Over Hurdle

**Section 2: Risk Profile — "The Free Option"**
This is the key selling frame. A side-by-side comparison card:

| | Assets Outperform Hurdle | Assets Underperform Hurdle |
|---|---|---|
| **Outcome** | Excess transfers to beneficiaries **tax-free** | All assets return to grantor |
| **Amount** | **$1,218,750** transferred | **$0** transferred |
| **Gift Tax Owed** | $0 (zeroed-out GRAT) | $0 |
| **Cost to Grantor** | $0 | $0 — **nothing is lost** |

- Visual treatment: two cards side by side. Left card has green accent (the upside). Right card has neutral/gray treatment (the "no-lose" case).
- Headline above: **"A call option with zero premium"**
- Subtext: "If the GRAT outperforms the 5.20% hurdle, the excess passes tax-free. If it doesn't, everything returns to the grantor. There is no downside."

**Section 3: Annuity Schedule Preview**
- Year-by-year payment breakdown + remainder to beneficiaries

**Section 4: Advisor Economics Note**
- Small card below projections:
  - "Your AUM fee: **$[X]/year** (preserved — assets remain at [custodian])"
  - "Sava trust admin: **$[Y]/year** (billed to client separately, not from your fee)"
  - "Client's net tax savings: **$[Z]** — justifies both fees many times over"

**GRAT Math (implemented in `lib/grat_math.ts`):**
- Zeroed-out annuity calculation: PV of annuity payments = funding amount at 7520 rate
- For a 2-year GRAT: each annual payment = funding / PV annuity factor
- PV annuity factor = (1 - (1 + r)^(-n)) / r where r = 7520 rate, n = term
- Projected end value = funding * (1 + expectedReturn)^term
- Remainder = projected end value - sum of annuity payments
- Gift tax saved = remainder * 0.40
- Advisor AUM fee = funding * household.advisorFeeRate
- Sava admin fee = funding * 0.0025 (0.25%)

### 5. Reports (`/reports`)

Cross-client wealth transfer summary.

**Header:**
- Title + date range filters (This Quarter / YTD / All Time toggle) + "Export PDF" button

**Metrics Row (4 hero cards):**
- Total Wealth Transferred ($11.06M), Gift Tax Saved ($4.42M), GRATs Completed (14), Avg Excess Return (+7.2%)

**Section 1: Per-Client Performance Table**
| Column | Details |
|--------|---------|
| Household | Name |
| Trust AUM | Right-aligned mono |
| Transferred | Right-aligned mono, color secondary |
| Tax Saved | Right-aligned mono, color secondary |
| Avg Return | Mono, colored (green positive, red negative) |
| GRATs | Count (active + matured breakdown) |

**Section 2: Advisor Impact** (new — key selling section)

A card with headline "Your Practice Economics" showing:

| Metric | Value | Note |
|--------|-------|------|
| **Your AUM Fee on Trust Assets** | $718,250/year | "Based on your standard fee rates across all client households" |
| **Sava Trust Admin Fee** | $211,250/year | "Billed to clients separately — does not reduce your fee" |
| **Total Client Tax Savings** | $4,420,000 | "Cumulative gift tax avoided across all households" |
| **Client Retention Value** | — | "Each GRAT rollover is a client touchpoint. 28 touchpoints this year." |

- Visual treatment: this should feel like a "what's in it for you" summary
- Subtext: "Sava holds all trust assets at your clients' existing custodians. Your advisory relationship and fee structure are fully preserved."

**Section 3: Sava Trust Administration Summary** (new — Sava shines)

A card showing Sava's role across the practice:

| Metric | Value |
|--------|-------|
| Active Trusts Administered | 12 |
| Rollovers Processed This Year | 7 |
| Annuity Payments Processed | 16 |
| Trust Documents Generated | 34 |
| Alternative Assets Under Administration | 4 (2 RE LLCs, 1 Private Co., 1 PE Fund) |

- Footer: "All trusts administered by Sava Trust Company under Nevada trust charter"

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
- Recommendation column shows actionable advice: "Favorable — consider new GRAT origination" or "Neutral — maintain current positions"

### 7. Settings (`/settings`)

Mostly decorative. Key functional element:

- **Reset Demo** button: server action that restores all data to initial fixtures
- Firm profile (read-only display): "Reynolds Wealth Management"
- Default GRAT parameters (decorative form): default term, default annuity structure
- Notification preferences (decorative toggles): rollover alerts, valuation reminders, annuity payment confirmations
- **Trust Company Info** (read-only): "Corporate Trustee: Sava Trust Company | Charter: Nevada | Trust Administration: 0.25% annually"

---

## Interactive Workflows

### Rollover Approval Flow

**Trigger:** Advisor clicks "Review" on a maturing GRAT (from dashboard or client detail)

**Modal/Sheet (glassmorphism overlay):**

1. **Header:** "ROLLOVER PROPOSAL" label (label-xs uppercase tracked), household name (headline-sm), GRAT ID, maturity date, original funding

2. **Maturing GRAT Performance** (gradient background card):
   - 3 metric blocks: Current Value, Annuities Paid, Remainder to Beneficiaries
   - The remainder value is the hero number — large, green, showing what was earned

3. **Proposed New GRAT** (light card):
   - Pre-populated parameters in a clean grid: Funding Amount, Term, 7520 Rate, Funding Asset (with asset type badge)
   - **Trustee line:** "Trustee: Sava Trust Company, NV" — always visible
   - Each parameter is editable (advisor can tweak before approving)

4. **Recommendation Signal:**
   - Green info card: "Current 7520 rate (5.20%) is below 12-month average. Rolling now locks in favorable conditions for the new GRAT term."

5. **Trust Execution Preview:**
   - "Upon approval, Sava Trust Company will:" followed by a compact workflow preview:
     - Generate successor trust instrument
     - Coordinate attorney review (J. Martinez, Esq.)
     - Process e-signature
     - Accept trust and issue funding instructions to [Custodian]
   - This shows the advisor that clicking "Approve" triggers a real institutional process

6. **Actions:** "Modify Parameters" (secondary), "Decline" (outline), "Approve Rollover" (primary)

**On Approve (server action):**
- Source GRAT status → "rolled", linked to new GRAT via `rolledToId`
- New GRAT created with status "active", linked back via `rolledFromId`
- New GRAT gets full workflow steps (all marked completed with timestamps)
- Activity entries added (including "Trust accepted by Sava Trust Company")
- RolloverProposal status → "approved"
- Dashboard pending count decremented
- `revalidatePath` on dashboard, client detail, and reports

### Asset Substitution Flow

**Trigger:** Advisor clicks "Substitute" on an underperforming GRAT

**Modal/Sheet:**
1. **Header:** household name, GRAT ID, "Asset Substitution — IRC 675(4)" (the legal reference adds institutional credibility)
2. **Current Performance:** current asset name + type badge, current value, performance since funding, performance vs hurdle rate (shown as a gap: "Trailing hurdle by 3.2%")
3. **Current Asset Detail:** name, type badge, funded value, current value, return since funding
4. **Proposed Replacement:** asset selector (from client's holdings, with type badges) + FMV input
5. **FMV Validation:** "Equal value swap required per IRC 675(4). FMV of replacement asset must equal current GRAT value of $[X]." Input validates that values match.
6. **Sava note:** "Sava Trust Company will document the substitution, validate FMV, and update trust records. $500 substitution fee applies."
7. **Actions:** "Cancel", "Execute Substitution" (primary)

**On Execute (server action):**
- GRAT funding asset and asset type updated
- Activity entry added: "Asset substitution: [old] → [new] for GRAT-[id], validated by Sava Trust Company"
- GRAT status → "active" (clears underperforming)
- `revalidatePath` on client detail and dashboard

### Stale Valuation Request Flow

**Trigger:** Advisor clicks "Request Update" on a stale valuation alert (dashboard or client header)

**Modal/Sheet:**
1. **Header:** "Valuation Update Request"
2. **Asset Info:** name, type (e.g., "Private Co. Stock"), last valuation date, days since last valuation
3. **Message:** "Alternative assets require periodic fair market value updates for GRAT compliance. Sava Trust Company will coordinate with the asset manager to obtain a current valuation."
4. **Actions:** "Cancel", "Request Valuation" (primary)

**On Request (server action):**
- Activity entry added: "Valuation update requested for [asset] — Sava Trust Company coordinating"
- Toast notification: "Valuation request sent. Sava Trust Company will coordinate with the asset manager."
- In the demo, this is cosmetic — the valuation doesn't actually update. But it shows the workflow exists.

### Create New GRAT Flow

**Trigger:** "+ New GRAT" button (header, client detail, or modeling page)

**Path:** Navigates to `/modeling` with client pre-selected. Advisor fills parameters, clicks "Generate Proposal". Proposal view shown with:

- Full projection results (including risk profile and advisor economics)
- **"Create GRAT" button** — labeled "Create GRAT — Sava Trust Company will serve as trustee"
- On click: brief animation showing trust execution workflow steps completing (1-2 seconds)

**On Create (server action):**
- New GRAT added to store with status "active"
- Workflow steps all marked completed with current timestamps
- Annuity schedule generated from GRAT math
- Activity entries added (including "Trust accepted by Sava Trust Company")
- Client's active GRAT count incremented
- `revalidatePath` on dashboard, client detail, reports

---

## Sava Trust Company Presence — Summary

Sava Trust Company should be visible at every level of the UI without being overbearing:

| Location | How Sava Appears |
|----------|-----------------|
| **Sidebar** | "SAVA" logo + "Auto-GRAT Platform" subtitle |
| **Footer** | "Administered by Sava Trust Company · Nevada Trust Charter" |
| **Every GRAT row** | "Trustee: Sava Trust Co." column |
| **Workflow tracker** | Step 4: "Trust Accepted by Sava Trust Company" |
| **Rollover modal** | "Upon approval, Sava Trust Company will..." + execution preview |
| **Substitution modal** | "Sava Trust Company will document the substitution" |
| **Modeling tool** | Trustee info block + advisor economics note |
| **Reports** | "Sava Trust Administration Summary" card |
| **Annuity tab footer** | "Annuity payments processed by Sava Trust Company" |
| **Tax & Documents** | "All trust documents prepared by Sava Trust Company" |
| **Activity feed** | "Trust accepted by Sava Trust Company" events |
| **Settings** | Trust Company info section |

The principle: Sava should feel like a trusted institutional partner embedded in every step — not a watermark, but a co-pilot.

---

## Server Actions (`lib/data/actions.ts`)

| Action | Input | Effect |
|--------|-------|--------|
| `approveRollover` | rolloverProposalId | Marks source GRAT as rolled, creates new GRAT with workflow, updates proposal, adds activities |
| `declineRollover` | rolloverProposalId | Updates proposal status to declined |
| `createGrat` | householdId, params | Creates new GRAT with workflow + annuity schedule, adds activities |
| `executeSubstitution` | gratId, newAsset, newAssetType, fmv | Updates GRAT asset, clears underperforming status, adds activity |
| `requestValuation` | householdId, assetName | Adds activity entry (cosmetic in demo) |
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
- Asset type badges with distinct styling for alternative assets
- Tinted navy shadows, tonal layering for depth
- Sava Trust Company presence: institutional, not promotional — embedded in workflows, not plastered as ads
