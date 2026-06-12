# 07 — 2FA Tool Reference Implementation

The complete, working 2FA (TOTP) generator — the heart of `2fa.media`. Copy verbatim; it depends only on the
atoms in `05`, the tokens in `02`, and `copyToClipboard`.

## Copy / wording (keep these strings)

| Surface | Text |
|---------|------|
| Page `<title>` | `2FA Code Generator | GOADS Tools` → change brand to `2FA.media` |
| Meta description | `Generate TOTP two-factor authentication codes from your 2FA secrets. Browser-only, no signup, no server.` |
| Header title | `2FA Generator` |
| Textarea placeholder | `Paste secrets, one per line` |
| Primary button | `Generate` |
| Bulk actions | `Copy all` · `Copied` (flash) · `Export` |
| Per-code copy flash | `Copied` |

> Tone: terse, utilitarian, privacy-forward ("Browser-only, no signup, no server"). Keep that voice — it's the
> language of the GOADS 2FA route the user wants preserved.

## Page — `app/(marketing)/tools/(panel)/2fa/page.tsx`

```tsx
import type { Metadata } from "next"
import { ToolBody } from "@/components/tools/body"
import { ToolHeader } from "@/components/tools/header"
import { TwoFaTool } from "@/components/tools/two-fa"

export const metadata: Metadata = {
  title: "2FA Code Generator | 2FA.media",
  description:
    "Generate TOTP two-factor authentication codes from your 2FA secrets. Browser-only, no signup, no server.",
}

function ShieldCheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path d="M16 4.667 5.333 9.333v6.667c0 6.166 4.553 11.933 10.667 13.333 6.114-1.4 10.667-7.167 10.667-13.333V9.333L16 4.667Z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m12 16 3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function TwoFaPage() {
  return (
    <>
      <ToolHeader icon={<ShieldCheckIcon />} title="2FA Generator" />
      <ToolBody>
        <TwoFaTool />
      </ToolBody>
    </>
  )
}
```

## Component — `src/components/tools/two-fa.tsx`

```tsx
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowRight, Check, Copy, Download } from "lucide-react"

import { cn } from "@/lib/utils"
import { copyToClipboard } from "@/lib/clipboard"
import { siteText } from "@/components/atoms/typography"
import { LightPrimaryButton } from "@/components/atoms/light-primary-button"
import { LightGhostAction } from "@/components/atoms/light-ghost-action"
import { CodeChip } from "@/components/atoms/code-chip"

// ─── TOTP — RFC 6238 / RFC 4226 ───
async function generateTOTP(secret: string): Promise<string> {
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  const cleanSecret = secret.replace(/[\s=-]/g, "").toUpperCase()
  let bits = ""
  for (const c of cleanSecret) {
    const val = base32Chars.indexOf(c)
    if (val === -1) throw new Error("Invalid base32")
    bits += val.toString(2).padStart(5, "0")
  }
  const keyBytes = new Uint8Array(Math.floor(bits.length / 8))
  for (let i = 0; i < keyBytes.length; i++) {
    keyBytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2)
  }

  const epoch = Math.floor(Date.now() / 1000)
  const counter = Math.floor(epoch / 30)
  const counterBytes = new Uint8Array(8)
  let tmp = counter
  for (let i = 7; i >= 0; i--) {
    counterBytes[i] = tmp & 0xff
    tmp = Math.floor(tmp / 256)
  }

  const key = await crypto.subtle.importKey(
    "raw", keyBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"],
  )
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, counterBytes))

  const offset = sig[sig.length - 1] & 0x0f
  const code =
    ((sig[offset] & 0x7f) << 24) |
    ((sig[offset + 1] & 0xff) << 16) |
    ((sig[offset + 2] & 0xff) << 8) |
    (sig[offset + 3] & 0xff)

  return (code % 1000000).toString().padStart(6, "0")
}

function parseSecrets(input: string): string[] {
  const lines = input.split("\n").filter((l) => l.trim())
  const secrets = new Set<string>()
  for (const line of lines) {
    const parts = line.split("|")
    for (const part of parts) {
      const clean = part.trim().replace(/[\s=-]/g, "").toUpperCase()
      if (/^[A-Z2-7]{16,}$/.test(clean)) { secrets.add(clean); break }
    }
  }
  return Array.from(secrets)
}

type CodeEntry = { secret: string; code: string }

const formatCode = (code: string) =>
  code.length === 6 ? `${code.slice(0, 3)} ${code.slice(3)}` : code

// ─── Component ───
export function TwoFaTool() {
  const [input, setInput] = useState("")
  const [entries, setEntries] = useState<CodeEntry[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const generate = useCallback(async () => {
    const secrets = parseSecrets(input)
    const results: CodeEntry[] = []
    for (const secret of secrets) {
      try { results.push({ secret, code: await generateTOTP(secret) }) }
      catch { results.push({ secret, code: "ERROR" }) }
    }
    setEntries(results)
  }, [input])

  useEffect(() => {
    if (entries.length === 0) return
    const tick = () => {
      const remaining = 30 - (Math.floor(Date.now() / 1000) % 30)
      setTimeLeft(remaining)
      if (remaining === 30) generate()
    }
    tick()
    intervalRef.current = setInterval(tick, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [entries.length, generate])

  const flashCopied = (id: string) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1400)
  }
  const copyCode = async (entry: CodeEntry) => {
    if (await copyToClipboard(entry.code)) flashCopied(entry.secret)
  }
  const copyAll = async () => {
    if (await copyToClipboard(entries.map((e) => e.code).join("\n"))) flashCopied("__all")
  }
  const exportTxt = () => {
    const text = entries.map((e) => `${e.secret}|${e.code}`).join("\n")
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `2fa-codes-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const hasResults = entries.length > 0

  return (
    <>
      {/* Input card */}
      <div className={cn(
        "flex flex-col rounded-[16px] border border-[var(--solid-50)] bg-white p-2",
        "transition-colors duration-[500ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
        "focus-within:border-[var(--solid-400)]",
      )}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste secrets, one per line"
          rows={5}
          spellCheck={false}
          className={cn(
            siteText.bodyM,
            "w-full resize-none bg-transparent px-4 py-3 font-mono text-[var(--solid-700)] outline-none",
            "placeholder:font-sans placeholder:tracking-[-0.01125em] placeholder:text-[var(--solid-400)]",
          )}
        />
        <div className="flex justify-end p-1">
          <LightPrimaryButton onClick={generate} disabled={!input.trim()}
            icon={<ArrowRight className="size-4" />}>
            Generate
          </LightPrimaryButton>
        </div>
      </div>

      {/* Results */}
      {hasResults && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-end">
            <CountdownRing seconds={timeLeft} />
          </div>

          {entries.map((entry) => (
            <CodeCard key={entry.secret} entry={entry}
              copied={copiedId === entry.secret}
              onCopy={() => { void copyCode(entry) }} />
          ))}

          <div className="flex items-center gap-2 pt-1">
            <LightGhostAction onClick={() => { void copyAll() }}
              icon={<Copy className="size-3.5" />}
              label={copiedId === "__all" ? "Copied" : "Copy all"} />
            <LightGhostAction onClick={exportTxt}
              icon={<Download className="size-3.5" />} label="Export" />
          </div>
        </div>
      )}
    </>
  )
}

