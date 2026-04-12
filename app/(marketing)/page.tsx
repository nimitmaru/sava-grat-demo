import Link from "next/link"
import Image from "next/image"

const PERSONAS = [
  {
    title: "For Wealth Managers",
    href: "/for-advisors",
    icon: "trending_up",
    hook: "Your AUM stays. Your clients save millions.",
    description: "Run a rolling GRAT program across your entire book. We coordinate the trust. You keep the fee.",
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

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-32 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-6">
            Nevada-Chartered Corporate Trustee
          </p>
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto">
            The Modern Approach to Rolling GRATs
          </h1>
          <p className="mt-6 text-lg md:text-xl text-on-primary-container max-w-3xl mx-auto leading-relaxed">
            Sava GRAT Platform combines a Nevada trust charter with an intelligent coordination platform.
            Model, create, monitor, and roll GRATs across every client.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary hover:bg-white/90 transition-opacity text-center"
            >
              Launch Demo
            </Link>
            <Link
              href="/for-advisors"
              className="w-full sm:w-auto rounded-xl border border-white/20 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/5 transition-colors text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/10">
        <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-headline text-3xl md:text-4xl font-extrabold text-primary tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-on-surface-variant">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Persona Cards */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
              Everyone wins
            </h2>
            <p className="mt-3 text-lg text-on-surface-variant max-w-xl mx-auto">
              A rolling GRAT strategy creates value for every party in the relationship.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {PERSONAS.map((persona) => (
              <Link
                key={persona.href}
                href={persona.href}
                className="group rounded-2xl bg-surface-container-lowest p-6 md:p-8 transition-all hover:scale-[1.02]"
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
      <section className="bg-surface-container-low py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">How It Works</p>
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
              Four steps. Zero operational burden.
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-container p-6 md:p-12 text-white text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">The GRAT Advantage</p>
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              A call option with zero premium
            </h2>
            <p className="text-base md:text-lg text-on-primary-container max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
              If the GRAT outperforms the 7520 hurdle rate, the excess passes to beneficiaries tax-free.
              If it doesn't, everything returns to the grantor. There is no downside.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-5 md:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20 mx-auto mb-3">
                  <span className="material-symbols-outlined text-secondary-container" style={{ fontSize: "20px" }}>trending_up</span>
                </div>
                <p className="font-headline text-lg font-extrabold mb-1">Assets Outperform</p>
                <p className="text-3xl font-headline font-extrabold text-secondary-container mb-2">$1.2M+</p>
                <p className="text-sm text-on-primary-container">Transfers to beneficiaries tax-free</p>
                <p className="mt-2 text-sm font-bold text-secondary-container">Gift tax owed: $0</p>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-5 md:p-6">
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
      <section className="bg-surface-container-low py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-primary tracking-tight mb-4">
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
