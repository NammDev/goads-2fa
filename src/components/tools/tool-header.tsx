import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { siteText, SITE_HERO_GRADIENT } from "@/components/atoms/typography"

interface ToolHeaderProps {
  icon: ReactNode      // 28x28 SVG, stroke currentColor
  title: string
  plain?: boolean      // disable gradient
  className?: string
}

export function ToolHeader({ icon, title, plain = false, className }: ToolHeaderProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* 48x48 rounded-[12px], 16%-white ring */}
      <div className="flex size-12 items-center justify-center rounded-[12px] border border-[#ffffff29] text-foreground">
        {icon}
      </div>
      <h1 className={cn(siteText.displayH4, plain ? "text-foreground" : SITE_HERO_GRADIENT)}>
        {title}
      </h1>
    </div>
  )
}
