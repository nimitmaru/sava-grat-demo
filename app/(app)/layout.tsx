import Link from "next/link"
import { AppShell } from "@/components/layout/app_shell"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Mobile gate — demo is desktop-only */}
      <div className="flex lg:hidden h-full items-center justify-center p-8">
        <div className="max-w-sm text-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-primary" aria-hidden="true">
            desktop_windows
          </span>
          <h1 className="font-headline text-xl font-bold text-on-surface">
            Desktop Experience Only
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            The Sava GRAT Platform demo is optimized for desktop browsers.
            Please visit on a device with a screen width of at least 1024px.
          </p>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            <span className="material-symbols-outlined text-lg" aria-hidden="true">arrow_back</span>
            Back to Home
          </Link>
        </div>
      </div>

      {/* Desktop app */}
      <div className="hidden lg:contents">
        <AppShell>{children}</AppShell>
      </div>
    </>
  )
}
