import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { siteText } from "@/components/atoms/typography"

const displaySizes = { h1: siteText.displayH1, h2: siteText.displayH2, h3: siteText.displayH3 }
const descSizes = { m: siteText.bodyM, l: siteText.bodyL }

interface SectionHeadProps {
  subtitle?: string
  title: ReactNode
  titleTag?: "h1" | "h2" | "h3"
  titleSize?: "h1" | "h2" | "h3"
  description?: ReactNode
  descSize?: "m" | "l"
  variant?: "dark" | "light"   // dark = on white bg; light = on dark bg
  size?: "default" | "large"
  align?: "center" | "left"
  className?: string
}

export function SectionHead({
  subtitle, title, titleTag: Tag = "h2", titleSize = "h3",
  description, descSize = "m", variant = "light", size = "default", align = "center", className,
}: SectionHeadProps) {
  return (
    <div className={cn(
      "flex w-full flex-col gap-3",
      align === "left" ? "items-start text-left" : "mx-auto items-center text-center",
      size === "large" ? "relative z-[2] max-w-[960px]" : "max-w-[720px]",
      className,
    )}>
      {subtitle && (
        <div className={variant === "dark" ? "text-[var(--solid-400)]" : "text-[var(--alpha-300)]"}>
          <div className={siteText.overline}>{subtitle}</div>
        </div>
      )}
      <div className={cn("[text-wrap:balance]",
        variant === "dark" ? "text-[var(--solid-700)]" : "text-foreground")}>
        <Tag className={displaySizes[titleSize]}>{title}</Tag>
      </div>
      {description && (
        <div className={size === "large" ? "[text-wrap:balance] max-w-[640px]" : "[text-wrap:pretty] max-w-[512px]"}>
          <div className={variant === "dark" ? "text-[var(--solid-600)]" : "text-[var(--alpha-100)]"}>
            <p className={descSizes[descSize]}>{description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
