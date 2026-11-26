"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RecuperarSenhaPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Informe um e-mail válido.");
      return;
    }
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`,
    });
    if (resetError) {
      setError(resetError.message.includes("fetch") ? "Não foi possível conectar ao serviço de autenticação." : "Não foi possível solicitar a redefinição agora.");
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  }

  return (
    <main id="main-content" className="grid min-h-screen place-items-center bg-[var(--background)] px-5">
      <div className="w-full max-w-[420px]">
        <Link href="/login" className="mb-8 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--navy)] text-lg font-black text-white">T<span className="text-[#62d6aa]">A</span></span>
          <span className="text-xl font-bold">Tribut<span className="text-[var(--green)]">AI</span></span>
        </Link>
        <div className="card-shell p-7">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--green-soft)] text-xl text-[var(--green)]">✓</div>
              <h1 className="mt-5 text-2xl font-bold">Solicitação registrada</h1>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Se o endereço estiver cadastrado, enviaremos um link para redefinir sua senha. No ambiente local, consulte a caixa de entrada do Mailpit.</p>
              <Link href="/login" className="mt-6 inline-flex h-11 items-center rounded-xl bg-[var(--navy)] px-5 text-sm font-bold text-white">Voltar ao login</Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--blue)]">Recuperação de acesso</p>
              <h1 className="mt-2 text-2xl font-bold">Esqueceu sua senha?</h1>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Informe seu e-mail profissional. Vamos orientar a redefinição.</p>
              <label className="mt-6 block text-xs font-bold text-[var(--muted)]">E-mail<input name="email" type="email" required className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none focus:border-[var(--blue)]" placeholder="voce@escritorio.com.br" /></label>
              {error && <div role="alert" className="mt-4 rounded-xl bg-[var(--red-soft)] px-4 py-3 text-sm font-semibold text-[var(--red)]">{error}</div>}
              <button disabled={loading} className="mt-5 h-12 w-full rounded-xl bg-[var(--navy)] text-sm font-bold text-white disabled:opacity-70">{loading ? "Enviando..." : "Solicitar redefinição"}</button>
              <Link href="/login" className="mt-5 block text-center text-sm font-bold text-[var(--muted)]">Voltar ao login</Link>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
