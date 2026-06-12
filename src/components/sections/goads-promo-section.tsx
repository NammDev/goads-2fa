import Image from "next/image"

import { SectionContainer } from "@/components/atoms/section-container"
import { SectionHead } from "@/components/atoms/section-head"
import { CtaButton } from "@/components/atoms/cta-button"
import { siteText } from "@/components/atoms/typography"
import { goadsUrl } from "@/data/site-links"

/**
 * Integrated GOADS promo panel — two-column accent-tint card:
 * copy + CTA on the left, generated dashboard artwork on the right.
 * Top padding kept tight so the panel surfaces close to the tool block.
 */
export function GoadsPromoSection() {
  return (
    <section className="pb-24 pt-14 max-md:pb-20 max-md:pt-10">
      <SectionContainer variant="section">
        <div className="overflow-hidden rounded-[36px] border border-[#ffffff29] bg-[var(--accent-soft)] max-md:rounded-[16px]">
          <div className="grid grid-cols-[1.05fr_0.95fr] items-stretch max-md:grid-cols-1">
            {/* Copy column */}
            <div className="flex flex-col justify-center gap-8 py-16 pl-12 pr-8 max-md:px-5 max-md:pb-4 max-md:pt-10">
              <SectionHead
                subtitle="BUILT BY GOADS"
                title="Running ads at scale? Meet GOADS."
                description="2FA.media is a free tool from GOADS — the agency ad account partner for performance marketers. Premium Facebook & Google agency accounts, fast top-ups, and real human support that keeps your campaigns live."
                titleTag="h2"
                titleSize="h3"
                align="left"
              />
              <div className="flex flex-col items-start gap-3">
                <CtaButton href={goadsUrl("promo")} variant="hero">
                  Explore GOADS Agency
                </CtaButton>
                <p className={`${siteText.bodyS} text-[var(--alpha-200)]`}>
                  Trusted by media buyers worldwide.
                </p>
              </div>
            </div>

            {/* Visual column — artwork fades into the panel tint */}
            <div className="relative min-h-[420px] max-md:min-h-[260px]">
              <Image
                src="/images/goads-promo.png"
                alt="Glass dashboard cards with rising ad performance charts"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover object-center"
              />
              {/* Blend artwork edge into panel background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-soft)] via-transparent to-transparent max-md:bg-gradient-to-b" />
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}
