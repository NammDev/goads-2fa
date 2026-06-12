import { ToolHeader } from "@/components/tools/tool-header"
import { ToolBody } from "@/components/tools/tool-body"
import { TwoFaTool } from "@/components/tools/two-fa-tool"
import { GoadsPromoStrip } from "@/components/sections/goads-promo-strip"

function ShieldCheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 4.667 5.333 9.333v6.667c0 6.166 4.553 11.933 10.667 13.333 6.114-1.4 10.667-7.167 10.667-13.333V9.333L16 4.667Z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="m12 16 3 3 6-6"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

/** Tool block: header + white body + GOADS strip. Parent owns width/placement. */
export function ToolSection() {
  return (
    <div className="flex flex-col gap-5 max-md:gap-4">
      <ToolHeader icon={<ShieldCheckIcon />} title="2FA Generator" />
      <ToolBody>
        <TwoFaTool />
      </ToolBody>
      <GoadsPromoStrip />
    </div>
  )
}
