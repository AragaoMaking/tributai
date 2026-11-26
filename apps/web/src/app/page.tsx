import Link from "next/link";
import ProductShowcase from "@/components/product-showcase";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m4 10 4 4 8-8" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="landing-page min-h-screen overflow-hidden bg-[#f5f8fc] text-[#10213f]">
      <header className="landing-header mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-7 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="TributAI, início">
          <span className="brand-mark grid h-10 w-10 place-items-center rounded-[14px] bg-[#0b1f3a] text-lg font-black tracking-tight text-white sm:h-11 sm:w-11">
            T<span className="text-[#62d6aa]">A</span>
          </span>
          <span className="text-lg font-bold tracking-tight sm:text-xl">
            Tribut<span className="text-[#168363]">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
          <a href="#recursos" className="text-sm font-semibold text-[#596981] transition-colors hover:text-[#168363]">Recursos</a>
          <a href="#transparencia" className="text-sm font-semibold text-[#596981] transition-colors hover:text-[#168363]">Transparência</a>
          <a href="#duvidas" className="text-sm font-semibold text-[#596981] transition-colors hover:text-[#168363]">Dúvidas</a>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <Link href="/login" className="hidden rounded-xl px-2.5 py-2.5 text-xs font-bold text-[#41516b] transition hover:bg-white min-[380px]:inline-flex sm:px-4 sm:text-sm">
            Entrar
          </Link>
          <Link href="/cadastro" className="whitespace-nowrap rounded-xl bg-[#0b1f3a] px-3.5 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#0b1f3a]/10 transition hover:-translate-y-0.5 hover:bg-[#17365f] sm:px-4 sm:text-sm">
            Criar conta
          </Link>
        </div>
      </header>

      <section className="hero-section relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-9 sm:px-7 sm:pb-20 sm:pt-12 lg:grid-cols-[0.94fr_1.06fr] lg:gap-14 lg:px-10 lg:pb-28 lg:pt-16">
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />
        <div className="hero-copy relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d6e8e1] bg-white/85 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#168363] shadow-sm sm:text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#39b78c] opacity-30 motion-reduce:hidden" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#39b78c]" />
            </span>
            Gestão tributária para escritórios
          </div>

          <h1 className="mt-6 max-w-2xl text-[2.55rem] font-bold leading-[1.07] tracking-[-0.045em] sm:mt-7 sm:text-5xl lg:text-[3.55rem]">
            Sua rotina contábil,
            <span className="hero-title-accent block">com mais clareza.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#64738b] sm:mt-6 sm:text-lg sm:leading-8">
            Organize empresas, acompanhe pendências e prepare simulações em um espaço feito para o dia a dia do seu escritório.
          </p>

          <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row sm:mt-8">
            <Link href="/cadastro" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_24px_-12px_rgba(11,31,58,0.55)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#17365f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168363]">
              Começar período de teste
              <ArrowIcon />
            </Link>
            <a href="#recursos" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#dfe6ef] bg-white/80 px-5 py-3 text-sm font-bold text-[#263752] transition hover:border-[#b8c5d8] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168363]">
              Explorar a plataforma
            </a>
          </div>
          <p className="mt-4 text-xs leading-5 text-[#77859a]">
            Sem cobrança automática. Veja com transparência o que está disponível.
          </p>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5 border-t border-[#e4eaf1] pt-5 sm:mt-8">
            {["Clientes organizados", "Rascunhos acompanhados", "Limitações explícitas"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2 text-xs font-semibold text-[#53647d]">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#e5f5ee] text-[#168363]"><CheckIcon /></span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-showcase relative z-10 mx-auto w-full max-w-[610px] lg:ml-auto">
          <ProductShowcase />
        </div>
      </section>

      <section id="recursos" className="landing-section border-y border-[#e5eaf1] bg-white/85 px-5 py-16 sm:px-7 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#168363]">Feito para dar contexto</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Menos abas. Mais visão da rotina.</h2>
            <p className="mt-3 text-sm leading-6 text-[#687791] sm:text-base">
              O essencial do escritório fica reunido, com o status de cada etapa sempre visível.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            <article className="feature-card group rounded-2xl border border-[#e6ebf2] bg-white p-5 sm:p-6">
              <span className="feature-icon grid h-11 w-11 place-items-center rounded-xl bg-[#eaf7f2] text-[#168363]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 3 4.6V20" /></svg>
              </span>
              <h3 className="mt-5 text-base font-bold">Clientes organizados</h3>
              <p className="mt-2 text-sm leading-6 text-[#687791]">Centralize cadastros e acompanhe o status das empresas atendidas.</p>
              <span className="mt-4 inline-flex rounded-full bg-[#eaf7f2] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#168363]">Disponível</span>
            </article>

            <article className="feature-card group rounded-2xl border border-[#e6ebf2] bg-white p-5 sm:p-6">
              <span className="feature-icon grid h-11 w-11 place-items-center rounded-xl bg-[#edf4ff] text-[#2864d8]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2" /></svg>
              </span>
              <h3 className="mt-5 text-base font-bold">Simulações com contexto</h3>
              <p className="mt-2 text-sm leading-6 text-[#687791]">Prepare e salve informações como rascunhos, com as pendências identificadas.</p>
              <span className="mt-4 inline-flex rounded-full bg-[#edf4ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#2864d8]">Rascunho</span>
            </article>

            <article className="feature-card group rounded-2xl border border-[#e6ebf2] bg-white p-5 sm:p-6">
              <span className="feature-icon grid h-11 w-11 place-items-center rounded-xl bg-[#fff7df] text-[#ad7319]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 3 4.5 6v5.5c0 4.5 3.1 7.7 7.5 9.5 4.4-1.8 7.5-5 7.5-9.5V6L12 3Z" /><path d="m9 12 2 2 4-4" /></svg>
              </span>
              <h3 className="mt-5 text-base font-bold">Acesso por escritório</h3>
              <p className="mt-2 text-sm leading-6 text-[#687791]">A autenticação e as políticas do banco protegem os dados vinculados à conta.</p>
              <span className="mt-4 inline-flex rounded-full bg-[#fff7df] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#94620f]">Proteção de dados</span>
            </article>
          </div>
        </div>
      </section>

      <section id="transparencia" className="landing-section px-5 py-16 sm:px-7 sm:py-20 lg:px-10">
        <div className="transparency-panel relative mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[26px] bg-[#0b1f3a] p-6 text-white sm:p-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-12">
          <div className="transparency-glow" aria-hidden="true" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#91e0c3]">Compromisso TributAI</span>
            <h2 className="mt-4 max-w-lg text-2xl font-bold leading-tight tracking-tight sm:text-3xl">Transparência também é uma funcionalidade.</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#c2cfe2]">
              A plataforma informa o que consegue fazer hoje e não apresenta estimativas como se fossem cálculos oficiais.
            </p>
          </div>
          <div className="relative grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#91e0c3]"><span className="h-2 w-2 rounded-full bg-[#62d6aa]" />Já disponível</span>
              <p className="mt-3 text-sm font-bold">Cadastro de empresas e rascunhos</p>
              <p className="mt-1 text-xs leading-5 text-[#b8c6da]">Organize informações sem confundir registro com cálculo.</p>
            </div>
            <div className="rounded-2xl border border-[#f0c66c]/20 bg-[#f0c66c]/[0.07] p-5">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#f0c66c]"><span className="h-2 w-2 rounded-full bg-[#f0c66c]" />Em desenvolvimento</span>
              <p className="mt-3 text-sm font-bold">Motores tributários oficiais</p>
              <p className="mt-1 text-xs leading-5 text-[#d3c7a8]">Os cálculos ainda não estão conectados ao fluxo do site.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="duvidas" className="landing-section border-t border-[#e5eaf1] bg-white px-5 py-16 sm:px-7 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#168363]">Antes de começar</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Dúvidas frequentes</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#687791]">Informação clara para você decidir se a plataforma faz sentido para sua rotina.</p>
          </div>
          <div className="space-y-3">
            <details className="faq-item group rounded-2xl border border-[#e6ebf2] bg-[#fbfcfe] p-4 sm:p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold">
                O cadastro gera cobrança automática?
                <span className="faq-plus grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-lg text-[#168363] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 max-w-2xl pr-8 text-sm leading-6 text-[#687791]">Não. O cadastro inicia um período de teste. Atualmente não há cobrança automática nem pagamento integrado.</p>
            </details>
            <details className="faq-item group rounded-2xl border border-[#e6ebf2] bg-[#fbfcfe] p-4 sm:p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold">
                O TributAI já calcula os tributos?
                <span className="faq-plus grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-lg text-[#168363] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 max-w-2xl pr-8 text-sm leading-6 text-[#687791]">Ainda não. O simulador salva rascunhos, mas os motores tributários não estão conectados e nenhum resultado deve ser tratado como cálculo oficial.</p>
            </details>
            <details className="faq-item group rounded-2xl border border-[#e6ebf2] bg-[#fbfcfe] p-4 sm:p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold">
                Posso usar no celular?
                <span className="faq-plus grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-lg text-[#168363] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 max-w-2xl pr-8 text-sm leading-6 text-[#687791]">A interface se adapta a telas menores. Para tarefas com muitos campos, uma tela maior pode ser mais confortável.</p>
            </details>
          </div>
        </div>
      </section>

      <footer className="landing-footer bg-[#f5f8fc] px-5 py-8 sm:px-7 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-sm font-bold tracking-tight">Tribut<span className="text-[#168363]">AI</span></Link>
          <p className="max-w-2xl text-xs leading-5 text-[#687791]">Gestão tributária com transparência. Não utilize a plataforma para decisões fiscais oficiais enquanto os motores não estiverem integrados.</p>
          <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-[#2864d8] transition hover:gap-3">Acessar conta <ArrowIcon /></Link>
        </div>
      </footer>
    </main>
  );
}
