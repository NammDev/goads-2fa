import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { siteText } from "@/components/atoms/typography"
import { goadsUrl } from "@/data/site-links"

interface GoadsSideBannerProps {
  content: "banner_left" | "banner_right"
  className?: string
}

/**
 * Vertical GOADS ad placement flanking the tool (desktop only).
 * Artwork + gradient scrim + HTML copy overlay — text stays crisp and editable.
 */
export function GoadsSideBanner({ content, className }: GoadsSideBannerProps) {
  return (
    <a
      href={goadsUrl(content)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block h-[480px] w-[180px] shrink-0 overflow-hidden rounded-[24px] border border-[#ffffff1f] no-underline",
        "transition-colors duration-[500ms] ease-[cubic-bezier(0.19,1,0.22,1)] hover:border-[#ffffff47]",
        className,
      )}
    >
      <Image
        src="/images/goads-banner.png"
        alt="GOADS — premium agency ad accounts"
        fill
        sizes="180px"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]"
      />
      {/* Scrim keeps overlay copy readable on any artwork */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#101522f5] via-[#10152233] to-[#10152259]" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4">
        <span className={cn(siteText.overline, "text-[var(--alpha-300)]")}>GOADS</span>
        <span className={cn(siteText.headingM, "text-foreground")}>
          Premium agency ad accounts
        </span>
        <span className={cn(siteText.labelS, "flex items-center gap-1 text-[var(--alpha-100)]")}>
          Scale your campaigns
          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  )
}
