import Image from "next/image"

import { CtaButton } from "@/components/atoms/cta-button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { siteText } from "@/components/atoms/typography"
import { goadsUrl } from "@/data/site-links"

/**
 * Floating glass island nav — a rounded blurred capsule that hovers a few px
 * below the top with margin from the screen edges. Separation comes from
 * elevation (soft shadow) + a hairline glass ring, never a full-width divider.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 shrink-0 px-4 pb-1 pt-3 max-md:px-3">
      <div
        className={[
          "mx-auto flex max-w-[1080px] items-center justify-between gap-4",
          "rounded-2xl bg-[var(--nav-bg)] py-2.5 pl-3.5 pr-2.5 backdrop-blur-xl",
          // glass edge + floating elevation (shadow reads on light; ring carries dark)
          "ring-1 ring-[var(--alpha-700)]",
          "shadow-[0_10px_34px_-18px_rgba(16,21,34,0.30)]",
        ].join(" ")}
      >
        <span className="flex items-center gap-2.5">
          <Image
            src="/goads/icon.png"
            alt="GOADS logo"
            width={32}
            height={32}
            className="rounded-[9px]"
            priority
          />
          <span className={`${siteText.headingL} text-foreground`}>2FA.media</span>
        </span>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <CtaButton href={goadsUrl("header")} variant="nav">
            Scale with GOADS
          </CtaButton>
        </div>
      </div>
    </header>
  )
}
