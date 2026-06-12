import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { siteText } from "@/components/atoms/typography"
import { CodeChip } from "@/components/atoms/code-chip"
import { formatCode, type CodeEntry } from "@/lib/totp"

interface CodeCardProps {
  entry: CodeEntry
  copied: boolean
  onCopy: () => void
}

/** Result row: secret chip + big 6-digit code + copy flash. Fixed-width copy slot prevents layout shift. */
export function CodeCard({ entry, copied, onCopy }: CodeCardProps) {
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={`Copy ${formatCode(entry.code)}`}
      className={cn(
        "group flex w-full cursor-pointer items-center justify-between gap-4 rounded-[16px] border border-[var(--solid-50)] bg-[var(--solid-25)] px-5 py-4 text-left max-md:px-4",
        "transition-all duration-[500ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
        "hover:border-[var(--solid-400)]",
        copied && "border-[var(--solid-700)]",
      )}
    >
      <CodeChip text={entry.secret} />
      <div className="flex shrink-0 items-center gap-3">
        <span className={cn(
          "font-display text-[2.25rem] font-semibold leading-none tracking-[0.04em] text-[var(--solid-900)] [font-optical-sizing:auto] [font-variant-numeric:tabular-nums]",
          "max-md:text-[1.75rem]",
        )}>
          {formatCode(entry.code)}
        </span>
        <span className="flex w-[78px] shrink-0 items-center justify-end">
          {copied ? (
            <span className="flex animate-in items-center gap-1 fade-in zoom-in-95 text-[var(--solid-900)] duration-200">
              <Check className="size-4" />
              <span className={cn(siteText.labelS, "font-medium")}>Copied</span>
            </span>
          ) : (
            <Copy className={cn(
              "size-3.5 text-[var(--solid-400)] transition-colors duration-200",
              "group-hover:text-[var(--solid-900)]",
            )} />
          )}
        </span>
      </div>
    </button>
  )
}
