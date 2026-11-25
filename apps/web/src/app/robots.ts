import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const sitemap = siteUrl ? new URL("/sitemap.xml", siteUrl).toString() : undefined;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/visao-geral",
        "/clientes",
        "/simulador",
        "/comparador",
        "/reforma",
        "/relatorios",
        "/alertas",
        "/assistente",
        "/equipe",
        "/assinatura",
        "/configuracoes",
        "/assinar",
      ],
    },
    sitemap,
  };
}
