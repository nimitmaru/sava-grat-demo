import type { Activity } from "@/lib/types"
import { formatDate } from "@/lib/format"

const ACTIVITY_ICONS: Record<string, string> = {
  trust_accepted: "verified",
  rollover_approved: "autorenew",
  grat_created: "add_circle",
  annuity_paid: "attach_money",
  substitution: "swap_horiz",
  valuation_requested: "query_stats",
  rollover_proposed: "schedule",
}

export function ClientHistory({ activities }: { activities: Activity[] }) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-6">
      <h3 className="font-headline text-base font-extrabold text-primary mb-1">Activity History</h3>
      <p className="text-sm text-on-surface-variant mb-4">{activities.length} events</p>
      <div className="space-y-4">
        {activities.map((activity) => {
          const isSavaEvent = activity.type === "trust_accepted" || activity.description.includes("Sava Trust")
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isSavaEvent ? "bg-primary-fixed" : "bg-surface-container-low"}`}>
                <span className={`material-symbols-outlined ${isSavaEvent ? "text-on-primary-fixed-variant" : "text-on-surface-variant"}`} style={{ fontSize: "15px" }}>
                  {ACTIVITY_ICONS[activity.type] ?? "info"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-on-surface">{activity.description}</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{formatDate(activity.timestamp)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
