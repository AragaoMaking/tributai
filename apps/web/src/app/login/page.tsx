"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const authError = new URLSearchParams(window.location.search).get("authError");
    if (authError) {
      window.requestAnimationFrame(() => setError("O link de autenticação é inválido ou expirou. Solicite um novo link."));
    }
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");

    if (!email || !password) {
      setError("Informe seu e-mail e sua senha.");
      return;
    }

    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message.includes("fetch") ? "Não foi possível conectar ao serviço de autenticação. Verifique se o Supabase está iniciado." : "E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }

    router.replace("/visao-geral");
    router.refresh();
  }

  return (
    <main id="main-content" className="grid min-h-screen bg-[var(--background)] lg:grid-cols-[1fr_470px]">
      <section className="relative hidden overflow-hidden bg-[var(--navy)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-28 -top-28 h-96 w-96 rounded-full border-[70px] border-white/[0.035]" />
        <Link href="/cadastro" className="relative z-10 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-xl font-black ring-1 ring-white/10">T<span className="text-[#62d6aa]">A</span></span>
          <span className="text-[22px] font-bold">Tribut<span className="text-[#62d6aa]">AI</span></span>
        </Link>
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#62d6aa]">Bem-vindo de volta</p>
          <h1 className="mt-5 text-5xl font-bold leading-[1.08]">Acompanhe a rotina tributária do seu escritório.</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-[#aebed6]">Clientes, simulações e pendências organizados em um só lugar.</p>
        </div>
        <p className="relative z-10 text-xs text-[#8fa3c1]">Inteligência tributária. Decisões mais inteligentes.</p>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[400px]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--blue)]">Acesse sua conta</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Entrar no TributAI</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Use o e-mail profissional cadastrado no escritório.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block text-xs font-bold text-[var(--muted)]">
              E-mail
              <input name="email" type="email" autoComplete="email" required className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-[var(--blue-soft)]" placeholder="voce@escritorio.com.br" />
            </label>
            <label className="block text-xs font-bold text-[var(--muted)]">
              Senha
              <input name="password" type="password" autoComplete="current-password" required className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-[var(--blue-soft)]" placeholder="Sua senha" />
            </label>

            {error && <div role="alert" className="rounded-xl bg-[var(--red-soft)] px-4 py-3 text-sm font-semibold text-[var(--red)]">{error}</div>}

            <div className="text-right"><Link href="/recuperar-senha" className="text-xs font-bold text-[var(--blue)]">Esqueci minha senha</Link></div>
            <button disabled={loading} className="h-12 w-full rounded-xl bg-[var(--navy)] text-sm font-bold text-white disabled:cursor-wait disabled:opacity-70">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--muted)]">Ainda não tem conta? <Link href="/cadastro" className="font-bold text-[var(--blue)]">Criar conta</Link></p>
        </div>
      </section>
    </main>
  );
}
