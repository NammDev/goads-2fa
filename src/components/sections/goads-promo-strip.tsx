import { ArrowUpRight, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { siteText } from "@/components/atoms/typography"
import { goadsUrl } from "@/data/site-links"

/**
 * Slim above-the-fold GOADS banner shown directly under the tool block.
 * Whole strip is one link; accent tint + hover lift keep it premium, not ad-like.
 */
export function GoadsPromoStrip() {
  return (
    <a
      href={goadsUrl("tool_strip")}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center justify-between gap-4 rounded-[16px] border border-[#ffffff14] bg-[var(--accent-soft)] px-5 py-3.5 no-underline max-md:px-4",
        "transition-colors duration-[500ms] ease-[cubic-bezier(0.19,1,0.22,1)] hover:border-[#ffffff3d]",
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        <Sparkles className="size-4 shrink-0 text-[var(--alpha-300)]" />
        <span className={cn(siteText.bodyS, "truncate text-[var(--alpha-200)]")}>
          <span className="font-medium text-foreground">Built by GOADS</span>
          {" — premium agency ad accounts for performance marketers."}
        </span>
      </span>
      <span className={cn(siteText.labelS, "flex shrink-0 items-center gap-1 font-medium text-foreground")}>
        Explore
        <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </a>
  )
}
