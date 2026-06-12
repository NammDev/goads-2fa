import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionWhiteBlockProps { children: ReactNode; className?: string }

export function SectionWhiteBlock({ children, className }: SectionWhiteBlockProps) {
  return (
    <div className="p-2">                            {/* .section-padding: 8px frame */}
      <div
        className={cn(
          "relative z-[2] overflow-hidden rounded-[36px]",
          // ALWAYS white — never dark-mode-inverted
          "bg-white text-[var(--solid-700)]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
