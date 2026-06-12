# Phase 04 — Landing Content, Funnel CTAs, FAQ

## Context links

- Lead-gen layer pattern: `docs/2fa-media-design-system/08-port-guide.md` §7
- Marketing atoms (`SectionHead`, `CtaButton`): `docs/2fa-media-design-system/04`/`05`
- Principles (CTA restraint, accent usage): `docs/2fa-media-design-system/01-design-principles.md`
- Depends on: [phase-02](phase-02-atoms-and-tool-shell.md), [phase-03](phase-03-2fa-tool-implementation.md)

## Overview

- **Date:** 2026-06-12
- **Description:** Build the full homepage: sticky header with GOADS nav CTA, hero, tool section, integrated GOADS promo section, FAQ accordion, footer. All funnel CTAs UTM-tagged. English copy drafted below.
- **Priority:** P1
- **Implementation status:** completed
- **Review status:** completed

## Key Insights

- Port guide §7 is explicit: lead-gen lives in the **dark scope around the white block** — never inside the tool. Monochrome restraint + the single `--accent` blue on CTAs "is the whole play".
- Design rule "no FAQ on tool pages" applies to `/tools/{slug}` panel pages; here the homepage is a marketing landing that *embeds* the tool — hero/FAQ/promo sections are sanctioned (`01` marketing-pages paragraph). Tool block itself stays clean.
- FAQ: use native `<details>/<summary>` styled dark-scope — zero JS, content crawlable for SEO, mirrors JSON-LD in phase 5. KISS.
- FAQ content in `src/data/faq-content.ts` as typed array → single source for both the section render and phase-5 JSON-LD.
- All GOADS links: `https://goadsagency.com/?utm_source=2fa-media&utm_medium=referral&utm_campaign=2fa-tool&utm_content={header|promo|footer|faq}` — funnel measurable per placement.

## Requirements

**Functional:**
- Page order: Header → Hero (compact) → Tool → GOADS promo → FAQ → Footer.
- 3 funnel touchpoints minimum: header nav CTA, promo section hero CTA, footer link. Optional 4th: FAQ "Who built this" answer link.
- FAQ items expandable/collapsible, first item open by default (`open` attr).
- Fully responsive per breakpoints (`max-fp-sm` / `max-md` / `max-fp-lg`).

**Non-functional:**
- Section rhythm: `py-[108px] max-md:py-24 max-sm:py-20` for promo/FAQ; tool section `py-10 max-md:py-8`. Hero compact (tool above the fold on desktop).
- Each component file < 200 lines.

## Architecture

```
src/
├── app/(marketing)/page.tsx        # composes sections, < 80 lines
├── data/
│   ├── faq-content.ts              # FaqItem[] {question, answer}
│   └── site-links.ts               # GOADS_URL builder w/ UTM helper
└── components/
    ├── layout/
    │   ├── site-header.tsx         # sticky blur nav: wordmark + CtaButton variant="nav"
    │   └── site-footer.tsx         # SectionContainer variant="footer"
    └── sections/
        ├── hero-section.tsx        # SectionHead h1, compact
        ├── tool-section.tsx        # ToolHeader + ToolBody + TwoFaTool, centered max-w-[960px]
        ├── goads-promo-section.tsx # the funnel centerpiece
        └── faq-section.tsx         # details/summary accordion
```

## Related code files

**Create:**
- `src/data/faq-content.ts`, `src/data/site-links.ts`
- `src/components/sections/hero-section.tsx`
- `src/components/sections/tool-section.tsx`
- `src/components/sections/goads-promo-section.tsx`
- `src/components/sections/faq-section.tsx`

**Modify:**
- `src/app/(marketing)/page.tsx` (final composition)
- `src/components/layout/site-header.tsx`, `site-footer.tsx` (finalize stubs)

**Delete:** none.

## Implementation Steps

