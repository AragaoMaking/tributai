import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return [];

  const baseUrl = new URL(siteUrl);
  return [
    {
      url: baseUrl.toString(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
