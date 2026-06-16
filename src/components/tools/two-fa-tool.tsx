"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowRight, Copy, Download } from "lucide-react"

import { cn } from "@/lib/utils"
import { copyToClipboard } from "@/lib/clipboard"
import { generateTOTP, parseSecrets, type CodeEntry } from "@/lib/totp"
import { siteText } from "@/components/atoms/typography"
import { LightPrimaryButton } from "@/components/atoms/light-primary-button"
import { LightGhostAction } from "@/components/atoms/light-ghost-action"
import { CodeCard } from "@/components/tools/two-fa-code-card"
import { CountdownRing } from "@/components/tools/two-fa-countdown-ring"

export function TwoFaTool() {
  const [input, setInput] = useState("")
  const [entries, setEntries] = useState<CodeEntry[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  // Secrets currently on screen — the refresh tick reads from here, NOT from the
  // textarea, so typing a new input never silently changes displayed results.
  const secretsRef = useRef<string[]>([])

  const regenerateCodes = useCallback(async (secrets: string[]) => {
    const results: CodeEntry[] = []
    for (const secret of secrets) {
      try { results.push({ secret, code: await generateTOTP(secret) }) }
      catch { results.push({ secret, code: "ERROR" }) }
    }
    secretsRef.current = secrets
    setEntries(results)
  }, [])

  const generate = useCallback(() => {
    void regenerateCodes(parseSecrets(input))
  }, [input, regenerateCodes])

  useEffect(() => {
    if (entries.length === 0) return
    const tick = () => {
      const remaining = 30 - (Math.floor(Date.now() / 1000) % 30)
      setTimeLeft(remaining)
      if (remaining === 30) void regenerateCodes(secretsRef.current)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [entries.length, regenerateCodes])

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
          rows={2}
          spellCheck={false}
          className={cn(
            siteText.bodyM,
            "w-full resize-none bg-transparent px-4 py-3 font-mono text-[var(--solid-700)] outline-none",
            "placeholder:font-sans placeholder:tracking-[-0.01125em] placeholder:text-[var(--solid-400)]",
          )}
        />
        <div className="flex justify-end p-1">
          <LightPrimaryButton
            onClick={generate}
            disabled={!input.trim()}
            icon={<ArrowRight className="size-4" />}
          >
            Generate
          </LightPrimaryButton>
        </div>
      </div>

      {/* Results — always shown on desktop (placeholder teaches the flow); on mobile the
          empty state is hidden so the banner stays visible until the user generates. */}
      <div className={cn("flex flex-col gap-3", !hasResults && "max-md:hidden")}>
        {hasResults ? (
          /* Internal scroll keeps the page itself at one viewport even with many secrets */
          <div className="flex max-h-[176px] flex-col gap-3 overflow-y-auto pr-0.5 [color-scheme:light]">
            {entries.map((entry) => (
              <CodeCard
                key={entry.secret}
                entry={entry}
                copied={copiedId === entry.secret}
                onCopy={() => { void copyCode(entry) }}
              />
            ))}
          </div>
        ) : (
          /* Placeholder row mirrors CodeCard metrics exactly (px-5 py-4, 2.25rem code) */
          <div
            aria-hidden
            className="flex w-full items-center justify-between gap-4 rounded-[16px] border border-dashed border-[var(--solid-100)] bg-[var(--solid-25)] px-5 py-4 max-md:px-4"
          >
            <span className={cn(siteText.labelS, "text-[var(--solid-300)]")}>
              Your 6-digit code appears here
            </span>
            <div className="flex shrink-0 items-center gap-3">
              <span className={cn(
                "font-display text-[2.25rem] font-semibold leading-none tracking-[0.04em] text-[var(--solid-100)] [font-variant-numeric:tabular-nums]",
                "max-md:text-[1.75rem]",
              )}>
                ••• •••
              </span>
              <span className="w-[78px] shrink-0" />
            </div>
          </div>
        )}

        {/* Actions left, countdown right — single row keeps the block compact */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <LightGhostAction
              onClick={() => { void copyAll() }}
              disabled={!hasResults}
              icon={<Copy className="size-3.5" />}
              label={copiedId === "__all" ? "Copied" : "Copy all"}
            />
            <LightGhostAction
              onClick={exportTxt}
              disabled={!hasResults}
              icon={<Download className="size-3.5" />}
              label="Export"
            />
          </div>
          <div className={cn("pr-1", !hasResults && "opacity-35")}>
            <CountdownRing seconds={hasResults ? timeLeft : 30} />
          </div>
        </div>
        <p className={cn(siteText.labelS, "text-[var(--solid-400)]")}>
          Export saves secret|code pairs to a local .txt file — it contains your raw secrets, store it safely.
        </p>
      </div>
    </>
  )
}
