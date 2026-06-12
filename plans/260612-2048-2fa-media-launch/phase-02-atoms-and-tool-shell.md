# Phase 02 — Component Atoms + Tool Shell

## Context links

- Atoms (verbatim source): `docs/2fa-media-design-system/05-component-library.md`
- Typography constants: `docs/2fa-media-design-system/03-typography-and-fonts.md`
- Containers / white block / section head: `docs/2fa-media-design-system/04-layout-and-scopes.md`
- Tool shell/header/body: `docs/2fa-media-design-system/06-tool-design-language.md`
- Depends on: [phase-01-project-scaffold.md](phase-01-project-scaffold.md)

## Overview

- **Date:** 2026-06-12
- **Description:** Port all design-system atoms, helpers, and the tool header/body components. Skip the registry sidebar entirely (single-tool launch) — tool will be centered on the homepage.
- **Priority:** P1
- **Implementation status:** completed
- **Review status:** completed

## Key Insights

- All atom code is **verbatim** in docs `03`/`04`/`05`/`06` — this is a transcription task, not design work. Do not "improve" the code.
- Inside the always-white block, `bg-background` resolves to near-black → `LightPrimaryButton` is intentionally a dark pill on white. Don't "fix" it.
- `ToolShell` + `ToolsSidebar` from `06` are NOT ported (no sidebar, no `/tools` routes, no shadcn Sheet/Collapsible). `ToolHeader` + `ToolBody` ARE ported — homepage composes them directly inside a centered container.
- `SectionWhiteBlock` is pinned white on purpose (a `dark:` override once broke 13 pages in the source repo).
- Only sanctioned raw hex: `#ffffff29` (header-icon ring / borders on dark).

## Requirements

**Functional:**
- All atoms compile and render per spec on a scratch test of the homepage.
- `CtaButton` renders `<a target=_blank rel=noopener>` for external `https://` hrefs (GOADS links).

**Non-functional:**
- Each file < 200 lines (all atoms are well under). Types strict, no `any`.

## Architecture

```
src/
├── lib/
│   ├── utils.ts                 # cn()
│   └── clipboard.ts             # copyToClipboard() w/ execCommand fallback
└── components/
    ├── atoms/
    │   ├── typography.ts        # siteText + SITE_HERO_GRADIENT
    │   ├── section-container.tsx
    │   ├── section-white-block.tsx
    │   ├── section-head.tsx
    │   ├── light-primary-button.tsx
    │   ├── light-ghost-action.tsx
    │   ├── code-chip.tsx
    │   └── cta-button.tsx
    └── tools/
        ├── tool-header.tsx      # icon + gradient title (06 `header.tsx`)
        └── tool-body.tsx        # white block wrapper (06 `body.tsx`)
```

(Names `tool-header.tsx`/`tool-body.tsx` instead of `header.tsx`/`body.tsx` for self-documenting greppability; exports stay `ToolHeader`/`ToolBody`.)

## Related code files

**Create:**
- `src/lib/utils.ts`, `src/lib/clipboard.ts`
- `src/components/atoms/typography.ts`
- `src/components/atoms/section-container.tsx`
- `src/components/atoms/section-white-block.tsx`
- `src/components/atoms/section-head.tsx`
- `src/components/atoms/light-primary-button.tsx`
- `src/components/atoms/light-ghost-action.tsx`
- `src/components/atoms/code-chip.tsx`
- `src/components/atoms/cta-button.tsx`
- `src/components/tools/tool-header.tsx`
- `src/components/tools/tool-body.tsx`

**Modify:** none. **Delete:** none.

## Implementation Steps

1. `src/lib/utils.ts` — `cn()` verbatim from `05`.
2. `src/lib/clipboard.ts` — `copyToClipboard()` verbatim from `05` (returns boolean; execCommand fallback for non-secure contexts).
3. `src/components/atoms/typography.ts` — `siteText` + `SITE_HERO_GRADIENT` verbatim from `03`.
4. `section-container.tsx`, `section-white-block.tsx`, `section-head.tsx` — verbatim from `04`.
5. `light-primary-button.tsx`, `light-ghost-action.tsx`, `code-chip.tsx`, `cta-button.tsx` — verbatim from `05`.
6. `tool-header.tsx`, `tool-body.tsx` — verbatim from `06` (`ToolHeader`, `ToolBody`); fix import paths only.
7. Smoke-render: temporarily compose on `(marketing)/page.tsx` — `ToolHeader` (any icon) + `ToolBody` with dummy text inside `SectionContainer variant="wide"` + `max-w-[960px] mx-auto`. Verify against `06` checklist items: gradient title on dark, white block white, paddings `p-8 max-md:p-5`.
8. `npx tsc --noEmit` + `npm run build` clean.

## Todo list

- [x] `lib/utils.ts` + `lib/clipboard.ts`
- [x] `atoms/typography.ts`
- [x] `atoms/section-container.tsx` / `section-white-block.tsx` / `section-head.tsx`
- [x] `atoms/light-primary-button.tsx` / `light-ghost-action.tsx` / `code-chip.tsx` / `cta-button.tsx`
- [x] `tools/tool-header.tsx` + `tools/tool-body.tsx`
- [x] Smoke render + visual check vs design docs
- [x] Build + typecheck clean

## Success Criteria

- Smoke page shows: dark scope, gradient `displayH4` tool title, white `rounded-[36px]` block with `p-2` frame, dark CTA pill hover `--solid-600`.
- All transitions match `02` table (cards 500ms long ease-out, buttons 150ms).

## Risk Assessment

- **Transcription drift** (wrong token, wrong radius) → diff each file against the doc source before marking done.
- **`next/link` import in `cta-button.tsx`** with external URLs → already handled via `isExternalUrl`; verify GOADS link renders `<a>` not `<Link>`.

## Security Considerations

- `rel="noopener noreferrer"` on all external links (built into `CtaButton`).
- Clipboard fallback uses deprecated `execCommand` only as graceful degradation — acceptable, no data exfiltration path.

## Next steps

- Phase 3: 2FA tool implementation consuming these atoms.
