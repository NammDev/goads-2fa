import { cn } from "@/lib/utils"
import { siteText } from "@/components/atoms/typography"

interface CountdownRingProps { seconds: number }

/** 36px SVG ring showing remaining seconds in the 30s TOTP window. */
export function CountdownRing({ seconds }: CountdownRingProps) {
  const r = 13
  const c = 2 * Math.PI * r
  const offset = c - (seconds / 30) * c
  return (
    <span className="relative flex size-9 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--solid-50)" strokeWidth="2" />
        <circle cx="18" cy="18" r={r} fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          className="text-[var(--solid-700)] transition-[stroke-dashoffset] duration-1000 ease-linear" />
      </svg>
      <span className={cn(siteText.labelS,
        "relative text-[var(--solid-700)] [font-variant-numeric:tabular-nums]")}>
        {seconds}
      </span>
    </span>
  )
}
