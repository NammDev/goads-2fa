# Code Review — 2fa.media Pre-Launch

**Date:** 2026-06-12  
**Reviewer:** code-reviewer  
**Score: 8.5 / 10**

---

## Scope

- Files reviewed: `src/lib/totp.ts`, `src/lib/clipboard.ts`, `src/lib/utils.ts`, `src/components/tools/*` (5 files), `src/components/atoms/*` (8 files), `src/components/sections/*` (4 files), `src/components/layout/*` (2 files), `src/components/seo/structured-data.tsx`, `src/app/layout.tsx`, `src/app/(marketing)/layout.tsx`, `src/app/(marketing)/page.tsx`, `src/app/opengraph-image.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/data/faq-content.ts`, `src/data/site-links.ts`, `src/fonts/index.ts`, `next.config.ts`
- Lines analyzed: ~650
- Review focus: TOTP correctness/security, React timer hygiene, XSS surface, design-system compliance, config headers

---

## Overall Assessment

Clean, purposeful codebase. TOTP implementation is RFC-correct and fully client-side. No secret leakage vectors found. React lifecycle is properly managed. XSS surface is minimal and safe. One medium-severity timer dependency bug and a few low-priority findings; nothing blocks launch.

---

## Critical Issues

None.

---

## High Priority Findings

None.

---

## Medium Priority Improvements

### M1 — Timer re-registers every time `generate` reference changes (stale-closure / re-subscribe churn)

**File:** `src/components/tools/two-fa-tool.tsx` lines 32–42

`generate` is a `useCallback` that closes over `input`. Any `input` keystroke recreates `generate`, which changes the `useEffect` dep `[entries.length, generate]`. If the user types while codes are displayed the interval is torn down and re-started every keystroke — harmless functionally (it clears+re-registers instantly) but semantically wrong and wastes work.

Fix: separate the tick concern from `generate`. Track `generate` via a ref so the interval never needs to re-register when `generate` changes:

```ts
const generateRef = useRef(generate)
useEffect(() => { generateRef.current = generate }, [generate])

useEffect(() => {
  if (entries.length === 0) return
  const tick = () => {
    const remaining = 30 - (Math.floor(Date.now() / 1000) % 30)
    setTimeLeft(remaining)
    if (remaining === 30) void generateRef.current()
  }
  tick()
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)
}, [entries.length]) // stable dep — no churn
```

### M2 — `exportTxt` leaks secrets into downloaded file

**File:** `src/components/tools/two-fa-tool.tsx` line 58

```ts
const text = entries.map((e) => `${e.secret}|${e.code}`).join("\n")
```

The export includes the raw secret. The user intentionally chose Export, so this is low-risk from a *surprise* standpoint, but the privacy promise ("secrets never leave your device") is technically fulfilled — it's a local download. However the filename `2fa-codes-{timestamp}.txt` containing both secrets and codes together is a high-value credential dump if that file is later mishandled (email, cloud sync, etc.).

Recommend: export codes only (`${e.secret.slice(0,4)}…|${e.code}`) or add a comment in code noting this is intentional UX. At minimum, document in FAQ or UI that the exported file contains raw secrets.

### M3 — `CountdownRing` is a server component receiving live `seconds` but not marked `"use client"`

**File:** `src/components/tools/two-fa-countdown-ring.tsx`

The component receives a prop that changes every second via the parent (`"use client"` boundary). This is fine — it's rendered inside `TwoFaTool` which is already a client component, so it inherits client context. But it could confuse future maintainers who see no `"use client"` directive on a purely dynamic component. Low risk, worth a comment.

---

## Low Priority Suggestions

### L1 — Missing `X-XSS-Protection` header (obsolete but belt-and-suspenders)

**File:** `next.config.ts`

Modern browsers don't need `X-XSS-Protection: 1; mode=block` (deprecated in Chrome). No action needed, but noting CSP is still deferred — add a report-only CSP soon post-launch per the phase-06 plan.

### L2 — `JSON.stringify` in JSON-LD does not escape `</script>` sequences

**File:** `src/components/seo/structured-data.tsx` line 51

All JSON-LD data is from static TypeScript literals (`faq-content.ts`). No user input reaches `dangerouslySetInnerHTML`. However, if FAQ answer strings ever contain `</script>`, browsers would interpret it as closing the script tag (HTML parser reads before JS parser). Current content is safe; a hardened approach replaces `</` with `<\/` inside the stringify output:

```ts
dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/<\//g, '<\\/') }}
```

Given the static nature, this is low-urgency but a good defensive habit.

### L3 — `new Date().getFullYear()` in footer executes at build time (static site)

**File:** `src/components/layout/site-footer.tsx` line 29

With `output: 'export'` or static generation the year is baked at build time. If the site isn't rebuilt each January, the copyright year will be stale. Since this is Vercel with push-to-deploy, it will refresh frequently enough in practice. No action required, but worth noting.

