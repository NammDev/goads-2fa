import { SectionContainer } from "@/components/atoms/section-container"
import { CtaButton } from "@/components/atoms/cta-button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { siteText } from "@/components/atoms/typography"
import { goadsUrl } from "@/data/site-links"

/** Sticky blurred nav: wordmark left, theme toggle + GOADS CTA right. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-[var(--alpha-700)] bg-[var(--nav-bg)] backdrop-blur">
      <SectionContainer variant="navbar">
        <div className="flex items-center justify-between py-3">
          <span className={`${siteText.headingL} text-foreground`}>2FA.media</span>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <CtaButton href={goadsUrl("header")} variant="nav">
              Scale with GOADS
            </CtaButton>
          </div>
        </div>
      </SectionContainer>
    </header>
  )
}
