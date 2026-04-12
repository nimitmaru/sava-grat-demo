import type { Household } from "@/lib/types"
import { formatCurrency } from "@/lib/format"

export function AdvisorImpact({ households }: { households: Household[] }) {
  const totalAdvisorFee = households.reduce((sum, h) => sum + h.totalAUM * h.advisorFeeRate, 0)
  const totalSavaFee = households.reduce((sum, h) => sum + h.totalAUM * 0.0025, 0)
  const totalTaxSavings = households.reduce((sum, h) => sum + h.wealthTransferred * 0.4, 0)

  return (
    <div className="rounded-xl bg-surface-container-lowest p-6">
      <h3 className="font-headline text-lg font-extrabold text-primary mb-1">Your Practice Economics</h3>
      <p className="text-sm text-on-surface-variant mb-6">How Auto-GRAT impacts your advisory practice</p>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-semibold text-on-surface">Your AUM Fee on Trust Assets</p>
            <p className="text-[11px] text-on-surface-variant">Based on your standard fee rates across all client households</p>
          </div>
          <p className="font-mono text-xl font-bold text-primary">{formatCurrency(totalAdvisorFee)}/yr</p>
        </div>
        <div className="flex items-center justify-between py-3 border-t border-outline-variant/10">
          <div>
            <p className="text-sm font-semibold text-on-surface">Sava Trust Admin Fee</p>
            <p className="text-[11px] text-on-surface-variant">Billed to clients separately — does not reduce your fee</p>
          </div>
          <p className="font-mono text-xl font-bold text-on-surface-variant">{formatCurrency(totalSavaFee)}/yr</p>
        </div>
        <div className="flex items-center justify-between py-3 border-t border-outline-variant/10">
          <div>
            <p className="text-sm font-semibold text-on-surface">Total Client Tax Savings</p>
            <p className="text-[11px] text-on-surface-variant">Cumulative gift tax avoided across all households</p>
          </div>
          <p className="font-mono text-xl font-bold text-secondary">{formatCurrency(totalTaxSavings)}</p>
        </div>
        <div className="flex items-center justify-between py-3 border-t border-outline-variant/10">
          <div>
            <p className="text-sm font-semibold text-on-surface">Client Retention Value</p>
            <p className="text-[11px] text-on-surface-variant">Each GRAT rollover is a client touchpoint</p>
          </div>
          <p className="font-mono text-xl font-bold text-primary">28 touchpoints/yr</p>
        </div>
      </div>

      <p className="mt-6 text-[11px] text-on-surface-variant border-t border-outline-variant/10 pt-3">
        Sava holds all trust assets at your clients&apos; existing custodians. Your advisory relationship and fee structure are fully preserved.
      </p>
    </div>
  )
}
