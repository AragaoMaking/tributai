import type { Metadata } from "next";
import { DM_Sans, Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import CookieNotice from "@/components/cookie-notice";
import SupportAgent from "@/components/support-agent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const marketingBodyFont = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const displayFont = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: "TributAI | Gestão tributária em um só lugar",
    template: "%s | TributAI",
  },
  description:
    "Organize clientes e acompanhe informações tributárias do seu escritório em um único lugar.",
  applicationName: "TributAI",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "TributAI",
    title: "TributAI | Gestão tributária em um só lugar",
    description:
      "Organize clientes e acompanhe informações tributárias do seu escritório em um único lugar.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${marketingBodyFont.variable} ${displayFont.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
        {children}
        <CookieNotice />
        <SupportAgent />
      </body>
    </html>
  );
}
