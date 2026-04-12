import { Header } from "@/components/layout/header"
import { SavaFooter } from "@/components/layout/sava_footer"
import { StatCard } from "@/components/ui/stat_card"
import { getRateHistory, getCurrentRate, getHouseholds, getGratsByHousehold } from "@/lib/data/store"
import { formatPercent } from "@/lib/format"
import { RateChart } from "./rate_chart"
import { StrategyComparison } from "./components/strategy_comparison"

export default function RateMonitorPage() {
  const rateHistory = getRateHistory()
  const currentRate = getCurrentRate()
  const households = getHouseholds()

  // Calculate 12-month average
  const last12 = rateHistory.slice(-12)
  const avgRate = last12.reduce((s, r) => s + r.rate, 0) / last12.length

  return (
    <>
      <Header
        title="Rates & Strategy"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Resources" }, { label: "Rates & Strategy" }]}
      />
      <div className="flex-1 overflow-y-auto bg-background p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-6">
          <StatCard
            label="Current Rate (Apr 2026)"
            value={formatPercent(currentRate)}
            trend="↓0.20% from last month"
            trendDirection="down"
            variant="hero"
          />
          <StatCard
            label="12-Month Average"
            value={formatPercent(avgRate)}
            trend="Range: 4.80%–5.80%"
            variant="light"
          />
          <div className="rounded-xl bg-secondary-container/20 border border-secondary/20 p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-secondary mb-1">Advisory Signal</p>
            <p className="font-headline text-3xl font-extrabold text-secondary">Favorable</p>
            <p className="text-sm text-on-surface-variant mt-2">
              Current rate below 12-month average — favorable conditions for new GRAT origination
            </p>
          </div>
        </div>

        {/* Historical Chart */}
        <RateChart rateHistory={rateHistory} avgRate={avgRate} />

        {/* Impact Analysis Table */}
        <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10">
            <h3 className="font-headline text-lg font-extrabold text-primary">Rate Impact Analysis</h3>
            <p className="text-sm text-on-surface-variant">
              How the current rate affects each client&apos;s GRAT program
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">
                  Household
                </th>
                <th className="px-6 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">
                  Active GRATs
                </th>
                <th className="px-6 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">
                  Hurdle Rates
                </th>
                <th className="px-6 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">
                  Spread vs Current
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">
                  Recommendation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {households.map(household => {
                const grats = getGratsByHousehold(household.id)
                const active = grats.filter(g => !["rolled", "completed"].includes(g.status))
                const hurdles = [...new Set(active.map(g => (g.hurdle7520Rate * 100).toFixed(2) + "%"))]
                const avgHurdle =
                  active.length > 0
                    ? active.reduce((s, g) => s + g.hurdle7520Rate, 0) / active.length
                    : currentRate
                const spread = ((currentRate - avgHurdle) * 100).toFixed(2)
                const favorable = currentRate <= avgRate

                return (
                  <tr key={household.id} className="hover:bg-primary-fixed/20 transition-colors">
                    <td className="px-6 py-3 text-sm font-semibold text-on-surface">{household.name}</td>
                    <td className="px-6 py-3 text-right font-mono text-sm font-medium text-primary">
                      {active.length}
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-sm text-on-surface">
                      {hurdles.join(", ")}
                    </td>
                    <td
                      className={`px-6 py-3 text-right font-mono text-sm font-bold ${
                        Number(spread) <= 0 ? "text-secondary" : "text-error"
                      }`}
                    >
                      {Number(spread) > 0 ? "+" : ""}
                      {spread}%
                    </td>
                    <td className="px-6 py-3 text-sm text-on-surface-variant">
                      {favorable ? (
                        <span className="text-secondary font-semibold">
                          Favorable — consider new GRAT origination
                        </span>
                      ) : (
                        <span>Neutral — maintain current positions</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Strategy Comparison */}
        <StrategyComparison currentRate={currentRate} />

        <SavaFooter />
      </div>
    </>
  )
}
