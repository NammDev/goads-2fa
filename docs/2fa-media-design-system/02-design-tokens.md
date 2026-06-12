# 02 — Design Tokens

Everything visual keys off these CSS variables. They live in the **`.site` scope** so every marketing/tool
page that renders inside the `.site` wrapper (see `04`) inherits them. Tailwind v4 maps them to utilities via
`@theme inline`.

## Copy-paste: the `.site` token block

Paste this into your `globals.css` (verbatim from the original `app/src/app/globals.css`). It is the
**single source of truth** for the dark scope, both palettes, fonts, and section rhythm.

```css
/* ── Dark theme scoped to the .site wrapper (marketing + tools) ── */
.site {
  /* Pin dark native UI (inputs, scrollbars, autofill) regardless of OS theme */
  color-scheme: dark;

  --background: #020308;          /* near-black with blue tint */
  --foreground: #ffffff;
  --card: #ffffff1a;              /* white 10% */
  --card-foreground: #ffffff;
  --popover: #ffffff1a;
  --popover-foreground: #ffffff;
  --primary: #ffffff;
  --primary-foreground: #090a0e;  /* solid-900 */
  --secondary: #ffffff1a;         /* white 10% */
  --secondary-foreground: #ffffff;
  --muted: #ffffff0f;             /* white 6% */
  --muted-foreground: #ffffffd6;  /* white 84% */
  --accent: #1c9cf0;              /* restrained brand-blue (overrides white below) */
  --accent-foreground: #ffffff;
  --accent-soft: #1c9cf01f;       /* ~12% — chips, tints, hover */
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #ffffff29;            /* white 16% */
  --input: #ffffff29;             /* white 16% */
  --ring: #ffffff;

  --font-sans: var(--font-inter), 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-inter), 'Inter Display', ui-sans-serif, system-ui, sans-serif;

  /* ── Neutral / alpha palette (white at opacities — text/borders on DARK bg) ── */
  --alpha-0: #ffffff;      /* white 100% */
  --alpha-25: #ffffffeb;   /* white 92% */
  --alpha-50: #ffffffd6;   /* white 84% */
  --alpha-100: #ffffffad;  /* white 68% */
  --alpha-200: #ffffff70;  /* white 44% */
  --alpha-300: #ffffff5c;  /* white 36% */
  --alpha-400: #ffffff52;  /* white 32% */
  --alpha-500: #fff3;      /* white 20% */
  --alpha-600: #ffffff29;  /* white 16% */
  --alpha-700: #ffffff1a;  /* white 10% */
  --alpha-800: #ffffff0f;  /* white 6% */
  --alpha-900: #ffffff08;  /* white 3% */

  /* ── Solid palette (solid grays — text/borders/fills on WHITE bg / white block) ── */
  --solid-0: #ffffff;
  --solid-25: #f9f9fa;
  --solid-50: #e9eaef;
  --solid-100: #dddee5;
  --solid-200: #c3c5d2;
  --solid-300: #b2b4c5;
  --solid-400: #4c505f;
  --solid-500: #343642;
  --solid-600: #24262e;
  --solid-700: #171920;
  --solid-800: #0f1116;
  --solid-900: #090a0e;

  --lime-green: #10b981;   /* online-indicator dot */
  --nav-bg: #020308eb;     /* header bg ~92% opacity */
  --border-nav: #2a2b30;   /* nav dropdown border */

  /* ── Section vertical padding scale ── */
  --py-section: 108px;     /* desktop */
  --py-section-md: 96px;   /* tablet  (max-md) */
  --py-section-sm: 80px;   /* mobile  (max-sm) */

  --radius: 1rem;
}

/* Force the window canvas dark when the .site wrapper is present */
html:has(.site) {
  background-color: #020308;
  color-scheme: dark;
}
```

And the Foreplay-parity breakpoints + container (top of `globals.css`, Tailwind v4 `@theme`):

