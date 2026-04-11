import type { GRAT } from "@/lib/types"
import { StatusPill } from "@/components/ui/status_pill"
import { formatCurrency, formatDate } from "@/lib/format"

export function AnnuitySchedule({ grats }: { grats: GRAT[] }) {
  const activeGrats = grats.filter(g => !["rolled", "completed"].includes(g.status))
  const payments = activeGrats
    .flatMap(g => g.annuityPayments.map(p => ({ ...p, gratName: g.name })))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  return (
    <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
      <div className="p-6 border-b border-outline-variant/10">
        <h3 className="font-headline text-base font-extrabold text-primary">Annuity Schedule</h3>
        <p className="text-sm text-on-surface-variant">{payments.length} payments across {activeGrats.length} active GRATs</p>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-surface-container-low/50">
            <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">GRAT</th>
            <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Payment</th>
            <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Due Date</th>
            <th className="px-6 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Amount</th>
            <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-primary-fixed/20 transition-colors">
              <td className="px-6 py-3 text-sm font-semibold text-on-surface">{payment.gratName}</td>
              <td className="px-6 py-3 text-sm text-on-surface">Year {payment.year}</td>
              <td className="px-6 py-3 text-sm text-on-surface">{formatDate(payment.dueDate)}</td>
              <td className="px-6 py-3 text-right font-mono text-sm font-medium text-primary">{formatCurrency(payment.amount)}</td>
              <td className="px-6 py-3"><StatusPill status={payment.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-6 py-3 text-[11px] text-on-surface-variant border-t border-outline-variant/10">
        Annuity payments processed by Sava Trust Company
      </div>
    </div>
  )
}
