"use client"

import { Fragment, useState } from "react"
import type { GRAT, RolloverProposal, Household } from "@/lib/types"
import { StatusPill } from "@/components/ui/status_pill"
import { AssetTypeBadge } from "@/components/ui/asset_type_badge"
import { WorkflowTracker } from "@/components/ui/workflow_tracker"
import { RolloverModal } from "@/components/ui/rollover_modal"
import { SubstitutionModal } from "@/components/ui/substitution_modal"
import { formatCurrency, formatDate } from "@/lib/format"

type GratLadderProps = {
  grats: GRAT[]
  householdId: string
  proposals: RolloverProposal[]
  household: Household
}

export function GratLadder({ grats, householdId, proposals, household }: GratLadderProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [rolloverGratId, setRolloverGratId] = useState<string | null>(null)
  const [substitutionGratId, setSubstitutionGratId] = useState<string | null>(null)

  const sortedGrats = [...grats].sort((a, b) => {
    const aHistorical = ["rolled", "completed"].includes(a.status) ? 1 : 0
    const bHistorical = ["rolled", "completed"].includes(b.status) ? 1 : 0
    if (aHistorical !== bHistorical) return aHistorical - bHistorical
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })

  return (
    <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
      <div className="p-6 border-b border-outline-variant/10">
        <h3 className="font-headline text-base font-extrabold text-primary">GRAT Ladder</h3>
        <p className="text-sm text-on-surface-variant">
          {grats.length} GRATs total ·{" "}
          {grats.filter(g => !["rolled", "completed"].includes(g.status)).length} active
        </p>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-surface-container-low/50">
            <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">
              GRAT
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">
              Asset
            </th>
            <th className="px-4 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">
              Funded
            </th>
            <th className="px-4 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">
              Hurdle
            </th>
            <th className="px-4 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">
              Current Value
            </th>
            <th className="px-4 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">
              Est. Remainder
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">
              Trustee
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {sortedGrats.map((grat) => {
            const isHistorical = ["rolled", "completed"].includes(grat.status)
            const isMaturing = grat.status === "maturing"
            const isUnderperforming = grat.status === "underperforming"
            const isExpanded = expandedId === grat.id

            return (
              <Fragment key={grat.id}>
                <tr
                  onClick={() => setExpandedId(isExpanded ? null : grat.id)}
                  className={`cursor-pointer transition-colors ${
                    isMaturing
                      ? "bg-tertiary-fixed/10 hover:bg-tertiary-fixed/20"
                      : isUnderperforming
                      ? "bg-error-container/10 hover:bg-error-container/20"
                      : isHistorical
                      ? "opacity-60 hover:opacity-80"
                      : "hover:bg-primary-fixed/20"
                  }`}
                >
                  <td className="px-6 py-3">
                    <p className="text-sm font-semibold text-on-surface">{grat.name}</p>
                    <p className="text-[11px] text-on-surface-variant">
                      {formatDate(grat.startDate)} — {formatDate(grat.maturityDate)}
                    </p>
                    {grat.rolledFromId && (
                      <p className="text-[10px] text-on-surface-variant">
                        ← Rolled from predecessor
                      </p>
                    )}
                    {isMaturing && (
                      <p className="text-[11px] font-semibold text-tertiary-fixed-dim">
                        Rollover recommended
                      </p>
                    )}
                    {(isMaturing || grat.status === "pending_rollover") && proposals.some(p => p.sourceGratId === grat.id) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setRolloverGratId(grat.id) }}
                        className="mt-1 rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-on-primary hover:bg-primary/90 transition-colors"
                      >
                        Review Rollover
                      </button>
                    )}
                    {isUnderperforming && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSubstitutionGratId(grat.id) }}
                        className="mt-1 rounded-lg bg-error px-2.5 py-1 text-[10px] font-bold text-on-error hover:bg-error/90 transition-colors"
                      >
                        Substitute Asset
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-on-surface mb-1">{grat.fundingAsset}</p>
                    <AssetTypeBadge type={grat.assetType} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-medium text-primary">
                    {formatCurrency(grat.fundingAmount)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-medium text-on-surface">
                    {(grat.hurdle7520Rate * 100).toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-medium text-primary">
                    {formatCurrency(grat.currentValue)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-mono text-sm font-bold ${
                        grat.remainderEstimate > 0
                          ? "text-secondary"
                          : grat.remainderEstimate < 0
                          ? "text-error"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {grat.remainderEstimate >= 0
                        ? formatCurrency(grat.remainderEstimate)
                        : `-${formatCurrency(Math.abs(grat.remainderEstimate))}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant">Sava Trust Co.</td>
                  <td className="px-4 py-3">
                    <StatusPill status={grat.status} animate={isMaturing} />
                  </td>
                </tr>
                {isExpanded && (
                  <tr key={`${grat.id}-workflow`}>
                    <td colSpan={8} className="bg-surface-container-low/30 px-6 py-4">
                      <div className="flex gap-8">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">
                            Trust Execution Workflow
                          </p>
                          <WorkflowTracker steps={grat.workflow} />
                        </div>
                        <div className="text-sm">
                          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">
                            Details
                          </p>
                          <p className="text-on-surface">Term: {grat.termYears} years</p>
                          <p className="text-on-surface">Attorney: {grat.attorneyName ?? "—"}</p>
                          <p className="text-on-surface">Jurisdiction: {grat.jurisdiction}</p>
                          <p className="text-on-surface">Trustee: {grat.trustee}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>

      {/* Rollover Modal */}
      {rolloverGratId && (() => {
        const sourceGrat = grats.find(g => g.id === rolloverGratId)
        const proposal = proposals.find(p => p.sourceGratId === rolloverGratId)
        if (!sourceGrat || !proposal) return null
        return (
          <RolloverModal
            proposal={proposal}
            sourceGrat={sourceGrat}
            household={household}
            open={true}
            onClose={() => setRolloverGratId(null)}
          />
        )
      })()}

      {/* Substitution Modal */}
      {substitutionGratId && (() => {
        const targetGrat = grats.find(g => g.id === substitutionGratId)
        if (!targetGrat) return null
        return (
          <SubstitutionModal
            grat={targetGrat}
            household={household}
            open={true}
            onClose={() => setSubstitutionGratId(null)}
          />
        )
      })()}
    </div>
  )
}
