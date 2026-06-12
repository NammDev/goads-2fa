# Phase 05 — SEO, Metadata, OG Image, JSON-LD, Sitemap, Analytics

## Context links

- Meta copy baseline: `docs/2fa-media-design-system/07-2fa-reference.md` (title/description strings)
- FAQ data source: `src/data/faq-content.ts` (phase 4)
- Depends on: [phase-04-landing-content-funnel-faq.md](phase-04-landing-content-funnel-faq.md)

## Overview

- **Date:** 2026-06-12
- **Description:** Production SEO layer: full Next.js Metadata API config, dynamic OG image via `next/og`, JSON-LD (`WebApplication` + `FAQPage`), `sitemap.ts`, `robots.ts`, Vercel Analytics.
- **Priority:** P1 (traffic IS the business model)
- **Implementation status:** completed
- **Review status:** completed

## Key Insights

- Single-URL site → sitemap is one entry (`https://2fa.media/`). Trivial but expected by Search Console.
- `FAQPage` rich results: Google limits eligibility, but schema still aids understanding; generate from same `faq-content.ts` array → zero drift between visible FAQ and markup.
- `opengraph-image.tsx` with `ImageResponse` (built into Next, no dep): render dark `#020308` canvas + white "2FA.media" wordmark + "Free 2FA Code Generator" + a white rounded block motif echoing the design system. 1200x630. No design-asset dependency.
- Target keywords: "2fa code generator", "totp generator", "2fa generator online", "two factor authentication code generator", "2fa live alternative". Title/description/H1/FAQ already align (phase 4 copy written keyword-rich).
- `@vercel/analytics` = zero-config, no env vars, no cookies/consent banner needed (cookieless). Sufficient for MVP funnel measurement (page views + outbound via UTM landing on GOADS side). Skip GA4 — YAGNI.

## Requirements

**Functional:**
- `<title>`: `2FA Code Generator — Free Online TOTP Codes | 2FA.media`
- Description (~155c): `Generate TOTP two-factor authentication codes from your 2FA secret key — free, instant, and 100% in your browser. No signup, no server, your secrets never leave your device.`
- Canonical `https://2fa.media/`, OG + Twitter card (`summary_large_image`), `metadataBase`.
- Valid JSON-LD: `WebApplication` (name, url, applicationCategory: SecurityApplication, offers price 0, creator Organization GOADS) + `FAQPage` (all 8 Q/As).
- `/sitemap.xml` + `/robots.txt` served (allow all, sitemap ref).
- OG image renders at `/opengraph-image`.

**Non-functional:**
- Lighthouse SEO = 100. JSON-LD passes Google Rich Results Test + schema.org validator.

## Architecture

```
src/app/
├── layout.tsx                  # root metadata export (metadataBase, title, desc, OG, twitter, icons, robots)
├── opengraph-image.tsx         # ImageResponse 1200x630, alt + contentType exports
├── sitemap.ts                  # MetadataRoute.Sitemap — single entry
├── robots.ts                   # MetadataRoute.Robots — allow /, sitemap url
├── icon.svg                    # shield favicon (reuse ShieldCheck path, white on #020308)
└── (marketing)/page.tsx        # injects <script type="application/ld+json"> via component
src/components/seo/
└── structured-data.tsx         # builds WebApplication + FAQPage from faq-content.ts
```

## Related code files

**Create:**
- `src/app/opengraph-image.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/icon.svg` (+ optional `apple-icon.png`)
- `src/components/seo/structured-data.tsx`

**Modify:**
- `src/app/layout.tsx` — replace placeholder metadata with full export
- `src/app/(marketing)/layout.tsx` or root — add `<Analytics />` from `@vercel/analytics/react`
- `src/app/(marketing)/page.tsx` — render `<StructuredData />`

**Delete:** none.

## Implementation Steps

1. Root `layout.tsx` metadata: `metadataBase: new URL("https://2fa.media")`, title (above), description, `alternates: { canonical: "/" }`, `openGraph` (type website, siteName 2FA.media, locale en_US), `twitter: { card: "summary_large_image" }`, `robots: { index: true, follow: true }`, `keywords` array.
2. `opengraph-image.tsx`: `ImageResponse`, size `{1200, 630}`, dark bg `#020308`, big white display-weight "2FA Code Generator", subline "Free · Browser-only · No signup", small white rounded card showing `123 456` mock code. Export `alt`, `size`, `contentType`.
3. `structured-data.tsx`: server component returning one `<script type="application/ld+json" dangerouslySetInnerHTML>` with `@graph` of:
   - `WebApplication`: name "2FA.media — 2FA Code Generator", url, applicationCategory "SecurityApplication", operatingSystem "Web", `offers: {price: "0", priceCurrency: "USD"}`, `creator: {Organization, name: "GOADS", url: goadsagency.com}`.
   - `FAQPage`: `mainEntity` mapped from `faq-content.ts` (plain-text answers — strip any JSX/links to text).
4. `sitemap.ts`: `[{ url: "https://2fa.media/", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }]`.
5. `robots.ts`: `rules: { userAgent: "*", allow: "/" }`, `sitemap: "https://2fa.media/sitemap.xml"`.
6. `icon.svg`: shield-check path on `#020308` rounded square.
7. Add `<Analytics />` (root layout body end).
8. Validate: build → check rendered `<head>` in view-source; Rich Results Test (FAQ + WebApplication recognized); OG check via opengraph preview tool; `curl /sitemap.xml /robots.txt /opengraph-image` locally.

## Todo list

- [x] Full root metadata export (title/desc/canonical/OG/twitter/robots)
- [x] `opengraph-image.tsx` (1200x630 dark + wordmark + mock code)
- [x] `structured-data.tsx` (`WebApplication` + `FAQPage` from faq data)
- [x] `sitemap.ts` + `robots.ts`
- [x] `icon.svg` favicon
- [x] `<Analytics />` mounted
- [x] Rich Results Test + schema validator pass; Lighthouse SEO 100

## Success Criteria

- View-source shows title, meta description, canonical, OG/Twitter tags, JSON-LD with all 8 FAQs.
- `/sitemap.xml`, `/robots.txt`, `/opengraph-image` return 200 with correct content.
- Social share preview (X/FB/LinkedIn debuggers) renders branded dark card.

## Risk Assessment

- **JSON-LD/visible-FAQ drift** → single data source enforced (`faq-content.ts`).
- **`ImageResponse` font limitations** (Inter not auto-available in edge runtime) → either fetch Inter TTF in the image route or accept default sans for OG only; decide at impl, don't block.
- **Rich result not granted** → schema correctness is still net-positive; no action.

## Security Considerations

- `dangerouslySetInnerHTML` only with `JSON.stringify` of static typed data (no user input) — safe.
- Analytics is cookieless; no consent banner needed; aligns with privacy-forward brand promise. Do NOT add trackers that contradict "no tracking of your secrets" copy.

## Next steps

- Phase 6: QA, deploy, Search Console submission in launch checklist.
