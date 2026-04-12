"use client"

import { useState, type ReactNode } from "react"

const TABS = [
  { key: "ladder", label: "GRAT Ladder", icon: "view_timeline" },
  { key: "annuity", label: "Annuity Schedule", icon: "schedule" },
  { key: "history", label: "History", icon: "history" },
  { key: "documents", label: "Tax & Documents", icon: "description" },
]

export function ClientTabs({ children }: { children: Record<string, ReactNode> }) {
  const [activeTab, setActiveTab] = useState("ladder")

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl bg-surface-container-low p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab.key
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab content */}
      <div className="mt-6">
        {children[activeTab]}
      </div>
    </div>
  )
}
