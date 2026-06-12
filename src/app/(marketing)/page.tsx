import { SectionContainer } from "@/components/atoms/section-container"
import { HeroSection } from "@/components/sections/hero-section"
import { ToolSection } from "@/components/sections/tool-section"
import { GoadsSideBanner } from "@/components/sections/goads-side-banner"
import { StructuredData } from "@/components/seo/structured-data"

/**
 * Single-viewport home: hero + tool centered, GOADS banners flanking on desktop.
 * Desktop never scrolls; below lg the page scrolls normally and side banners hide.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col justify-center py-6 max-lg:justify-start max-lg:overflow-y-auto max-lg:py-8">
      <StructuredData />
      <SectionContainer variant="wide">
        <div className="flex items-center justify-center gap-10 max-xl:gap-6">
          <GoadsSideBanner content="banner_left" className="max-lg:hidden" />
          <div className="flex w-full max-w-[720px] flex-col gap-6 max-md:gap-5">
            <HeroSection />
            <ToolSection />
          </div>
          <GoadsSideBanner content="banner_right" className="max-lg:hidden" />
        </div>
      </SectionContainer>
    </main>
  )
}
