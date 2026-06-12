import type { MetadataRoute } from "next";

/** Single-URL sitemap for 2fa.media. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://2fa.media/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
