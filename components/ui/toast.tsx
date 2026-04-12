"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type Toast = {
  id: string
  message: string
  type: "success" | "info" | "error"
}

type ToastContextType = {
  showToast: (message: string, type?: Toast["type"]) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = `toast-${Date.now()}`
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{ boxShadow: "0 20px 40px rgba(0, 27, 68, 0.18)" }}
            className={`rounded-xl px-5 py-3 text-sm font-semibold ${
              toast.type === "success"
                ? "bg-secondary text-white"
                : toast.type === "error"
                ? "bg-error text-white"
                : "bg-primary text-on-primary"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                {toast.type === "success" ? "check_circle" : toast.type === "error" ? "error" : "info"}
              </span>
              {toast.message}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
