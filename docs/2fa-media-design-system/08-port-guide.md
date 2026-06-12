# 08 — Port Guide (stand up `2fa.media`)

Step-by-step to rebuild this design system in a **fresh codebase**. Assumes Next.js App Router + Tailwind v4
(the original stack). If your stack differs, the tokens (`02`) and components (`05`/`06`/`07`) still apply —
only the bootstrap differs.

## 0. Dependencies

```bash
npx create-next-app@latest 2fa-media --ts --app --tailwind --eslint
cd 2fa-media

# runtime
npm i lucide-react clsx tailwind-merge
# tailwind v4 animation utilities (animate-in / fade-in / zoom-in used by the 2FA card)
npm i -D tw-animate-css
# sidebar drawer/collapsible (only if you keep the registry-driven sidebar)
npx shadcn@latest add sheet collapsible
```

Fonts come from `next/font/google` (no install).

## 1. Tokens → `globals.css`

1. At the top, add the Foreplay-parity `@theme` block (breakpoints + container) from `02`.
2. Add `@import "tw-animate-css";` near the other imports.
3. Paste the entire `.site { … }` block + `html:has(.site) { … }` from `02`.
4. Keep Tailwind's `@theme inline` semantic mapping (`--color-background: var(--background)`, …,
   `--font-display: var(--font-display, var(--font-sans))`) so `bg-background`/`font-display` resolve.
5. Base layer: `body { @apply bg-background text-foreground }` and `code,pre { font-family: var(--font-mono) }`.

## 2. Fonts → `src/fonts/index.ts`

Copy the `fontInter` block from `03`. It exposes `--font-inter` (with `opsz` axis).

## 3. The `.site` layout

Create the marketing layout (`04`) that wraps children in the `.site` + `fontInter.variable` div with the base
body classes and `[font-optical-sizing:none]`. Add your own `<Header>` / `<Footer>` (dark, built from
`SectionContainer` navbar variant + `CtaButton` nav variant).

## 4. Helpers + atoms

From `05`, create:
- `src/lib/utils.ts` (`cn`), `src/lib/clipboard.ts` (`copyToClipboard`)
- `src/components/atoms/`: `typography.ts` (`03`), `section-container.tsx`, `section-white-block.tsx`,
  `section-head.tsx` (`04`), `light-primary-button.tsx`, `light-ghost-action.tsx`, `code-chip.tsx`,
  `cta-button.tsx`

## 5. Tool shell + the 2FA tool

From `06` + `07`:
- `src/components/tools/`: `shell.tsx`, `header.tsx`, `body.tsx`, `sidebar.tsx`, `two-fa.tsx`
- `src/data/tools-registry.ts` (categories + items; minimal shape in `06`). For a single-tool launch you can
  hardcode one item or drop the sidebar and center `ToolBody`.
- Routes:
  - `app/(marketing)/layout.tsx` — `.site` wrapper (step 3)
  - `app/(marketing)/tools/(panel)/layout.tsx` — mounts `ToolShell`
  - `app/(marketing)/tools/(panel)/2fa/page.tsx` — the 2FA page (`07`)

## 6. Verify

- Run `npm run dev`, open `/tools/2fa`.
- Check against the **tool checklist** in `06`.
- Confirm: dark page, white block always white, digits use tabular nums, copy flash doesn't shift the row,
  ring counts down, mobile (`max-md`) paddings/sizes kick in, sidebar drawer stays dark on a light-mode phone.

## 7. The ProAds-style lead-gen layer (the business goal)

`2fa.media` gives the tool away free to pull traffic, then converts that attention into GOADS leads. Build
this **in the dark scope, around the white block** — never clutter the tool itself:

- **Header CTA** (`CtaButton variant="nav"`): persistent "GOADS" / "Get clients" link → goadsagency.com.
- **Banner slot below the tool body**: a `SectionWhiteBlock` *or* a dark `--accent-soft` panel with a
  `SectionHead` + `CtaButton variant="hero"`. Reuse the tools landing card pattern (white card,
  `rounded-[16px] border-[var(--solid-50)]`, hover `border-[var(--solid-400)]`).
- **Sidebar promo** (desktop): a small card pinned under the tools nav promoting a GOADS offer.
- **Footer**: full marketing footer with GOADS links (build with `SectionContainer variant="footer"`).
- **Attribution**: tag outbound GOADS links with UTM params so the funnel is measurable.

Keep the tool fast and uncluttered — the trust earned by a clean, no-signup tool is exactly what makes the
banner convert. Monochrome restraint + one brand-blue accent (`--accent`) on the CTA is the whole play.

## Stack-swap notes (if not Next.js)

- `next/font` → self-host Inter with `@font-face` + `font-feature-settings`; keep `opsz` if the file supports it.
- `next/link` in `cta-button.tsx` → your router's link (or plain `<a>`).
- `usePathname` in `sidebar.tsx` → your router's equivalent (only needed for active-link highlighting).
- Everything else is framework-agnostic Tailwind v4 + React.

## Open questions to confirm before building

- UI language: keep English (as the source route) or add Vietnamese? (default: English)
- Single-tool launch (just 2FA) or multi-tool from day one (keep the registry sidebar)?
- Reuse Next.js + Tailwind v4, or a different stack?
