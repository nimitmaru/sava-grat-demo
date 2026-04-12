"use client"

type StatusPillProps = {
  status: "active" | "maturing" | "pending_rollover" | "rolled" | "underperforming" | "completed" | "new" |
          "action_needed" | "rollover_ready" | "on_track" | "scheduled" | "paid" | "overdue"
  animate?: boolean
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  active:           { bg: "bg-secondary-container",              text: "text-on-secondary-container",         dot: "bg-secondary",              label: "Active" },
  on_track:         { bg: "bg-secondary-container",              text: "text-on-secondary-container",         dot: "bg-secondary",              label: "On Track" },
  paid:             { bg: "bg-secondary-container",              text: "text-on-secondary-container",         dot: "bg-secondary",              label: "Paid" },
  maturing:         { bg: "bg-tertiary-fixed/30",                text: "text-on-tertiary-fixed-variant",      dot: "bg-tertiary-fixed-dim",     label: "Maturing" },
  pending_rollover: { bg: "bg-primary-fixed",                    text: "text-on-primary-fixed-variant",       dot: "bg-primary",                label: "Pending Rollover" },
  rollover_ready:   { bg: "bg-primary-fixed",                    text: "text-on-primary-fixed-variant",       dot: "bg-primary",                label: "Rollover Ready" },
  action_needed:    { bg: "bg-tertiary-fixed/30",                text: "text-on-tertiary-fixed-variant",      dot: "bg-tertiary-fixed-dim",     label: "Action Needed" },
  scheduled:        { bg: "bg-surface-container-high",           text: "text-on-surface-variant",             dot: "bg-on-surface-variant",     label: "Scheduled" },
  underperforming:  { bg: "bg-error-container",                  text: "text-on-error-container",             dot: "bg-error",                  label: "Underperforming" },
  overdue:          { bg: "bg-error-container",                  text: "text-on-error-container",             dot: "bg-error",                  label: "Overdue" },
  rolled:           { bg: "bg-surface-container-high",           text: "text-on-surface-variant",             dot: "bg-on-surface-variant",     label: "Rolled" },
  completed:        { bg: "bg-surface-container-high",           text: "text-on-surface-variant",             dot: "bg-on-surface-variant",     label: "Completed" },
  new:              { bg: "bg-surface-container",                text: "text-on-surface-variant",             dot: "bg-on-surface-variant",     label: "New" },
}

export function StatusPill({ status, animate }: StatusPillProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.active
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-tight ${config.bg} ${config.text}`}>
      {animate ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.dot} opacity-75`} />
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${config.dot}`} />
        </span>
      ) : (
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      )}
      {config.label}
    </span>
  )
}
