import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { siteText } from "@/components/atoms/typography"

interface LightGhostActionProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: ReactNode
  label: string
}

export function LightGhostAction({ icon, label, className, type = "button", ...rest }: LightGhostActionProps) {
  return (
    <button
      type={type}
      {...rest}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-[10px] px-3 py-2 text-[var(--solid-500)] no-underline",
        "transition-colors duration-150",
        "hover:bg-[var(--solid-25)] hover:text-[var(--solid-900)]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
    >
      {icon}
      <span className={siteText.labelS}>{label}</span>
    </button>
  )
}
