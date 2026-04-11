"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Clients", icon: "group", href: "/clients" },
  { label: "GRAT Modeling", icon: "calculate", href: "/modeling" },
  { label: "Reports", icon: "analytics", href: "/reports" },
  { label: "7520 Rate", icon: "monitoring", href: "/rate_monitor" },
  { label: "Settings", icon: "settings", href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-primary text-on-primary">
      {/* Logo */}
      <div className="px-6 pt-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-container">
            <span className="material-symbols-outlined text-white" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          </div>
          <div>
            <p className="text-xl font-extrabold tracking-tight">SAVA</p>
            <p className="text-[10px] uppercase tracking-wider text-on-primary-container">Auto-GRAT Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-container text-white"
                  : "text-on-primary-container hover:bg-white/5"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px", fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User profile */}
      <div className="border-t border-white/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-white">
            MR
          </div>
          <div>
            <p className="text-sm font-semibold">Michael Reynolds</p>
            <p className="text-[11px] text-on-primary-container">Reynolds Wealth Mgmt</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
