import { Header } from "@/components/layout/header"
import { SavaFooter } from "@/components/layout/sava_footer"

const FAQ_ITEMS = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "What is a GRAT and how does it work?",
        a: "A Grantor Retained Annuity Trust (GRAT) is an irrevocable trust used to transfer wealth to beneficiaries with minimal or zero gift tax. The grantor contributes assets and receives annuity payments over a fixed term. If the assets grow faster than the IRS Section 7520 hurdle rate, the excess passes to beneficiaries tax-free.",
      },
      {
        q: "What is a rolling GRAT strategy?",
        a: "Instead of one large, long-term GRAT, a rolling strategy creates overlapping short-term GRATs (typically 2-year terms) on a quarterly cadence. This diversifies timing risk and creates repeated \"free options\" on asset appreciation. Each successful GRAT locks in a tax-free transfer, while unsuccessful ones simply return assets to the grantor.",
      },
      {
        q: "How does Sava fit into the process?",
        a: "Sava serves as the corporate trustee under a Nevada trust charter and provides the administration platform. We handle trust acceptance, document generation, annuity payment processing, rollover automation, and compliance reporting — so you can focus on the client relationship.",
      },
    ],
  },
  {
    category: "Working with Attorneys",
    questions: [
      {
        q: "How do I invite my client's T&E attorney?",
        a: "From any client detail page, click \"Invite Attorney\" to send an invitation. The attorney receives a personalized pitch showing their potential recurring review income. Once they accept, they're linked to the household and automatically receive trust instruments for review at each GRAT creation or rollover.",
      },
      {
        q: "What does the attorney review process look like?",
        a: "When a new GRAT is created or rolled, the trust instrument is sent to the linked attorney for review. They receive a notification, review the document in their portal, and approve or request changes. The $500 review fee is paid by Sava from the per-GRAT fee — no additional cost to your client.",
      },
      {
        q: "Can an attorney work with multiple advisors?",
        a: "Yes. Attorneys build a portfolio of households across multiple advisory firms. Each GRAT review generates $500 in income, creating a meaningful recurring revenue stream.",
      },
    ],
  },
  {
    category: "GRAT Operations",
    questions: [
      {
        q: "What happens when a GRAT matures?",
        a: "The platform monitors all GRAT maturity dates. 30 days before maturity, we generate a rollover proposal with recommended parameters based on current market conditions and the 7520 rate. You review and approve with one click, or decline if the client's situation has changed.",
      },
      {
        q: "What is asset substitution?",
        a: "Under IRC 675(4), the grantor can swap assets in a GRAT for others of equal fair market value. This is useful when a GRAT is underperforming its hurdle rate — you can substitute in higher-growth assets. The platform guides you through the multi-step process including FMV validation, attorney review, and custodian coordination.",
      },
      {
        q: "How are annuity payments handled?",
        a: "Sava calculates and schedules all annuity payments based on the GRAT terms. We generate distribution instructions for the custodian and track payment status. You can view the full annuity schedule for any GRAT in the client detail page.",
      },
    ],
  },
  {
    category: "Fees & Economics",
    questions: [
      {
        q: "What does Sava charge?",
        a: "Trust Administration: 0.25% of trust assets annually (min $1,500/year per household). Per-GRAT Fee: $1,500 flat for each new GRAT or rollover. Asset Substitution: $500 per swap event. Platform subscription available for high-volume firms.",
      },
      {
        q: "Does Sava's fee affect my AUM billing?",
        a: "No. Sava holds GRAT assets at your existing custodian (Schwab, Fidelity, Pershing). You continue to bill your standard AUM fee on trust assets. Sava's 0.25% administration fee is additive — the client pays it as a trust cost, not from your fee.",
      },
      {
        q: "How do attorneys earn from Auto-GRAT?",
        a: "Attorneys receive $500 for each GRAT review (creation or rollover), paid by Sava from the per-GRAT fee. An attorney working across 20 households with quarterly rollovers can earn ~$40,000/year in passive review income.",
      },
    ],
  },
]

export default function HelpPage() {
  return (
    <>
      <Header
        title="Help & FAQ"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Resources" }, { label: "Help & FAQ" }]}
      />
      <div className="flex-1 overflow-y-auto bg-background p-6 space-y-6">
        <div className="rounded-xl bg-surface-container-lowest p-6">
          <h2 className="font-headline text-lg font-extrabold text-primary mb-1">Frequently Asked Questions</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Common questions about GRATs, the Sava platform, and working with attorneys
          </p>

          <div className="space-y-8">
            {FAQ_ITEMS.map((section) => (
              <div key={section.category}>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-4">
                  {section.category}
                </h3>
                <div className="space-y-4">
                  {section.questions.map((item) => (
                    <div key={item.q} className="rounded-xl bg-surface-container-low/50 p-5">
                      <p className="text-sm font-semibold text-on-surface mb-2">{item.q}</p>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="rounded-xl bg-primary-fixed/20 p-6">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: "24px" }}>support_agent</span>
            <div>
              <h3 className="font-headline text-base font-extrabold text-primary mb-1">Need More Help?</h3>
              <p className="text-sm text-on-surface-variant mb-3">
                Our team is available to assist with platform questions, GRAT strategy, and onboarding.
              </p>
              <div className="flex gap-3">
                <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary">
                  Contact Support
                </button>
                <button className="rounded-xl bg-surface-container-lowest px-4 py-2 text-sm font-bold text-on-surface-variant">
                  Schedule a Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        <SavaFooter />
      </div>
    </>
  )
}
