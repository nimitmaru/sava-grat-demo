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
      <section className="bg-primary py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">For Families</p>
          <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl">
            Transfer wealth to your children, tax-free. No downside.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-on-primary-container max-w-2xl leading-relaxed">
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
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Example</p>
            <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
              How a $5M GRAT transfers $912,000 tax-free
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {EXAMPLE_STEPS.map((step, i) => (
              <div key={step.label} className="text-center">
                {i > 0 && (
                  <div className="hidden md:flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "20px" }}>arrow_forward</span>
                  </div>
                )}
                {i === 0 && <div className="hidden md:block mb-4 h-5" />}
                <div className={`rounded-2xl p-4 md:p-6 ${
                  i === EXAMPLE_STEPS.length - 1
                    ? "bg-secondary-container/20 border border-secondary/20"
                    : "bg-surface-container-lowest"
                }`} style={i < EXAMPLE_STEPS.length - 1 ? { boxShadow: "0 4px 24px rgba(0, 27, 68, 0.06)" } : undefined}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">{step.label}</p>
                  <p className={`font-headline text-2xl md:text-3xl font-extrabold tracking-tight ${
                    i === EXAMPLE_STEPS.length - 1 ? "text-secondary" : "text-primary"
                  }`}>{step.value}</p>
                  <p className="text-xs md:text-sm text-on-surface-variant mt-1">{step.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 md:mt-12 text-center">
            <p className="text-base text-on-surface-variant max-w-2xl mx-auto">
              And if the assets had underperformed the 5.20% hurdle? Everything would have returned to you.
              <span className="font-semibold text-on-surface"> The cost to you: $0.</span> That is why it is called a free option.
            </p>
          </div>
        </div>
      </section>

      {/* Rolling Strategy */}
      <section className="bg-surface-container-low py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">The Rolling Strategy</p>
              <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary tracking-tight mb-4">
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
            <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-container p-6 md:p-8 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">Over 10 Years</p>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-on-primary-container">Starting portfolio</p>
                  <p className="font-headline text-2xl md:text-3xl font-extrabold">$10,000,000</p>
                </div>
                <div>
                  <p className="text-sm text-on-primary-container">Potential tax-free transfer</p>
                  <p className="font-headline text-2xl md:text-3xl font-extrabold text-secondary-container">$2,000,000+</p>
                </div>
                <div>
                  <p className="text-sm text-on-primary-container">Gift tax avoided (at 40%)</p>
                  <p className="font-headline text-2xl md:text-3xl font-extrabold text-secondary-container">$800,000+</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-on-primary-container">Risk to you</p>
                  <p className="font-headline text-2xl md:text-3xl font-extrabold">$0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protections */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Your Protections</p>
            <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
              Institutional quality. Complete transparency.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {PROTECTIONS.map((item) => (
              <div key={item.title} className="flex gap-4 md:gap-5 rounded-2xl bg-surface-container-lowest p-5 md:p-6" style={{ boxShadow: "0 4px 24px rgba(0, 27, 68, 0.06)" }}>
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
      <section className="bg-surface-container-low py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Pricing</p>
          <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary tracking-tight mb-4">
            Modest fees. Outsized savings.
          </h2>
          <p className="text-base text-on-surface-variant max-w-xl mx-auto mb-10 md:mb-12">
            Sava's fees are a fraction of the potential tax savings. Your advisor's fee is completely separate and unaffected.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto">
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
      <section className="bg-primary py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4">
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
