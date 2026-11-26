import Link from "next/link";
import MarketingShell from "@/components/marketing/marketing-shell";

const layouts = [
  {
    href: "/home-1",
    number: "01",
    title: "Imersiva",
    description: "Hero em tela ampla, tipografia expressiva e uma demonstração de produto em primeiro plano.",
    className: "layout-preview-immersive",
  },
  {
    href: "/home-2",
    number: "02",
    title: "Storytelling",
    description: "Uma narrativa em etapas, com revelações suaves durante a rolagem.",
    className: "layout-preview-story",
  },
  {
    href: "/home-3",
    number: "03",
    title: "Bento interativo",
    description: "Recursos em uma composição assimétrica, com foco em leitura rápida e conversão.",
    className: "layout-preview-bento",
  },
];

export default function LayoutChooser() {
  return (
    <MarketingShell footerNote="Estas são propostas para comparação; a página inicial oficial permanece inalterada.">
      <main id="main-content" className="layout-chooser marketing-container">
        <header className="layout-chooser-heading">
          <span className="marketing-eyebrow">Escolha a direção visual</span>
          <h1 className="marketing-heading">Três caminhos.<br /><span>Uma identidade.</span></h1>
          <p className="marketing-copy">
            Compare as propostas do TributAI antes de escolher qual será a página inicial oficial.
            Cada opção mantém a mesma identidade, acessibilidade e conteúdo verificável.
          </p>
        </header>
        <div className="layout-option-grid">
          {layouts.map((layout) => (
            <article key={layout.number} className="layout-option">
              <Link href={layout.href} className={`layout-preview ${layout.className}`} aria-label={`Visualizar variação ${layout.number}: ${layout.title}`}>
                <span className="layout-preview-label">VARIAÇÃO {layout.number}</span>
                <span className="layout-preview-art" aria-hidden="true">
                  <i /><i /><i /><b />
                </span>
                <span className="layout-preview-footer"><b>TributAI</b><i>Prévia</i></span>
              </Link>
              <div className="layout-option-copy">
                <div>
                  <span className="layout-option-number">{layout.number}</span>
                  <h2>{layout.title}</h2>
                </div>
                <p>{layout.description}</p>
                <Link href={layout.href} className="marketing-text-link">Explorar esta opção <span aria-hidden="true">↗</span></Link>
              </div>
            </article>
          ))}
        </div>
        <div className="layout-chooser-bottom">
          <p>A home atual continua em <code>/</code> enquanto você compara.</p>
          <Link href="/institucional" className="marketing-button marketing-button-dark">Ver página institucional</Link>
        </div>
      </main>
    </MarketingShell>
  );
}
