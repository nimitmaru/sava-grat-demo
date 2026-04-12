import { Header } from "@/components/layout/header"
import { SavaFooter } from "@/components/layout/sava_footer"
import { StatusPill } from "@/components/ui/status_pill"
import { AssetTypeBadge } from "@/components/ui/asset_type_badge"
import { getHouseholds, getGratsByHousehold } from "@/lib/data/store"
import { formatCurrency } from "@/lib/format"
import Link from "next/link"

export default function ClientsPage() {
  const households = getHouseholds()

  return (
    <>
      <Header
        title="Clients"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Clients" }]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-2">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>search</span>
              <input type="text" placeholder="Search clients..." className="bg-transparent text-sm outline-none placeholder:text-on-surface-variant/60 w-48" />
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary">
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
              New Client
            </button>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto bg-background p-6 space-y-6">
        <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Household</th>
                <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Custodian</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Attorney</th>
                <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Active GRATs</th>
                <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Asset Types</th>
                <th className="px-6 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Trust AUM</th>
                <th className="px-6 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Transferred</th>
                <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {households.map((household) => {
                const grats = getGratsByHousehold(household.id)
                const activeGrats = grats.filter(g => !["rolled", "completed"].includes(g.status))
                const assetTypes = [...new Set(activeGrats.map(g => g.assetType))]

                return (
                  <tr key={household.id} className="transition-colors hover:bg-primary-fixed/20">
                    <td className="px-6 py-4">
                      <Link href={`/clients/${household.id}`} className="block">
                        <p className="text-sm font-semibold text-on-surface">{household.name}</p>
                        <p className="text-[13px] text-on-surface-variant">{household.description}</p>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-on-surface">Assets at {household.custodian}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-container text-[9px] font-bold text-white">
                          {household.attorney.initials}
                        </div>
                        <span className="text-sm text-on-surface-variant">{household.attorney.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm font-bold text-on-surface">{activeGrats.length}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {assetTypes.map((type) => (
                          <AssetTypeBadge key={type} type={type} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-mono text-sm font-medium text-primary">{formatCurrency(household.totalAUM)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-mono text-sm font-medium text-secondary">{formatCurrency(household.wealthTransferred)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={household.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <SavaFooter />
      </div>
    </>
  )
}
