import type { Metadata } from "next";
import InstitutionalPage from "@/components/marketing/institutional-page";

export const metadata: Metadata = {
  title: "Sobre o TributAI",
  description: "Conheça a proposta, os recursos e os limites atuais do TributAI.",
};

export default function InstitutionalRoute() {
  return <InstitutionalPage />;
}
