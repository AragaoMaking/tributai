import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/site";

const legalLinks = [
  { href: "/privacidade", label: "Privacidade" },
  { href: "/termos", label: "Termos de uso" },
  { href: "/cookies", label: "Cookies" },
  { href: "/lgpd", label: "Direitos sobre dados" },
];

export function LegalLayout({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--foreground)] sm:px-6 sm:py-12"
    >
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Tribut<span className="text-[var(--green)]">AI</span>
          </Link>
          <nav aria-label="Documentos e direitos" className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-[var(--blue)] underline decoration-transparent underline-offset-4 hover:decoration-current">
                {link.label}
              </Link>
            ))}
          </nav>
        </header>

        <article className="py-9 sm:py-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--muted)]">{summary}</p>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            Última atualização: 26/11/2026. Responsável informado: Miguel Dos Santos Aragão.
            Contato:{" "}
            <a className="font-semibold text-[var(--blue)] underline" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
          </p>
          <div className="legal-content mt-9 space-y-8">{children}</div>
        </article>

        <footer className="border-t border-[var(--border)] py-6 text-sm leading-6 text-[var(--muted)]">
          CNPJ e endereço comercial não foram informados para publicação e permanecem pendentes.
          Estas informações não substituem revisão jurídica.
        </footer>
      </div>
    </main>
  );
}
