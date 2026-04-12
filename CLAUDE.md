@AGENTS.md

# Sava Auto-GRAT Platform

## What Is This Project?

This is the **demo/prototype** for Sava's Auto-GRAT product — a platform that combines Sava's Nevada trust charter with purpose-built software to automate rolling GRAT (Grantor Retained Annuity Trust) programs for wealth advisors. Sava is a YC F25 company backed by Gradient Ventures.

The app is a fully functional, production-grade demo with mock data. It is **not connected to real backends or databases** — all state lives in an in-memory store that resets on server restart (or via the Settings page reset button).

---

## The Business Problem

### What Is a GRAT?

A Grantor Retained Annuity Trust is an estate planning vehicle that transfers wealth tax-free. The grantor puts assets into a trust, receives annuity payments back over a fixed term (typically 2 years), and any appreciation above the IRS Section 7520 hurdle rate passes to beneficiaries with zero gift tax. If the assets don't beat the hurdle, everything returns to the grantor — nothing is lost. It's a free option on asset appreciation.

Key tax references: IRC 2702, IRC 7520, Walton v. Commissioner (2003), IRC 675(4).

### Why Rolling GRATs?

A single GRAT is one bet. A **rolling GRAT strategy** creates overlapping short-term GRATs on a recurring cadence (quarterly). This diversifies timing risk, creates an asymmetric payoff profile (upside with no downside), and compounds through rollovers. It is universally agreed to be optimal — but almost nobody does it because the operational burden is extreme.

Each GRAT requires: trust instrument drafting, attorney review, grantor execution, trustee acceptance, custodian funding, annuity tracking, tax reporting, and maturity monitoring. Multiply by 4 GRATs/year/client across 50 clients and it's unmanageable. Most advisors do one GRAT at inception and never roll.

### Sava's Solution

Sava is the **only entity that can serve as trustee, generate trust instruments, administer the trust, automate the rolling lifecycle, support alternative assets, and provide a unified platform**. The charter is the moat; the software is the distribution wedge.

---

## Who Uses This Platform (Three User Roles)

