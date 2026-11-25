"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [validLink, setValidLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function checkRecoverySession() {
      try {
        const supabase = createClient();
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (!active) return;
        if (sessionError) setError("Não foi possível validar o link de recuperação.");
        setValidLink(Boolean(data.session));
        setReady(true);
      } catch {
        if (active) {
          setError("Supabase não está configurado neste ambiente.");
          setReady(true);
        }
      }
    }

    void checkRecoverySession();
    return () => { active = false; };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("confirmation") || "");

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmation) {
      setError("As senhas não conferem.");
      return;
    }

    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError("O link expirou ou não é válido. Solicite uma nova redefinição.");
      setLoading(false);
      return;
    }
    router.replace("/visao-geral");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--background)] px-5">
      <div className="w-full max-w-[420px] card-shell p-7">
        <Link href="/login" className="mb-8 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--navy)] text-lg font-black text-white">T<span className="text-[#62d6aa]">A</span></span>
          <span className="text-xl font-bold">Tribut<span className="text-[var(--green)]">AI</span></span>
        </Link>
        <h1 className="text-2xl font-bold">Criar nova senha</h1>
        {!ready ? (
          <p className="mt-3 text-sm text-[var(--muted)]">Validando o link...</p>
        ) : !validLink ? (
          <div>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{error || "Este link não é válido ou já expirou."}</p>
            <Link href="/recuperar-senha" className="mt-5 inline-flex h-11 items-center rounded-xl bg-[var(--navy)] px-5 text-sm font-bold text-white">Solicitar outro link</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block text-xs font-bold text-[var(--muted)]">Nova senha
              <input name="password" type="password" required minLength={8} autoComplete="new-password" className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none focus:border-[var(--blue)]" />
            </label>
            <label className="block text-xs font-bold text-[var(--muted)]">Confirme a senha
              <input name="confirmation" type="password" required minLength={8} autoComplete="new-password" className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none focus:border-[var(--blue)]" />
            </label>
            {error && <div role="alert" className="rounded-xl bg-[var(--red-soft)] px-4 py-3 text-sm font-semibold text-[var(--red)]">{error}</div>}
            <button disabled={loading} className="h-12 w-full rounded-xl bg-[var(--navy)] text-sm font-bold text-white disabled:opacity-70">{loading ? "Salvando..." : "Salvar nova senha"}</button>
          </form>
        )}
      </div>
    </main>
  );
}
