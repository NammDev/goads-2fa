# 06 — Tool Design Language

How to build a functional utility tool (input → output, no marketing copy) at `/tools/{slug}`.
This is the pattern the 2FA generator follows; reuse it for any future tool on `2fa.media`.

## Composition: shell → header → body

```tsx
// app/(marketing)/tools/(panel)/{slug}/page.tsx
import type { Metadata } from "next"
import { ToolHeader } from "@/components/tools/header"
import { ToolBody } from "@/components/tools/body"
import { MyTool } from "@/components/tools/my-tool"

export const metadata: Metadata = {
  title: "My Tool | 2FA.media",
  description: "Short SEO description.",
}

export default function MyToolPage() {
  return (
    <>
      <ToolHeader icon={<MyToolIcon />} title="My Tool" />
      <ToolBody>
        <MyTool />
      </ToolBody>
    </>
  )
}
```

The **shell** is mounted once by the `(panel)` route-group layout so the sidebar persists across tool
navigations:

```tsx
// app/(marketing)/tools/(panel)/layout.tsx
import type { ReactNode } from "react"
import { ToolShell } from "@/components/tools/shell"

export default function ToolsPanelLayout({ children }: { children: ReactNode }) {
  return <ToolShell>{children}</ToolShell>
}
```

## `ToolShell` — page wrapper + sidebar

`src/components/tools/shell.tsx` (verbatim):

```tsx
import type { ReactNode } from "react"
import { SectionContainer } from "@/components/atoms/section-container"
import { ToolsSidebar, ToolsSidebarMobile } from "@/components/tools/sidebar"

export function ToolShell({ children }: { children: ReactNode }) {
  return (
    <section className="py-10 max-md:py-8">
      <SectionContainer variant="wide">
        <div className="flex gap-8 max-lg:flex-col max-lg:gap-4">
          <ToolsSidebar />
          <div className="flex min-w-0 flex-1 flex-col gap-6 max-md:gap-5">
            <div className="lg:hidden"><ToolsSidebarMobile /></div>
            {children}
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}
```

## `ToolHeader` — icon + gradient title (dark scope)

`src/components/tools/header.tsx` (verbatim):

```tsx
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
```

## `ToolBody` — the white block wrapper

`src/components/tools/body.tsx` (verbatim):

```tsx
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
```

## `ToolsSidebar` — dark nav (driven by a tools registry)

`src/components/tools/sidebar.tsx` (verbatim — needs a `tools-registry` + shadcn `Sheet`/`Collapsible`):

```tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { TOOL_CATEGORIES, getToolsByCategory, type ToolItem } from "@/data/tools-registry"
import { siteText } from "@/components/atoms/typography"

function ToolLink({ tool, isActive }: { tool: ToolItem; isActive: boolean }) {
  const Icon = tool.icon
  return (
    <Link href={tool.href ?? `/tools/${tool.slug}`}
      className={cn(
        siteText.labelS,
        "flex items-center gap-2.5 rounded-[10px] px-3 py-2 transition-colors",
        isActive
          ? "bg-[var(--alpha-700)] text-foreground"
          : "text-[var(--alpha-200)] hover:bg-[var(--alpha-700)] hover:text-foreground",
      )}>
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{tool.title}</span>
    </Link>
  )
}

function SidebarNav() {
  const pathname = usePathname()
  return (
    <nav className="space-y-1">
      {TOOL_CATEGORIES.map((category) => {
        const tools = getToolsByCategory(category.id)
        return (
          <Collapsible key={category.id} defaultOpen>
            <CollapsibleTrigger className={cn(siteText.overline,
              "flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-[var(--alpha-300)] transition-colors hover:text-foreground")}>
              <span>{category.label}</span>
              <ChevronDown className="size-3.5 transition-transform [[data-state=closed]_&]:rotate-[-90deg]" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-0.5 pt-1 pb-3 pl-1">
              {tools.map((tool) => (
                <ToolLink key={tool.slug} tool={tool} isActive={pathname === `/tools/${tool.slug}`} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )
      })}
    </nav>
  )
}

export function ToolsSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto pr-4">
        <SidebarNav />
      </div>
    </aside>
  )
}

export function ToolsSidebarMobile() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => { setOpen(false) }, [pathname])   // auto-close on navigation
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" className={cn(siteText.labelS,
          "flex items-center gap-2 rounded-[10px] border border-[#ffffff29] px-3 py-2 text-foreground transition-colors hover:bg-[var(--alpha-700)] lg:hidden")}>
          <PanelLeft className="size-4" /><span>Tools</span>
        </button>
      </SheetTrigger>
      {/* re-apply `site` INSIDE the Radix portal so the drawer stays dark */}
      <SheetContent side="left" showCloseButton={false}
        className="site w-64 overflow-y-auto border-r border-[#ffffff29] bg-background p-4 pt-20 text-muted-foreground">
        <SidebarNav />
      </SheetContent>
    </Sheet>
  )
}
```

> ⚠️ The mobile drawer must re-apply the `site` class on `SheetContent` — Radix portals render outside the
> `.site` wrapper, so without it the drawer falls back to OS theme (white on light-mode phones).

For a single-tool site you can replace the registry-driven sidebar with a simpler static list, or drop the
sidebar entirely and center the tool body. The `tools-registry` shape is just:
`TOOL_CATEGORIES: {id,label}[]` + `getToolsByCategory(id) → ToolItem[]` where
`ToolItem = { slug, title, href?, icon }`.

## Tool checklist (before shipping a tool)

- [ ] Page = `ToolHeader` + `ToolBody` (shell auto-mounts sidebar via `(panel)` layout)
- [ ] Header title = `displayH4` + `SITE_HERO_GRADIENT`
- [ ] All interactive UI inside `ToolBody` (white block)
- [ ] Input card: `rounded-[16px] border-[var(--solid-50)] bg-white`, focus border `var(--solid-400)`
- [ ] Primary button = `LightPrimaryButton` (not raw `<button>`)
- [ ] Bulk/secondary = `LightGhostAction`
- [ ] Result cards: `rounded-[16px] bg-[var(--solid-25)] border-[var(--solid-50)]`, hover border `var(--solid-400)`
- [ ] Code/ID = `CodeChip` pill
- [ ] Big numeric = `font-display 2.25rem 600 + tabular-nums + tracking-[0.04em]`
- [ ] Only `siteText.*` for type; only `var(--solid-*)`/`var(--alpha-*)` for color (lone exception `#ffffff29`)
- [ ] Card transitions = `500ms cubic-bezier(0.19,1,0.22,1)`; buttons = `150ms`
- [ ] `max-md:` overrides on padding + display sizes
- [ ] TS compiles clean

## What NOT to do (tool pages)

- ❌ Gradient title inside the white block (dark-scope only)
- ❌ shadcn `<Table>` — use the result-card stack
- ❌ raw shadcn `<Button>` — use the light atoms
- ❌ marketing hero / FAQ / testimonial sections on a tool page
- ❌ `text-mono` for big display values — use `font-display` + tabular-nums
