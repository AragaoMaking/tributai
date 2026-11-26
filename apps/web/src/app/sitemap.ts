import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return [];

  const baseUrl = new URL(siteUrl);
  const updatedAt = new Date("2026-11-26T00:00:00.000Z");
  return [
    {
      url: baseUrl.toString(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...["institucional", "privacidade", "termos", "cookies", "lgpd"].map((path) => ({
      url: new URL(`/${path}`, baseUrl).toString(),
      lastModified: updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
