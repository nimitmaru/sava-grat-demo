"use client"

type StatCardProps = {
  label: string
  value: string
  trend?: string
  trendDirection?: "up" | "down" | "neutral"
  variant: "hero" | "light"
  icon?: string  // Material Symbols icon name
}

export function StatCard({ label, value, trend, trendDirection = "neutral", variant, icon }: StatCardProps) {
  if (variant === "hero") {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-container p-6 text-white">
        {/* Decorative blur circle */}
        <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <p className="font-headline text-[10px] font-bold uppercase tracking-[0.08em] opacity-60">
            {label}
          </p>
          <p className="font-headline text-5xl font-extrabold tracking-tightest -mt-1">
            {value}
          </p>
          {trend && (
            <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-secondary-container">
              {trendDirection === "up" && <span className="material-symbols-outlined text-sm">trending_up</span>}
              {trendDirection === "down" && <span className="material-symbols-outlined text-sm">trending_down</span>}
              {trend}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Light variant
  return (
    <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6">
      <p className="font-body text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="font-headline text-4xl font-extrabold tracking-tight text-primary">
        {value}
      </p>
      {trend && (
        <p className={`mt-2 flex items-center gap-1 text-[11px] font-semibold ${
          trendDirection === "up" ? "text-secondary" : trendDirection === "down" ? "text-error" : "text-on-surface-variant"
        }`}>
          {trendDirection === "up" && <span className="material-symbols-outlined text-sm">trending_up</span>}
          {trendDirection === "down" && <span className="material-symbols-outlined text-sm">trending_down</span>}
          {trend}
        </p>
      )}
    </div>
  )
}
