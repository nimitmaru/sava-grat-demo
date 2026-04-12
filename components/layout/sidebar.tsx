"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

const PLATFORM_ITEMS = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Clients", icon: "group", href: "/clients" },
  { label: "GRAT Modeling", icon: "calculate", href: "/modeling" },
  { label: "Reports", icon: "analytics", href: "/reports" },
]

const RESOURCE_ITEMS = [
  { label: "Rates & Strategy", icon: "monitoring", href: "/rates_strategy" },
  { label: "Help & FAQ", icon: "help", href: "/help" },
  { label: "Documentation", icon: "menu_book", href: "/docs" },
]

function NavLink({ item, isActive }: { item: { label: string; icon: string; href: string }; isActive: boolean }) {
  return (
    <Link
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
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-primary text-on-primary">
      {/* Logo */}
      <div className="px-6 pt-6 pb-8">
        <Image
          src="/sava-logo.svg"
          alt="Sava"
          width={140}
          height={40}
          className="invert"
          priority
        />
        <p className="text-[10px] uppercase tracking-wider text-on-primary-container mt-0" style={{ paddingLeft: 36 }}>GRAT Platform</p>
      </div>

      {/* Platform Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {PLATFORM_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
        ))}

        {/* Resources Section */}
        <div className="pt-6">
          <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container/50">
            Resources
          </p>
          {RESOURCE_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
          ))}
        </div>
      </nav>

      {/* Settings */}
      <div className="px-3 pb-2">
        <NavLink
          item={{ label: "Settings", icon: "settings", href: "/settings" }}
          isActive={pathname.startsWith("/settings")}
        />
      </div>

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
