# Marketing Landing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a marketing landing page at `/` with three persona-specific subpages (`/for-advisors`, `/for-attorneys`, `/for-families`) that sell the Sava Auto-GRAT platform to its three audiences, with a "Launch Demo" CTA linking into the existing app.

**Architecture:** Use Next.js route groups to separate marketing pages (full-width, no sidebar) from app pages (sidebar + header). The root layout provides fonts and global styles. `(marketing)/layout.tsx` provides a marketing nav + footer. `(app)/layout.tsx` wraps content in the existing `AppShell`. All marketing pages are server components with no client-side state (except a mobile nav toggle).

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4 with existing design tokens, Manrope/Geist fonts (already configured), next/image for logo.

---

## File Map

```
app/
├── layout.tsx                          # MODIFY: Remove AppShell wrapper, keep fonts + ToastProvider
├── (marketing)/
│   ├── layout.tsx                      # CREATE: Marketing layout (nav + footer, no sidebar)
│   ├── page.tsx                        # CREATE: Main landing page (was redirect to /dashboard)
│   ├── for-advisors/
│   │   └── page.tsx                    # CREATE: Wealth manager persona page
│   ├── for-attorneys/
│   │   └── page.tsx                    # CREATE: T&E attorney persona page
│   └── for-families/
│       └── page.tsx                    # CREATE: Client/family persona page
├── (app)/
│   ├── layout.tsx                      # CREATE: App layout (AppShell wrapper)
│   ├── dashboard/
│   │   └── page.tsx                    # MOVE from app/dashboard/page.tsx
│   ├── clients/
│   │   ├── page.tsx                    # MOVE from app/clients/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx               # MOVE from app/clients/[id]/page.tsx
│   │       └── components/            # MOVE from app/clients/[id]/components/
│   ├── modeling/
│   │   ├── page.tsx                    # MOVE from app/modeling/page.tsx
│   │   └── components/                # MOVE from app/modeling/components/
│   ├── reports/
│   │   ├── page.tsx                    # MOVE from app/reports/page.tsx
│   │   └── components/                # MOVE from app/reports/components/
│   ├── rate_monitor/
│   │   └── page.tsx                    # MOVE from app/rate_monitor/page.tsx (+ rate_chart.tsx)
│   └── settings/
│       └── page.tsx                    # MOVE from app/settings/page.tsx
components/
└── marketing/
    ├── marketing_nav.tsx               # CREATE: Top nav for marketing pages
    ├── marketing_footer.tsx            # CREATE: Footer for marketing pages
    ├── hero_section.tsx                # CREATE: Reusable hero section component
    └── feature_section.tsx             # CREATE: Reusable feature section with alternating bg
```

---

### Task 1: Restructure Routes with Route Groups

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/(app)/layout.tsx`
- Create: `app/(marketing)/layout.tsx`
- Move: all existing app pages into `app/(app)/`

This task restructures the app to support two layouts. Marketing pages get full-width, no sidebar. App pages keep the existing sidebar + header layout.

- [ ] **Step 1: Move existing app pages into (app) route group**

```bash
cd /Users/nimit/conductor/workspaces/sava-grat-demo/buffalo
mkdir -p app/\(app\)
mv app/dashboard app/\(app\)/dashboard
mv app/clients app/\(app\)/clients
mv app/modeling app/\(app\)/modeling
mv app/reports app/\(app\)/reports
mv app/rate_monitor app/\(app\)/rate_monitor
mv app/settings app/\(app\)/settings
```

- [ ] **Step 2: Create app layout that wraps children in AppShell**

Create `app/(app)/layout.tsx`:

```tsx
import { AppShell } from "@/components/layout/app_shell"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
```

- [ ] **Step 3: Create empty marketing layout (placeholder)**

Create `app/(marketing)/layout.tsx`:

```tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 4: Update root layout to remove AppShell**

Modify `app/layout.tsx` to remove the `AppShell` import and wrapper. Keep fonts, ToastProvider, metadata, and Material Symbols link:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
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
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Remove old app/page.tsx (redirect)**

Delete `app/page.tsx` — it currently redirects to `/dashboard`. The marketing landing page will replace it.

```bash
rm app/page.tsx
```

- [ ] **Step 6: Build and verify**

```bash
bun run build
```

