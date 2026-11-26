import Link from "next/link";
import MarketingShell from "@/components/marketing/marketing-shell";
import MetricReel from "@/components/marketing/metric-reel";
import ScrollReveal from "@/components/marketing/scroll-reveal";

const services = [
  ["01", "Cadastro de empresas", "Mantenha informações do escritório e das empresas atendidas em um fluxo organizado."],
  ["02", "Rascunhos acompanhados", "Registre informações para simulações e deixe pendências identificadas, sem sugerir um cálculo oficial."],
  ["03", "Assistente de atendimento", "Consulte informações gerais sobre o produto e tópicos tributários, com fontes oficiais quando disponíveis."],
];

const process = [
  ["Criar o espaço", "Abra uma conta e configure o escritório."],
  ["Organizar os registros", "Cadastre empresas e acompanhe o status de cada informação."],
  ["Preparar rascunhos", "Registre os dados necessários e identifique o que ainda falta."],
];

export default function InstitutionalPage() {
  return (
    <MarketingShell footerNote="O TributAI está em evolução. A disponibilidade de cada função é informada sem prometer resultados fiscais.">
      <main id="main-content" className="institutional-page">
        <section className="institutional-hero">
          <div className="marketing-container institutional-hero-grid">
            <div>
              <span className="marketing-eyebrow">Sobre o TributAI</span>
              <h1 className="marketing-heading">Tecnologia que organiza.<br /><span>Transparência que orienta.</span></h1>
              <p className="marketing-copy">
                Um espaço digital para escritórios contábeis organizarem empresas,
                acompanharem pendências e prepararem rascunhos de simulação.
              </p>
              <div className="home-cta-row">
                <Link href="/cadastro" className="marketing-button marketing-button-dark">Começar período de teste</Link>
                <Link href="/layouts" className="marketing-text-link">Explorar as páginas <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
            <div className="institutional-hero-art" aria-hidden="true">
              <span className="institutional-stamp">CLAREZA<br />EM CADA<br />ETAPA</span>
              <div className="institutional-art-line institutional-art-line-one" />
              <div className="institutional-art-line institutional-art-line-two" />
              <div className="institutional-art-core">TA</div>
              <span className="institutional-art-caption">ORGANIZAÇÃO · CONTEXTO · CONTROLE</span>
            </div>
          </div>
        </section>

        <section className="institutional-facts">
          <div className="marketing-container">
            <div className="institutional-facts-heading">
              <span className="marketing-eyebrow">O que é verificável hoje</span>
              <p>Números operacionais do produto — não são resultados ou promessas de economia.</p>
            </div>
            <div className="institutional-metrics">
              <MetricReel value={14} suffix="dias" label="de período de teste inicial" />
              <MetricReel value={10} suffix="clientes" label="no plano Starter" />
              <MetricReel value={100} suffix="clientes" label="no plano Profissional" />
            </div>
          </div>
        </section>

        <section className="marketing-section institutional-services">
          <div className="marketing-container">
            <div className="institutional-section-heading">
              <span className="marketing-eyebrow">O que fazemos</span>
              <h2 className="marketing-heading">Uma base para a rotina do escritório.</h2>
            </div>
            <div className="institutional-service-list">
              {services.map(([number, title, description], index) => (
                <ScrollReveal key={number} delay={index * 90} className="institutional-service">
                  <span className="institutional-service-number">{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className="institutional-service-arrow" aria-hidden="true">↗</span>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="institutional-difference">
          <div className="marketing-container institutional-difference-grid">
            <div>
              <span className="marketing-eyebrow">Nosso diferencial</span>
              <h2 className="marketing-heading">Limites claros também são parte do produto.</h2>
            </div>
            <div className="institutional-difference-copy">
              <p>
                Hoje, o TributAI organiza cadastros e registra rascunhos. Os motores tributários
                oficiais ainda não estão conectados; nenhum resultado deve ser tratado como
                cálculo fiscal oficial.
              </p>
              <Link href="/termos" className="marketing-text-link">Leia os termos de uso <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>

        <section className="marketing-section institutional-process">
          <div className="marketing-container">
            <div className="institutional-section-heading">
              <span className="marketing-eyebrow">Como funciona</span>
              <h2 className="marketing-heading">Três passos para começar.</h2>
            </div>
            <div className="institutional-timeline">
              {process.map(([title, description], index) => (
                <ScrollReveal key={title} delay={index * 100} className="institutional-timeline-step">
                  <span className="institutional-timeline-index">0{index + 1}</span>
                  <i aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="institutional-proof">
          <div className="marketing-container institutional-proof-grid">
            <ScrollReveal className="institutional-proof-panel">
              <span className="marketing-eyebrow">Depoimentos</span>
              <h2>Relatos reais merecem espaço real.</h2>
              <p>
                Ainda não publicamos depoimentos de clientes. Não usamos avaliações ou citações
                fictícias; este espaço será atualizado quando houver relatos autorizados.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={120} className="institutional-proof-panel institutional-team-panel">
              <span className="marketing-eyebrow">Equipe</span>
              <h2>Construído com foco em clareza.</h2>
              <p>
                Informações públicas sobre a equipe, funções e credenciais ainda não foram
                confirmadas para publicação.
              </p>
              <Link href="/privacidade" className="marketing-text-link">Conheça nossa política de privacidade <span aria-hidden="true">↗</span></Link>
            </ScrollReveal>
          </div>
        </section>

        <section className="marketing-section institutional-faq">
          <div className="marketing-container institutional-faq-grid">
            <div>
              <span className="marketing-eyebrow">Perguntas frequentes</span>
              <h2 className="marketing-heading">Antes de começar.</h2>
            </div>
            <div className="institutional-faq-list">
              <details>
                <summary>O TributAI calcula tributos?</summary>
                <p>Não. Os motores tributários ainda não estão conectados; os registros são rascunhos e não substituem uma análise profissional.</p>
              </details>
              <details>
                <summary>O cadastro inicia um pagamento?</summary>
                <p>Não. O site não tem checkout. Pagamentos de planos podem ser combinados por fora; confirme valores e condições por escrito antes de pagar.</p>
              </details>
              <details>
                <summary>Como os dados do escritório são tratados?</summary>
                <p>Consulte a política de privacidade para ver as categorias de dados, fornecedores e como enviar uma solicitação.</p>
              </details>
            </div>
          </div>
        </section>

        <section className="institutional-cta">
          <div className="marketing-container institutional-cta-inner">
            <span className="marketing-eyebrow">Veja se faz sentido para sua rotina</span>
            <h2 className="marketing-heading">Comece com mais contexto.</h2>
            <Link href="/cadastro" className="marketing-button marketing-button-lime">Criar conta <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
