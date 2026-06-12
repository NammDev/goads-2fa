import { SectionContainer } from "@/components/atoms/section-container"
import { SectionHead } from "@/components/atoms/section-head"

/** Compact hero — keeps the tool near the fold on desktop. */
export function HeroSection() {
  return (
    <section className="pt-16 pb-4 max-md:pt-10">
      <SectionContainer variant="section">
        <SectionHead
          titleTag="h1"
          titleSize="h2"
          size="large"
          subtitle="FREE 2FA CODE GENERATOR"
          title="Get your 2FA codes. Right in your browser."
          description="Paste your 2FA secret key and get the 6-digit code instantly. No signup, no server, no tracking of your secrets — everything runs locally in your browser."
        />
      </SectionContainer>
    </section>
  )
}
