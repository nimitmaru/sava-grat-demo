"use client"

import { useEffect, useCallback } from "react"

type ModalShellProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function ModalShell({ open, onClose, title, subtitle, children }: ModalShellProps) {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, handleEscape])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />
      {/* Modal panel */}
      <div className="relative mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-surface-container-lowest shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between bg-surface-container-lowest p-6 pb-4">
          <div>
            <h2 className="font-headline text-lg font-extrabold text-primary">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-on-surface-variant">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {/* Content */}
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  )
}
