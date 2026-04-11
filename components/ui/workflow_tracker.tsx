import type { WorkflowStep } from "@/lib/types"

type WorkflowTrackerProps = {
  steps: WorkflowStep[]
  compact?: boolean
}

export function WorkflowTracker({ steps, compact = false }: WorkflowTrackerProps) {
  return (
    <div className={compact ? "space-y-1" : "space-y-3"}>
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          {/* Step indicator */}
          <div className="flex flex-col items-center">
            {step.status === "completed" ? (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary">
                <span className="material-symbols-outlined text-white" style={{ fontSize: "14px" }}>check</span>
              </div>
            ) : step.status === "active" ? (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-container-high">
                <div className="h-2 w-2 rounded-full bg-on-surface-variant/40" />
              </div>
            )}
            {/* Connecting line (not on last step) */}
            {i < steps.length - 1 && (
              <div className={`w-0.5 ${compact ? "h-3" : "h-5"} ${
                step.status === "completed" ? "bg-secondary" : "bg-surface-container-high"
              }`} />
            )}
          </div>
          {/* Step content */}
          <div className={compact ? "-mt-0.5" : ""}>
            <p className={`${compact ? "text-xs" : "text-sm"} font-semibold ${
              step.status === "pending" ? "text-on-surface-variant/60" : "text-on-surface"
            }`}>
              {step.label}
            </p>
            {step.detail && !compact && (
              <p className="text-[11px] text-on-surface-variant">{step.detail}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
