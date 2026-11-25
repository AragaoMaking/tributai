"use client";

import { useEffect, useRef, useState } from "react";

type Citation = {
  title: string;
  url: string;
};

type ChatMessage = {
  role: "user" | "model";
  text: string;
  citations?: Citation[];
};

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "miguel.norton@icloud.com";

export default function SupportAgent() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Olá! Posso ajudar com dúvidas sobre o TributAI e informações tributárias gerais. Não faço cálculos nem análise fiscal individual.",
    },
  ]);
  const endOfMessages = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessages.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages = [...messages, { role: "user" as const, text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/assistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-10).map(({ role, text: messageText }) => ({
            role,
            text: messageText,
          })),
        }),
      });
      const data: { reply?: string; citations?: Citation[]; error?: string } = await response.json();

      if (!response.ok || !data.reply) {
        throw new Error(data.error || "Não foi possível responder agora.");
      }

      setMessages((current) => [
        ...current,
        { role: "model", text: data.reply!, citations: data.citations },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível responder agora.";
      setMessages((current) => [...current, { role: "model", text: message }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[80] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <section
          aria-label="Atendimento TributAI"
          className="flex h-[min(34rem,calc(100dvh-6rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#dfe6ef] bg-white text-[#10213f] shadow-2xl"
        >
          <header className="flex items-center justify-between bg-[#0b1f3a] px-4 py-3 text-white">
            <div>
              <h2 className="text-sm font-bold">Atendimento TributAI</h2>
              <p className="mt-0.5 text-xs text-[#c5d2e5]">Assistente virtual</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Fechar atendimento"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <div className="scrollbar-subtle flex-1 space-y-3 overflow-y-auto bg-[#f7f9fc] p-3" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[90%] rounded-2xl px-3 py-2.5 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto rounded-br-md bg-[#0b1f3a] text-white"
                    : "rounded-bl-md border border-[#e4e9f0] bg-white text-[#263752]"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-2 border-t border-[#e4e9f0] pt-2">
                    <p className="text-xs font-bold">Fontes</p>
                    <ul className="mt-1 space-y-1">
                      {message.citations.map((citation) => (
                        <li key={citation.url}>
                          <a
                            href={citation.url}
                            target="_blank"
                            rel="noreferrer"
                            className="break-all text-xs text-[#2864d8] underline"
                          >
                            {citation.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <p className="w-fit rounded-2xl border border-[#e4e9f0] bg-white px-3 py-2 text-xs text-[#687791]">
                Preparando resposta…
              </p>
            )}
            <div ref={endOfMessages} />
          </div>

          <p className="border-t border-[#e4e9f0] bg-white px-3 pt-2 text-[11px] leading-4 text-[#687791]">
            As mensagens são processadas pelo Google Gemini. No plano gratuito, elas podem ser usadas para melhorar os serviços do Google. Não envie dados pessoais ou de clientes.
          </p>
          <form onSubmit={sendMessage} className="flex gap-2 bg-white p-3">
            <label className="sr-only" htmlFor="support-message">Escreva sua mensagem</label>
            <input
              id="support-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={1200}
              disabled={sending}
              placeholder="Escreva sua dúvida..."
              className="h-11 min-w-0 flex-1 rounded-xl border border-[#dfe6ef] px-3 text-sm outline-none focus:border-[#2864d8] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Enviar mensagem"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0b1f3a] text-white transition hover:bg-[#17365f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </form>
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=Atendimento%20TributAI`}
            className="bg-white px-3 pb-3 text-center text-xs font-semibold text-[#2864d8] hover:underline"
          >
            Falar com atendimento humano
          </a>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? "Fechar atendimento" : "Abrir atendimento"}
        className="grid h-14 w-14 place-items-center rounded-full bg-[#0b1f3a] text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#17365f]"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-4-.99L3 21l1.99-5.5a8.4 8.4 0 0 1-.99-4A8.5 8.5 0 1 1 21 11.5Z" />
            <path d="M8 12h.01M12 12h.01M16 12h.01" />
          </svg>
        )}
      </button>
    </div>
  );
}
