import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-[#10213f]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label="TributAI, início">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#0b1f3a] text-xl font-black tracking-tight text-white">
            T<span className="text-[#62d6aa]">A</span>
          </span>
          <span className="text-xl font-bold tracking-tight">
            Tribut<span className="text-[#168363]">AI</span>
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#41516b] transition hover:bg-white"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-xl bg-[#0b1f3a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17365f]"
          >
            Criar conta
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-28 lg:pt-20">
        <div className="fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#dce8e4] bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#168363]">
            <span className="h-2 w-2 rounded-full bg-[#39b78c]" />
            Gestão para escritórios contábeis
          </span>
          <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Mais clareza na rotina tributária do seu escritório.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#687791]">
            Organize seus clientes, centralize informações e acompanhe o trabalho
            do escritório em um só lugar — com transparência sobre o que já está
            disponível e o que ainda está em desenvolvimento.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0b1f3a] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0b1f3a]/10 transition hover:-translate-y-0.5 hover:bg-[#17365f]"
            >
              Conhecer a plataforma <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-[#dfe6ef] bg-white px-5 py-3.5 text-sm font-bold text-[#10213f] transition hover:border-[#b8c5d8]"
            >
              Já tenho uma conta
            </Link>
          </div>
          <p className="mt-5 text-xs leading-5 text-[#687791]">
            O cadastro atual inicia um período de teste. Não há cobrança
            automática nem pagamento integrado.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-[#dceee8] blur-3xl" />
          <div className="absolute -right-8 bottom-2 h-48 w-48 rounded-full bg-[#e1eaff] blur-3xl" />
          <div className="relative rounded-[26px] border border-white bg-white p-5 shadow-[0_30px_90px_-40px_rgba(11,31,58,0.3)] sm:p-7">
            <div className="flex items-center justify-between border-b border-[#edf0f5] pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8794a8]">
                  Espaço do escritório
                </p>
                <p className="mt-1 text-lg font-bold">Sua rotina, mais organizada</p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf7f2] text-lg text-[#168363]" aria-hidden="true">
                ✓
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#f6f8fb] p-4">
                <p className="text-xs font-semibold text-[#687791]">Clientes</p>
                <p className="mt-3 text-sm font-bold">Cadastro centralizado</p>
                <p className="mt-1 text-xs text-[#8794a8]">Acompanhe os dados do escritório</p>
              </div>
              <div className="rounded-2xl bg-[#f6f8fb] p-4">
                <p className="text-xs font-semibold text-[#687791]">Simulações</p>
                <p className="mt-3 text-sm font-bold">Status transparente</p>
                <p className="mt-1 text-xs text-[#8794a8]">Sem apresentar valores não calculados</p>
              </div>
            </div>
            <div className="mt-3 rounded-2xl border border-[#f0dfb9] bg-[#fff9e9] p-4">
              <p className="text-sm font-bold text-[#8b651e]">Em desenvolvimento</p>
              <p className="mt-1 text-xs leading-5 text-[#806d4d]">
                Os motores de cálculo tributário ainda não estão conectados.
                A plataforma não gera cálculos fiscais oficiais.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#f6f8fb] p-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#eaf7f2] text-sm font-bold text-[#168363]" aria-hidden="true">
                TA
              </span>
              <div>
                <p className="text-xs font-bold">Dados separados por escritório</p>
                <p className="mt-0.5 text-[11px] text-[#8794a8]">Acesso protegido por conta</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e5eaf1] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3 lg:px-10">
          <article>
            <p className="text-sm font-bold">Clientes em um só lugar</p>
            <p className="mt-2 text-sm leading-6 text-[#687791]">
              Registre e organize as empresas atendidas pelo seu escritório.
            </p>
          </article>
          <article>
            <p className="text-sm font-bold">Acesso por escritório</p>
            <p className="mt-2 text-sm leading-6 text-[#687791]">
              Cada conta acessa os registros vinculados ao próprio escritório.
            </p>
          </article>
          <article>
            <p className="text-sm font-bold">Status sem surpresas</p>
            <p className="mt-2 text-sm leading-6 text-[#687791]">
              O que depende de integração é identificado, não apresentado como
              cálculo concluído.
            </p>
          </article>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-xs text-[#687791] sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <p>TributAI. Gestão tributária com transparência.</p>
        <p>Não utilize a plataforma para decisões fiscais oficiais enquanto os motores não estiverem integrados.</p>
      </footer>
    </main>
  );
}
