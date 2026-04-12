import { Header } from "@/components/layout/header"
import { SavaFooter } from "@/components/layout/sava_footer"

const DOC_SECTIONS = [
  {
    title: "Platform Guides",
    icon: "auto_stories",
    items: [
      { name: "Getting Started with Sava", description: "Step-by-step guide to creating your first rolling GRAT program", type: "Guide" },
      { name: "Client Onboarding Walkthrough", description: "How to add a new client household and configure their GRAT strategy", type: "Guide" },
      { name: "Attorney Invitation & Review Process", description: "How to invite T&E attorneys and manage the review workflow", type: "Guide" },
      { name: "Rollover Management", description: "Understanding rollover proposals, approval flows, and successor GRAT creation", type: "Guide" },
    ],
  },
  {
    title: "GRAT Strategy Resources",
    icon: "school",
    items: [
      { name: "Rolling GRAT Strategy Overview", description: "Why rolling GRATs outperform single GRATs and how to structure a program", type: "Whitepaper" },
      { name: "7520 Rate Analysis Framework", description: "How to interpret rate trends and time GRAT originations", type: "Whitepaper" },
      { name: "Alternative Assets in GRATs", description: "Using PE, hedge funds, and RE LLCs in GRAT structures — valuation and compliance", type: "Whitepaper" },
      { name: "Asset Substitution Best Practices", description: "When and how to exercise the grantor's substitution power under IRC 675(4)", type: "Whitepaper" },
    ],
  },
  {
    title: "Regulatory & Compliance",
    icon: "gavel",
    items: [
      { name: "IRC 2702 — Retained Interest Valuation", description: "Key provisions governing GRAT structure and annuity requirements", type: "Reference" },
      { name: "IRC 7520 — Section 7520 Rate", description: "How the monthly hurdle rate is calculated and applied", type: "Reference" },
      { name: "Walton v. Commissioner (2003)", description: "Tax Court decision confirming zeroed-out short-term GRATs", type: "Reference" },
      { name: "Form 709 Filing Requirements", description: "Gift tax return requirements for GRAT funding and maturity events", type: "Reference" },
    ],
  },
  {
    title: "Trust Administration",
    icon: "verified",
    items: [
      { name: "Sava Trust Company Overview", description: "Nevada charter, fiduciary standards, and administration capabilities", type: "Overview" },
      { name: "Fee Schedule & Economics", description: "Detailed breakdown of trust administration, per-GRAT, and substitution fees", type: "Reference" },
      { name: "Custodian Integration Guide", description: "How Sava works with Schwab, Fidelity, and Pershing custody accounts", type: "Guide" },
      { name: "Tax Season Reporting Package", description: "What's included in annual trust returns and Form 709 preparation", type: "Guide" },
    ],
  },
]

export default function DocsPage() {
  return (
    <>
      <Header
        title="Documentation"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Resources" }, { label: "Documentation" }]}
      />
      <div className="flex-1 overflow-y-auto bg-background p-6 space-y-6">
        {DOC_SECTIONS.map((section) => (
          <div key={section.title} className="rounded-xl bg-surface-container-lowest p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>
                {section.icon}
              </span>
              <h3 className="font-headline text-base font-extrabold text-primary">{section.title}</h3>
            </div>
            <div className="space-y-2">
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className="flex w-full items-center justify-between rounded-xl p-4 text-left transition-colors hover:bg-primary-fixed/20"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-on-surface">{item.name}</p>
                    <p className="text-[13px] text-on-surface-variant">{item.description}</p>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-2">
                    <span className="rounded-lg bg-surface-container-low px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-on-surface-variant">
                      {item.type}
                    </span>
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>
                      arrow_forward
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <SavaFooter />
      </div>
    </>
  )
}
