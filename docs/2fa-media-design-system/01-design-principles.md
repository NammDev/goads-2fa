# 01 — Design Principles

The GOADS 2FA tool descends from the **Foreplay** aesthetic: restrained, monochrome, near-black canvas
with one signature white card. Everything below is the *why* — tokens/components in later files are the *how*.

## The signature pattern

```
┌─────────────────────────────────────────────────────┐
│ Header (sticky, blur, dark)                          │ ← .site dark scope
├──────────────┬──────────────────────────────────────┤
│              │  [Icon] Title (display-h4, gradient) │ ← dark scope (white text)
│  Sidebar     │  ╔══════════════════════════════╗    │
│  Tools nav   │  ║  WHITE BLOCK  (always white)  ║    │ ← light scope (solid palette)
│  (dark,      │  ║   ┌──────────────────────┐   ║    │
│   white@opac)│  ║   │ Input card (white)   │   ║    │
│              │  ║   │              [CTA]   │   ║    │
│              │  ║   └──────────────────────┘   ║    │
│              │  ║   ┌──────────────────────┐   ║    │
│              │  ║   │ Result card (solid-25)│   ║    │
│              │  ║   └──────────────────────┘   ║    │
│              │  ╚══════════════════════════════╝    │
├──────────────┴──────────────────────────────────────┤
│ Footer (dark)                                        │
└─────────────────────────────────────────────────────┘
```

**Rule of thumb:** dark page + sidebar (left) + tool body (right). Tool body = dark **header** (icon + title)
on dark bg, then a **single white block** wrapping all interactive UI.

## Two color scopes (the core mental model)

Everything keys off **which scope** an element sits in. There are two, and they use **two different palettes**:

| Scope | Where | Background | Text | Palette |
|-------|-------|-----------|------|---------|
| **Dark** (`.site`) | Page canvas, header, footer, sidebar, tool header | `#020308` (near-black, blue tint) | white at opacities | `--alpha-*` (white on dark) |
| **Light** (white block) | Everything inside the tool body | `#ffffff` | near-black at opacities | `--solid-*` (dark on white) |

- `--alpha-*` = white at decreasing opacity (`#ffffff` → `#ffffff08`). For text/borders/fills **on dark**.
- `--solid-*` = solid grays from white → near-black (`#ffffff` → `#090a0e`). For text/borders/fills **on white**.

> The white block is **always white** — never dark-mode-inverted. (In the original repo a `dark:` override
> there once broke ~13 pages; the block is pinned white on purpose.)

## Aesthetic rules

1. **Monochrome first.** Grays only. One restrained brand-blue accent (`--accent: #1c9cf0`) used *sparingly*
   on focal points (a selected state, a sheen). Never a rainbow.
2. **Big rounded surfaces.** White block `rounded-[36px]`, cards `rounded-[16px]`, buttons `rounded-[10px]`,
   chips `rounded-[6px]`. Softness is part of the brand.
3. **Tokens, not hex.** Components reference `var(--solid-*)` / `var(--alpha-*)` / semantic tokens.
   The *only* sanctioned raw hex is `#ffffff29` (the 16%-white ring on the header icon).
4. **Card-stack, not tables.** Results render as a vertical stack of cards (`gap-3`), never a `<table>`.
5. **Inline feedback, no toasts.** "Copied" confirmation appears *at the code itself* with fixed width so the
   row never shifts. No corner toasts.
6. **Slow, expensive easing for surfaces.** Border/hover transitions use `500ms cubic-bezier(0.19,1,0.22,1)`
   (a long ease-out). Buttons are snappy (`150ms`).
7. **Tabular numerals for codes.** Large numeric displays use `font-display` + `[font-variant-numeric:tabular-nums]`
   + slight positive tracking so digits read cleanly and don't jitter on refresh.
8. **Optical sizing off by default.** Body sets `[font-optical-sizing:none]`; only display headings re-enable
   `auto` (that's what gives the "Inter Display" condensed look at large sizes).

## What NOT to do

- ❌ Don't invert the white block to dark.
- ❌ Don't put the hero gradient title *inside* the white block (gradient is dark-scope only).
- ❌ Don't use raw shadcn `<Button>` / `<Table>` on tool pages — use the atoms + card stack.
- ❌ Don't add FAQ / testimonial / marketing sections to a tool page.
- ❌ Don't scatter hex values — go through tokens.
- ❌ Don't use `text-mono` for big display numbers — use `font-display` + tabular-nums.

## Marketing vs tool pages

This bundle covers **both**, because `2fa.media` needs a tool *and* lead-gen banners/landing:

- **Tool pages** (`/tools/{slug}`): the pattern above. See `06-tool-design-language.md`.
- **Marketing/landing** (hero, sections, CTA banners): same dark `.site` scope, `SectionContainer` +
  `SectionHead` + `CtaButton`, section vertical padding `108/96/80px`. See `04` + `05`.
