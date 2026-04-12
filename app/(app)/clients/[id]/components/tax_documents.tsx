import type { TrustDocument } from "@/lib/types"
import { formatDate } from "@/lib/format"

const DOC_ICONS: Record<string, string> = {
  trust_instrument: "description",
  form_709: "receipt_long",
  trust_return: "summarize",
  annuity_confirmation: "task_alt",
  funding_instructions: "send",
}

function deliveryStatus(doc: TrustDocument): { label: string; color: string; icon: string } {
  const docDate = new Date(doc.date)
  const now = new Date("2026-04-11")
  const daysSince = Math.floor((now.getTime() - docDate.getTime()) / (1000 * 60 * 60 * 24))

  if (daysSince < 30) {
    return { label: "Delivered", color: "text-secondary", icon: "check_circle" }
  }
  if (daysSince < 90) {
    return { label: "Available", color: "text-primary", icon: "inventory_2" }
  }
  return { label: "Archived", color: "text-on-surface-variant", icon: "archive" }
}

export function TaxDocuments({ documents }: { documents: TrustDocument[] }) {
  const grouped = documents.reduce<Record<string, TrustDocument[]>>((acc, doc) => {
    const year = new Date(doc.date).getFullYear().toString()
    if (!acc[year]) acc[year] = []
    acc[year].push(doc)
    return acc
  }, {})

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="rounded-xl bg-surface-container-lowest p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>verified</span>
        <h3 className="font-headline text-base font-extrabold text-primary">Documents from Sava Trust Company</h3>
      </div>
      <p className="text-sm text-on-surface-variant mb-4">
        {documents.length} documents prepared and maintained by Sava Trust Company
      </p>
      <div className="space-y-6">
        {years.map(year => (
          <div key={year}>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">{year}</h4>
            <div className="space-y-2">
              {grouped[year].map(doc => {
                const status = deliveryStatus(doc)
                return (
                  <div key={doc.id} className="flex items-center justify-between rounded-lg p-3 hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "20px" }}>
                        {DOC_ICONS[doc.type] ?? "description"}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-on-surface">{doc.name}</p>
                        <p className="text-[11px] text-on-surface-variant">{formatDate(doc.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`material-symbols-outlined ${status.color}`} style={{ fontSize: "16px" }}>
                        {status.icon}
                      </span>
                      <span className={`text-[11px] font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-[11px] text-on-surface-variant border-t border-outline-variant/10 pt-3">
        Documents are prepared by Sava Trust Company as part of trust administration. Contact your Sava representative for copies or questions.
      </div>
    </div>
  )
}
