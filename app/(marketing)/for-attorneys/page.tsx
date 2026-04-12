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
      <section className="bg-primary py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">For T&E Attorneys</p>
          <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl">
            Draft once. Earn on every rollover.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-on-primary-container max-w-2xl leading-relaxed">
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
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <div className="rounded-2xl bg-surface-container-high/50 p-6 md:p-8">
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
            <div className="rounded-2xl bg-secondary-container/20 p-6 md:p-8 border border-secondary/20">
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
      <section className="bg-surface-container-low py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Your Workflow</p>
            <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
              Minimal effort. Maximum leverage.
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
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
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
              Attorney Economics
            </h2>
            <p className="mt-3 text-base text-on-surface-variant">
              Simple, transparent fee structure. Your review fees are paid by Sava, not your clients.
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest overflow-x-auto" style={{ boxShadow: "0 8px 32px rgba(0, 27, 68, 0.08)" }}>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 md:px-8 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Event</th>
                  <th className="px-6 md:px-8 py-4 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Fee</th>
                  <th className="px-6 md:px-8 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Paid By</th>
                  <th className="px-6 md:px-8 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {INCOME_TABLE.map((row) => (
                  <tr key={row.event}>
                    <td className="px-6 md:px-8 py-4 text-sm font-semibold text-on-surface">{row.event}</td>
                    <td className="px-6 md:px-8 py-4 text-right font-mono text-sm font-bold text-primary">{row.fee}</td>
                    <td className="px-6 md:px-8 py-4 text-sm text-on-surface-variant">{row.paidBy}</td>
                    <td className="px-6 md:px-8 py-4 text-sm text-on-surface-variant">{row.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4">
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
