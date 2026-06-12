import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { siteText } from "@/components/atoms/typography"

interface LightPrimaryButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode
  icon?: ReactNode   // optional right-side icon
}

export function LightPrimaryButton({
  children, icon, className, type = "button", ...rest
}: LightPrimaryButtonProps) {
  return (
    <button
      type={type}
      {...rest}
      className={cn(
        "relative z-[5] flex cursor-pointer items-center rounded-[10px] bg-background p-2 text-foreground no-underline",
        "transition-all duration-150",
        "hover:bg-[var(--solid-600)] active:bg-[var(--solid-400)]",
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-background",
        className,
      )}
    >
      <span className={cn(siteText.headingM, "relative z-[2] px-1.5")}>{children}</span>
      {icon && <span className="relative z-[2] -ml-1 flex opacity-[0.68]">{icon}</span>}
    </button>
  )
}
