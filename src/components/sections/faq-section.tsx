import { SectionContainer } from "@/components/atoms/section-container"
import { SectionHead } from "@/components/atoms/section-head"
import { siteText } from "@/components/atoms/typography"
import { goadsUrl } from "@/data/site-links"
import { FAQ_ITEMS } from "@/data/faq-content"

/**
 * FAQ accordion — native <details>/<summary>, zero JS.
 * Content crawlable in page source (SSR). First item open by default.
 * Last item answer contains a GOADS link (utm_content=faq).
 */
export function FaqSection() {
  return (
    <section className="py-[108px] max-md:py-24 max-sm:py-20">
      <SectionContainer variant="section">
        <div className="flex flex-col gap-10">
          <SectionHead
            titleTag="h2"
            titleSize="h2"
            title="Frequently asked questions"
          />
          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-3">
            {FAQ_ITEMS.map((item, i) => {
              const isLast = i === FAQ_ITEMS.length - 1
              return (
                <details
                  key={item.question}
                  open={i === 0}
                  className="group rounded-[16px] border border-[#ffffff29] bg-[var(--alpha-900)]"
                >
                  <summary className={`
                    flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4
                    [&::-webkit-details-marker]:hidden
                  `}>
                    <span className={`${siteText.headingM} text-foreground`}>
                      {item.question}
                    </span>
                    {/* ChevronDown rotates when open */}
                    <svg
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      className="shrink-0 text-[var(--alpha-300)] transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    >
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <div className={`${siteText.bodyM} px-5 pb-5 text-[var(--alpha-100)]`}>
                    {isLast ? (
                      <p>
                        2FA.media is a free tool built by{" "}
                        <a
                          href={goadsUrl("faq")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
                        >
                          GOADS
                        </a>
                        {" "}— the agency ad account partner for performance marketers. GOADS provides premium
                        Facebook and Google agency ad accounts, fast top-ups, and real human support to keep
                        campaigns running. This tool is our contribution to the marketing community.
                      </p>
                    ) : (
                      <p>{item.answer}</p>
                    )}
                  </div>
                </details>
              )
            })}
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}
