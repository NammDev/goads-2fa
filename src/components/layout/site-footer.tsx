import { SectionContainer } from "@/components/atoms/section-container"
import { siteText } from "@/components/atoms/typography"
import { goadsUrl } from "@/data/site-links"

/** Slim single-row footer — fits the single-viewport shell. */
export function SiteFooter() {
  return (
    <footer className="shrink-0 border-t border-[#ffffff14] py-3.5">
      <SectionContainer variant="footer">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 max-md:justify-center">
          <span className={`${siteText.labelS} text-foreground`}>2FA.media</span>
          <p className={`${siteText.bodyXs} text-[var(--alpha-300)]`}>
            We never see your secrets — everything runs in your browser.
          </p>
          <p className={`${siteText.bodyXs} text-[var(--alpha-300)]`}>
            © {new Date().getFullYear()} · A free tool by{" "}
            <a
              href={goadsUrl("footer")}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
            >
              GOADS
            </a>
          </p>
        </div>
      </SectionContainer>
    </footer>
  )
}
