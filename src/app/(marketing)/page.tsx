import { SectionContainer } from "@/components/atoms/section-container"
import { HeroSection } from "@/components/sections/hero-section"
import { ToolSection } from "@/components/sections/tool-section"
import { GoadsSideBanner } from "@/components/sections/goads-side-banner"
import { GoadsBottomBanner } from "@/components/sections/goads-bottom-banner"
import { StructuredData } from "@/components/seo/structured-data"

/**
 * Single-viewport home, content anchored to the top (not vertically centered):
 * vertical GOADS banner on the left (desktop), horizontal banner under the tool.
 * Desktop never scrolls; below lg the page scrolls and the side banner hides.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col pb-3 pt-8 max-md:pt-5 max-lg:overflow-y-auto">
      <StructuredData />
      <SectionContainer variant="wide">
        <div className="flex items-start justify-center gap-10 max-xl:gap-6">
          <GoadsSideBanner content="banner_left" className="max-lg:hidden" />
          <div className="flex w-full max-w-[720px] flex-col gap-4">
            <HeroSection />
            <ToolSection />
            <GoadsBottomBanner />
          </div>
        </div>
      </SectionContainer>
    </main>
  )
}
