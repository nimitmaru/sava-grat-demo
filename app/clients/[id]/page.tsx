import { Header } from "@/components/layout/header"
import { SavaFooter } from "@/components/layout/sava_footer"
import { StatCard } from "@/components/ui/stat_card"
import { ClientHeader } from "./components/client_header"
import { ClientTabs } from "./components/client_tabs"
import { GratTimeline } from "./components/grat_timeline"
import { GratLadder } from "./components/grat_ladder"
import { CumulativeChart } from "./components/cumulative_chart"
import { AnnuitySchedule } from "./components/annuity_schedule"
import { ClientHistory } from "./components/client_history"
import { TaxDocuments } from "./components/tax_documents"
import { getHousehold, getGratsByHousehold, getActivities, getDocuments, getPendingRollovers } from "@/lib/data/store"
import { formatCompactCurrency } from "@/lib/format"
import { notFound } from "next/navigation"

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const household = getHousehold(id)
  if (!household) notFound()

  const grats = getGratsByHousehold(id)
  const activeGrats = grats.filter(g => !["rolled", "completed"].includes(g.status))
  const activities = getActivities(id)
  const documents = getDocuments(id)
  const proposals = getPendingRollovers().filter(p => p.householdId === id)

  // Calculate avg return vs hurdle
  const avgExcess = activeGrats.length > 0
    ? activeGrats.reduce((sum, g) => sum + (g.expectedReturn - g.hurdle7520Rate), 0) / activeGrats.length
    : 0

  return (
    <>
      <Header
        title={household.name}
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Clients", href: "/clients" },
          { label: household.name },
        ]}
      />
      <div className="flex-1 overflow-y-auto bg-background p-6 space-y-6">
        <ClientHeader household={household} />

        {/* Metrics Row */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard label="Trust AUM" value={formatCompactCurrency(household.totalAUM)} variant="hero" />
          <StatCard label="Wealth Transferred" value={formatCompactCurrency(household.wealthTransferred)} trend="Tax-free to beneficiaries" trendDirection="up" variant="hero" />
          <StatCard label="Active GRATs" value={String(activeGrats.length)} variant="light" />
          <StatCard label="Avg Return vs Hurdle" value={`+${(avgExcess * 100).toFixed(1)}%`} trend="Above 7520 rate" trendDirection="up" variant="light" />
        </div>

        {/* Tabs */}
        <ClientTabs>
          {{
            ladder: (
                <div className="space-y-6">
                  <GratTimeline grats={grats} />
                  <GratLadder grats={grats} householdId={id} proposals={proposals} household={household} />
                  <CumulativeChart grats={grats} />
                </div>
              ),
            annuity: <AnnuitySchedule grats={grats} />,
            history: <ClientHistory activities={activities} />,
            documents: <TaxDocuments documents={documents} />,
          }}
        </ClientTabs>

        <SavaFooter />
      </div>
    </>
  )
}
