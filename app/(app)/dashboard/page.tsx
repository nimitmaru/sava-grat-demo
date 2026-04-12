import { Header } from "@/components/layout/header"
import { SavaFooter } from "@/components/layout/sava_footer"
import { StatCard } from "@/components/ui/stat_card"
import { getDashboardStats, getNeedsAttention, getActivities } from "@/lib/data/store"
import { formatCompactCurrency, formatDate } from "@/lib/format"
import Link from "next/link"

export default function DashboardPage() {
  const stats = getDashboardStats()
  const attentionItems = getNeedsAttention()
  const recentActivities = getActivities().slice(0, 8)

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
        {/* Stat Cards Row */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard
            label="Active GRATs"
            value={String(stats.activeGrats)}
            trend="+3 this quarter"
            trendDirection="up"
            variant="hero"
          />
          <StatCard
            label="Wealth Transferred"
            value={formatCompactCurrency(stats.wealthTransferred)}
            trend="+$2.5M YTD"
            trendDirection="up"
            variant="hero"
          />
          <StatCard
            label="Pending Rollovers"
            value={String(stats.pendingRollovers)}
            trend="2 due this week"
            variant="light"
          />
          <StatCard
            label="Client Households"
            value={String(stats.totalHouseholds)}
            trend={`${formatCompactCurrency(stats.totalAUM)} total AUM`}
            variant="light"
          />
        </div>

        {/* Two-column grid: Needs Attention + Activity Feed */}
        <div className="grid grid-cols-2 gap-6">
          {/* Needs Attention */}
          <div className="rounded-xl bg-surface-container-lowest p-6">
            <h2 className="font-headline text-lg font-extrabold text-primary">Needs Attention</h2>
            <p className="text-sm text-on-surface-variant mb-4">
              {attentionItems.length} items require your review
            </p>
            <div className="space-y-3">
              {attentionItems.map((item, i) => {
                const bgColor =
                  item.type === "underperforming"
                    ? "bg-error-container/10"
                    : item.type === "valuation"
                    ? "bg-primary-fixed/20"
                    : "bg-tertiary-fixed/10"

                return (
                  <Link
                    key={i}
                    href={item.actionUrl}
                    className={`block rounded-xl ${bgColor} p-4 transition-colors hover:opacity-80`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{item.household.name}</p>
                        <p className="text-[13px] text-on-surface-variant">{item.description}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{item.action}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl bg-surface-container-lowest p-6">
            <h2 className="font-headline text-lg font-extrabold text-primary">Recent Activity</h2>
            <p className="text-sm text-on-surface-variant mb-4">Latest actions across all clients</p>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-low">
                    <span
                      className="material-symbols-outlined text-on-surface-variant"
                      style={{ fontSize: "14px" }}
                    >
                      {activity.type === "trust_accepted"
                        ? "verified"
                        : activity.type === "rollover_approved"
                        ? "autorenew"
                        : activity.type === "grat_created"
                        ? "add_circle"
                        : activity.type === "annuity_paid"
                        ? "attach_money"
                        : activity.type === "substitution"
                        ? "swap_horiz"
                        : activity.type === "valuation_requested"
                        ? "query_stats"
                        : "schedule"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-on-surface">{activity.description}</p>
                    <p className="text-[11px] text-on-surface-variant">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SavaFooter />
      </div>
    </>
  )
}
