# 04 — Layout & Scopes

## The `.site` wrapper (entry point for the dark scope)

Every marketing/tool page renders inside a single `.site` wrapper. That class is what activates the dark
token block from `02`. It also loads the Inter variable and sets the base body type.

`src/app/(marketing)/layout.tsx` (verbatim — adapt imports for your repo):

```tsx
import { fontInter } from "@/fonts"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[
        "site",
        fontInter.variable,
        // base body
        "min-h-svh bg-background text-muted-foreground",
        "font-sans text-base font-normal leading-6 tracking-[-0.01125em]",
        "overflow-x-clip",
        "antialiased",
        // optical sizing OFF globally — only display headings re-enable auto
        "[font-optical-sizing:none]",
      ].join(" ")}
    >
      <Header />
      {children}
      <Footer />
    </div>
  )
}
```

> Header/Footer are your own marketing chrome (logo + nav + CTA). They're not reproduced verbatim here
> because they're brand-specific; build them with `SectionContainer` (navbar variant) + `CtaButton` (nav
> variant) from `05`. Keep the sticky/blur dark header: `bg-[var(--nav-bg)]` with backdrop blur.

## Containers — `SectionContainer`

Wraps every section/footer; enforces max-width + responsive horizontal padding.
`src/components/atoms/section-container.tsx` (verbatim):

```tsx
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionContainerProps {
  children: ReactNode
  /** "section" = 1216px, "wide" = 1440px, "navbar" = 1440px px-2 */
  variant?: "section" | "wide" | "footer" | "navbar"
  as?: "div" | "section" | "footer"
  className?: string
}

// 40px desktop ≥992 → 32px tablet ≤991 → 24px mobile ≤767
const RESPONSIVE_PX = "px-6 md:px-8 fp-lg:px-10"
const variantClasses: Record<string, string> = {
  navbar:  "max-w-site px-2 relative z-[5]",
  wide:    `max-w-site ${RESPONSIVE_PX}`,
  section: `max-w-[1216px] ${RESPONSIVE_PX}`,
  footer:  `max-w-[1216px] ${RESPONSIVE_PX}`,
}

export function SectionContainer({
  children, variant = "section", as: Tag = "div", className,
}: SectionContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full", variantClasses[variant], className)}>
      {children}
    </Tag>
  )
}
```

| Variant | Max width | Use |
|---------|-----------|-----|
| `wide` | 1440px | Tool shell, full-bleed sections |
| `section` | 1216px | Standard content sections |
| `footer` | 1216px | Footer |
| `navbar` | 1440px (px-2) | Header bar |

## The signature white block — `SectionWhiteBlock`

The always-white rounded-[36px] card. Wraps all tool UI; also used for any "light island" on a dark page.
`src/components/atoms/section-white-block.tsx` (verbatim):

```tsx
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
```

## Section header — `SectionHead`

Centered subtitle + title + paragraph, used atop marketing sections. Note: **visual size is decoupled from
HTML tag** (`titleSize` vs `titleTag`). `src/components/atoms/section-head.tsx` (verbatim):

```tsx
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
  className?: string
}

export function SectionHead({
  subtitle, title, titleTag: Tag = "h2", titleSize = "h3",
  description, descSize = "m", variant = "light", size = "default", className,
}: SectionHeadProps) {
  return (
    <div className={cn(
      "mx-auto flex w-full flex-col items-center gap-3 text-center",
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
```

## Spacing rhythm (memorize these)

| Where | Value | Tailwind |
|-------|-------|----------|
| Section vertical padding | 108 / 96 / 80px | `py-[108px] max-md:py-24 max-sm:py-20` (or `--py-section*`) |
| Tool shell section padding | 40 / 32px | `py-10 max-md:py-8` |
| Sidebar gap to body | 32 / 16px | `gap-8 max-lg:gap-4` |
| Header → body | 24 / 20px | `gap-6 max-md:gap-5` |
| White-block inner padding | 32 / 20px | `p-8 max-md:p-5` |
| White-block inner sections | 24px | `gap-6` |
| Result-card stack | 12px | `gap-3` |
| Input card frame | 8px | `p-2` |
| Input text padding | 16 / 12px | `px-4 py-3` |
| Result card padding | 16–20 / 16px | `px-5 py-4 max-md:px-4` |
| Section head internal gap | 12px | `gap-3` |

## Breakpoint cheat-sheet (Foreplay parity)

| Token | px | Meaning |
|-------|----|---------|
| `max-fp-sm:` | ≤479 | smallest mobile |
| `md:` / `max-md:` | 768 | tablet tier (built-in) |
| `fp-lg:` / `max-fp-lg:` | 992 | full nav ≥992 / mobile nav ≤991 |
| `max-w-site` | 1440 | page container width |
