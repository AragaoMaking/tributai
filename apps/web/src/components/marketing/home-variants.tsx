import Link from "next/link";
import MarketingShell from "@/components/marketing/marketing-shell";
import ScrollReveal from "@/components/marketing/scroll-reveal";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function DemoWorkspace({ dark = false }: { dark?: boolean }) {
  return (
    <div
      role="img"
      aria-label="Demonstração ilustrativa do painel TributAI, sem dados reais"
      className={`demo-workspace${dark ? " demo-workspace-dark" : ""}`}
    >
      <div className="demo-workspace-top">
        <span className="demo-window-dots" aria-hidden="true"><i /><i /><i /></span>
        <span>ESPAÇO DO ESCRITÓRIO</span>
        <span className="demo-status">TESTE</span>
      </div>
      <div className="demo-workspace-heading">
        <div>
          <span className="demo-overline">VISÃO GERAL</span>
          <h2>Um lugar para organizar o próximo passo.</h2>
        </div>
        <span className="demo-workspace-symbol" aria-hidden="true">T<span>A</span></span>
      </div>
      <div className="demo-workspace-metrics">
        <div><span>Clientes cadastrados</span><strong>Seus dados</strong></div>
        <div><span>Simulações</span><strong>Em rascunho</strong></div>
        <div><span>Próxima etapa</span><strong>Em andamento</strong></div>
      </div>
      <div className="demo-workspace-line" aria-hidden="true"><i /><i /><i /><i /></div>
      <p className="demo-caption">Prévia ilustrativa · não contém dados reais</p>
    </div>
  );
}

function TestCta() {
  return (
    <Link href="/cadastro" className="marketing-button marketing-button-lime">
      Conhecer o TributAI <ArrowIcon />
    </Link>
  );
}

