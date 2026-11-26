import type { Metadata } from "next";
import { HomeStory } from "@/components/marketing/home-variants";

export const metadata: Metadata = {
  title: "Variação 2 — Storytelling",
  description: "Explore a proposta narrativa de página inicial do TributAI.",
  robots: { index: false, follow: true },
};

export default function HomeTwoPage() {
  return <HomeStory />;
}
