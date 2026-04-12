import Link from "next/link"

type HeaderProps = {
  title: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  actions?: React.ReactNode
}

export function Header({ title, breadcrumbs, actions }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest px-8">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-[11px] text-on-surface-variant mb-0.5">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-primary transition-colors">{crumb.label}</Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-headline text-lg font-extrabold text-primary">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {actions}
        {/* Notification bell */}
        <button className="relative rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>notifications</span>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
        </button>
      </div>
    </header>
  )
}
