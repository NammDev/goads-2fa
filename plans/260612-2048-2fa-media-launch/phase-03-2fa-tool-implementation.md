# Phase 03 — 2FA Tool Implementation (Client-Side TOTP)

## Context links

- Reference implementation (source of truth): `docs/2fa-media-design-system/07-2fa-reference.md`
- Tool checklist: `docs/2fa-media-design-system/06-tool-design-language.md`
- Depends on: [phase-02-atoms-and-tool-shell.md](phase-02-atoms-and-tool-shell.md)

## Overview

- **Date:** 2026-06-12
- **Description:** Port the full working 2FA TOTP generator from `07`: textarea input (multi-secret), Generate button, result card stack with 6-digit codes, 30s countdown ring, per-code copy + Copy all + Export .txt, auto-refresh on window rollover. 100% client-side via Web Crypto.
- **Priority:** P1 (the product)
- **Implementation status:** completed
- **Review status:** completed

## Key Insights

- TOTP is hand-rolled in `07` (RFC 6238/4226 via `crypto.subtle` HMAC-SHA1). **No `otpauth`/`speakeasy` npm dep** — follow the reference exactly. Zero crypto dependencies = smaller bundle + auditably client-only.
- Reference `two-fa.tsx` is ~230 lines → exceeds 200-line rule. Modularize: extract pure TOTP/parse logic to `src/lib/totp.ts`, `CodeCard` + `CountdownRing` to own component files. Logic stays byte-identical, only file boundaries change.
- Multi-secret support IS in the reference: one secret per line + pipe-separated rows (`label|SECRET|...`), first valid base32 `^[A-Z2-7]{16,}$` per line, deduped via Set. Keep it (matches 2fa.live UX).
- Invalid secret → entry renders code `"ERROR"` (reference behavior). Keep; cards still copyable pattern holds.
- Copy flash is fixed-width `w-[78px]` so the row never shifts; flash timeout 1400ms with stale-id guard.
- Auto-refresh: 1s interval; regenerates when `remaining === 30` (rollover). `crypto.subtle` requires secure context — fine on localhost + https (Vercel).
- `animate-in fade-in zoom-in-95` requires `tw-animate-css` (installed phase 1).

## Requirements

**Functional:**
- Paste secret(s) → Generate → 6-digit code(s) formatted `XXX XXX`.
- Codes auto-regenerate at 30s boundary; ring + numeric countdown animate per second.
- Click card = copy code, inline "Copied" flash; "Copy all" copies newline-joined codes; "Export" downloads `2fa-codes-{ts}.txt` (`secret|code` lines).
- Whitespace/`=`/`-` stripped from secrets; lowercase accepted (uppercased).
- Generate disabled when textarea empty.

**Non-functional:**
- Zero network requests carrying secret material (verifiable in devtools Network tab).
- Each file < 200 lines. `"use client"` only on components needing it.

## Architecture

```
src/
├── lib/
│   └── totp.ts                          # generateTOTP(), parseSecrets(), formatCode(), CodeEntry type
└── components/tools/
    ├── two-fa-tool.tsx                  # "use client" — state, interval, copy/export handlers, input card, composition
    ├── two-fa-code-card.tsx             # CodeCard — result row (chip + big digits + copy flash)
    └── two-fa-countdown-ring.tsx        # CountdownRing — 36px SVG ring, 30s window
```

Data flow: textarea → `parseSecrets` → per-secret `generateTOTP` (Web Crypto HMAC-SHA1, counter = floor(epoch/30)) → `CodeEntry[]` state → card stack. Interval effect keyed on `entries.length` re-ticks every 1s.

## Related code files

**Create:**
- `src/lib/totp.ts`
- `src/components/tools/two-fa-tool.tsx`
- `src/components/tools/two-fa-code-card.tsx`
- `src/components/tools/two-fa-countdown-ring.tsx`

**Modify:**
- `src/app/(marketing)/page.tsx` — mount `ToolHeader` (ShieldCheck icon from `07`) + `ToolBody><TwoFaTool/>` (placement finalized phase 4)

