import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionContainerProps {
  children: ReactNode
  /** "section" = 1216px, "wide" = 1440px, "navbar" = 1440px px-2 */
  variant?: "section" | "wide" | "footer" | "navbar"
  as?: "div" | "section" | "footer"
  className?: string
}

// 40px desktop ≥992 → 32px tablet ≤991 → 24px mobile ≤767
const RESPONSIVE_PX = "px-6 md:px-8 fp-lg:px-10"
const variantClasses: Record<string, string> = {
  navbar:  "max-w-site px-2 relative z-[5]",
  wide:    `max-w-site ${RESPONSIVE_PX}`,
  section: `max-w-[1216px] ${RESPONSIVE_PX}`,
  footer:  `max-w-[1216px] ${RESPONSIVE_PX}`,
}

export function SectionContainer({
  children, variant = "section", as: Tag = "div", className,
}: SectionContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full", variantClasses[variant], className)}>
      {children}
    </Tag>
  )
}
