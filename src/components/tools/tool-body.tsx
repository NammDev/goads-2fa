import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { SectionWhiteBlock } from "@/components/atoms/section-white-block"

interface ToolBodyProps { children: ReactNode; gap?: string; className?: string }

export function ToolBody({ children, gap, className }: ToolBodyProps) {
  return (
    <SectionWhiteBlock>
      <div className={cn("flex flex-col p-8 max-md:p-5", gap ?? "gap-6", className)}>
        {children}
      </div>
    </SectionWhiteBlock>
  )
}