1. `src/data/site-links.ts`: `goadsUrl(content: "header"|"promo"|"footer"|"faq")` returning UTM-tagged URL (base `https://goadsagency.com/`).
2. `site-header.tsx`: sticky `top-0 z-50`, `bg-[var(--nav-bg)] backdrop-blur`, bottom border `#ffffff29`; `SectionContainer variant="navbar"`; left: "2FA.media" wordmark (`siteText.headingL`, white) + right: `CtaButton variant="nav" href={goadsUrl("header")}` → "Scale with GOADS".
3. `hero-section.tsx`: `SectionContainer variant="section"`, `pt-16 pb-4 max-md:pt-10` (compact — tool must be near the fold). `SectionHead` `titleTag="h1" titleSize="h2" size="large"` with copy below.
4. `tool-section.tsx`: `section py-10 max-md:py-8` → `SectionContainer variant="wide"` → `div max-w-[960px] mx-auto flex flex-col gap-6 max-md:gap-5` → `ToolHeader` + `ToolBody><TwoFaTool/>`.
5. `goads-promo-section.tsx` (integrated-design promo, NOT an ad banner): dark-scope panel inside `SectionContainer variant="section"` — `rounded-[36px] max-md:rounded-[16px] border border-[#ffffff29] bg-[var(--accent-soft)]` (the one sanctioned accent tint), inner `px-8 py-[72px] max-md:px-5 max-md:py-12`; contains `SectionHead variant="light"` + centered `CtaButton variant="hero" href={goadsUrl("promo")}` + below it `siteText.bodyS text-[var(--alpha-200)]` trust line. Card hover/border transitions per `02` table.
6. `faq-section.tsx`: `SectionHead` (h2) then stack of `<details>` cards — `rounded-[16px] border border-[#ffffff29] bg-[var(--alpha-900)]`, `<summary>` = `siteText.headingM text-foreground` + ChevronDown rotating via `[[open]_&]:rotate-180`, answer = `siteText.bodyM text-[var(--alpha-100)] px-5 pb-5`. Maps `faq-content.ts`. First item `open`.
7. `site-footer.tsx`: `SectionContainer variant="footer"`, top border `#ffffff29`, `py-12`; wordmark + tagline "Free browser-only 2FA codes. A free tool by GOADS." + link `goadsUrl("footer")` + © 2026 2FA.media. Privacy one-liner: "We never see your secrets — everything runs in your browser."
8. Compose `page.tsx`; full responsive pass at 375 / 480 / 768 / 992 / 1440.

## Copy drafts (final-candidate English)

**Hero** — overline: `FREE 2FA CODE GENERATOR` · H1: `Get your 2FA codes. Right in your browser.` · desc: `Paste your 2FA secret key and get the 6-digit code instantly. No signup, no server, no tracking of your secrets — everything runs locally in your browser.`

**Header CTA:** `Scale with GOADS`

**GOADS promo** — overline: `BUILT BY GOADS` · H2: `Running ads at scale? Meet GOADS.` · desc: `2FA.media is a free tool from GOADS — the agency ad account partner for performance marketers. Premium Facebook & Google agency accounts, fast top-ups, and real human support that keeps your campaigns live.` · CTA (hero): `Explore GOADS Agency` · trust line: `Trusted by media buyers worldwide.`

**FAQ (8 items)** — answers drafted in full during implementation, 2–4 sentences each, keyword-rich:
1. `What is a 2FA code generator?` — TOTP/RFC 6238 explainer, same codes as Google Authenticator.
2. `Is it safe to paste my 2FA secret key here?` — 100% client-side, Web Crypto, nothing transmitted/stored; verifiable in devtools; refresh clears everything.
3. `Where do I find my 2FA secret key?` — the base32 string shown during 2FA setup ("can't scan the QR?" link on most sites).
4. `Why is my code not working?` — device clock sync, secret typos, 30s expiry window.
5. `Can I generate codes for multiple accounts at once?` — one per line, `label|SECRET` rows supported, Copy all / Export.
6. `Which services does this work with?` — any TOTP service: Google, Facebook, Instagram, Microsoft, GitHub, exchanges...
7. `Do you store my secret keys?` — No. No server, no database, no cookies for secrets; closing the tab wipes them.
8. `Who built 2FA.media?` — GOADS, the agency ad account provider — free tool for the marketing community, with link (`goadsUrl("faq")`).

## Todo list

- [x] `site-links.ts` UTM helper + `faq-content.ts`
- [x] Header finalized (sticky blur + nav CTA)
- [x] Hero section (compact)
- [x] Tool section (centered, no sidebar)
- [x] GOADS promo section (accent-soft panel + hero CTA)
- [x] FAQ section (details/summary, 8 items)
- [x] Footer finalized
- [x] Responsive pass 375→1440
- [x] Copy reviewed (tone: terse, utilitarian, privacy-forward)

## Success Criteria

- Tool visible at/near fold on 1440x900. Promo reads premium/integrated (no ad-banner look; passes the "would GOADS ship this" gut check).
- All GOADS links carry distinct `utm_content`; open in new tab with `noopener`.
- FAQ crawlable in page source (SSR, no client JS required to read answers).

## Risk Assessment

- **Promo too loud → trust damage** → single accent tint, monochrome elsewhere, no images, no animation gimmicks.
- **Hero pushes tool below fold** → compact hero (no full `py-[108px]` on hero); verify on 768px-height viewport.
- **`<details>` default marker styling** → `[&::-webkit-details-marker]:hidden` + `list-none` on summary.

## Security Considerations

- External links `rel="noopener noreferrer"` (CtaButton handles).
- No third-party embeds/scripts in promo (pure HTML/CSS).

## Next steps

- Phase 5: SEO/metadata consumes `faq-content.ts` for JSON-LD.
