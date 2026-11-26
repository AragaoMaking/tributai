"use client";

import { useState } from "react";
import { SUPPORT_EMAIL } from "@/lib/site";

const requestTypes = [
  "Confirmação ou acesso aos dados",
  "Correção de dados",
  "Anonimização, bloqueio ou eliminação",
  "Informações sobre compartilhamento",
  "Revogação de consentimento ou outra solicitação",
];

export default function DataRequestForm() {
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState(requestTypes[0]);
  const [status, setStatus] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = encodeURIComponent("Solicitação sobre dados pessoais - TributAI");
    const body = encodeURIComponent(
      `E-mail usado na conta: ${email.trim()}\nSolicitação: ${requestType}\n\nNão inclua CPF, CNPJ, documentos ou dados de clientes.`,
    );
    setStatus(
      "Seu aplicativo de e-mail deve abrir com a solicitação. Revise e envie a mensagem para registrar o pedido.",
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <label className="block text-sm font-semibold">
        E-mail associado à conta
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)]"
        />
      </label>
      <label className="block text-sm font-semibold">
        Tipo de solicitação
        <select
          value={requestType}
          onChange={(event) => setRequestType(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)]"
        >
          {requestTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>
      <p className="text-sm leading-6 text-[var(--muted)]">
        O formulário não envia nem armazena a solicitação no site. Ele prepara um e-mail para
        atendimento; o pedido só será recebido quando você enviar a mensagem. Não inclua
        documentos, CPF, CNPJ ou dados de clientes.
      </p>
      <button type="submit" className="min-h-11 rounded-lg bg-[var(--navy)] px-5 text-sm font-bold text-white">
        Preparar e-mail
      </button>
      {status && <p role="status" className="text-sm font-semibold text-[var(--green)]">{status}</p>}
    </form>
  );
}
