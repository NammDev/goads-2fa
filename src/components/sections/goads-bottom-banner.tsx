import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { siteText } from "@/components/atoms/typography"
import { goadsUrl } from "@/data/site-links"

/**
 * Horizontal GOADS placement under the tool — leaderboard style.
 * Dark artwork card works on both themes; copy is crisp HTML over a scrim.
 */
export function GoadsBottomBanner() {
  return (
    <a
      href={goadsUrl("banner_bottom")}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block h-[96px] w-full overflow-hidden rounded-[20px] border border-[var(--alpha-700)] no-underline max-md:h-[88px]",
        "transition-colors duration-[500ms] ease-[cubic-bezier(0.19,1,0.22,1)] hover:border-[var(--alpha-500)]",
      )}
    >
      <Image
        src="/images/goads-banner-wide.png"
        alt="GOADS — premium agency ad accounts"
        fill
        sizes="(max-width: 768px) 100vw, 720px"
        className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.04]"
      />
      {/* Left scrim for copy legibility — always dark, matches the artwork */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#101522f5] via-[#10152299] to-[#10152226]" />
      <div className="absolute inset-0 flex items-center justify-between gap-4 px-6 max-md:px-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className={cn(siteText.overline, "text-[#ffffff8c]")}>Built by GOADS</span>
          <span className={cn(siteText.headingM, "truncate text-white")}>
            Premium agency ad accounts for performance marketers
          </span>
        </div>
        <span className={cn(siteText.labelS, "flex shrink-0 items-center gap-1 text-white")}>
          Scale now
          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  )
}
