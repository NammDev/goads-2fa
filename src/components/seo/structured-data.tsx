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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [webApplicationSchema],
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
