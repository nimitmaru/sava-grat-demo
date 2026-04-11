import { Header } from "@/components/layout/header"
import { SavaFooter } from "@/components/layout/sava_footer"
import { StatCard } from "@/components/ui/stat_card"
import { ClientHeader } from "./components/client_header"
import { ClientTabs } from "./components/client_tabs"
import { GratTimeline } from "./components/grat_timeline"
import { GratLadder } from "./components/grat_ladder"
import { getHousehold, getGratsByHousehold } from "@/lib/data/store"
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
                  <GratLadder grats={grats} householdId={id} />
                </div>
              ),
            annuity: <div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-on-surface-variant">Annuity Schedule — coming in Task 16</div>,
            history: <div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-on-surface-variant">History — coming in Task 16</div>,
            documents: <div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-on-surface-variant">Tax & Documents — coming in Task 16</div>,
          }}
        </ClientTabs>

        <SavaFooter />
      </div>
    </>
  )
}
