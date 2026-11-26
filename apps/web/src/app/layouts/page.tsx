import type { Metadata } from "next";
import LayoutChooser from "@/components/marketing/layout-chooser";

export const metadata: Metadata = {
  title: "Comparar layouts",
  description: "Compare as três propostas de página inicial do TributAI.",
  robots: { index: false, follow: true },
};

export default function LayoutsPage() {
  return <LayoutChooser />;
}
