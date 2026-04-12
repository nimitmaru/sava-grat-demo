type MetricBlockProps = {
  label: string
  value: string
  variant?: "default" | "success" | "primary"
}

export function MetricBlock({ label, value, variant = "default" }: MetricBlockProps) {
  const valueColor = variant === "success" ? "text-secondary" : variant === "primary" ? "text-primary" : "text-on-surface"
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">{label}</p>
      <p className={`font-headline text-2xl font-extrabold tracking-tight ${valueColor}`}>{value}</p>
    </div>
  )
}
