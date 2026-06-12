---
title: "2fa.media Launch"
description: "Free client-side TOTP generator funneling traffic to goadsagency.com"
status: in-review
priority: P1
effort: 20h
branch: main
tags: [nextjs, tailwind, totp, funnel, launch]
created: 2026-06-12
---

# 2fa.media Launch Plan

Free, browser-only TOTP 2FA code generator at `2fa.media`. Built with Next.js (App Router) + Tailwind v4 per the GOADS design-system bundle (`docs/2fa-media-design-system/`). Business goal: funnel tool traffic to goadsagency.com via integrated premium CTAs.

## Architecture decision (key)

Single-page launch: the tool lives on `/` (homepage = landing + tool). No `/tools/*` routes, no sidebar (per `06` + `08`: single-tool launch drops the registry sidebar and centers the tool body). Page order, all dark `.site` scope: Header → Hero → ToolHeader+ToolBody (white block) → GOADS promo section → FAQ → Footer. Reference code in `07-2fa-reference.md` is the source of truth for the tool; TOTP is hand-rolled Web Crypto (RFC 6238) — **no `otpauth` dependency needed**.

## Phases

| # | Phase | File | Effort | Status |
|---|-------|------|--------|--------|
| 1 | Project scaffold | [phase-01-project-scaffold.md](phase-01-project-scaffold.md) | 3h | complete |
| 2 | Atoms + tool shell | [phase-02-atoms-and-tool-shell.md](phase-02-atoms-and-tool-shell.md) | 3h | complete |
| 3 | 2FA tool implementation | [phase-03-2fa-tool-implementation.md](phase-03-2fa-tool-implementation.md) | 4h | complete |
| 4 | Landing content + funnel CTAs + FAQ | [phase-04-landing-content-funnel-faq.md](phase-04-landing-content-funnel-faq.md) | 4h | complete |
| 5 | SEO, metadata, OG, JSON-LD | [phase-05-seo-metadata-structured-data.md](phase-05-seo-metadata-structured-data.md) | 3h | complete |
| 6 | QA + Vercel deploy + launch | [phase-06-qa-deploy-launch.md](phase-06-qa-deploy-launch.md) | 3h | code-complete; prod deploy pending |

## Dependencies

- Phase 2 depends on 1 (tokens/fonts/layout). Phase 3 depends on 2 (atoms). Phase 4 depends on 2+3. Phase 5 depends on 4 (FAQ content drives JSON-LD). Phase 6 last.
- npm deps (exact, with reasons in phase 1): `lucide-react`, `clsx`, `tailwind-merge`, `tw-animate-css` (dev), `@vercel/analytics`. No backend, no env secrets, no database.

## Constraints

- Strict design-system compliance: tokens only (`--solid-*`/`--alpha-*`), `siteText.*` type, atoms not raw buttons, white block always white. Checklist in `06`.
- Code files < 200 lines, kebab-case names. TOTP logic extracted to `src/lib/totp.ts` to keep `two-fa.tsx` under limit.
- English-only copy. Privacy promise: secrets never leave browser.
