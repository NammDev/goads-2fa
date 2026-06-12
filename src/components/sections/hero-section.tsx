import { SectionHead } from "@/components/atoms/section-head"

/** Compact hero — sized to share one viewport with the tool block. */
export function HeroSection() {
  return (
    <SectionHead
      titleTag="h1"
      titleSize="h3"
      subtitle="FREE 2FA CODE GENERATOR"
      title="Get your 2FA codes. Right in your browser."
      description="Paste your 2FA secret key and get the 6-digit code instantly. No signup, no server — secrets never leave your browser."
    />
  )
}