All existing routes should still work at the same URLs (`/dashboard`, `/clients`, etc.). The root `/` will 404 for now.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Restructure routes into (app) and (marketing) groups"
```

---

### Task 2: Marketing Nav and Footer Components

**Files:**
- Create: `components/marketing/marketing_nav.tsx`
- Create: `components/marketing/marketing_footer.tsx`

- [ ] **Step 1: Create marketing nav**

Create `components/marketing/marketing_nav.tsx`:

```tsx
import Link from "next/link"
import Image from "next/image"

export function MarketingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/sava-logo.svg" alt="Sava" width={120} height={34} priority />
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/for-advisors" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            For Advisors
          </Link>
          <Link href="/for-attorneys" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            For Attorneys
          </Link>
          <Link href="/for-families" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            For Families
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary hover:opacity-90 transition-opacity"
          >
            Launch Demo
          </Link>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create marketing footer**

Create `components/marketing/marketing_footer.tsx`:

```tsx
import Image from "next/image"
import Link from "next/link"

export function MarketingFooter() {
  return (
    <footer className="bg-primary text-on-primary">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <Image src="/sava-logo.svg" alt="Sava" width={120} height={34} className="invert" />
            <p className="text-sm text-on-primary-container mt-4 leading-relaxed">
              Nevada-chartered corporate trustee. Automated rolling GRAT administration.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">Product</p>
            <div className="space-y-2.5">
              <Link href="/for-advisors" className="block text-sm text-on-primary-container hover:text-white transition-colors">For Advisors</Link>
              <Link href="/for-attorneys" className="block text-sm text-on-primary-container hover:text-white transition-colors">For Attorneys</Link>
              <Link href="/for-families" className="block text-sm text-on-primary-container hover:text-white transition-colors">For Families</Link>
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">Platform</p>
            <div className="space-y-2.5">
              <Link href="/dashboard" className="block text-sm text-on-primary-container hover:text-white transition-colors">Dashboard</Link>
              <Link href="/modeling" className="block text-sm text-on-primary-container hover:text-white transition-colors">GRAT Modeling</Link>
              <Link href="/reports" className="block text-sm text-on-primary-container hover:text-white transition-colors">Reports</Link>
              <Link href="/rate_monitor" className="block text-sm text-on-primary-container hover:text-white transition-colors">7520 Rate Monitor</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">Company</p>
            <div className="space-y-2.5">
              <p className="text-sm text-on-primary-container">Sava Trust Company</p>
              <p className="text-sm text-on-primary-container">Nevada Trust Charter</p>
              <p className="text-sm text-on-primary-container">YC F25 | Gradient Ventures</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-[11px] text-on-primary-container">
            &copy; 2026 Sava Trust Company. All rights reserved. Nevada Trust Charter.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Update marketing layout to use nav and footer**

Update `app/(marketing)/layout.tsx`:

```tsx
import { MarketingNav } from "@/components/marketing/marketing_nav"
import { MarketingFooter } from "@/components/marketing/marketing_footer"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingNav />
      <main className="pt-[72px]">{children}</main>
      <MarketingFooter />
    </>
  )
}
```

- [ ] **Step 4: Build and verify**

```bash
bun run build
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add marketing nav and footer components"
```

---

### Task 3: Main Landing Page

**Files:**
- Create: `app/(marketing)/page.tsx`

The main landing page with hero, three persona cards, a "how it works" section, key stats, and CTAs.

- [ ] **Step 1: Create the main landing page**

Create `app/(marketing)/page.tsx`:

```tsx
import Link from "next/link"
import Image from "next/image"

const PERSONAS = [
  {
    title: "For Wealth Managers",
    href: "/for-advisors",
    icon: "trending_up",
    hook: "Your AUM stays. Your clients save millions.",
    description: "Run a rolling GRAT program across your entire book. We handle the trust. You keep the fee.",
  },
  {
    title: "For Attorneys",
    href: "/for-attorneys",
    icon: "gavel",
    hook: "Your templates generate $40K+/year in passive income.",
    description: "Draft once. Earn $500 on every rollover. Transform one-time project work into recurring revenue.",
  },
  {
    title: "For Families",
    href: "/for-families",
    icon: "family_restroom",
    hook: "Institutional-quality estate planning, without the family office.",
    description: "Transfer wealth to the next generation tax-free. If assets underperform, nothing is lost.",
  },
]

const STATS = [
  { value: "$11M+", label: "Wealth transferred tax-free" },
  { value: "5.20%", label: "Current 7520 rate (favorable)" },
  { value: "$0", label: "Downside risk to grantor" },
  { value: "40%", label: "Gift tax rate avoided" },
]

