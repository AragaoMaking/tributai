"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const office = String(form.get("office") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const terms = form.get("terms");

    if (!name || !office || !email || !password) {
      setError("Preencha todos os campos para continuar.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (!terms) {
      setError("Você precisa aceitar os termos para criar a conta.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: { name, office },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/assinar`,
      },
    });

    if (signUpError) {
      setError(signUpError.message.includes("fetch") ? "Não foi possível conectar ao Supabase. Confira se ele está iniciado." : signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setMessage("Conta criada. Confirme o endereço de e-mail para continuar; em ambiente local, confira a caixa de entrada do Mailpit.");
      setLoading(false);
      return;
    }

    router.replace("/assinar");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="grid min-h-screen lg:grid-cols-[1fr_470px]">
        <section className="relative hidden overflow-hidden bg-[var(--navy)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-28 -top-28 h-96 w-96 rounded-full border-[70px] border-white/[0.035]" />
          <div className="absolute -bottom-32 right-[-100px] h-96 w-96 rounded-full bg-[#2864d8]/10" />
          <Link href="/cadastro" className="relative z-10 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-xl font-black ring-1 ring-white/10">T<span className="text-[#62d6aa]">A</span></span>
            <span className="text-[22px] font-bold tracking-tight">Tribut<span className="text-[#62d6aa]">AI</span></span>
          </Link>
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-[#b7c8e2]">GESTÃO TRIBUTÁRIA INTELIGENTE</span>
            <h1 className="mt-6 text-5xl font-bold leading-[1.08] tracking-tight">Decisões tributárias com mais clareza.</h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-[#aebed6]">Organize clientes, prepare simulações e acompanhe a Reforma Tributária em um único ambiente.</p>
            <div className="mt-10 grid grid-cols-3 gap-3">
              {[
                ["01", "Cadastre"],
                ["02", "Simule"],
                ["03", "Compare"],
              ].map(([number, label]) => (
                <div key={number} className="rounded-xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="text-xs font-bold text-[#62d6aa]">{number}</div>
                  <div className="mt-2 text-sm font-bold">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="relative z-10 text-xs text-[#8fa3c1]">Inteligência tributária. Decisões mais inteligentes.</p>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-[400px]">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--navy)] text-lg font-black text-white">T<span className="text-[#62d6aa]">A</span></span>
                <span className="text-xl font-bold">Tribut<span className="text-[var(--green)]">AI</span></span>
              </div>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--blue)]">Comece agora</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Crie sua conta</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Cadastre seu escritório e comece a organizar a rotina tributária.</p>

            <form onSubmit={submit} className="mt-7 space-y-4">
              <label className="block text-xs font-bold text-[var(--muted)]">
                Seu nome
                <input name="name" autoComplete="name" required maxLength={120} className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-[var(--blue-soft)]" placeholder="Como você gostaria de ser chamado?" />
              </label>
              <label className="block text-xs font-bold text-[var(--muted)]">
                Nome do escritório
                <input name="office" required maxLength={160} className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-[var(--blue-soft)]" placeholder="Ex.: Carvalho Contabilidade" />
              </label>
              <label className="block text-xs font-bold text-[var(--muted)]">
                E-mail profissional
                <input name="email" type="email" autoComplete="email" required className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-[var(--blue-soft)]" placeholder="voce@escritorio.com.br" />
              </label>
              <label className="block text-xs font-bold text-[var(--muted)]">
                Senha
                <input name="password" type="password" autoComplete="new-password" required minLength={8} className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-[var(--blue-soft)]" placeholder="Mínimo de 8 caracteres" />
              </label>
              <label className="flex items-start gap-3 text-xs leading-5 text-[var(--muted)]">
                <input name="terms" type="checkbox" className="mt-1 h-4 w-4 accent-[var(--blue)]" />
                <span>Li e aceito os termos de uso e a política de privacidade.</span>
              </label>

              {error && <div role="alert" className="rounded-xl bg-[var(--red-soft)] px-4 py-3 text-sm font-semibold text-[var(--red)]">{error}</div>}
              {message && <div role="status" className="rounded-xl bg-[var(--green-soft)] px-4 py-3 text-sm font-semibold text-[var(--green)]">{message}</div>}

              <button disabled={loading} className="h-12 w-full rounded-xl bg-[var(--navy)] text-sm font-bold text-white shadow-lg shadow-[#0b1f3a]/10 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70">
                {loading ? "Criando conta..." : "Continuar para planos"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--muted)]">
              Já possui uma conta? <button onClick={() => router.push("/login")} className="font-bold text-[var(--blue)]">Entrar</button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
