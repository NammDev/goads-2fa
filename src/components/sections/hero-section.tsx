import { SectionHead } from "@/components/atoms/section-head"

/** Compact hero — sized to share one viewport with the tool block. */
export function HeroSection() {
  return (
    <SectionHead
      titleTag="h1"
      titleSize="h3"
      title="Get your 2FA codes. Right in your browser."
      description="Free 2FA code generator. Paste your secret key, get the 6-digit code instantly. No signup, secrets never leave your browser."
    />
  )
}
