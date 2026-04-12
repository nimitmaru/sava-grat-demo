import { Header } from "@/components/layout/header"
import { SavaFooter } from "@/components/layout/sava_footer"
import { StatCard } from "@/components/ui/stat_card"
import { getDashboardStats, getNeedsAttention } from "@/lib/data/store"
import { formatCompactCurrency, formatPercent } from "@/lib/format"
import Link from "next/link"

export default function DashboardPage() {
  const stats = getDashboardStats()
  const attentionItems = getNeedsAttention()

  return (
    <>
      <Header
        title="Dashboard"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Dashboard" }]}
        actions={
          <Link
            href="/modeling"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
            New GRAT
          </Link>
        }
      />
      <div className="flex-1 overflow-y-auto bg-background p-6 space-y-6">
        {/* Actionable Metrics */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard
            label="Wealth Transferred"
            value={formatCompactCurrency(stats.wealthTransferred)}
            trend={`across ${stats.totalHouseholds} households`}
            trendDirection="up"
            variant="hero"
          />
          <StatCard
            label="Maturing This Month"
            value={String(stats.maturingThisMonth)}
            trend={stats.maturingThisMonth > 0 ? "Rollover decisions needed" : "No action needed"}
            trendDirection={stats.maturingThisMonth > 0 ? "up" : "neutral"}
            variant="light"
          />
          <StatCard
            label="Clients Without Program"
            value={String(stats.clientsWithoutProgram)}
            trend={stats.clientsWithoutProgram > 0 ? "Opportunity to onboard" : "All clients active"}
            trendDirection={stats.clientsWithoutProgram > 0 ? "up" : "neutral"}
            variant="light"
          />
          <div className={`rounded-xl p-6 ${stats.rateFavorableClients > 0 ? "bg-secondary-container/20 border border-secondary/20" : "bg-surface-container-lowest border border-outline-variant/10"}`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1">7520 Rate Signal</p>
            <p className={`font-headline text-3xl font-extrabold tracking-tight ${stats.rateFavorableClients > 0 ? "text-secondary" : "text-primary"}`}>
              {formatPercent(stats.currentRate)}
            </p>
            <p className="text-[11px] text-on-surface-variant mt-1">
              {stats.rateFavorableClients > 0
                ? `Favorable — consider origination for ${stats.rateFavorableClients} clients`
                : "Neutral — maintain current positions"
              }
            </p>
          </div>
        </div>

        {/* Action Queue */}
        <div className="rounded-xl bg-surface-container-lowest p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-headline text-lg font-extrabold text-primary">Action Queue</h2>
              <p className="text-sm text-on-surface-variant">
                {attentionItems.length} item{attentionItems.length !== 1 ? "s" : ""} requiring your attention
              </p>
            </div>
          </div>

          {attentionItems.length === 0 ? (
            <div className="rounded-xl bg-secondary-container/10 p-8 text-center">
              <span className="material-symbols-outlined text-secondary mb-2" style={{ fontSize: "32px" }}>check_circle</span>
              <p className="text-sm font-semibold text-on-surface">All caught up</p>
              <p className="text-[13px] text-on-surface-variant">No items require your attention right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attentionItems.map((item, i) => {
                const config = {
                  maturing: { bg: "bg-tertiary-fixed/10", icon: "schedule", iconColor: "text-on-tertiary-container", verb: "Review Rollover" },
                  rollover: { bg: "bg-primary-fixed/20", icon: "autorenew", iconColor: "text-primary", verb: "Approve Rollover" },
                  underperforming: { bg: "bg-error-container/10", icon: "trending_down", iconColor: "text-error", verb: "Review Substitution" },
                  valuation: { bg: "bg-surface-container-low", icon: "query_stats", iconColor: "text-on-surface-variant", verb: "Request Valuation" },
                }[item.type]

                return (
                  <Link
                    key={i}
                    href={item.actionUrl}
                    className={`flex items-center justify-between rounded-xl ${config.bg} p-4 transition-colors hover:opacity-80`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/60">
                        <span className={`material-symbols-outlined ${config.iconColor}`} style={{ fontSize: "20px" }}>
                          {config.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{item.household.name}</p>
                        <p className="text-[13px] text-on-surface-variant">{item.description}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 rounded-lg bg-white/80 px-3 py-1.5 text-[12px] font-bold text-primary">
                      {config.verb}
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-6">
          <Link
            href="/clients/whitfield"
            className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-5 transition-colors hover:bg-primary-fixed/10"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: "22px" }}>person_add</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">Onboard Whitfield Family</p>
              <p className="text-[12px] text-on-surface-variant">New client — no active GRAT program</p>
            </div>
          </Link>
          <Link
            href="/modeling"
            className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-5 transition-colors hover:bg-primary-fixed/10"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: "22px" }}>calculate</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">Model a New GRAT</p>
              <p className="text-[12px] text-on-surface-variant">Run projections with current 7520 rate</p>
            </div>
          </Link>
          <Link
            href="/reports"
            className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-5 transition-colors hover:bg-primary-fixed/10"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: "22px" }}>analytics</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">View Practice Report</p>
              <p className="text-[12px] text-on-surface-variant">Wealth transfer summary & economics</p>
            </div>
          </Link>
        </div>

        <SavaFooter />
      </div>
    </>
  )
}
