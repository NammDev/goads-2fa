# Codebase Summary — 2FA.media

**Stack:** Next.js 15 App Router · Tailwind v4 · TypeScript · Vercel (static)
**Shape:** Single-page, zero backend, zero env vars.

---

## Directory Map

```
2fa/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout — global metadata, Vercel Analytics
│   │   ├── globals.css             # Tailwind v4 entry + CSS vars
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx          # Marketing layout wrapper
│   │   │   └── page.tsx            # Single-viewport page: hero + tool centered, GOADS side banners (no scroll on desktop)
│   │   ├── opengraph-image.tsx     # OG image (Next.js ImageResponse)
│   │   ├── sitemap.ts              # Single-URL sitemap
│   │   ├── robots.ts               # robots.txt
│   │   ├── icon.svg                # Favicon
│   │   └── not-found.tsx           # 404 page
│   ├── lib/
│   │   ├── totp.ts                 # RFC 6238 TOTP — generateTOTP, parseSecrets, formatCode
│   │   ├── utils.ts                # cn() Tailwind class merger
│   │   └── clipboard.ts            # copyToClipboard() — Clipboard API + execCommand fallback
│   ├── data/
│   │   └── site-links.ts           # goadsUrl(content) — UTM-tagged GOADS links
│   ├── components/
│   │   ├── atoms/                  # Design-system primitives (ported from design-system bundle)
│   │   │   ├── typography.ts       # siteText — Tailwind class map for type scale
│   │   │   ├── section-container.tsx
│   │   │   ├── section-white-block.tsx
│   │   │   ├── section-head.tsx
│   │   │   ├── light-primary-button.tsx
│   │   │   ├── light-ghost-action.tsx
│   │   │   ├── code-chip.tsx
│   │   │   └── cta-button.tsx
│   │   ├── tools/                  # TOTP tool UI
│   │   │   ├── two-fa-tool.tsx     # "use client" — main interactive island
│   │   │   ├── two-fa-code-card.tsx
│   │   │   ├── two-fa-countdown-ring.tsx
│   │   │   ├── tool-header.tsx
│   │   │   └── tool-body.tsx
│   │   ├── sections/               # Page sections (RSC, no client state)
│   │   │   ├── hero-section.tsx
│   │   │   ├── tool-section.tsx    # Wraps TwoFaTool in layout shell
│   │   │   ├── goads-side-banner.tsx   # Vertical GOADS placement, left of tool (goads-banner.png)
│   │   │   └── goads-bottom-banner.tsx # Horizontal GOADS placement under tool (goads-banner-wide.png)
│   │   ├── layout/
│   │   │   ├── site-header.tsx     # Logo + GOADS CTA (utm_content=header)
│   │   │   └── site-footer.tsx     # Links + GOADS CTA (utm_content=footer)
│   │   └── seo/
│   │       └── structured-data.tsx # JSON-LD: WebApplication schema
│   └── fonts/
│       └── index.ts                # Next.js font definitions
├── scripts/
│   ├── verify-totp.mjs             # RFC 6238 test vectors (node, no deps)
│   └── generate-promo-image.mjs    # Regenerate promo artwork via Gemini (needs GEMINI_API_KEY)
├── next.config.ts                  # Security headers (X-Frame-Options, Referrer-Policy, etc.)
└── docs/
    ├── 2fa-media-design-system/    # Visual design system (DO NOT MODIFY)
    ├── codebase-summary.md         # ← this file
    ├── project-overview-pdr.md
    └── deployment-guide.md
```

---

## Module Responsibilities

| Module | Role |
|---|---|
| `lib/totp.ts` | Pure async TOTP — no deps, Web Crypto only. Exports `generateTOTP`, `parseSecrets`, `formatCode` |
| `lib/clipboard.ts` | Clipboard write with graceful fallback |
| `lib/utils.ts` | `cn()` — clsx + tailwind-merge |
| `data/site-links.ts` | `goadsUrl(content)` — four UTM touchpoints: `header`, `footer`, `banner_left`, `banner_bottom` |
| `components/layout/theme-toggle.tsx` | Light/dark switch — `html.dark` class + localStorage; light is default (pre-paint script in root layout) |
| `components/tools/two-fa-tool.tsx` | Only client component. Owns: input state, code generation loop, 30 s countdown refresh, copy/export |
| `components/seo/structured-data.tsx` | Inline `<script type="application/ld+json">` — WebApplication |
| `app/opengraph-image.tsx` | Edge-rendered OG image via Next.js ImageResponse |
| `scripts/verify-totp.mjs` | Standalone RFC verification — mirrors `totp.ts` algorithm, tests 4 RFC vectors + base32 edge cases |

---

## Key Constraints

- **Client-only TOTP**: secrets never leave the browser tab; no localStorage, no cookies, no network calls during generation.
- **Single client boundary**: only `two-fa-tool.tsx` is `"use client"`. All sections are RSC.
- **No TOTP library**: hand-rolled via `crypto.subtle.importKey` + `crypto.subtle.sign` to keep the bundle auditable and dependency-free.
- **UTM funnel**: every GOADS link goes through `goadsUrl()` — do not hardcode URLs elsewhere.
