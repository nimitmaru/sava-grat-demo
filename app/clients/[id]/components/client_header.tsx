import type { Household } from "@/lib/types"
import { StatusPill } from "@/components/ui/status_pill"
import Link from "next/link"

export function ClientHeader({ household }: { household: Household }) {
  const hasStaleValuation = household.holdings.some(h => h.valuationStale)

  return (
    <div className="rounded-xl bg-surface-container-lowest p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-headline text-2xl font-extrabold text-primary">{household.name}</h2>
            <StatusPill status={household.status} />
          </div>
          <p className="text-sm text-on-surface-variant mb-3">{household.description}</p>
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "16px" }}>account_balance</span>
              <span className="font-semibold">Assets held at {household.custodian}</span>
            </span>
            <span className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>verified</span>
              Trustee: Sava Trust Company, NV
            </span>
            <span className="text-on-surface-variant">Contact: {household.primaryContact}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasStaleValuation && (
            <button className="flex items-center gap-1.5 rounded-xl bg-surface-container-low px-4 py-2 text-sm font-bold text-on-surface-variant">
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>query_stats</span>
              Request Valuation
            </button>
          )}
          <Link href={`/modeling?client=${household.id}`} className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary">
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
            New GRAT
          </Link>
        </div>
      </div>
    </div>
  )
}
