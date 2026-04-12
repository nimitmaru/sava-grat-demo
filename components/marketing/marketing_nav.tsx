import Link from "next/link"
import Image from "next/image"

export function MarketingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/sava-logo.svg" alt="Sava" width={120} height={34} priority />
        </Link>
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/for-advisors" className="hidden md:block text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            For Advisors
          </Link>
          <Link href="/for-attorneys" className="hidden md:block text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            For Attorneys
          </Link>
          <Link href="/for-families" className="hidden md:block text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            For Families
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl bg-primary px-4 py-2 md:px-5 md:py-2.5 text-sm font-bold text-on-primary hover:opacity-90 transition-opacity"
          >
            Launch Demo
          </Link>
        </div>
      </div>
    </nav>
  )
}
