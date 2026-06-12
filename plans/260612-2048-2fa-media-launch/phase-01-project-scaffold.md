# Phase 01 — Project Scaffold

## Context links

- Port guide (follow exactly): `docs/2fa-media-design-system/08-port-guide.md`
- Tokens: `docs/2fa-media-design-system/02-design-tokens.md`
- Fonts: `docs/2fa-media-design-system/03-typography-and-fonts.md`
- Layout/scopes: `docs/2fa-media-design-system/04-layout-and-scopes.md`

## Overview

- **Date:** 2026-06-12
- **Description:** Stand up Next.js App Router + Tailwind v4 project in repo root, install deps, paste design tokens into `globals.css`, set up Inter font with `opsz` axis, create the `.site` dark-scope layout wrapper.
- **Priority:** P1 (blocks everything)
- **Implementation status:** completed
- **Review status:** completed

## Key Insights

- Port guide step 0 uses `create-next-app` with `--ts --app --tailwind --eslint`. Repo root already has `docs/` + `plans/` — scaffold **in place** (run `npx create-next-app@latest . ...` or scaffold to temp dir and move) so project root stays `C:\Users\Nam Nguyen\Documents\Code\2fa`.
- Tailwind v4 = CSS-first config (`@theme` in `globals.css`), no `tailwind.config.ts` needed.
- `html:has(.site)` rule pins window canvas dark — required, prevents white flash.
- shadcn `sheet`/`collapsible` from port guide step 0 NOT needed (no sidebar, single-tool launch). Skip.
- `color-scheme: dark` on `.site` pins native inputs/scrollbars dark regardless of OS theme.

## Requirements

**Functional:**
- `npm run dev` serves dark `#020308` page with Inter, no console errors.
- `bg-background`, `font-display`, `max-w-site`, `fp-lg:` utilities resolve.

**Non-functional:**
- TypeScript strict, ESLint passes, no env vars required.

## Architecture

```
src/
├── app/
│   ├── layout.tsx              # root: <html lang="en">, metadata placeholder
│   ├── (marketing)/
│   │   ├── layout.tsx          # .site wrapper + Header + Footer
│   │   └── page.tsx            # homepage placeholder (built in phase 4)
│   └── globals.css             # @theme + .site tokens + base layer
├── fonts/index.ts              # fontInter (opsz axis)
└── components/layout/          # site-header.tsx, site-footer.tsx (stubs)
```

## Related code files

**Create:**
- `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `eslint.config.mjs` (via create-next-app)
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/(marketing)/layout.tsx`
- `src/app/(marketing)/page.tsx` (placeholder)
- `src/fonts/index.ts`
- `src/components/layout/site-header.tsx` (stub — finalized phase 4)
- `src/components/layout/site-footer.tsx` (stub — finalized phase 4)

**Modify:** none. **Delete:** create-next-app boilerplate (default `page.tsx` content, vercel/next SVGs, default CSS).

## Implementation Steps

1. Scaffold: `npx create-next-app@latest . --ts --app --tailwind --eslint --src-dir --import-alias "@/*" --no-turbopack` (accept in-place; if CLI refuses non-empty dir, scaffold to `./tmp-scaffold` and move files up, keeping `docs/` + `plans/`). Init git repo on `main`.
2. Install deps:
   - `npm i lucide-react clsx tailwind-merge @vercel/analytics`
     - `lucide-react`: icons used by tool (ArrowRight, Copy, Check, Download)
     - `clsx` + `tailwind-merge`: `cn()` helper (design system requirement)
     - `@vercel/analytics`: zero-config traffic + funnel measurement (phase 5)
   - `npm i -D tw-animate-css` — provides `animate-in fade-in zoom-in-95` used by copy flash (per `07`/`08`)
3. `globals.css` rewrite, in order:
   1. `@import "tailwindcss";` then `@import "tw-animate-css";`
   2. `@theme` block: `--breakpoint-fp-sm: 480px`, `--breakpoint-fp-lg: 992px`, `--container-site: 1440px` (verbatim from `02`)
   3. `@theme inline` semantic mapping: `--color-background: var(--background)`, `--color-foreground`, `--color-primary`, `--color-primary-foreground`, `--color-secondary`, `--color-muted-foreground`, `--color-border`, `--color-accent`, `--color-destructive`, `--font-sans: var(--font-sans)`, `--font-display: var(--font-display, var(--font-sans))`, `--radius` mappings
   4. Paste entire `.site { … }` token block + `html:has(.site) { … }` verbatim from `02`
   5. Base layer: `body { @apply bg-background text-foreground; }`, `code, pre { font-family: ui-monospace, monospace; }`
4. `src/fonts/index.ts`: copy `fontInter` block verbatim from `03` (Inter, `variable: "--font-inter"`, `axes: ["opsz"]`, `display: "swap"`).
5. `src/app/layout.tsx`: minimal root — `<html lang="en">`, `<body>{children}</body>`, temporary metadata (finalized phase 5).
6. `src/app/(marketing)/layout.tsx`: verbatim pattern from `04` — `.site` + `fontInter.variable` + base body classes (`min-h-svh bg-background text-muted-foreground font-sans text-base font-normal leading-6 tracking-[-0.01125em] overflow-x-clip antialiased [font-optical-sizing:none]`), renders `<SiteHeader />`, `{children}`, `<SiteFooter />`.
7. Stub `site-header.tsx` (sticky, `bg-[var(--nav-bg)]` + `backdrop-blur`, "2FA.media" wordmark left) and `site-footer.tsx` (empty footer shell). Final content phase 4.
8. Verify: `npm run dev` → dark page, Inter renders, no hydration warnings. `npm run build` passes. `npx tsc --noEmit` clean.

## Todo list

- [x] Scaffold Next.js + Tailwind v4 in repo root, git init
- [x] Install runtime + dev deps
- [x] `globals.css`: @theme breakpoints + @theme inline mapping + `.site` token block + base layer
- [x] `src/fonts/index.ts` with opsz axis
- [x] Root layout + `(marketing)` `.site` layout
- [x] Header/footer stubs
- [x] `npm run build` + `tsc --noEmit` clean

## Success Criteria

- Dev server shows `#020308` canvas (verify computed style), Inter active, `fp-lg:`/`max-w-site` utilities work.
- Build + typecheck pass. No `tailwind.config` file (v4 CSS-first).

## Risk Assessment

- **create-next-app in non-empty dir** → use temp-dir-and-move fallback; keep `docs/`/`plans/` untouched.
- **Tailwind v4 semantic mapping mistakes** → `bg-background` silently unstyled; verify with devtools computed styles, not eyeballing.
- **Missing `html:has(.site)`** → white overscroll flash; include verbatim.

## Security Considerations

- No env secrets. Confirm `.gitignore` covers `.env*` anyway (default does).

## Next steps

- Phase 2: atoms + tool shell components.
