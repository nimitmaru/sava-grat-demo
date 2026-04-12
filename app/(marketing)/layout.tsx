import { MarketingNav } from "@/components/marketing/marketing_nav"
import { MarketingFooter } from "@/components/marketing/marketing_footer"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingNav />
      <main className="pt-[72px]">{children}</main>
      <MarketingFooter />
    </>
  )
}
