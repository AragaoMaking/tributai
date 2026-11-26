import type { Metadata } from "next";
import { HomeImmersive } from "@/components/marketing/home-variants";

export const metadata: Metadata = {
  title: "Gestão tributária clara para escritórios",
  description:
    "Organize empresas, acompanhe pendências e prepare simulações em um espaço feito para a rotina contábil.",
};

export default function Home() {
  return <HomeImmersive />;
}
