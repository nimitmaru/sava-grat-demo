import Image from "next/image"
import Link from "next/link"

export function MarketingFooter() {
  return (
    <footer className="bg-primary text-on-primary">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Image src="/sava-logo.svg" alt="Sava" width={120} height={34} className="invert" />
            <p className="text-sm text-on-primary-container mt-4 leading-relaxed">
              Nevada-chartered corporate trustee. Automated rolling GRAT administration.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">Product</p>
            <div className="space-y-2.5">
              <Link href="/for-advisors" className="block text-sm text-on-primary-container hover:text-white transition-colors">For Advisors</Link>
              <Link href="/for-attorneys" className="block text-sm text-on-primary-container hover:text-white transition-colors">For Attorneys</Link>
              <Link href="/for-families" className="block text-sm text-on-primary-container hover:text-white transition-colors">For Families</Link>
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">Platform</p>
            <div className="space-y-2.5">
              <Link href="/dashboard" className="block text-sm text-on-primary-container hover:text-white transition-colors">Dashboard</Link>
              <Link href="/modeling" className="block text-sm text-on-primary-container hover:text-white transition-colors">GRAT Modeling</Link>
              <Link href="/reports" className="block text-sm text-on-primary-container hover:text-white transition-colors">Reports</Link>
              <Link href="/rate_monitor" className="block text-sm text-on-primary-container hover:text-white transition-colors">7520 Rate Monitor</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-primary-container mb-4">Company</p>
            <div className="space-y-2.5">
              <p className="text-sm text-on-primary-container">Sava Trust Company</p>
              <p className="text-sm text-on-primary-container">Nevada Trust Charter</p>
              <p className="text-sm text-on-primary-container">YC F25 | Gradient Ventures</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-[11px] text-on-primary-container">
            &copy; 2026 Sava Trust Company. All rights reserved. Nevada Trust Charter.
          </p>
        </div>
      </div>
    </footer>
  )
}
