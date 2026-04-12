"use client"

import type { TrustDocument } from "@/lib/types"
import { formatDate } from "@/lib/format"
import { useToast } from "@/components/ui/toast"

const DOC_ICONS: Record<string, string> = {
  trust_instrument: "description",
  form_709: "receipt_long",
  trust_return: "summarize",
  annuity_confirmation: "task_alt",
  funding_instructions: "send",
}

export function TaxDocuments({ documents }: { documents: TrustDocument[] }) {
  const { showToast } = useToast()

  const grouped = documents.reduce<Record<string, TrustDocument[]>>((acc, doc) => {
    const year = new Date(doc.date).getFullYear().toString()
    if (!acc[year]) acc[year] = []
    acc[year].push(doc)
    return acc
  }, {})

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="rounded-xl bg-surface-container-lowest p-6">
      <h3 className="font-headline text-base font-extrabold text-primary mb-1">Tax & Documents</h3>
      <p className="text-sm text-on-surface-variant mb-4">{documents.length} documents</p>
      <div className="space-y-6">
        {years.map(year => (
          <div key={year}>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">{year}</h4>
            <div className="space-y-2">
              {grouped[year].map(doc => (
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
                  <button
                    onClick={() => showToast("PDF generation available in production environment", "info")}
                    className="rounded-lg bg-surface-container-low px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-[11px] text-on-surface-variant border-t border-outline-variant/10 pt-3">
        All trust documents prepared and maintained by Sava Trust Company
      </div>
    </div>
  )
}
