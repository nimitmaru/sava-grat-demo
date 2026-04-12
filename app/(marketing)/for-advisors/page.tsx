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
      <section className="bg-primary py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">For Wealth Managers</p>
          <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl">
            Run a rolling GRAT program across your entire book. We handle the trust. You keep the fee.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-on-primary-container max-w-2xl leading-relaxed">
            Every advisor knows GRATs work. Nobody does them at scale because the operational burden is extreme. Sava eliminates that burden entirely.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary hover:bg-white/90 transition-opacity text-center">
              Launch Demo
            </Link>
            <Link href="/modeling" className="w-full sm:w-auto rounded-xl border border-white/20 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/5 transition-colors text-center">
              Try GRAT Modeling
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">The Problem</p>
              <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary tracking-tight mb-4">
                You know rolling GRATs are optimal. You can't operationalize them.
              </h2>
              <p className="text-base text-on-surface-variant leading-relaxed mb-4">
                Each GRAT requires a trust instrument drafted by counsel, executed by the grantor, accepted by a trustee, funded through a custodian, and administered with annuity payment tracking, tax reporting, and maturity monitoring.
              </p>
              <p className="text-base text-on-surface-variant leading-relaxed">
                Multiply that by four GRATs per year per client, across fifty clients, and no advisor can manage it manually. Most track upcoming maturities in Excel if they track them at all.
              </p>
            </div>
            <div className="rounded-2xl bg-surface-container-lowest p-6 md:p-8" style={{ boxShadow: "0 8px 32px rgba(0, 27, 68, 0.08)" }}>
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
      <section className="bg-surface-container-low py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Your Economics</p>
            <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
              Your fee is untouched. Your client saves millions.
            </h2>
            <p className="mt-3 text-base text-on-surface-variant max-w-xl mx-auto">
              Sava holds GRAT assets at your client's existing custodian. Your AUM fee is fully preserved.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Platform Capabilities</p>
            <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
              Everything you need to run GRATs at scale
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
      <section className="bg-primary py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4">
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
