# 03 — Typography & Fonts

## Font: Inter (with optical-size axis)

The whole `.site` scope runs on **Inter**, loaded via `next/font/google` with the `opsz` axis enabled.
The `opsz` axis is what produces the "Inter Display" look (tighter, condensed) at large heading sizes.

`src/fonts/index.ts` (verbatim):

```ts
import { Inter } from "next/font/google";

// Inter with optical size axis for display headings.
// opsz axis enables the "Inter Display" look at large sizes (tighter, condensed).
export const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  axes: ["opsz"],
});
```

The `.site` wrapper applies `fontInter.variable`, which feeds `--font-inter` into:

```css
.site {
  --font-sans:    var(--font-inter), 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-inter), 'Inter Display', ui-sans-serif, system-ui, sans-serif;
}
```

**Optical sizing rule:** the body sets `[font-optical-sizing:none]` globally; only the display heading
constants re-enable `[font-optical-sizing:auto]`. Keep this — it's the difference between flat and "Display".

> Mono: the 2FA secret chips use `font-mono`. Any monospace stack works (`JetBrains Mono`, `ui-monospace`).

## The type scale — `siteText` constants

Centralize every text style here so components never hand-roll arbitrary text classes.
`src/components/atoms/typography.ts` (verbatim):

```ts
// Usage: import { siteText } from "@/components/atoms/typography"

export const SITE_HERO_GRADIENT =
  "[background-image:radial-gradient(circle_at_50%_-100%,#fff,#ffffffe0)] bg-clip-text [-webkit-text-fill-color:transparent]";

export const siteText = {
  // Display headings — Inter Display + font-optical-sizing:auto.
  // H1 + H2 scale responsively (mobile-first):
  //   H1: ≤479=2.375/3 · 480–767=3.25/3.75 · ≥768=3.75/4.25 rem
  //   H2: ≤479=2.25/3 · 480–991=2.5/3.25 · ≥992=2.75/3.36 rem
  displayH1: "font-display font-semibold tracking-[-0.0075em] [font-optical-sizing:auto] text-[2.375rem] leading-[3rem] min-[480px]:text-[3.25rem] min-[480px]:leading-[3.75rem] md:text-[3.75rem] md:leading-[4.25rem]",
  displayH2: "font-display font-semibold tracking-[-0.0075em] [font-optical-sizing:auto] text-[2.25rem] leading-[3rem] min-[480px]:text-[2.5rem] min-[480px]:leading-[3.25rem] fp-lg:text-[2.75rem] fp-lg:leading-[3.36rem]",
  displayH3: "font-display text-[2.25rem] font-semibold leading-[2.75rem] tracking-[-0.00722em] [font-optical-sizing:auto]",
  displayH4: "font-display text-[1.75rem] font-semibold leading-[2.25rem] tracking-[-0.00714em] [font-optical-sizing:auto]",
  displayH5: "m-0 font-display text-[1.5rem] font-semibold leading-8 tracking-[-0.00667em] [font-optical-sizing:auto]",

  // Headings — Inter
  headingL: "font-sans text-[1.125rem] font-[550] leading-6 tracking-[-0.0144em]",
  headingM: "font-sans text-base font-[550] leading-6 tracking-[-0.01125em]",

  // Labels — Inter
  labelM: "m-0 font-sans text-base font-medium leading-6 tracking-[-0.01125em] no-underline",
  labelS: "m-0 font-sans text-[0.875rem] font-medium leading-5 tracking-[-0.00643em] no-underline",
  labelL: "m-0 font-sans text-[1.125rem] font-medium leading-6 tracking-[-0.0144em] no-underline",

  // Body — Inter
  bodyM: "font-sans text-base font-normal leading-6 tracking-[-0.01125em]",
  bodyL: "font-sans text-[1.125rem] font-normal leading-7 tracking-[-0.0144em]",
  bodyS: "font-sans text-[0.875rem] font-normal leading-5 tracking-[-0.00643em]",
  bodyXs: "font-sans text-[0.75rem] font-normal leading-5",

  // Overline — Inter, uppercase (section subtitles, sidebar categories)
  overline: "font-sans text-[0.75rem] font-[550] uppercase leading-4 tracking-[0.166667em]",

  // Navlink — Inter
  navlink: "font-sans text-[0.9375rem] leading-5",
} as const;
```

## Which style for which element

| Element | Class | Notes |
|---------|-------|-------|
| Tool title (header) | `siteText.displayH4` + `SITE_HERO_GRADIENT` | 1.75rem + radial white fade |
| Landing hero H1/H2 | `siteText.displayH1` / `displayH2` | responsive |
| Section subtitle / sidebar category | `siteText.overline` | uppercase, wide tracking |
| Body / paragraph | `siteText.bodyM` | 1rem |
| Helper / muted | `siteText.bodyS` | 0.875rem |
| Primary button text | `siteText.headingM` | 1rem font-[550] |
| Ghost action / sidebar link | `siteText.labelS` | 0.875rem medium |
| Secret pill text | `siteText.labelS` + `font-mono` + `tracking-[0.02em]` | mono override |
| Big code / digit display | `font-display text-[2.25rem] font-semibold leading-none tracking-[0.04em] [font-variant-numeric:tabular-nums]` | tabular nums + positive micro-tracking |
| Code display (mobile) | `text-[1.75rem]` | `max-md:` |

## The hero gradient

`SITE_HERO_GRADIENT` paints text with a radial white→translucent-white fade (top-down). It is a
**dark-scope only** treatment — used on the tool header title and hero headings. Never inside the white block.
