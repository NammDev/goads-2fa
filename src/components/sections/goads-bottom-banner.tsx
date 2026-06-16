import Image from "next/image"

import { cn } from "@/lib/utils"
import { goadsUrl } from "@/data/site-links"

/**
 * Hero-scale horizontal GOADS placement under the tool.
 * Artwork ships with its own baked-in copy — no HTML overlay.
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
        src="/images/banner_2.png"
        alt="GOADS — premium agency ad accounts"
        fill
        sizes="(max-width: 768px) 100vw, 720px"
        className="object-cover object-center max-md:object-left transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.04]"
      />
    </a>
  )
}
