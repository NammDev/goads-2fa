"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"

/** html.dark is the source of truth — observe it so any change re-renders the toggle. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}

/** Light/dark switch — toggles `html.dark`, persists to localStorage (light = default). */
export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false, // server snapshot: light default
  )

  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle("dark", next)
    try { localStorage.setItem("theme", next ? "dark" : "light") } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex size-9 cursor-pointer items-center justify-center rounded-[10px] border border-[var(--alpha-700)] text-[var(--alpha-100)] transition-colors duration-150 hover:border-[var(--alpha-500)] hover:text-foreground"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}
