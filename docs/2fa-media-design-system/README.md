# 2fa.media Design System

> **Portable, self-contained** design-system bundle extracted from the `/tools/2fa` route of goadsagency.com.
> Carry this folder into the **new `2fa.media` codebase** and you can rebuild the exact visual language —
> tokens, fonts, components, and the 2FA tool itself — **without opening the original repo**.

## Why this exists

`2fa.media` = a free **6-digit (TOTP) code generator** that, like ProAds, gives away a useful tool while
pulling banner traffic / leads back to GOADS. It must **keep the visual language of the current GOADS 2FA tool**.
This bundle freezes that language into copy-paste-ready docs.

## The one-line philosophy

> **Dark page background + a single signature white block.**
> Marketing/nav/sidebar live in a near-black `.site` scope (`#020308`, Inter font, white text at opacities).
> All interactive tool UI lives inside **one always-white rounded-[36px] block** using a separate "solid" palette.

## What's inside

| File | Read it when you need… |
|------|------------------------|
| [`01-design-principles.md`](01-design-principles.md) | The philosophy, the two color scopes, aesthetic do/don't |
| [`02-design-tokens.md`](02-design-tokens.md) | The full `.site` CSS variable block (copy-paste) + hex tables |
| [`03-typography-and-fonts.md`](03-typography-and-fonts.md) | Inter font setup + the `siteText` type scale (verbatim) |
| [`04-layout-and-scopes.md`](04-layout-and-scopes.md) | `.site` wrapper, containers, white block, section head, spacing rhythm |
| [`05-component-library.md`](05-component-library.md) | Verbatim source of every atom (buttons, chips, ghost actions) + helpers |
| [`06-tool-design-language.md`](06-tool-design-language.md) | The tool page pattern (shell + header + body) + a build checklist |
| [`07-2fa-reference.md`](07-2fa-reference.md) | The full working 2FA tool (page + component + TOTP) + its copy |
| [`08-port-guide.md`](08-port-guide.md) | Step-by-step to stand this up in a fresh Next.js repo |

## Fastest path to port

1. Read `08-port-guide.md` → create the Next.js + Tailwind v4 project + deps.
2. Paste the token block from `02-design-tokens.md` into `globals.css`.
3. Set up Inter from `03-typography-and-fonts.md`; wrap the app in the `.site` layout (`04`).
4. Drop in the atoms from `05`, then the 2FA tool from `07`.
5. Verify against the checklist in `06`.

## Source provenance (original repo)

| Concept | Original file |
|---------|---------------|
| Tokens + `.site` scope | `app/src/app/globals.css` |
| Fonts | `app/src/fonts/index.ts` |
| Marketing layout (`.site` wrapper) | `app/src/app/(marketing)/layout.tsx` |
| Typography constants | `app/src/components/atoms/typography.ts` |
| Tool shell/header/body | `app/src/components/tools/{shell,header,body}.tsx` |
| Atoms | `app/src/components/atoms/*.tsx` |
| 2FA tool | `app/src/components/tools/two-fa.tsx` + `app/src/app/(marketing)/tools/(panel)/2fa/page.tsx` |

> ⚠️ Naming note: older code comments say scope `.goads` and prefix `Foreplay*`. The **current truth** is
> scope **`.site`** and **un-prefixed** components under `@/components/atoms` + `@/components/tools`.
> This bundle uses the current truth everywhere.
