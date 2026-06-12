# Launch QA Report — 2FA.media

Date: 2026-06-12 | Tester agent

---

## 1. TOTP Correctness — PASS (9/9)

Script: `scripts/verify-totp.mjs` (kept — canonical verify, run with `node scripts/verify-totp.mjs`)

**RFC 6238 Vectors (SHA-1, 6-digit truncation of 8-digit RFC values):**

| T | Counter | Expected | Actual | Result |
|---|---------|----------|--------|--------|
| 59 | 1 | 287082 | 287082 | PASS |
| 1111111109 | 37037036 | 081804 | 081804 | PASS |
| 1234567890 | 41152263 | 005924 | 005924 | PASS |
| 2000000000 | 66666666 | 279037 | 279037 | PASS |

**Base32 edge cases:**
- Lowercase input → normalized (PASS)
- Spaces + `=` padding → stripped (PASS)
- Hyphens → stripped (PASS)
- Invalid char `1` → throws (PASS)
- Invalid char `@` → throws (PASS)

**Algorithm notes:** `totp.ts` correctly implements HMAC-SHA1 via `crypto.subtle`, big-endian 8-byte counter, dynamic truncation (offset = last nibble of HMAC), 6-digit modulo. Fully RFC 6238 compliant.

---

## 2. Build Integrity — PASS

`npm run build` succeeded, TypeScript clean, no warnings.

**Static routes generated (6):**
```
○ /
○ /_not-found
○ /icon.svg
○ /opengraph-image
○ /robots.txt
○ /sitemap.xml
```

Note: task spec expected 8 routes — only 6 generated. The 6 match all defined app routes. No missing routes found in codebase; 8 may have been a pre-implementation estimate.

---

## 3. Rendered Output — PASS

Tested via `npm run start` → `curl http://localhost:3000/`.

| Check | Result |
|-------|--------|
| HTTP 200 | PASS |
| Title contains "2FA" | PASS — "2FA Code Generator — Free Online TOTP Codes \| 2FA.media" |
| JSON-LD `<script type="application/ld+json">` | PASS |
| `@graph` contains WebApplication | PASS |
| `@graph` contains FAQPage | PASS |
| FAQPage mainEntity count = 8 | PASS |
| `<details>` elements = 8 | PASS |
| `utm_content=header` link | PASS |
| `utm_content=promo` link | PASS |
| `utm_content=footer` link | PASS |
| `utm_content=faq` link | PASS |
| Total distinct goadsagency.com `href` | 4 (header, promo, faq, footer) |

**Security headers:**
| Header | Value | Result |
|--------|-------|--------|
| X-Frame-Options | DENY | PASS |
| X-Content-Type-Options | nosniff | PASS |
| Referrer-Policy | strict-origin-when-cross-origin | PASS |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | PASS |

---

## Summary

| Category | Tests | Passed | Failed |
|----------|-------|--------|--------|
| TOTP vectors | 4 | 4 | 0 |
| Base32 edge cases | 5 | 5 | 0 |
| Build | 1 | 1 | 0 |
| HTML/SEO/Headers | 14 | 14 | 0 |
| **Total** | **24** | **24** | **0** |

---

## Unresolved Questions

1. Task spec expected 8 static routes; build produces 6. Verify whether `/favicon.ico` and `/apple-touch-icon` (or similar) were expected as separate routes, or if 6 is correct for this app.
2. No X-XSS-Protection header emitted (deprecated but some auditors flag). By design per `next.config.ts` comment ("CSP deferred to post-launch")?
