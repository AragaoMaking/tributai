import type { Metadata } from "next";
import { HomeImmersive } from "@/components/marketing/home-variants";

export const metadata: Metadata = {
  title: "Variação 1 — Imersiva",
  description: "Explore a proposta imersiva de página inicial do TributAI.",
  robots: { index: false, follow: true },
};

export default function HomeOnePage() {
  return <HomeImmersive />;
}
