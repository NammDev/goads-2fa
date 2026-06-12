import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionWhiteBlockProps { children: ReactNode; className?: string }

export function SectionWhiteBlock({ children, className }: SectionWhiteBlockProps) {
  return (
    <div className="p-2">                            {/* .section-padding: 8px frame */}
      <div
        className={cn(
          "relative z-[2] overflow-hidden rounded-[36px]",
          // ALWAYS white — never dark-mode-inverted; soft ring delineates it on light bg
          "bg-white text-[var(--solid-700)] shadow-[0_0_0_1px_var(--alpha-700),0_12px_32px_#10152217]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