### 1. Wealth Advisor (Primary User)
- Creates proposals, configures rolling strategies, approves rollovers, manages client households
- The demo is built from the advisor's perspective (user: "Michael Reynolds, CFP" at Reynolds Wealth Management)
- Advisor retains AUM fee on trust assets (Sava holds assets at advisor's existing custodian)

### 2. T&E Attorney (Reviewer)
- Reviews and approves trust instruments at creation and rollover
- Receives $500 per GRAT review from Sava (recurring passive income)
- Attorneys in the demo: Sarah Kim (Kim & Associates), David Park (Park Estate Law), Lisa Tran (Tran Legal Group)

### 3. Client/Grantor (Optional Read-Only)
- Optional read-only access toggled by advisor per household
- Views active GRATs, annuity schedules, estimated wealth transferred

---

## Product Economics (Revenue Model)

| Fee | Amount | Notes |
|-----|--------|-------|
| Trust Administration | 0.25% of trust assets/year | Core recurring revenue. Billed quarterly. Min $1,500/year per household. |
| Per-GRAT Fee | $1,500 per GRAT | Flat fee for each new GRAT or rollover. Covers docs, attorney coordination, e-sig, funding. |
| Platform Subscription | $5K-$15K/year per firm | Optional. Tiered by households. Reduces per-GRAT fee to $1,000. |
| Asset Substitution | $500 per swap | Charged when grantor exercises substitution power. |

At 100 households in steady state, Sava ARR reaches ~$2.55M from Auto-GRAT alone.

---

## Core Product Capabilities

1. **GRAT Modeling** — Calculator with real-time 7520 rate, projected remainder, annuity schedules, risk profiles
2. **One-Click GRAT Creation** — From parameterized templates, with attorney review workflow
3. **Automated Annuity Tracking** — Payment scheduling, status tracking (scheduled/paid/overdue)
4. **Rolling GRAT Engine** — Auto-proposes rollovers as GRATs approach maturity; advisor approves with one click
5. **Asset Substitution** — Alerts advisor when GRAT underperforms hurdle rate; streamlined swap with FMV validation
6. **Cumulative Wealth Transfer Reporting** — Across entire GRAT ladder per household
7. **Tax Season Exports** — Form 709 and trust-level returns (UI only in demo)
8. **Alternative Asset Support** — PE, hedge funds, RE LLCs with manual valuation prompts and stale-value flagging
9. **7520 Rate Monitor** — Historical rate tracking with per-client impact analysis and advisory signals

---

## Competitive Landscape

**Corporate trustees** (BNY Mellon, Wilmington Trust, Great Gray): Trust admin but no GRAT automation. High minimums ($10M+), decline alternative assets.

**Estate planning software** (WealthCounsel, Interactive Legal, Vanilla): Document drafting only. No trust administration, no rolling automation.

Sava is the only integrated solution.

---

## Tech Stack

- **Framework**: Next.js 16.2.3 (App Router)
- **Runtime**: React 19.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts 3.8.1
- **Fonts**: Geist Sans (body/UI), Geist Mono (financial data), Manrope (headlines)
- **Icons**: Material Symbols Outlined (Google Fonts)
- **Package Manager**: Bun

---

## Architecture & Data Flow

### Data Layer
- **No database** — all data lives in `lib/data/store.ts` (in-memory clones of fixtures)
- **Fixtures** in `lib/data/fixtures.ts` — 5 mock households with realistic GRAT scenarios
- **Server Actions** in `lib/data/actions.ts` — mutations via `"use server"` with `revalidatePath`
- **Calculations** in `lib/grat_math.ts` — annuity factors, projections, remainder calculations
- **Formatting** in `lib/format.ts` — currency, percentages, dates

### Rendering
- Pages are **Server Components** that fetch data directly from the store
- Interactive sections (modals, tabs, forms) are **Client Components** with `"use client"`
- Toast notifications via React Context (`components/ui/toast.tsx`)

### State Management
- Server state: in-memory store, refreshed via `revalidatePath("/", "layout")` after mutations
- Client state: `useState` for UI concerns (modals, tabs, expanded rows, form values)

---

## Project Structure

```
app/
  layout.tsx              # Root layout (fonts, ToastProvider, AppShell)
  page.tsx                # Redirects to /dashboard
  dashboard/page.tsx      # Stats, alerts, activity feed
  clients/
    page.tsx              # Household list table
    [id]/
      page.tsx            # Client detail with tabbed interface
      components/         # Client-specific components (timeline, ladder, annuity, etc.)
  modeling/
    page.tsx              # GRAT calculator/modeler
    components/           # Parameter form, projection panel, risk profile
  rate_monitor/
    page.tsx              # 7520 rate history and impact analysis
    rate_chart.tsx
  reports/
    page.tsx              # Wealth transfer summary, advisor/attorney economics
    components/
  settings/page.tsx       # Firm profile, defaults, demo reset

components/
  layout/                 # AppShell, Sidebar, Header, Footer
  ui/                     # StatCard, StatusPill, Modals, Toast, WorkflowTracker, etc.

lib/
  types.ts                # TypeScript types (Household, GRAT, AnnuityPayment, etc.)
  format.ts               # Number/date formatting utilities
  grat_math.ts            # GRAT calculation engine
  data/
    fixtures.ts           # Mock data (5 households, GRATs, activities, documents)
    store.ts              # In-memory data store with read/write operations
    actions.ts            # Server actions (approveRollover, createGrat, etc.)
```

---

## Demo Data & Scenarios

**Simulation date**: April 11, 2026

| Household | AUM | Transferred | Key Scenario |
|-----------|-----|-------------|--------------|
| Chen Family | $12M | $3.8M | Tech founder, concentrated NVDA. One GRAT maturing (rollover ready). |
| Ambani Trust | $45M | $5.2M | Pre-IPO exec, private co shares. Pending rollover proposal. |
| Morrison Family | $10M | $1.56M | RE investor, LLC holdings. One GRAT underperforming (substitution available). |
| Nakamura Trust | $7.5M | $0.5M | Retiree, diversified ladder. Demonstrates successful rolling strategy. |
| Whitfield Family | $10M | $0 | New client, no GRATs yet. Demonstrates onboarding flow. |

**Total**: $84.5M AUM, $11.06M wealth transferred, 13 GRATs across all statuses.

---

## Design System

See `DESIGN.md` for the full design specification. Key principles:

- **Aesthetic**: Swiss-influenced financial editorial — institutional authority, quiet confidence
- **No-line philosophy**: Background shifts replace borders; no 1px solid borders for sectioning
- **Typography hierarchy**: Dramatic size contrast — KPI labels at 10px uppercase, values at 36-48px bold
- **Color**: Navy primary (#001b44), signal colors only for semantics (green=success, amber=warning, red=error)
- **Shadows**: Tinted with primary navy, never default CSS shadows

---

## What's Implemented vs Stub

### Fully Working
- Dashboard with live stats and attention items
- Client list and detail pages with all tabs
- GRAT modeling with real-time calculations
- Rollover approval/decline workflow
- Asset substitution with FMV validation
- Valuation request workflow
- 7520 rate monitor with chart and impact analysis
- Reports with advisor/attorney economics
- Activity timeline across all pages
- Toast notifications for all actions
- Demo data reset

### Stubs (UI Only)
- Search on clients page (input rendered, no filtering)
- New Client button (no create flow)
- Document downloads ("PDF generation available in production")
- Settings notification toggles (decorative)
- Report time period filters (always show all-time)
- Export PDF button on reports

---

## File Naming Conventions

- All files use **snake_case** (e.g., `stat_card.tsx`, `grat_math.ts`)
- React components are named in **PascalCase** inside files
- Route-specific components live in their route's `components/` directory
- Shared components live in `components/ui/` or `components/layout/`
