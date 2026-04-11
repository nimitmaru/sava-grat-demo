"use client"

import { Header } from "@/components/layout/header"
import { SavaFooter } from "@/components/layout/sava_footer"
import { resetDemo } from "@/lib/data/actions"
import { useToast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { showToast } = useToast()
  const router = useRouter()

  const handleReset = async () => {
    await resetDemo()
    showToast("Demo data has been reset to initial state", "success")
    router.refresh()
  }

  return (
    <>
      <Header
        title="Settings"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Settings" }]}
      />
      <div className="flex-1 overflow-y-auto bg-background p-6 space-y-6">
        {/* Firm Profile */}
        <div className="rounded-xl bg-surface-container-lowest p-6">
          <h3 className="font-headline text-base font-extrabold text-primary mb-4">Firm Profile</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1">Firm Name</p>
              <p className="text-sm font-semibold text-on-surface">Reynolds Wealth Management</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1">Primary Advisor</p>
              <p className="text-sm font-semibold text-on-surface">Michael Reynolds, CFP®</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1">Location</p>
              <p className="text-sm text-on-surface">San Francisco, CA</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1">Clients</p>
              <p className="text-sm text-on-surface">5 Households · $84.5M AUM</p>
            </div>
          </div>
        </div>

        {/* Default GRAT Parameters */}
        <div className="rounded-xl bg-surface-container-lowest p-6">
          <h3 className="font-headline text-base font-extrabold text-primary mb-4">Default GRAT Parameters</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1.5">Default Term</p>
              <div className="rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface">2 Years</div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1.5">Annuity Structure</p>
              <div className="rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface">Level</div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1.5">Default Return Assumption</p>
              <div className="rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface">12%</div>
            </div>
          </div>
        </div>

        {/* Trust Company Info */}
        <div className="rounded-xl bg-surface-container-lowest p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>verified</span>
            <h3 className="font-headline text-base font-extrabold text-primary">Trust Company</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1">Corporate Trustee</p>
              <p className="text-sm font-semibold text-on-surface">Sava Trust Company</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1">Charter</p>
              <p className="text-sm text-on-surface">Nevada</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1">Trust Administration Fee</p>
              <p className="text-sm text-on-surface">0.25% annually</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1">Per-GRAT Fee</p>
              <p className="text-sm text-on-surface">$1,500</p>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-xl bg-surface-container-lowest p-6">
          <h3 className="font-headline text-base font-extrabold text-primary mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { label: "Rollover Alerts", desc: "Notify when a GRAT is approaching maturity", on: true },
              { label: "Valuation Reminders", desc: "Alert when alternative asset valuations become stale", on: true },
              { label: "Annuity Confirmations", desc: "Confirm when annuity payments are processed", on: false },
            ].map(pref => (
              <div key={pref.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-on-surface">{pref.label}</p>
                  <p className="text-[11px] text-on-surface-variant">{pref.desc}</p>
                </div>
                {/* Decorative toggle */}
                <div className={`h-6 w-11 rounded-full p-0.5 transition-colors ${pref.on ? "bg-secondary" : "bg-surface-container-high"}`}>
                  <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${pref.on ? "translate-x-5" : ""}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Demo */}
        <div className="rounded-xl border border-error/20 bg-error-container/10 p-6">
          <h3 className="font-headline text-base font-extrabold text-error mb-1">Reset Demo Data</h3>
          <p className="text-sm text-on-surface-variant mb-4">Restore all client data, GRATs, and activities to their initial state. This cannot be undone.</p>
          <button
            onClick={handleReset}
            className="rounded-xl border border-error/30 bg-white px-4 py-2 text-sm font-bold text-error hover:bg-error-container/20 transition-colors"
          >
            Reset All Demo Data
          </button>
        </div>

        <SavaFooter />
      </div>
    </>
  )
}