**Delete:** phase-2 smoke-render dummy content.

## Implementation Steps

1. `src/lib/totp.ts`: move `generateTOTP`, `parseSecrets`, `formatCode`, `CodeEntry` type verbatim from `07` (pure module, no React, no `"use client"` needed — only called from client components). Add brief JSDoc noting RFC 6238 + base32 decode.
2. `src/components/tools/two-fa-countdown-ring.tsx`: `CountdownRing` verbatim (r=13, dasharray/dashoffset, `transition-[stroke-dashoffset] duration-1000 ease-linear`).
3. `src/components/tools/two-fa-code-card.tsx`: `CodeCard` verbatim — group hover, `CodeChip` secret, `font-display text-[2.25rem] ... tabular-nums max-md:text-[1.75rem]` digits, `w-[78px]` copy-flash slot, `aria-label`.
4. `src/components/tools/two-fa-tool.tsx`: `"use client"`; port `TwoFaTool` body verbatim — input card (`rounded-[16px] border-[var(--solid-50)] focus-within:border-[var(--solid-400)]`, mono textarea, placeholder "Paste secrets, one per line", rows=5, spellCheck=false), `LightPrimaryButton` "Generate" + ArrowRight, results block with `CountdownRing`, card stack `gap-3`, `LightGhostAction` "Copy all"/"Export". Import logic from `@/lib/totp`.
5. Wire into homepage: `ToolHeader icon={ShieldCheckIcon} title="2FA Generator"` + `ToolBody><TwoFaTool/></ToolBody>` inside centered `max-w-[960px]` column (final layout phase 4). Keep ShieldCheck inline SVG from `07` (28x28, stroke currentColor) in a small `two-fa-shield-icon.tsx` or co-located in page.
6. Correctness validation (manual, mandatory): generate code for a known secret and compare against an authenticator app / `oathtool --totp -b <secret>`; verify identical 6 digits and synchronized rollover. Test vector option: secret `GEZDGNBVGEZDGNBVGEZDGNBVGEZDGNBV` cross-checked with any online RFC 6238 reference at same timestamp.
7. Edge tests (manual): invalid base32 line → ERROR entry; mixed valid/invalid lines; pipe format `mail@x.com|pass|SECRET`; duplicate secrets dedupe; 20+ secrets perf; tab left open across rollover keeps regenerating.
8. `tsc --noEmit` + build clean; confirm Network tab silent during generate/refresh.

## Todo list

- [x] `lib/totp.ts` (pure logic extracted)
- [x] `two-fa-countdown-ring.tsx`
- [x] `two-fa-code-card.tsx`
- [x] `two-fa-tool.tsx` (state + handlers + input card)
- [x] Mount on homepage with `ToolHeader`/`ToolBody`
- [x] TOTP correctness verified vs authenticator app/oathtool
- [x] Edge cases pass (invalid/pipe/dedupe/rollover)
- [x] No network requests with secret material; build + typecheck clean

## Success Criteria

- Codes match a real authenticator for same secret + time.
- All `06` tool-checklist items pass (atoms used, card stack, tabular nums, 500ms/150ms transitions, `max-md` overrides).
- Copy flash never shifts row width; ring animates smoothly.

## Risk Assessment

- **Refactor drift while splitting files** → keep logic verbatim; only move code. Diff against `07` after.
- **Client clock skew** → codes "wrong" for users with bad system time; mitigate via FAQ answer (phase 4), not code.
- **`crypto.subtle` unavailable on plain http** → only affects non-localhost http; production is https. No action.
- **`key={entry.secret}` collisions** → impossible post-dedupe (Set).

## Security Considerations

- Secrets live only in React state/textarea; never logged, never sent, no localStorage persistence (deliberate — refresh clears secrets; state this in FAQ).
- HMAC-SHA1 is the RFC 6238 standard for authenticator compatibility — not a security weakness here.
- Export file generated via Blob URL client-side only; `URL.revokeObjectURL` called.

## Next steps

- Phase 4: landing structure around the tool + funnel CTAs + FAQ.
