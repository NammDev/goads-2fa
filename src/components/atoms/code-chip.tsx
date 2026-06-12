import { cn } from "@/lib/utils"
import { siteText } from "@/components/atoms/typography"

interface CodeChipProps { text: string; maxWidth?: string; className?: string }

export function CodeChip({ text, maxWidth = "220px", className }: CodeChipProps) {
  return (
    <span
      style={{ maxWidth }}
      className={cn(
        siteText.labelS,
        "inline-block min-w-0 truncate rounded-[6px] bg-white px-2.5 py-1 font-mono tracking-[0.02em] text-[var(--solid-500)]",
        "shadow-[inset_0_0_0_1px_var(--solid-50)]",
        "transition-colors duration-200",
        "group-hover:text-[var(--solid-700)]",   // reacts when parent card is hovered
        className,
      )}
    >
      {text}
    </span>
  )
}
