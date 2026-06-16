import Image from "next/image"

import { cn } from "@/lib/utils"
import { goadsUrl } from "@/data/site-links"

interface GoadsSideBannerProps {
  content: "banner_left"
  className?: string
}

/**
 * Vertical GOADS ad placement flanking the tool (desktop only).
 * Artwork ships with its own baked-in copy — no HTML overlay.
 */
export function GoadsSideBanner({ content, className }: GoadsSideBannerProps) {
  return (
    <a
      href={goadsUrl(content)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block h-[480px] w-[180px] shrink-0 overflow-hidden rounded-[24px] border border-[var(--alpha-700)] no-underline",
        "transition-colors duration-[500ms] ease-[cubic-bezier(0.19,1,0.22,1)] hover:border-[var(--alpha-500)]",
        className,
      )}
    >
      <Image
        src="/images/banner_1.png"
        alt="GOADS — premium agency ad accounts"
        fill
        sizes="180px"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]"
      />
    </a>
  )
}