export function HomeImmersive() {
  return (
    <MarketingShell footerNote="Tecnologia tributária com clareza sobre o que já existe — e o que ainda está em construção.">
      <main id="main-content" className="home-variant home-immersive">
        <section className="home-immersive-hero">
          <div className="home-immersive-glow home-immersive-glow-one" aria-hidden="true" />
          <div className="home-immersive-glow home-immersive-glow-two" aria-hidden="true" />
          <div className="marketing-container home-immersive-grid">
            <div className="home-immersive-copy">
              <span className="marketing-eyebrow">Gestão tributária para escritórios</span>
              <h1 className="marketing-display">
                Mais clareza.
                <span>Menos ruído.</span>
              </h1>
              <p>
                Organize empresas, acompanhe pendências e prepare simulações em um espaço feito
                para a rotina contábil.
              </p>
              <div className="home-cta-row">
                <TestCta />
                <Link href="/layouts" className="marketing-text-link">Comparar layouts <ArrowIcon /></Link>
              </div>
              <span className="home-disclaimer">Rascunhos para organização. Não são cálculos fiscais oficiais.</span>
            </div>
            <div className="home-immersive-art">
              <div className="home-orbit home-orbit-one" aria-hidden="true" />
              <div className="home-orbit home-orbit-two" aria-hidden="true" />
              <span className="home-orbit-label">ROTINA EM CONTEXTO</span>
              <DemoWorkspace dark />
              <span className="home-float-note">Do cadastro ao próximo passo <b>↗</b></span>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="marketing-section">
          <div className="marketing-container">
            <div className="home-section-heading">
              <span className="marketing-eyebrow">Um fluxo simples</span>
              <h2 className="marketing-heading">Organize primeiro.<br />Decida com contexto.</h2>
            </div>
            <div className="home-step-grid">
              {[
                ["01", "Reúna as informações", "Cadastre empresas e mantenha os dados do escritório organizados."],
                ["02", "Acompanhe pendências", "Registre rascunhos e veja o que ainda precisa de atenção."],
                ["03", "Siga com clareza", "Use a plataforma como apoio operacional, sem confundir registro com cálculo."],
              ].map(([number, title, description], index) => (
                <ScrollReveal key={number} delay={index * 100} className="home-step">
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="home-truth-band">
          <div className="marketing-container home-truth-inner">
            <span className="marketing-eyebrow">Transparência por princípio</span>
            <p>Os motores tributários ainda não estão conectados. O TributAI não apresenta rascunhos como resultados oficiais.</p>
            <Link href="/institucional" className="marketing-text-link">Saiba como o produto funciona <ArrowIcon /></Link>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}

export function HomeStory() {
  const chapters = [
    {
      number: "01",
      label: "Comece pelo contexto",
      title: "Cada escritório tem um ritmo.",
      description: "Cadastre empresas e reúna as informações importantes para acompanhar o trabalho, sem espalhar tudo por várias telas.",
      tone: "paper",
    },
    {
      number: "02",
      label: "Enxergue as pendências",
      title: "O que falta também precisa aparecer.",
      description: "Os rascunhos ficam identificados como pendentes. Assim, informação incompleta não se disfarça de conclusão.",
      tone: "jade",
    },
    {
      number: "03",
      label: "Avance com segurança",
      title: "Clareza antes de automatizar.",
      description: "Enquanto os motores oficiais não estão conectados, a plataforma organiza o processo e deixa os limites visíveis.",
      tone: "lime",
    },
  ];

  return (
    <MarketingShell footerNote="Uma rotina mais organizada começa por enxergar o que está pronto — e o que ainda não está.">
      <main id="main-content" className="home-variant home-story">
        <section className="home-story-intro marketing-container">
          <div>
            <span className="marketing-eyebrow">Da rotina à visão</span>
            <h1 className="marketing-heading">Menos procura.<br /><span>Mais perspectiva.</span></h1>
          </div>
          <div className="home-story-intro-aside">
            <p className="marketing-copy">
              Uma jornada visual por um fluxo de trabalho tributário mais organizado — sem
              prometer cálculos que ainda não estão disponíveis.
            </p>
            <TestCta />
          </div>
        </section>

        <div className="home-story-rule" aria-hidden="true"><span /><span /><span /></div>

        <section aria-label="Etapas do fluxo TributAI" className="home-story-chapters">
          {chapters.map((chapter, index) => (
            <section key={chapter.number} className={`home-story-chapter home-story-chapter-${chapter.tone}`}>
              <div className="marketing-container home-story-chapter-grid">
                <ScrollReveal className="home-story-number">
                  <span>{chapter.number}</span>
                  <i aria-hidden="true" />
                  <p>{chapter.label}</p>
                </ScrollReveal>
                <ScrollReveal delay={90} className="home-story-chapter-copy">
                  <h2>{chapter.title}</h2>
                  <p>{chapter.description}</p>
                  {index === 0 && <span className="home-story-chip">Cadastro por escritório</span>}
                  {index === 1 && <span className="home-story-chip">Status sempre identificado</span>}
                  {index === 2 && <span className="home-story-chip">Sem cálculo fiscal oficial</span>}
                </ScrollReveal>
                <ScrollReveal delay={160} className="home-story-chapter-art">
                  {index === 1 ? <DemoWorkspace /> : (
                    <div className={`story-illustration story-illustration-${index + 1}`} aria-hidden="true">
                      <span /><span /><span /><i />
                      <b>{index === 0 ? "CONTEXTO" : "PRÓXIMO PASSO"}</b>
                    </div>
                  )}
                </ScrollReveal>
              </div>
            </section>
          ))}
        </section>

        <section className="marketing-section">
          <div className="marketing-container home-story-end">
            <span className="marketing-eyebrow">Uma base mais clara</span>
            <h2 className="marketing-heading">Comece com o que já funciona.</h2>
            <p className="marketing-copy">Conheça o produto e veja se ele combina com a rotina do seu escritório.</p>
            <TestCta />
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}

export function HomeBento() {
  return (
    <MarketingShell footerNote="Uma plataforma em evolução, com cada etapa claramente identificada.">
      <main id="main-content" className="home-variant home-bento">
        <section className="marketing-container home-bento-intro">
          <div>
            <span className="marketing-eyebrow">TributAI · Gestão tributária</span>
            <h1 className="marketing-heading">Rotina em ordem.<br /><span>Decisões com contexto.</span></h1>
          </div>
          <div>
            <p className="marketing-copy">Um espaço prático para organizar empresas, pendências e rascunhos do seu escritório.</p>
            <TestCta />
          </div>
        </section>

        <section className="marketing-container home-bento-grid" aria-label="Visão geral dos recursos">
          <ScrollReveal className="home-bento-card home-bento-card-feature">
            <span className="marketing-eyebrow">01 · Organize</span>
            <h2>Clientes,<br />sem perder o fio.</h2>
            <p>Centralize cadastros e acompanhe o status de cada empresa.</p>
            <Link href="/cadastro" aria-label="Começar a organizar clientes">Abrir espaço <ArrowIcon /></Link>
            <div className="bento-graphic bento-graphic-records" aria-hidden="true">
              <i /><i /><i /><b>EMPRESAS</b>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80} className="home-bento-card home-bento-card-dark">
            <span className="marketing-eyebrow">02 · Acompanhe</span>
            <h2>O próximo passo fica visível.</h2>
            <div className="bento-status-list" aria-hidden="true">
              <span><i /> Cadastro centralizado</span>
              <span><i /> Rascunho pendente</span>
              <span><i /> Ação em andamento</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={140} className="home-bento-card home-bento-card-lime">
            <span className="marketing-eyebrow">03 · Sem promessas vagas</span>
            <h2>Rascunho não é cálculo oficial.</h2>
            <p>Os motores tributários ainda não estão conectados ao fluxo do site.</p>
            <Link href="/institucional" aria-label="Conhecer os limites do produto">Ver transparência <ArrowIcon /></Link>
          </ScrollReveal>

          <ScrollReveal delay={200} className="home-bento-card home-bento-card-visual">
            <DemoWorkspace />
          </ScrollReveal>
        </section>

        <section className="home-bento-bottom">
          <div className="marketing-container home-bento-bottom-inner">
            <p>Sem checkout no site. Planos pagos podem ser acertados por fora; confirme as condições antes de pagar.</p>
            <Link href="/layouts" className="marketing-text-link">Ver as outras propostas <ArrowIcon /></Link>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