### L4 — `execCommand('copy')` fallback is deprecated

**File:** `src/lib/clipboard.ts` line 13

`document.execCommand` is deprecated but still works in all major browsers as fallback. The implementation is correct (fixed position, opacity 0, appended+removed). Fine for launch; consider removing after browser compat requirements allow dropping non-secure-context support.

### L5 — `CodeChip` renders raw `entry.secret` to DOM

**File:** `src/components/tools/two-fa-code-card.tsx` line 27 → `src/components/atoms/code-chip.tsx`

Secret is rendered as React text node (safe, no `dangerouslySetInnerHTML`). XSS-free. Also correctly truncated via CSS `truncate` class — no issue.

### L6 — `aria-label` on CodeCard uses raw code not formatted code

**File:** `src/components/tools/two-fa-code-card.tsx` line 19

```tsx
aria-label={`Copy ${entry.code}`}  // "Copy 123456"
```

Screen reader would say "Copy 123456" while the visual displays "123 456". Minor a11y inconsistency — use `formatCode(entry.code)` for the label.

---

## Positive Observations

- **TOTP correctness**: RFC 6238 dynamic truncation offset (`sig[sig.length-1] & 0x0f`), HMAC-SHA1 via `crypto.subtle`, big-endian 8-byte counter — all correct. `Math.floor(tmp / 256)` loop avoids bitwise shift overflow on 32-bit integer boundary (correct).
- **No secret leakage**: `crypto.subtle.importKey` with `extractable: false`, no logging, no localStorage, no cookies, no network calls from the TOTP path. Privacy promise holds.
- **Base32 validation**: `^[A-Z2-7]{16,}$` regex is correct RFC 4648 base32 alphabet. Min-16 chars is a reasonable lower bound for TOTP secrets (80-bit minimum).
- **Interval cleanup**: `clearInterval` in effect cleanup — correct.
- **Clipboard fallback**: Dual-path (Clipboard API → execCommand) with boolean return and silent failure — robust.
- **External links**: All `target="_blank"` links carry `rel="noopener noreferrer"` — correct throughout (`cta-button.tsx`, `faq-section.tsx`, `site-footer.tsx`).
- **JSON-LD source**: Static typed object → `JSON.stringify` — no user input in schema, XSS-safe for current content.
- **Design-system compliance**: CSS custom properties (`--solid-*`, `--alpha-*`) used consistently; no raw hex colors except brand-mandated ones in OG image and border literals matching design tokens. `siteText.*` used for all typography.
- **File sizes**: All files under 200 lines. Kebab-case naming throughout.
- **Metadata**: `metadataBase` set, canonical `/` resolves to `https://2fa.media/`, sitemap/robots correctly configured.
- **Security headers**: 4 baseline headers present. X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy — correct values.
- **`"use client"` boundary**: Only `two-fa-tool.tsx` is client; all rendering components (sections, atoms) are server components. Correct boundary placement.
- **Hydration safety**: No `window`/`document` access outside event handlers or effects. No hydration mismatch risk.

---

## Recommended Actions

1. **(Medium — before launch)** Fix timer dep churn in `two-fa-tool.tsx` useEffect (M1) — use a ref to stabilize `generate` dep.
2. **(Medium — before launch)** Add `aria-label` fix for CodeCard (L6) — one-liner.
3. **(Low — post-launch)** Add `</` → `<\/` escaping in `structured-data.tsx` JSON-LD (L2).
4. **(Low — post-launch)** Add report-only CSP header per phase-06 plan.
5. **(Low — decision)** Decide if `exportTxt` including raw secrets is intentional UX; document or scope-limit (M2).

---

## Plan Status

All phases 1–6 code tasks are DONE per agent reports. Phase-06 non-code items (Vercel deploy, domain DNS, Search Console, Lighthouse, OG debuggers) remain as human/production-domain steps — not blockers for code quality sign-off.

Updating plan.md phase statuses to reflect code-complete:

| Phase | Code Status |
|-------|------------|
| 1 — Scaffold | complete |
| 2 — Atoms | complete |
| 3 — 2FA tool | complete |
| 4 — Landing/FAQ | complete |
| 5 — SEO/metadata | complete |
| 6 — QA/deploy | code complete; prod deploy pending |

---

## Unresolved Questions

1. **`exportTxt` UX intent**: Is including raw secrets in the export file intentional? If yes, add a brief UI warning ("This file contains your secret keys — store securely").
2. **CSP timeline**: No report-only CSP is in place yet — Vercel Analytics injects an inline script; will the CSP need a `'unsafe-inline'` exception or nonce? Needs verification when CSP is added post-launch.
3. **`not-found.tsx` review skipped**: File was created per phase-06 report but not included in review scope. Recommend a quick check that it renders within `.site` dark scope.
