# Phase 05 — SEO / Metadata / OG / JSON-LD / Sitemap / Analytics

**Date:** 2026-06-12  
**Status:** DONE

## Files Modified

| File | Action | Notes |
|------|--------|-------|
| `src/app/layout.tsx` | Modified | Full metadata export + Analytics mount |
| `src/app/(marketing)/page.tsx` | Modified | Added `<StructuredData />` |

## Files Created

| File | Notes |
|------|-------|
| `src/app/opengraph-image.tsx` | 1200×630, dark #020308, wordmark + mock TOTP card, system sans (no font fetch) |
| `src/app/sitemap.ts` | Single entry `https://2fa.media/`, monthly, priority 1 |
| `src/app/robots.ts` | Allow all, sitemap ref |
| `src/app/icon.svg` | Shield-check on #020308 rounded square |
| `src/components/seo/structured-data.tsx` | WebApplication + FAQPage @graph, FAQPage driven from faq-content.ts |

## Tasks Completed

- [x] Full root metadata (title, description, canonical, OG, Twitter card, keywords, robots)
- [x] `metadataBase: new URL("https://2fa.media")`
- [x] `opengraph-image.tsx` — 1200×630, dark brand bg, wordmark, mock code, badge pills
- [x] `structured-data.tsx` — WebApplication + FAQPage (all 8 Q&As from faq-content.ts, zero drift)
- [x] `sitemap.ts` + `robots.ts`
- [x] `icon.svg` shield favicon
- [x] `<Analytics />` from @vercel/analytics/react mounted in root layout body
- [x] `npx tsc --noEmit` — clean
- [x] `npm run build` — clean, all 6 routes static

## Build Output

```
Route (app)
○ /
○ /_not-found
○ /icon.svg
○ /opengraph-image
○ /robots.txt
○ /sitemap.xml
```

All static. No errors.

## Decisions

- OG image uses system `sans-serif` (no Inter TTF fetch) — KISS, avoids edge runtime font complexity
- `@vercel/analytics` was already in package.json (v2.0.1) — no install needed
- Analytics mounted in root layout (not marketing layout) so it tracks all future routes too

## Unresolved Questions

None.