// ─── CodeCard ───
function CodeCard({ entry, copied, onCopy }: {
  entry: CodeEntry; copied: boolean; onCopy: () => void
}) {
  return (
    <button type="button" onClick={onCopy} aria-label={`Copy ${entry.code}`}
      className={cn(
        "group flex w-full cursor-pointer items-center justify-between gap-4 rounded-[16px] border border-[var(--solid-50)] bg-[var(--solid-25)] px-5 py-4 text-left max-md:px-4",
        "transition-all duration-[500ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
        "hover:border-[var(--solid-400)]",
        copied && "border-[var(--solid-700)]",
      )}>
      <CodeChip text={entry.secret} />
      <div className="flex shrink-0 items-center gap-3">
        <span className={cn(
          "font-display text-[2.25rem] font-semibold leading-none tracking-[0.04em] text-[var(--solid-900)] [font-optical-sizing:auto] [font-variant-numeric:tabular-nums]",
          "max-md:text-[1.75rem]",
        )}>
          {formatCode(entry.code)}
        </span>
        <span className="flex w-[78px] shrink-0 items-center justify-end">
          {copied ? (
            <span className="flex animate-in items-center gap-1 fade-in zoom-in-95 text-[var(--solid-900)] duration-200">
              <Check className="size-4" />
              <span className={cn(siteText.labelS, "font-medium")}>Copied</span>
            </span>
          ) : (
            <Copy className={cn("size-3.5 text-[var(--solid-400)] transition-colors duration-200",
              "group-hover:text-[var(--solid-900)]")} />
          )}
        </span>
      </div>
    </button>
  )
}

// ─── CountdownRing (30s TOTP window) ───
function CountdownRing({ seconds }: { seconds: number }) {
  const r = 13
  const c = 2 * Math.PI * r
  const offset = c - (seconds / 30) * c
  return (
    <span className="relative flex size-9 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--solid-50)" strokeWidth="2" />
        <circle cx="18" cy="18" r={r} fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          className="text-[var(--solid-700)] transition-[stroke-dashoffset] duration-1000 ease-linear" />
      </svg>
      <span className={cn(siteText.labelS,
        "relative text-[var(--solid-700)] [font-variant-numeric:tabular-nums]")}>
        {seconds}
      </span>
    </span>
  )
}
```

## Behavior notes

- **Browser-only / no server.** TOTP computed client-side via Web Crypto (`crypto.subtle`). No secret ever
  leaves the page. This is both the privacy promise *and* the copy ("no signup, no server").
- **Auto-refresh.** A 1s interval recomputes every code when the 30s window rolls over; the ring animates the
  remaining seconds.
- **Bulk paste.** `parseSecrets` accepts one secret per line and also pipe-separated rows
  (`label|SECRET|...`), extracting the first valid base32 (`^[A-Z2-7]{16,}$`) per line.
- **Inline copy feedback.** Clicking a card copies that code; the `Copied` flash is fixed-width (`w-[78px]`)
  so the row never shifts. `Copy all` / `Export .txt` for the whole batch.
- **`animate-in fade-in zoom-in-95`** comes from `tailwindcss-animate` / `tw-animate-css` — include it
  (see `08`).
