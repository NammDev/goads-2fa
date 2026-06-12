import { fontInter } from "@/fonts"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[
        "site",
        fontInter.variable,
        // base body
        "min-h-svh bg-background text-muted-foreground",
        "font-sans text-base font-normal leading-6 tracking-[-0.01125em]",
        "overflow-x-clip",
        "antialiased",
        // optical sizing OFF globally — only display headings re-enable auto
        "[font-optical-sizing:none]",
      ].join(" ")}
    >
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  )
}
