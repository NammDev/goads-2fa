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
          rows={5}
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

      {/* Results */}
      {hasResults && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-end">
            <CountdownRing seconds={timeLeft} />
          </div>

          {entries.map((entry) => (
            <CodeCard
              key={entry.secret}
              entry={entry}
              copied={copiedId === entry.secret}
              onCopy={() => { void copyCode(entry) }}
            />
          ))}

          <div className="flex items-center gap-2 pt-1">
            <LightGhostAction
              onClick={() => { void copyAll() }}
              icon={<Copy className="size-3.5" />}
              label={copiedId === "__all" ? "Copied" : "Copy all"}
            />
            <LightGhostAction
              onClick={exportTxt}
              icon={<Download className="size-3.5" />}
              label="Export"
            />
          </div>
          <p className={cn(siteText.labelS, "text-[var(--solid-400)]")}>
            Export saves secret|code pairs to a local .txt file — it contains your raw secrets, store it safely.
          </p>
        </div>
      )}
    </>
  )
}
