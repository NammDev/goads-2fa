import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { siteText } from "@/components/atoms/typography"
import { goadsUrl } from "@/data/site-links"

/**
 * Hero-scale horizontal GOADS placement under the tool.
 * Dark artwork card works on both themes; copy is crisp HTML over a scrim.
 */
export function GoadsBottomBanner() {
  return (
    <a
      href={goadsUrl("banner_bottom")}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block h-[200px] w-full overflow-hidden rounded-[24px] border border-[var(--alpha-700)] no-underline max-md:h-[148px]",
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
      <div className="absolute inset-0 bg-gradient-to-r from-[#101522f8] via-[#10152299] to-[#10152226]" />
      <div className="absolute inset-0 flex items-center justify-between gap-6 px-8 max-md:px-5">
        <div className="flex min-w-0 flex-col gap-1.5 max-md:gap-1">
          <span className={cn(siteText.overline, "text-[#1c9cf0]")}>Built by GOADS</span>
          <span className={cn(siteText.displayH5, "text-white max-md:text-[1.125rem] max-md:leading-6")}>
            Premium agency ad accounts
          </span>
          <span className={cn(siteText.bodyS, "max-w-[400px] text-[#ffffffa8] max-md:hidden")}>
            For performance marketers — fast top-ups, real human support, campaigns that never pause.
          </span>
        </div>
        {/* CTA pill — visual button, whole card is the link */}
        <span
          className={cn(
            siteText.labelS,
            "flex shrink-0 items-center gap-1.5 rounded-full bg-white px-5 py-3 font-[550] text-[#101522] max-md:px-4 max-md:py-2.5",
            "transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]",
          )}
        >
          Scale now
          <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  )
}
