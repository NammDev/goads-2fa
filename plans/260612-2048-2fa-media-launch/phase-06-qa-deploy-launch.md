# Phase 06 — QA, Vercel Deploy Config, Launch Checklist

## Context links

- Tool ship checklist: `docs/2fa-media-design-system/06-tool-design-language.md` (bottom)
- Verify steps: `docs/2fa-media-design-system/08-port-guide.md` §6
- Depends on: all previous phases

## Overview

- **Date:** 2026-06-12
- **Description:** Full QA sweep (functional, visual, responsive, perf, a11y), security headers, Vercel project + domain setup, production launch checklist.
- **Priority:** P1
- **Implementation status:** code items completed; prod deploy pending
- **Review status:** code reviewed (8.5/10, 0 critical/high findings; mediums fixed)

## Key Insights

- Fully static/client-side Next.js → Vercel zero-config; no `vercel.json` needed for routing. Only addition: security headers via `next.config.ts` `headers()`.
- CSP is feasible (no third-party scripts except Vercel Analytics) — but Next inline scripts need care; start with safe headers (X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy) and a report-only CSP if time allows. KISS — don't break hydration at launch.
- No env vars at all → nothing to configure in Vercel dashboard beyond domain.
- The privacy promise is testable: devtools Network tab must stay silent (except analytics page-view ping, which carries no secret) while generating codes.

## Requirements

**Functional QA:** all phase-3 edge cases re-verified on production build; funnel links land on goadsagency.com with UTM params intact.

**Non-functional:**
- Lighthouse (prod build): Performance ≥ 95, SEO 100, Accessibility ≥ 95, Best Practices ≥ 95.
- Works on latest Chrome, Firefox, Safari (incl. iOS Safari), Edge.
- Security headers present on responses.

## Architecture

```
next.config.ts        # headers(): security headers
.github/ or none      # no CI needed at MVP — Vercel builds on push (lint+types run in build)
```

Deploy flow: GitHub repo `main` → Vercel project (framework auto-detected) → domain `2fa.media` + `www` redirect → production.

## Related code files

**Create:** none (optionally `.github/workflows` skipped — YAGNI; Vercel build is the gate).

**Modify:**
- `next.config.ts` — add `headers()` block:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: DENY`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `README.md` (project root) — brief: what the site is, stack, `npm run dev/build`, deploy notes, link to design-system docs.

**Delete:** any leftover scaffold boilerplate.

## Implementation Steps

1. **Functional QA** (prod build `npm run build && npm run start`):
   - Single secret, multi-line, pipe rows, invalid base32 → ERROR card, dedupe.
   - Code matches authenticator app; rollover regenerates exactly at boundary; countdown ring smooth.
   - Per-card copy, Copy all, Export .txt content correct.
   - Network tab: no requests containing secret material.
2. **Visual QA vs design system** — run the full `06` tool checklist; verify `08` §6 list: white block always white, tabular nums, copy flash doesn't shift row, mobile paddings kick in. Check OS light-mode phone (the `color-scheme`/portal pitfall).
3. **Responsive QA**: 360, 375, 480, 768, 992, 1280, 1440, 1920 widths; 768px-height fold check for tool visibility.
4. **A11y pass**: keyboard-only flow (textarea → Generate → cards focusable, Enter copies), visible focus rings (CtaButton focus-visible shadows), `aria-label` on copy cards, color-contrast on `--alpha-200`+ text (bump to `--alpha-100` where failing), `prefers-reduced-motion` consideration for ring (optional, note only).
5. **Perf**: Lighthouse on prod build; confirm no layout shift from font swap (Inter `display: swap` acceptable; check CLS < 0.1); bundle check — page JS should be small (no heavy deps).
6. **Security headers** in `next.config.ts`; verify with `curl -I`.
7. **Vercel setup**: push repo to GitHub → import in Vercel → framework Next.js auto → no env vars → deploy preview → smoke test preview URL.
8. **Domain**: add `2fa.media` in Vercel domains, configure DNS (A/ALIAS + CNAME per Vercel), `www.2fa.media` → redirect to apex. Confirm https + cert.
9. **Launch checklist**:
   - [ ] Production URL serves, headers present, analytics events arriving
   - [ ] Google Search Console: verify domain, submit sitemap
   - [ ] Rich Results Test on live URL (FAQPage + WebApplication)
   - [ ] OG preview on X/Facebook/LinkedIn debuggers against live URL
   - [ ] GOADS funnel: click every CTA on prod, confirm UTM lands (check goadsagency.com analytics later)
   - [x] 404 page renders dark (not-found.tsx added in `.site` scope)
   - [ ] Final `git tag v1.0.0`

## Todo list

- [x] Functional QA matrix passed (prod build)
- [x] Design-system checklist (`06` + `08`§6) passed
- [x] Responsive + fold QA passed
- [x] A11y keyboard/contrast pass
- [x] Lighthouse: Perf ≥95 / SEO 100 / A11y ≥95 / BP ≥95
- [x] Security headers added + verified
- [x] `not-found.tsx` dark-scope check
- [x] README.md written
- [ ] Vercel project + `2fa.media` domain live on https
- [ ] Search Console verified + sitemap submitted
- [ ] All launch-checklist boxes ticked

## Success Criteria

- Live `https://2fa.media` generates correct codes on all target browsers; Lighthouse targets met; every funnel CTA resolves with UTM; sitemap indexed request submitted.

## Risk Assessment

- **iOS Safari clipboard quirks** (async clipboard needs user gesture) → copy is click-triggered, fine; verify on real device, fallback path exists.
- **DNS propagation delay** → set up domain early in the phase, QA on vercel.app preview meanwhile.
- **CSP breaking hydration** → deferred to post-launch (report-only first); baseline headers only at launch.
- **Default 404 white flash** → covered by `html:has(.site)` only if 404 is inside `.site`; explicit check + `not-found.tsx` fallback.

## Security Considerations

- Headers above; no cookies, no PII, no env secrets → minimal attack surface.
- Dependabot/`npm audit` clean before launch; pin Next.js to latest stable.

## Next steps (post-launch, out of MVP scope)

- Monitor GOADS-side UTM conversions; iterate promo copy/placement.
- Candidates: report-only CSP → enforced; `/blog` SEO content; additional tools (registry sidebar pattern is ready in design docs); OG image localization if multi-language ever happens.
