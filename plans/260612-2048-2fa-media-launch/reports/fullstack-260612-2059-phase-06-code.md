# Phase 06 Code Items — Implementation Report

## Status: DONE

## Files Modified
- `next.config.ts` — added `headers()` block with 4 security headers (+18 lines)

## Files Created
- `src/app/not-found.tsx` — dark-scoped 404 page with `.site` wrapper (36 lines)

## Tasks Completed
- [x] Security headers added to `next.config.ts`:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: DENY`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- [x] `not-found.tsx` created with `.site` dark scope — prevents white-flash 404
- [x] `npm run lint` — clean (no output = no errors)
- [x] `npx tsc --noEmit` — clean
- [x] `npm run build` — clean; 8 static routes generated

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
All static. Turbopack compiled in 1326ms.

## Remaining (human / production-domain required)
- Functional QA matrix on prod build (`npm run start`)
- Visual QA vs design-system checklists (`06` + `08§6`)
- Responsive QA at 360–1920px widths
- A11y keyboard/contrast pass
- Lighthouse run (Perf ≥95 / SEO 100 / A11y ≥95 / BP ≥95)
- Security headers verified with `curl -I` on live URL
- Vercel project setup + push to GitHub → import → deploy preview
- Domain `2fa.media` DNS setup + https cert confirmation
- Google Search Console verify + sitemap submit
- Rich Results Test on live URL
- OG preview debuggers (X/Facebook/LinkedIn) on live URL
- GOADS funnel UTM end-to-end on prod
- `git tag v1.0.0`
- `README.md` (noted in phase spec but excluded from scope per task instructions — no md outside ./plans or ./docs)

## Notes
- CSP deferred post-launch per phase spec (avoid hydration risk; report-only first)
- No `vercel.json` needed — fully static, zero-config on Vercel per phase key insights
- No env vars configured (none needed)
