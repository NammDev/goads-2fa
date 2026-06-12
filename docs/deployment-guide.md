# Deployment Guide — 2FA.media

**Target:** Vercel · Zero-config · No env vars required.

---

## Vercel Deploy (first time)

1. Push repo to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) → Import repository.
3. Framework preset: **Next.js** (auto-detected).
4. Build & Output settings: leave all defaults (`next build`, output `.next`).
5. Environment variables: **none needed** — skip this step.
6. Click **Deploy**.

Vercel will detect `next.config.ts`, apply security headers, and serve the static output via Edge Network.

---

## Custom Domain — 2fa.media

1. In Vercel project → **Settings → Domains** → Add `2fa.media` and `www.2fa.media`.
2. At your DNS registrar, add the records Vercel shows (usually an A record + CNAME, or Vercel nameservers).
3. Vercel auto-provisions TLS — no manual cert steps.
4. Set `2fa.media` as primary; configure `www.2fa.media` to redirect → `2fa.media` (Vercel handles this with the "redirect" option in the Domains panel).

Propagation: typically < 10 min with Vercel nameservers, up to 48 h with external DNS.

---

## Subsequent Deploys

Push to `main` → Vercel auto-deploys. No manual steps.

Preview deployments are created automatically for every pull request branch.

---

## Post-Launch Checklist

### SEO & Indexing
- [ ] Submit `https://2fa.media/sitemap.xml` in [Google Search Console](https://search.google.com/search-console) → Sitemaps.
- [ ] Request indexing for `https://2fa.media/` via URL Inspection tool.
- [ ] Verify `robots.txt` at `https://2fa.media/robots.txt` — should allow all.

### Social / OG
- [ ] Test OG image: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) → `https://2fa.media/`
- [ ] Test Twitter card: [Twitter Card Validator](https://cards-dev.twitter.com/validator) → `https://2fa.media/`
- [ ] Confirm `opengraph-image` route returns 200 at `https://2fa.media/opengraph-image`.

### JSON-LD
- [ ] Validate structured data: [Google Rich Results Test](https://search.google.com/test/rich-results) → `https://2fa.media/`
- [ ] Expect: **WebApplication** + **FAQPage** schemas passing.

### Security Headers
- [ ] Check headers: [Security Headers](https://securityheaders.com/?q=2fa.media)
- [ ] Expected grade: A (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy present).
- [ ] **CSP follow-up**: add `Content-Security-Policy-Report-Only` header in `next.config.ts`, monitor for 1–2 weeks, then promote to enforcing `Content-Security-Policy`.

### Vercel Analytics
- [ ] Confirm `@vercel/analytics` is reporting page views in Vercel dashboard → Analytics tab.

### Functional Smoke Test
- [ ] Paste a known TOTP secret → generate codes → verify code matches authenticator app.
- [ ] Confirm zero network requests during generation (DevTools → Network, clear, generate — no XHR/fetch).
- [ ] Test copy-single, copy-all, export .txt.
- [ ] Confirm countdown ring auto-refreshes at 30 s boundary.
- [ ] Click all four GOADS CTAs (header, promo, footer, faq) — verify UTM params in destination URL.

---

## Rollback

Vercel keeps full deployment history. To rollback: Vercel dashboard → Deployments → find previous deploy → **Promote to Production**.

---

## Local Development

```bash
npm install
npm run dev        # http://localhost:3000

# Verify TOTP algorithm against RFC vectors (no build needed):
node scripts/verify-totp.mjs
```

No `.env` file required.