```css
@theme {
  --breakpoint-fp-sm: 480px;   /* max-fp-sm: ≈ ≤479 */
  --breakpoint-fp-lg: 992px;   /* fp-lg: ≈ ≥992 (full nav) · max-fp-lg: ≈ ≤991 (mobile nav) */
  --container-site: 1440px;    /* page container width */
}
```

> The 767 tier maps to Tailwind's built-in `md` / `max-md`.

## Palette reference — `--solid-*` (on white / inside the block)

| Token | Hex | Typical use |
|-------|-----|-------------|
| `--solid-0` | `#ffffff` | White-block bg, chip pill bg |
| `--solid-25` | `#f9f9fa` | Result-card fill, ghost hover bg |
| `--solid-50` | `#e9eaef` | Borders / 1px rings on white |
| `--solid-100` | `#dddee5` | — |
| `--solid-200` | `#c3c5d2` | — |
| `--solid-300` | `#b2b4c5` | — |
| `--solid-400` | `#4c505f` | Muted text / placeholder / focus border |
| `--solid-500` | `#343642` | Body text on white, chip text |
| `--solid-600` | `#24262e` | Primary button hover |
| `--solid-700` | `#171920` | Title text / icons / strong |
| `--solid-800` | `#0f1116` | — |
| `--solid-900` | `#090a0e` | Display headings, code numbers |

## Palette reference — `--alpha-*` (on dark / page scope)

| Token | Value | % white | Typical use |
|-------|-------|---------|-------------|
| `--alpha-0` | `#ffffff` | 100% | Strong white text |
| `--alpha-25` | `#ffffffeb` | 92% | — |
| `--alpha-50` | `#ffffffd6` | 84% | Body text on dark, muted-foreground |
| `--alpha-100` | `#ffffffad` | 68% | Secondary text |
| `--alpha-200` | `#ffffff70` | 44% | Idle sidebar link text |
| `--alpha-300` | `#ffffff5c` | 36% | Category labels / overlines on dark |
| `--alpha-400` | `#ffffff52` | 32% | — |
| `--alpha-500` | `#fff3` | 20% | — |
| `--alpha-600` | `#ffffff29` | 16% | Borders, header-icon ring (`#ffffff29`) |
| `--alpha-700` | `#ffffff1a` | 10% | Active sidebar pill, hover fill |
| `--alpha-800` | `#ffffff0f` | 6% | Muted fill |
| `--alpha-900` | `#ffffff08` | 3% | Faintest fill |

## Radius scale

| Element | Radius |
|---------|--------|
| White block (signature card) | `rounded-[36px]` (mobile `rounded-[16px]`) |
| Input / result card | `rounded-[16px]` |
| Header icon container | `rounded-[12px]` |
| Buttons (all variants) | `rounded-[10px]` (nav CTA: `rounded-[8px]`) |
| Code chip pill | `rounded-[6px]` |

## Transitions

| Where | Spec |
|-------|------|
| Card hover / input focus (border) | `transition-all duration-[500ms] ease-[cubic-bezier(0.19,1,0.22,1)]` |
| Button hover / active | `transition-all duration-150` |
| Ghost action hover | `transition-colors duration-150` |
| Chip / icon color | `transition-colors duration-200` |
| Countdown ring stroke | `transition-[stroke-dashoffset] duration-1000 ease-linear` |
| Nav CTA | `transition-all duration-[600ms] ease-[cubic-bezier(0.19,1,0.22,1)]` |

## Semantic tokens → utilities

Tailwind v4 `@theme inline` maps `--background`→`bg-background`, `--foreground`→`text-foreground`,
`--primary`→`bg-primary`, `--border`→`border-border`, `--font-display`→`font-display`, etc. So inside `.site`
you write `bg-background text-foreground` and get the dark scope automatically; the `--solid-*`/`--alpha-*`
palettes are used as arbitrary values: `bg-[var(--solid-25)]`, `text-[var(--alpha-200)]`.
