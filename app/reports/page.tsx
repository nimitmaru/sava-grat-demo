import { Header } from "@/components/layout/header"
import { SavaFooter } from "@/components/layout/sava_footer"
import { StatCard } from "@/components/ui/stat_card"
import { AdvisorImpact } from "./components/advisor_impact"
import { getHouseholds, getGratsByHousehold, getActiveGrats } from "@/lib/data/store"
import { formatCurrency, formatCompactCurrency } from "@/lib/format"

export default function ReportsPage() {
  const households = getHouseholds()
  const allGrats = households.flatMap(h => getGratsByHousehold(h.id))
  const activeGrats = getActiveGrats()

  const totalTransferred = households.reduce((sum, h) => sum + h.wealthTransferred, 0)
  const totalTaxSaved = totalTransferred * 0.4
  const completedGrats = allGrats.filter(g => ["rolled", "completed"].includes(g.status)).length
  const avgExcess = activeGrats.length > 0
    ? activeGrats.reduce((sum, g) => sum + (g.expectedReturn - g.hurdle7520Rate), 0) / activeGrats.length * 100
    : 0

  // Count alternative assets under admin
  const altAssetGrats = activeGrats.filter(g => ["private_co", "re_llc", "pe_fund", "hedge_fund"].includes(g.assetType))

  return (
    <>
      <Header
        title="Wealth Transfer Summary"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Reports" }]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-surface-container-low text-[11px] font-bold">
              <button className="rounded-lg bg-primary px-3 py-1.5 text-on-primary">All Time</button>
              <button className="px-3 py-1.5 text-on-surface-variant">YTD</button>
              <button className="px-3 py-1.5 text-on-surface-variant">This Quarter</button>
            </div>
            <button className="rounded-xl bg-surface-container-low px-4 py-2 text-sm font-bold text-on-surface-variant">
              Export PDF
            </button>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto bg-background p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard label="Total Wealth Transferred" value={formatCompactCurrency(totalTransferred)} variant="hero" />
          <StatCard label="Gift Tax Saved" value={formatCompactCurrency(totalTaxSaved)} variant="hero" />
          <StatCard label="GRATs Completed" value={String(completedGrats)} variant="light" />
          <StatCard label="Avg Excess Return" value={`+${avgExcess.toFixed(1)}%`} trendDirection="up" variant="light" />
        </div>

        {/* Per-Client Performance Table */}
        <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10">
            <h3 className="font-headline text-lg font-extrabold text-primary">Per-Client Performance</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Household</th>
                <th className="px-6 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Trust AUM</th>
                <th className="px-6 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Transferred</th>
                <th className="px-6 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Tax Saved</th>
                <th className="px-6 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Avg Return</th>
                <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">GRATs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {households.map(household => {
                const hGrats = getGratsByHousehold(household.id)
                const hActive = hGrats.filter(g => !["rolled", "completed"].includes(g.status))
                const hCompleted = hGrats.filter(g => ["rolled", "completed"].includes(g.status))
                const hAvgReturn = hActive.length > 0
                  ? hActive.reduce((s, g) => s + g.expectedReturn, 0) / hActive.length * 100
                  : 0

                return (
                  <tr key={household.id} className="hover:bg-primary-fixed/20 transition-colors">
                    <td className="px-6 py-3 text-sm font-semibold text-on-surface">{household.name}</td>
                    <td className="px-6 py-3 text-right font-mono text-sm font-medium text-primary">{formatCurrency(household.totalAUM)}</td>
                    <td className="px-6 py-3 text-right font-mono text-sm font-medium text-secondary">{formatCurrency(household.wealthTransferred)}</td>
                    <td className="px-6 py-3 text-right font-mono text-sm font-medium text-secondary">{formatCurrency(household.wealthTransferred * 0.4)}</td>
                    <td className="px-6 py-3 text-right font-mono text-sm font-bold text-secondary">{hAvgReturn.toFixed(1)}%</td>
                    <td className="px-6 py-3 text-sm text-on-surface">{hActive.length} active · {hCompleted.length} matured</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Advisor Impact */}
        <AdvisorImpact households={households} />

        {/* Sava Trust Administration Summary */}
        <div className="rounded-xl bg-surface-container-lowest p-6">
          <h3 className="font-headline text-lg font-extrabold text-primary mb-1">Sava Trust Administration Summary</h3>
          <p className="text-sm text-on-surface-variant mb-6">Trust services provided across your practice</p>
          <div className="grid grid-cols-5 gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Active Trusts</p>
              <p className="font-headline text-3xl font-extrabold text-primary">{activeGrats.length}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Rollovers Processed</p>
              <p className="font-headline text-3xl font-extrabold text-primary">7</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Annuity Payments</p>
              <p className="font-headline text-3xl font-extrabold text-primary">{allGrats.reduce((s, g) => s + g.annuityPayments.filter(p => p.status === "paid").length, 0)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Documents Generated</p>
              <p className="font-headline text-3xl font-extrabold text-primary">34</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Alt Assets Under Admin</p>
              <p className="font-headline text-3xl font-extrabold text-primary">{altAssetGrats.length}</p>
            </div>
          </div>
          <p className="mt-6 text-[11px] text-on-surface-variant border-t border-outline-variant/10 pt-3">
            All trusts administered by Sava Trust Company under Nevada trust charter
          </p>
        </div>

        <SavaFooter />
      </div>
    </>
  )
}
