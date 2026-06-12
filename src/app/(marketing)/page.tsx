import { HeroSection } from "@/components/sections/hero-section"
import { ToolSection } from "@/components/sections/tool-section"
import { GoadsPromoSection } from "@/components/sections/goads-promo-section"
import { FaqSection } from "@/components/sections/faq-section"
import { StructuredData } from "@/components/seo/structured-data"

export default function HomePage() {
  return (
    <main>
      <StructuredData />
      <HeroSection />
      <ToolSection />
      <GoadsPromoSection />
      <FaqSection />
    </main>
  )
}
