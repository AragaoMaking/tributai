import type { Metadata } from "next";
import { HomeBento } from "@/components/marketing/home-variants";

export const metadata: Metadata = {
  title: "Variação 3 — Bento",
  description: "Explore a proposta em grade interativa de página inicial do TributAI.",
  robots: { index: false, follow: true },
};

export default function HomeThreePage() {
  return <HomeBento />;
}
