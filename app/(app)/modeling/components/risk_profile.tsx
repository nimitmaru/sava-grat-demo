"use client"

import { formatCurrency } from "@/lib/format"

export function RiskProfile({
  remainder,
  rate7520,
}: {
  remainder: number
  rate7520: number
}) {
  return (
    <div>
      <h4 className="font-headline text-base font-extrabold text-primary mb-1">A call option with zero premium</h4>
      <p className="text-sm text-on-surface-variant mb-4">
        If the GRAT outperforms the {(rate7520 * 100).toFixed(2)}% hurdle, the excess passes tax-free. If it doesn&apos;t, everything returns to the grantor.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {/* Win scenario */}
        <div className="rounded-xl bg-secondary-container/20 border border-secondary/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-secondary mb-3">Assets Outperform Hurdle</p>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Tax-Free Transfer</p>
              <p className="font-headline text-2xl font-extrabold text-secondary">{formatCurrency(remainder)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Gift Tax Owed</p>
              <p className="font-mono text-lg font-bold text-on-surface">$0</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Cost to Grantor</p>
              <p className="font-mono text-lg font-bold text-on-surface">$0</p>
            </div>
          </div>
        </div>
        {/* No-lose scenario */}
        <div className="rounded-xl bg-surface-container-low p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">Assets Underperform Hurdle</p>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Tax-Free Transfer</p>
              <p className="font-mono text-lg font-bold text-on-surface-variant">$0</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Gift Tax Owed</p>
              <p className="font-mono text-lg font-bold text-on-surface">$0</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Cost to Grantor</p>
              <p className="font-mono text-lg font-bold text-on-surface">$0 — nothing is lost</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
