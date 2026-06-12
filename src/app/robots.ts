import type { MetadataRoute } from "next";

/** Robots: allow all crawlers, reference sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://2fa.media/sitemap.xml",
  };
}
