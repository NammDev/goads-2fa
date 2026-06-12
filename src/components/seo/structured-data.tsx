import { FAQ_ITEMS } from "@/data/faq-content";

const SITE_URL = "https://2fa.media";

/** WebApplication JSON-LD schema for 2FA.media. */
const webApplicationSchema = {
  "@type": "WebApplication",
  name: "2FA.media — 2FA Code Generator",
  url: SITE_URL,
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "GOADS",
    url: "https://goadsagency.com",
  },
};

/** FAQPage JSON-LD schema generated from the single-source faq-content.ts array. */
const faqPageSchema = {
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [webApplicationSchema, faqPageSchema],
};

/**
 * Server component — injects JSON-LD structured data into the page.
 * Uses a static typed object with JSON.stringify — no user input, safe for dangerouslySetInnerHTML.
 */
export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // Escape "</" so content can never close the script tag early (defense-in-depth)
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/<\//g, "<\\/") }}
    />
  );
}
