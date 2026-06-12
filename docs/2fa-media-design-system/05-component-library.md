# 05 — Component Library

Verbatim source of every reusable atom, plus the two helpers they depend on. Drop these into
`src/components/atoms/` (and `src/lib/`) of the new repo. All depend on `cn` + the `siteText` constants (`03`).

## Helpers

`src/lib/utils.ts` — the `cn` class merger (standard shadcn helper):

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

`src/lib/clipboard.ts` — used by the 2FA tool (returns success boolean):

```ts
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for non-secure contexts / older browsers
    try {
      const ta = document.createElement("textarea")
      ta.value = text
      ta.style.position = "fixed"
      ta.style.opacity = "0"
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand("copy")
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}
```

> The original repo imports `copyToClipboard` from `@/lib/clipboard`. If your repo lacks it, the above is a
> drop-in. (Behavior: resolves `true` on success — the 2FA tool keys its "Copied" flash on that.)

---

## Tool atoms (used inside the white block)

### `LightPrimaryButton` — primary CTA on a white card

Dark pill on white. `src/components/atoms/light-primary-button.tsx` (verbatim):

```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { siteText } from "@/components/atoms/typography"

interface LightPrimaryButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode
  icon?: ReactNode   // optional right-side icon
}

export function LightPrimaryButton({
  children, icon, className, type = "button", ...rest
}: LightPrimaryButtonProps) {
  return (
    <button
      type={type}
      {...rest}
      className={cn(
        "relative z-[5] flex cursor-pointer items-center rounded-[10px] bg-background p-2 text-foreground no-underline",
        "transition-all duration-150",
        "hover:bg-[var(--solid-600)] active:bg-[var(--solid-400)]",
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-background",
        className,
      )}
    >
      <span className={cn(siteText.headingM, "relative z-[2] px-1.5")}>{children}</span>
      {icon && <span className="relative z-[2] -ml-1 flex opacity-[0.68]">{icon}</span>}
    </button>
  )
}
```

> Note: inside the always-white block, `bg-background` resolves to the `.site` near-black (`#020308`) and
> `text-foreground` to white — so this renders a dark pill on white. That's intentional.

### `LightGhostAction` — secondary/bulk action (Copy all, Export…)

`src/components/atoms/light-ghost-action.tsx` (verbatim):

```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { siteText } from "@/components/atoms/typography"

interface LightGhostActionProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: ReactNode
  label: string
}

export function LightGhostAction({ icon, label, className, type = "button", ...rest }: LightGhostActionProps) {
  return (
    <button
      type={type}
      {...rest}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-[10px] px-3 py-2 text-[var(--solid-500)] no-underline",
        "transition-colors duration-150",
        "hover:bg-[var(--solid-25)] hover:text-[var(--solid-900)]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
    >
      {icon}
      <span className={siteText.labelS}>{label}</span>
    </button>
  )
}
```

### `CodeChip` — mono pill for secrets / IDs / tokens

`src/components/atoms/code-chip.tsx` (verbatim):

```tsx
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
```

---

## Marketing atom — `CtaButton` (for landing + lead-gen banners)

Multi-variant button covering nav, hero, secondary, ghost, and light variants. Renders `<Link>` / `<a>` /
`<button>` automatically. `src/components/atoms/cta-button.tsx` (verbatim):

```tsx
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
```

| Variant | Look | Use |
|---------|------|-----|
| `nav` | White pill, small | Header CTA |
| `hero` | White pill, full | Landing hero primary |
| `secondary` | 10%-white fill | Secondary on dark |
| `ghost` | Transparent → fill on hover | Tertiary on dark |
| `light-primary` | Dark pill | Primary inside white block |
| `light-stroke` | White + 1px ring | Secondary inside white block |

## Atom inventory checklist (to port)

- [ ] `lib/utils.ts` (`cn`)
- [ ] `lib/clipboard.ts` (`copyToClipboard`)
- [ ] `atoms/typography.ts` (`siteText`, `SITE_HERO_GRADIENT`) — see `03`
- [ ] `atoms/section-container.tsx` — see `04`
- [ ] `atoms/section-white-block.tsx` — see `04`
- [ ] `atoms/section-head.tsx` — see `04`
- [ ] `atoms/light-primary-button.tsx`
- [ ] `atoms/light-ghost-action.tsx`
- [ ] `atoms/code-chip.tsx`
- [ ] `atoms/cta-button.tsx`
- [ ] `tools/{shell,header,body}.tsx` + `tools/sidebar.tsx` — see `06`
