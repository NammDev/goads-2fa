import { SectionContainer } from "@/components/atoms/section-container"
import { siteText } from "@/components/atoms/typography"
import { goadsUrl } from "@/data/site-links"

/** Site footer: wordmark, tagline, GOADS link, privacy note, copyright. */
export function SiteFooter() {
  return (
    <footer className="border-t border-[#ffffff29] py-12">
      <SectionContainer variant="footer">
        <div className="flex flex-col gap-3">
          <span className={`${siteText.headingL} text-foreground`}>2FA.media</span>
          <p className={`${siteText.bodyS} text-[var(--alpha-300)]`}>
            Free browser-only 2FA codes.{" "}
            A free tool by{" "}
            <a
              href={goadsUrl("footer")}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
            >
              GOADS
            </a>
            .
          </p>
          <p className={`${siteText.bodyS} text-[var(--alpha-200)]`}>
            We never see your secrets — everything runs in your browser.
          </p>
          <p className={`${siteText.bodyXs} text-[var(--alpha-300)] mt-4`}>
            © {new Date().getFullYear()} 2FA.media
          </p>
        </div>
      </SectionContainer>
    </footer>
  )
}
