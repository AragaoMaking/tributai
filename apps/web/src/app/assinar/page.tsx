"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const plans = [
  { id: "starter", name: "Starter", limit: "Até 10 clientes", offer: "Período de teste", description: "Para profissionais iniciando no digital.", featured: false },
  { id: "profissional", name: "Profissional", limit: "Até 100 clientes", offer: "Consulte valores", description: "Para escritórios com operação em crescimento.", featured: true },
  { id: "escritorio", name: "Escritório", limit: "Limite configurável", offer: "Sob consulta", description: "Para equipes e estruturas maiores.", featured: false },
];

export default function AssinarPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("profissional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startPlan() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      router.replace("/login");
      return;
    }

    const { data: membership, error: membershipError } = await supabase
      .from("membros")
      .select("escritorio_id")
      .eq("usuario_id", user.id)
      .eq("ativo", true)
      .limit(1)
      .maybeSingle();
    if (membershipError || !membership) {
      setError("Não foi possível localizar o escritório desta conta.");
      setLoading(false);
      return;
    }

    const { error: planError } = await supabase.rpc("selecionar_plano", {
      p_escritorio_id: membership.escritorio_id,
      p_plano_id: selected,
    });
    if (planError) {
      setError("Não foi possível salvar o plano. Confirme se o período de teste está ativo.");
      setLoading(false);
      return;
    }

    router.replace("/visao-geral");
    router.refresh();
  }

  return (
    <main id="main-content" className="min-h-screen bg-[var(--background)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex items-center justify-between">
          <Link href="/cadastro" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--navy)] text-lg font-black text-white">T<span className="text-[#62d6aa]">A</span></span>
            <span className="text-xl font-bold">Tribut<span className="text-[var(--green)]">AI</span></span>
          </Link>
          <button onClick={() => router.push("/visao-geral")} className="text-sm font-bold text-[var(--muted)] transition hover:text-[var(--foreground)]">Continuar no Starter de teste</button>
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[var(--blue-soft)] px-3 py-1 text-xs font-bold text-[var(--blue)]">Fase de assinatura</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Escolha o plano ideal para seu escritório</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">A seleção nesta tela salva uma opção de teste e não inicia pagamento. O site não processa pagamentos; planos pagos podem ser acertados por fora.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`relative rounded-2xl border p-6 text-left transition ${selected === plan.id ? "border-[var(--blue)] bg-[var(--surface)] ring-2 ring-[var(--blue)]" : "border-[var(--border)] bg-[var(--surface)] hover:-translate-y-1 hover:shadow-xl"}`}
            >
              {plan.featured && <span className="absolute right-5 top-5 rounded-full bg-[var(--blue-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--blue)]">Mais completo</span>}
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${selected === plan.id ? "bg-[var(--blue)] text-white" : "bg-[var(--surface-soft)] text-[var(--muted)]"}`}>
                {plan.name === "Starter" ? "S" : plan.name === "Profissional" ? "P" : "E"}
              </div>
              <h2 className="mt-5 text-xl font-bold">{plan.name}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{plan.limit}</p>
              <div className="mt-6 text-2xl font-bold">{plan.offer}</div>
              <p className="mt-3 min-h-10 text-sm leading-5 text-[var(--muted)]">{plan.description}</p>
              <div className={`mt-6 h-11 rounded-xl text-center text-sm font-bold leading-[44px] ${selected === plan.id ? "bg-[var(--navy)] text-white" : "border border-[var(--border)]"}`}>
                {selected === plan.id ? "Plano selecionado" : "Selecionar"}
              </div>
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-xl">
          {error && <div role="alert" className="mb-4 rounded-xl bg-[var(--red-soft)] px-4 py-3 text-sm font-semibold text-[var(--red)]">{error}</div>}
          <button onClick={startPlan} disabled={loading} className="h-12 w-full rounded-xl bg-[var(--navy)] text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70">
            {loading ? "Preparando ambiente..." : "Começar com o plano selecionado"}
          </button>
          <p className="mt-3 text-center text-xs leading-5 text-[var(--muted)]">Antes de pagar um plano externo, solicite por escrito valores, forma de pagamento e condições de cancelamento/reembolso. Não há uma política formal publicada no site neste momento.</p>
        </div>
      </div>
    </main>
  );
}
