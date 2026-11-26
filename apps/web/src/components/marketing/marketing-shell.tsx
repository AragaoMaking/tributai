import Link from "next/link";

const navigation = [
  { href: "/home-1", label: "Imersiva" },
  { href: "/home-2", label: "Storytelling" },
  { href: "/home-3", label: "Bento" },
  { href: "/institucional", label: "Institucional" },
];

function Brand() {
  return (
    <Link href="/" className="marketing-brand" aria-label="TributAI, página inicial">
      <span className="marketing-brand-mark" aria-hidden="true">
        T<span>A</span>
      </span>
      <span className="marketing-brand-name">Tribut<span>AI</span></span>
    </Link>
  );
}

export function MarketingHeader() {
  return (
    <header className="marketing-header">
      <div className="marketing-container marketing-header-inner">
        <Brand />
        <nav className="marketing-desktop-nav" aria-label="Navegação principal">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="marketing-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="marketing-header-actions">
          <Link href="/login" className="marketing-login-link">Entrar</Link>
          <Link href="/cadastro" className="marketing-button marketing-button-dark marketing-header-cta">
            Começar teste
          </Link>
          <details className="marketing-mobile-menu">
            <summary aria-label="Abrir navegação" className="marketing-menu-trigger">
              <span>Menu</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <nav aria-label="Navegação móvel" className="marketing-menu-panel">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="marketing-menu-link">
                  {item.label}
                </Link>
              ))}
              <Link href="/login" className="marketing-menu-link">Entrar</Link>
              <Link href="/cadastro" className="marketing-menu-cta">Começar teste</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export default function MarketingShell({
  children,
  footerNote = "Organize a rotina. Mantenha as decisões com quem entende.",
}: {
  children: React.ReactNode;
  footerNote?: string;
}) {
  return (
    <div className="marketing-page">
      <MarketingHeader />
      {children}
      <footer className="marketing-footer">
        <div className="marketing-container marketing-footer-inner">
          <Brand />
          <p>{footerNote}</p>
          <nav aria-label="Informações legais">
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/termos">Termos</Link>
            <Link href="/cookies">Cookies</Link>
            <Link href="/lgpd">Dados pessoais</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
