import type { AssetType } from "@/lib/types"

const BADGE_CONFIG: Record<AssetType, { label: string; className: string }> = {
  public_equity:       { label: "Public Equity",       className: "bg-surface-container-high text-on-surface-variant" },
  concentrated_stock:  { label: "Concentrated Stock",  className: "bg-surface-container-high text-on-surface-variant" },
  diversified:         { label: "Diversified",         className: "bg-surface-container-high text-on-surface-variant" },
  private_co:          { label: "Private Co.",         className: "bg-primary-fixed text-on-primary-fixed-variant" },
  pe_fund:             { label: "PE Fund",             className: "bg-primary-fixed text-on-primary-fixed-variant" },
  hedge_fund:          { label: "Hedge Fund",          className: "bg-primary-fixed text-on-primary-fixed-variant" },
  re_llc:              { label: "RE LLC",              className: "bg-primary-fixed text-on-primary-fixed-variant" },
}

export function AssetTypeBadge({ type }: { type: AssetType }) {
  const config = BADGE_CONFIG[type]
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${config.className}`}>
      {config.label}
    </span>
  )
}
