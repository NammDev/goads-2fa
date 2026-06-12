import type { ReactNode } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type ButtonVariant = "nav" | "hero" | "secondary" | "ghost" | "light-primary" | "light-stroke"

interface CtaButtonProps {
  href?: string
  onClick?: () => void
  children: ReactNode
  variant?: ButtonVariant
  showIcon?: boolean
  leadingIcon?: ReactNode
  className?: string
  download?: boolean
  data?: Record<string, string>
}

const isExternalUrl = (href: string) =>
  /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")

const variantStyles: Record<ButtonVariant, string> = {
  nav: "bg-primary text-primary-foreground transition-all duration-[600ms] ease-[cubic-bezier(0.19,1,0.22,1)] hover:bg-primary/90",
  hero: "bg-primary text-primary-foreground transition-all duration-150 hover:bg-[var(--alpha-50)] active:bg-[var(--alpha-100)]",
  secondary: "bg-secondary text-foreground border-0 transition-all duration-150 hover:bg-border active:bg-[var(--alpha-100)]",
  ghost: "bg-background text-foreground transition-all duration-150 hover:bg-secondary active:bg-[var(--alpha-600)]",
  "light-primary": "bg-background text-foreground transition-all duration-150 hover:bg-[var(--solid-600)] active:bg-[var(--solid-400)] active:text-foreground",
  "light-stroke": "bg-white text-[var(--solid-900)] shadow-[0_0_0_1px_var(--solid-50)] transition-all duration-150 hover:bg-[var(--solid-25)] hover:shadow-none active:bg-[var(--solid-50)]",
}

export function CtaButton({
  href, onClick, children, variant = "nav",
  showIcon = true, leadingIcon, className, download, data,
}: CtaButtonProps) {
  const isNav = variant === "nav"
  const iconOpacity = variant === "hero" ? 1 : 0.68
  const external = href ? isExternalUrl(href) : false

  const sharedClass = cn(
    "relative z-[5] flex cursor-pointer items-center no-underline",
    isNav ? "rounded-[8px] p-1.5" : "rounded-[10px] p-2",
    variantStyles[variant],
    variant === "light-primary" || variant === "light-stroke"
      ? "focus-visible:shadow-[0_0_0_2px_white,0_0_0_3px_var(--solid-900)] focus-visible:outline-none"
      : "focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_3px_white] focus-visible:outline-none",
    className,
  )

  const body = (
    <>
      {leadingIcon && (
        <span className="relative z-[2] -mr-1 flex items-center justify-center">
          <span className="flex size-6 items-center justify-center">{leadingIcon}</span>
        </span>
      )}
      <span className={cn("relative z-[2] px-1.5 font-sans font-[550]",
        isNav ? "text-[0.9375rem] leading-5" : "text-base leading-6 tracking-[-0.01125em]")}>
        {children}
      </span>
      {showIcon && <ChevronIcon opacity={iconOpacity} />}
    </>
  )

  if (!href) return <button type="button" onClick={onClick} className={sharedClass} {...data}>{body}</button>
  if (download) return <a href={href} download className={sharedClass} {...data}>{body}</a>
  return external
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={sharedClass} {...data}>{body}</a>
    : <Link href={href} className={sharedClass} {...data}>{body}</Link>
}

function ChevronIcon({ opacity }: { opacity: number }) {
  return (
    <span className="relative z-[2] -ml-1 flex items-center justify-center" style={{ opacity }}>
      <span className="flex size-6 items-center justify-center">
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
          <path d="M8 6.5l3.5 3.5L8 13.5" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </span>
  )
}