const STEPS = [
  {
    number: "01",
    title: "Model",
    description: "Configure GRAT parameters with real-time projections. See exactly how much wealth transfers tax-free at current 7520 rates.",
    icon: "calculate",
  },
  {
    number: "02",
    title: "Create",
    description: "One click generates the trust instrument, coordinates attorney review, processes e-signature, and funds the GRAT.",
    icon: "add_circle",
  },
  {
    number: "03",
    title: "Monitor",
    description: "Track annuity payments, asset performance vs. hurdle rate, and upcoming maturities across every client household.",
    icon: "monitoring",
  },
  {
    number: "04",
    title: "Roll",
    description: "When a GRAT matures, the system proposes a rollover with pre-populated parameters. Approve with one click. Repeat.",
    icon: "autorenew",
  },
]

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary">
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 -left-40 h-[500px] w-[500px] rounded-full bg-primary-container/40 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-[400px] w-[400px] rounded-full bg-primary-container/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-32 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-6">
            Nevada-Chartered Corporate Trustee
          </p>
          <h1 className="font-headline text-6xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto">
            The wealth transfer platform that pays for itself
          </h1>
          <p className="mt-6 text-xl text-on-primary-container max-w-2xl mx-auto leading-relaxed">
            Sava combines a Nevada trust charter with rolling GRAT automation.
            Advisors keep their AUM. Attorneys earn recurring income.
            Families transfer wealth tax-free.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary hover:bg-white/90 transition-opacity"
            >
              Launch Demo
            </Link>
            <Link
              href="/for-advisors"
              className="rounded-xl border border-white/20 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/5 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/10">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-headline text-4xl font-extrabold text-primary tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-on-surface-variant">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Persona Cards */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight">
              Everyone wins
            </h2>
            <p className="mt-3 text-lg text-on-surface-variant max-w-xl mx-auto">
              A rolling GRAT strategy creates value for every party in the relationship.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {PERSONAS.map((persona) => (
              <Link
                key={persona.href}
                href={persona.href}
                className="group rounded-2xl bg-surface-container-lowest p-8 transition-all hover:scale-[1.02]"
                style={{ boxShadow: "0 4px 24px rgba(0, 27, 68, 0.06)" }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-fixed/30 mb-5">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "24px" }}>
                    {persona.icon}
                  </span>
                </div>
                <h3 className="font-headline text-xl font-extrabold text-primary mb-2">{persona.title}</h3>
                <p className="text-base font-semibold text-on-surface mb-3">{persona.hook}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{persona.description}</p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-surface-container-low py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">How It Works</p>
            <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight">
              Four steps. Zero operational burden.
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mx-auto mb-5">
                  <span className="material-symbols-outlined text-white" style={{ fontSize: "28px" }}>
                    {step.icon}
                  </span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1">Step {step.number}</p>
                <h3 className="font-headline text-xl font-extrabold text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Free Option */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-container p-12 text-white text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">The GRAT Advantage</p>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight mb-4">
              A call option with zero premium
            </h2>
            <p className="text-lg text-on-primary-container max-w-2xl mx-auto mb-10 leading-relaxed">
              If the GRAT outperforms the 7520 hurdle rate, the excess passes to beneficiaries tax-free.
              If it doesn't, everything returns to the grantor. There is no downside.
            </p>
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20 mx-auto mb-3">
                  <span className="material-symbols-outlined text-secondary-container" style={{ fontSize: "20px" }}>trending_up</span>
                </div>
                <p className="font-headline text-lg font-extrabold mb-1">Assets Outperform</p>
                <p className="text-3xl font-headline font-extrabold text-secondary-container mb-2">$1.2M+</p>
                <p className="text-sm text-on-primary-container">Transfers to beneficiaries tax-free</p>
                <p className="mt-2 text-sm font-bold text-secondary-container">Gift tax owed: $0</p>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 mx-auto mb-3">
                  <span className="material-symbols-outlined text-on-primary-container" style={{ fontSize: "20px" }}>trending_flat</span>
                </div>
                <p className="font-headline text-lg font-extrabold mb-1">Assets Underperform</p>
                <p className="text-3xl font-headline font-extrabold text-on-primary-container mb-2">$0</p>
                <p className="text-sm text-on-primary-container">Everything returns to grantor</p>
                <p className="mt-2 text-sm font-bold text-on-primary-container">Cost to grantor: $0</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-surface-container-low py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight mb-4">
            See it in action
          </h2>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto mb-8">
            Explore the full platform with mock data. Create GRATs, approve rollovers, substitute assets, and view reports.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-on-primary hover:opacity-90 transition-opacity"
          >
            Launch Demo
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
          </Link>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Build and verify**

```bash
bun run build
```

Navigate to `/` and verify the landing page renders. Verify `/dashboard` still works.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add main marketing landing page"
```

---

### Task 4: For Advisors Page

**Files:**
- Create: `app/(marketing)/for-advisors/page.tsx`

The primary audience page. Answers: "Why should I care, and what does it cost me?"

- [ ] **Step 1: Create the advisors page**

Create `app/(marketing)/for-advisors/page.tsx`:

```tsx
import Link from "next/link"

const ECONOMICS = [
  { label: "Your AUM Fee", value: "$42,500/yr", detail: "Preserved. Assets remain at your client's custodian.", color: "text-primary" },
  { label: "Sava Trust Admin", value: "0.25%/yr", detail: "Billed to client separately. Never reduces your fee.", color: "text-on-surface-variant" },
  { label: "Client Tax Savings", value: "$1.2M+", detail: "Per household over a decade. Justifies both fees many times over.", color: "text-secondary" },
  { label: "Per-GRAT Fee", value: "$1,500", detail: "Flat fee per GRAT. Same price for new originations and rollovers.", color: "text-on-surface-variant" },
]

const CAPABILITIES = [
  {
    icon: "calculate",
    title: "Real-Time GRAT Modeling",
    description: "Configure funding amount, term, asset, and expected return. See projected tax-free transfer, annuity schedule, and advisor economics update instantly.",
  },
  {
    icon: "autorenew",
    title: "Automated Rollover Engine",
    description: "When a GRAT approaches maturity, the system proposes a rollover with pre-populated parameters. You approve with one click. The strategy compounds automatically.",
  },
  {
    icon: "swap_horiz",
    title: "Asset Substitution Workflow",
    description: "When a GRAT underperforms the hurdle rate, swap to a better-performing asset with FMV validation. IRC 675(4) compliance built in.",
  },
  {
    icon: "monitoring",
    title: "7520 Rate Intelligence",
    description: "Track the monthly Section 7520 rate with historical charts and per-client impact analysis. Get alerted when conditions are favorable for new origination.",
  },
  {
    icon: "analytics",
    title: "Cumulative Wealth Transfer Reporting",
    description: "See the rolling strategy working across every client household. Each GRAT maturity creates a visible step-up in total wealth transferred.",
  },
  {
    icon: "domain",
    title: "Alternative Asset Support",
    description: "We hold what BNY Mellon won't. Private equity, hedge fund interests, real estate LLCs. Full administration with valuation tracking.",
  },
]

export default function ForAdvisorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">For Wealth Managers</p>
          <h1 className="font-headline text-5xl font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl">
            Run a rolling GRAT program across your entire book. We handle the trust. You keep the fee.
          </h1>
          <p className="mt-6 text-xl text-on-primary-container max-w-2xl leading-relaxed">
            Every advisor knows GRATs work. Nobody does them at scale because the operational burden is extreme. Sava eliminates that burden entirely.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link href="/dashboard" className="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary hover:bg-white/90 transition-opacity">
              Launch Demo
            </Link>
            <Link href="/modeling" className="rounded-xl border border-white/20 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/5 transition-colors">
              Try GRAT Modeling
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">The Problem</p>
              <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight mb-4">
                You know rolling GRATs are optimal. You can't operationalize them.
              </h2>
              <p className="text-base text-on-surface-variant leading-relaxed mb-4">
                Each GRAT requires a trust instrument drafted by counsel, executed by the grantor, accepted by a trustee, funded through a custodian, and administered with annuity payment tracking, tax reporting, and maturity monitoring.
              </p>
              <p className="text-base text-on-surface-variant leading-relaxed">
                Multiply that by four GRATs per year per client, across fifty clients, and no advisor can manage it manually. Most track upcoming maturities in Excel if they track them at all.
              </p>
            </div>
            <div className="rounded-2xl bg-surface-container-lowest p-8" style={{ boxShadow: "0 8px 32px rgba(0, 27, 68, 0.08)" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-4">Per GRAT, you need to:</p>
              <div className="space-y-3">
                {[
                  "Draft trust instrument with counsel",
                  "Execute grantor signature",
                  "Accept trust with corporate trustee",
                  "Issue funding instructions to custodian",
                  "Track annuity payments and distributions",
                  "Monitor performance vs. 7520 hurdle",
                  "File Form 709 and trust returns",
                  "Evaluate rollover at maturity",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-error" style={{ fontSize: "16px" }}>close</span>
                    <p className="text-sm text-on-surface">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/10">
                <p className="text-sm font-semibold text-primary">With Sava, every step is automated or one-click.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Economics Are Preserved */}
      <section className="bg-surface-container-low py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Your Economics</p>
            <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">
              Your fee is untouched. Your client saves millions.
            </h2>
            <p className="mt-3 text-base text-on-surface-variant max-w-xl mx-auto">
              Sava holds GRAT assets at your client's existing custodian. Your AUM fee is fully preserved.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {ECONOMICS.map((item) => (
              <div key={item.label} className="rounded-2xl bg-surface-container-lowest p-6" style={{ boxShadow: "0 4px 24px rgba(0, 27, 68, 0.06)" }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">{item.label}</p>
                <p className={`font-headline text-3xl font-extrabold tracking-tight ${item.color} mb-2`}>{item.value}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Platform Capabilities</p>
            <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">
              Everything you need to run GRATs at scale
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {CAPABILITIES.map((cap) => (
              <div key={cap.title} className="rounded-2xl bg-surface-container-lowest p-6" style={{ boxShadow: "0 4px 24px rgba(0, 27, 68, 0.06)" }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed/30 mb-4">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "22px" }}>{cap.icon}</span>
                </div>
                <h3 className="font-headline text-base font-extrabold text-primary mb-2">{cap.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-headline text-3xl font-extrabold text-white tracking-tight mb-4">
            See the full platform in action
          </h2>
          <p className="text-lg text-on-primary-container max-w-xl mx-auto mb-8">
            Explore with five mock client households, create GRATs, approve rollovers, and view reports.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary hover:bg-white/90 transition-opacity"
          >
            Launch Demo
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
          </Link>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Build and verify**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add app/\(marketing\)/for-advisors/page.tsx
git commit -m "Add For Advisors marketing page"
```

---

### Task 5: For Attorneys Page

**Files:**
- Create: `app/(marketing)/for-attorneys/page.tsx`

The distribution channel page. Answers: "How do I make money from this?"

- [ ] **Step 1: Create the attorneys page**

Create `app/(marketing)/for-attorneys/page.tsx`:

```tsx
import Link from "next/link"

const INCOME_TABLE = [
  { event: "Initial GRAT Setup", fee: "$3,000 - $7,000", paidBy: "Client (direct)", frequency: "Per new household" },
  { event: "GRAT Review (new or rollover)", fee: "$500", paidBy: "Sava (from per-GRAT fee)", frequency: "Per GRAT created" },
  { event: "Annual passive income (20 households)", fee: "~$40,000/year", paidBy: "Sava", frequency: "Recurring" },
]

const WORKFLOW_STEPS = [
  { step: "01", title: "Your Template", description: "You draft the initial trust instrument for your client. Standard T&E engagement, billed at your standard rate ($3,000 - $7,000)." },
  { step: "02", title: "Sava Automates", description: "Sava uses your template to generate successor instruments for rollovers and new originations. Every document routes to you for review." },
  { step: "03", title: "You Review", description: "Each GRAT creation or rollover triggers a review notification. Approve the instrument. Takes minutes, not hours." },
  { step: "04", title: "You Earn", description: "Sava pays you $500 per review from its $1,500 per-GRAT fee. No additional cost to the client. Recurring, passive income." },
]

export default function ForAttorneysPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">For T&E Attorneys</p>
          <h1 className="font-headline text-5xl font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl">
            Draft once. Earn on every rollover.
          </h1>
          <p className="mt-6 text-xl text-on-primary-container max-w-2xl leading-relaxed">
            Today you draft a GRAT instrument, bill for the work, and never hear about it again.
            Sava changes that. Every rolling GRAT cycle routes a review fee to you. Your one-time project work becomes recurring revenue.
          </p>
          <Link href="/reports" className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary hover:bg-white/90 transition-opacity">
            See Attorney Economics
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* The Transformation */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-12">
            <div className="rounded-2xl bg-surface-container-high/50 p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-error mb-3">Today</p>
              <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-4">One and done</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error mt-0.5" style={{ fontSize: "16px" }}>close</span>
                  <p className="text-sm text-on-surface-variant">Draft a GRAT instrument</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error mt-0.5" style={{ fontSize: "16px" }}>close</span>
                  <p className="text-sm text-on-surface-variant">Bill $5,000 for the work</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error mt-0.5" style={{ fontSize: "16px" }}>close</span>
                  <p className="text-sm text-on-surface-variant">Never hear about it again</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error mt-0.5" style={{ fontSize: "16px" }}>close</span>
                  <p className="text-sm text-on-surface-variant">No recurring revenue from GRATs</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/10">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1">Annual GRAT Income</p>
                <p className="font-headline text-3xl font-extrabold text-on-surface-variant">$5,000</p>
                <p className="text-sm text-on-surface-variant">One-time, per household</p>
              </div>
            </div>
            <div className="rounded-2xl bg-secondary-container/20 p-8 border border-secondary/20">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-secondary mb-3">With Sava</p>
              <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-4">Recurring revenue engine</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontSize: "16px" }}>check_circle</span>
                  <p className="text-sm text-on-surface">Draft initial template (bill client directly)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontSize: "16px" }}>check_circle</span>
                  <p className="text-sm text-on-surface">Review each rollover ($500, paid by Sava)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontSize: "16px" }}>check_circle</span>
                  <p className="text-sm text-on-surface">Automatic notifications on every new GRAT</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontSize: "16px" }}>check_circle</span>
                  <p className="text-sm text-on-surface">Passive income scales with advisor's book</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-secondary/20">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-secondary mb-1">Annual GRAT Income (20 Households)</p>
                <p className="font-headline text-3xl font-extrabold text-secondary">$40,000+</p>
                <p className="text-sm text-on-surface-variant">Recurring, passive</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-surface-container-low py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Your Workflow</p>
            <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">
              Minimal effort. Maximum leverage.
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-8">
            {WORKFLOW_STEPS.map((step) => (
              <div key={step.step}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4">
                  <span className="font-headline text-lg font-extrabold text-white">{step.step}</span>
                </div>
                <h3 className="font-headline text-base font-extrabold text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Table */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">
              Attorney Economics
            </h2>
            <p className="mt-3 text-base text-on-surface-variant">
              Simple, transparent fee structure. Your review fees are paid by Sava, not your clients.
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest overflow-hidden" style={{ boxShadow: "0 8px 32px rgba(0, 27, 68, 0.08)" }}>
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Event</th>
                  <th className="px-8 py-4 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Fee</th>
                  <th className="px-8 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Paid By</th>
                  <th className="px-8 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {INCOME_TABLE.map((row) => (
                  <tr key={row.event}>
                    <td className="px-8 py-4 text-sm font-semibold text-on-surface">{row.event}</td>
                    <td className="px-8 py-4 text-right font-mono text-sm font-bold text-primary">{row.fee}</td>
                    <td className="px-8 py-4 text-sm text-on-surface-variant">{row.paidBy}</td>
                    <td className="px-8 py-4 text-sm text-on-surface-variant">{row.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-headline text-3xl font-extrabold text-white tracking-tight mb-4">
            See the attorney economics in action
          </h2>
          <p className="text-lg text-on-primary-container max-w-xl mx-auto mb-8">
            The Reports page shows per-attorney review income, household assignments, and projected annual income.
          </p>
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary hover:bg-white/90 transition-opacity"
          >
            View Reports Demo
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
          </Link>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Build and verify**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add app/\(marketing\)/for-attorneys/page.tsx
git commit -m "Add For Attorneys marketing page"
```

---

### Task 6: For Families Page

**Files:**
- Create: `app/(marketing)/for-families/page.tsx`

The end-client page. Answers: "Is my money safe, and how much will I save?"

- [ ] **Step 1: Create the families page**

Create `app/(marketing)/for-families/page.tsx`:

```tsx
import Link from "next/link"

const PROTECTIONS = [
  {
    icon: "verified",
    title: "Nevada-Chartered Corporate Trustee",
    description: "Sava Trust Company is a state-chartered corporate trustee. Your trust is administered by a regulated institution, not a software company.",
  },
  {
    icon: "account_balance",
    title: "Assets Stay at Your Custodian",
    description: "Your investments remain at Schwab, Fidelity, or Pershing. Sava holds the trust. Your advisor manages the assets. Nothing moves.",
  },
  {
    icon: "shield",
    title: "Nevada Trust Advantages",
    description: "Nevada offers some of the strongest asset protection and trust-friendly laws in the country. No state income tax on trust earnings.",
  },
  {
    icon: "group",
    title: "Your Advisor Stays in Control",
    description: "This is not a replacement for your wealth manager. It is a tool they use on your behalf to systematically transfer wealth to your beneficiaries.",
  },
]

const EXAMPLE_STEPS = [
  { label: "Funded", value: "$5,000,000", sublabel: "Contributed to 2-year GRAT" },
  { label: "7520 Hurdle", value: "5.20%", sublabel: "IRS required return rate" },
  { label: "Actual Return", value: "15.00%", sublabel: "Your assets outperformed" },
  { label: "Tax-Free Transfer", value: "$912,000", sublabel: "Passed to beneficiaries at $0 tax" },
]

export default function ForFamiliesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">For Families</p>
          <h1 className="font-headline text-5xl font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl">
            Transfer wealth to your children, tax-free. No downside.
          </h1>
          <p className="mt-6 text-xl text-on-primary-container max-w-2xl leading-relaxed">
            A GRAT is a simple bet: if your investments outperform a low IRS hurdle rate, the excess passes to your beneficiaries
            with zero gift tax. If they don't, everything comes back to you. Nothing is lost.
          </p>
          <Link href="/modeling" className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary hover:bg-white/90 transition-opacity">
            See How It Works
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Example Walk-Through */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Example</p>
            <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">
              How a $5M GRAT transfers $912,000 tax-free
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {EXAMPLE_STEPS.map((step, i) => (
              <div key={step.label} className="text-center">
                {i > 0 && (
                  <div className="flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "20px" }}>arrow_forward</span>
                  </div>
                )}
                {i === 0 && <div className="mb-4 h-5" />}
                <div className={`rounded-2xl p-6 ${
                  i === EXAMPLE_STEPS.length - 1
                    ? "bg-secondary-container/20 border border-secondary/20"
                    : "bg-surface-container-lowest"
                }`} style={i < EXAMPLE_STEPS.length - 1 ? { boxShadow: "0 4px 24px rgba(0, 27, 68, 0.06)" } : undefined}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">{step.label}</p>
                  <p className={`font-headline text-3xl font-extrabold tracking-tight ${
                    i === EXAMPLE_STEPS.length - 1 ? "text-secondary" : "text-primary"
                  }`}>{step.value}</p>
                  <p className="text-sm text-on-surface-variant mt-1">{step.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-base text-on-surface-variant max-w-2xl mx-auto">
              And if the assets had underperformed the 5.20% hurdle? Everything would have returned to you.
              <span className="font-semibold text-on-surface"> The cost to you: $0.</span> That is why it is called a free option.
            </p>
          </div>
        </div>
      </section>

      {/* Rolling Strategy */}
      <section className="bg-surface-container-low py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">The Rolling Strategy</p>
              <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight mb-4">
                One GRAT is a bet. A rolling program is a strategy.
              </h2>
              <p className="text-base text-on-surface-variant leading-relaxed mb-4">
                Instead of one large, long-duration GRAT, your advisor creates a series of overlapping short-term GRATs on a recurring cadence. Some will succeed, some won't.
              </p>
              <p className="text-base text-on-surface-variant leading-relaxed mb-4">
                But the ones that succeed lock in tax-free wealth transfer permanently. The ones that don't cost nothing. Over time, the strategy compounds.
              </p>
              <p className="text-base font-semibold text-on-surface">
                A successful rolling GRAT program on a $10M portfolio can transfer millions of dollars tax-free over a decade.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-container p-8 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">Over 10 Years</p>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-on-primary-container">Starting portfolio</p>
                  <p className="font-headline text-3xl font-extrabold">$10,000,000</p>
                </div>
                <div>
                  <p className="text-sm text-on-primary-container">Potential tax-free transfer</p>
                  <p className="font-headline text-3xl font-extrabold text-secondary-container">$2,000,000+</p>
                </div>
                <div>
                  <p className="text-sm text-on-primary-container">Gift tax avoided (at 40%)</p>
                  <p className="font-headline text-3xl font-extrabold text-secondary-container">$800,000+</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-on-primary-container">Risk to you</p>
                  <p className="font-headline text-3xl font-extrabold">$0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protections */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Your Protections</p>
            <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">
              Institutional quality. Complete transparency.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {PROTECTIONS.map((item) => (
              <div key={item.title} className="flex gap-5 rounded-2xl bg-surface-container-lowest p-6" style={{ boxShadow: "0 4px 24px rgba(0, 27, 68, 0.06)" }}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed/30">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "24px" }}>{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline text-base font-extrabold text-primary mb-1">{item.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What It Costs */}
      <section className="bg-surface-container-low py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Pricing</p>
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight mb-4">
            Modest fees. Outsized savings.
          </h2>
          <p className="text-base text-on-surface-variant max-w-xl mx-auto mb-12">
            Sava's fees are a fraction of the potential tax savings. Your advisor's fee is completely separate and unaffected.
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="rounded-2xl bg-surface-container-lowest p-6" style={{ boxShadow: "0 4px 24px rgba(0, 27, 68, 0.06)" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">Trust Administration</p>
              <p className="font-headline text-3xl font-extrabold text-primary">0.25%</p>
              <p className="text-sm text-on-surface-variant mt-1">of trust assets, annually</p>
            </div>
            <div className="rounded-2xl bg-surface-container-lowest p-6" style={{ boxShadow: "0 4px 24px rgba(0, 27, 68, 0.06)" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">Per GRAT</p>
              <p className="font-headline text-3xl font-extrabold text-primary">$1,500</p>
              <p className="text-sm text-on-surface-variant mt-1">flat, per GRAT created</p>
            </div>
            <div className="rounded-2xl bg-secondary-container/20 p-6 border border-secondary/20">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-secondary mb-2">Potential Savings</p>
              <p className="font-headline text-3xl font-extrabold text-secondary">$800K+</p>
              <p className="text-sm text-on-surface-variant mt-1">in gift tax avoided</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-headline text-3xl font-extrabold text-white tracking-tight mb-4">
            Ask your advisor about Sava
          </h2>
          <p className="text-lg text-on-primary-container max-w-xl mx-auto mb-8">
            Your wealth manager can model a GRAT strategy for your portfolio today. Explore the platform to see what it looks like.
          </p>
          <Link
            href="/modeling"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary hover:bg-white/90 transition-opacity"
          >
            Explore GRAT Modeling
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
          </Link>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Build and verify**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add app/\(marketing\)/for-families/page.tsx
git commit -m "Add For Families marketing page"
```

---

### Task 7: Polish and Final Verification

**Files:**
- Various touch-ups

- [ ] **Step 1: Verify all routes work**

```bash
bun run build
```

Check the route table:
- `/` - landing page (marketing layout)
- `/for-advisors` - advisor page (marketing layout)
- `/for-attorneys` - attorney page (marketing layout)
- `/for-families` - families page (marketing layout)
- `/dashboard` - app dashboard (app layout with sidebar)
- `/clients` - clients list (app layout)
- `/clients/[id]` - client detail (app layout)
- `/modeling` - GRAT modeling (app layout)
- `/reports` - reports (app layout)
- `/rate_monitor` - rate monitor (app layout)
- `/settings` - settings (app layout)

- [ ] **Step 2: Fix any build errors or styling issues**

Review each marketing page for consistency:
- All headings use `font-headline` (Manrope)
- Financial numbers use `font-mono`
- Section labels use `text-[10px] font-bold uppercase tracking-[0.08em]`
- Cards use navy-tinted shadows, not default CSS shadows
- No 1px borders for sectioning (background shifts instead)
- CTAs are consistent across all pages

- [ ] **Step 3: Commit final polish**

```bash
git add -A
git commit -m "Polish marketing pages and verify all routes"
```

---

## Task Dependency Graph

```
Task 1 (Route Groups) ──────────────────────────────────
    │
Task 2 (Nav + Footer) ──────────────────────────────────
    │
    ├── Task 3 (Landing Page) ──────────────────────────
    ├── Task 4 (For Advisors) ──────────────────────────
    ├── Task 5 (For Attorneys) ─────────────────────────
    ├── Task 6 (For Families) ──────────────────────────
    │
    └── Task 7 (Polish) ────────────────────────────────
```

Tasks 1 and 2 are sequential. Tasks 3-6 can be parallelized after Task 2. Task 7 is last.
