"use client";

import { useState } from "react";

const PREVIEWS = [
  { id: "clientes", label: "Clientes" },
  { id: "simulacoes", label: "Simulações" },
  { id: "protecao", label: "Proteção" },
] as const;

type Preview = (typeof PREVIEWS)[number]["id"];

function MiniIcon({ name }: { name: "users" | "document" | "shield" }) {
  const paths = {
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 3 4.6V20" /></>,
    document: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></>,
    shield: <><path d="M12 3 4.5 6v5.5c0 4.5 3.1 7.7 7.5 9.5 4.4-1.8 7.5-5 7.5-9.5V6L12 3Z" /><path d="m9 12 2 2 4-4" /></>,
  };

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function PreviewContent({ preview }: { preview: Preview }) {
  if (preview === "clientes") {
    return (
      <div className="preview-enter">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#596981]">Cadastro de clientes</p>
            <h3 className="mt-2 text-lg font-bold text-[#10213f]">Tudo em seu devido lugar.</h3>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eaf7f2] text-[#11664d]"><MiniIcon name="users" /></span>
        </div>
        <div className="mt-5 space-y-2.5">
          {[
            ["Informações da empresa", "Cadastro centralizado"],
            ["Status do cadastro", "Ativo, rascunho ou arquivado"],
            ["Acesso", "Separado por escritório"],
          ].map(([label, value], index) => (
            <div key={label} className="preview-row flex items-center gap-3 rounded-xl border border-[#edf0f5] bg-white px-3.5 py-3" style={{ animationDelay: `${index * 70}ms` }}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f3f7fb] text-xs font-bold text-[#596981]">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1"><span className="block text-xs font-bold text-[#263752]">{label}</span><span className="mt-0.5 block text-[11px] text-[#596981]">{value}</span></span>
              <span className="h-2 w-2 rounded-full bg-[#39b78c]" />
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-[#596981]">Prévia ilustrativa · não contém dados reais</p>
      </div>
    );
  }

  if (preview === "simulacoes") {
    return (
      <div className="preview-enter">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#596981]">Simulador tributário</p>
            <h3 className="mt-2 text-lg font-bold text-[#10213f]">Prepare uma operação.</h3>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf4ff] text-[#2864d8]"><MiniIcon name="document" /></span>
        </div>
        <div className="mt-5 rounded-xl border border-[#edf0f5] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#263752]">Rascunho da simulação</span>
            <span className="rounded-full bg-[#fff7df] px-2.5 py-1 text-[10px] font-bold text-[#94620f]">Pendente</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-[#f6f8fb] p-3"><span className="text-[10px] font-semibold text-[#596981]">Empresa</span><p className="mt-1 text-xs font-bold text-[#53647d]">Selecionada no painel</p></div>
            <div className="rounded-lg bg-[#f6f8fb] p-3"><span className="text-[10px] font-semibold text-[#596981]">Período</span><p className="mt-1 text-xs font-bold text-[#53647d]">Informado pelo usuário</p></div>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#f0dfb9] bg-[#fff9e9] p-3">
          <span className="mt-0.5 text-[#ad7319]"><MiniIcon name="document" /></span>
          <p className="text-[11px] leading-5 text-[#806d4d]">O sistema salva o rascunho; os motores tributários ainda não calculam impostos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-enter">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#596981]">Acesso protegido</p>
          <h3 className="mt-2 text-lg font-bold text-[#10213f]">Cada escritório no seu espaço.</h3>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eaf7f2] text-[#11664d]"><MiniIcon name="shield" /></span>
      </div>
      <div className="mt-5 rounded-2xl bg-[#0b1f3a] p-5 text-white">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-xs font-black">TA</span>
          <div><p className="text-sm font-bold">Área do escritório</p><p className="mt-1 text-[11px] text-[#b9c9de]">Sessão autenticada</p></div>
          <span className="ml-auto h-2.5 w-2.5 rounded-full bg-[#62d6aa]" />
        </div>
        <div className="mt-5 h-px bg-white/10" />
        <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
          <div><p className="text-[#91a2bc]">Seus registros</p><p className="mt-1 font-bold">Acesso controlado</p></div>
          <div><p className="text-[#91a2bc]">Separação</p><p className="mt-1 font-bold">Por escritório</p></div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#eaf7f2] px-3.5 py-3 text-[11px] font-semibold text-[#11664d]">
        <MiniIcon name="shield" />
        Proteções de acesso aplicadas no servidor e no banco.
      </div>
      <p className="mt-3 text-[10px] text-[#596981]">Demonstração da experiência · não exibe dados reais</p>
    </div>
  );
}

export default function ProductShowcase() {
  const [activePreview, setActivePreview] = useState<Preview>("clientes");

  return (
    <section className="showcase-shell rounded-[24px] border border-white/80 bg-white/90 p-3.5 shadow-[0_30px_90px_-38px_rgba(11,31,58,0.38)] backdrop-blur sm:rounded-[28px] sm:p-5" aria-label="Demonstração interativa do produto">
      <div className="flex items-center justify-between gap-3 border-b border-[#edf0f5] px-1 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1.5" aria-hidden="true"><i className="h-2 w-2 rounded-full bg-[#f1a4a4]" /><i className="h-2 w-2 rounded-full bg-[#f0c66c]" /><i className="h-2 w-2 rounded-full bg-[#62d6aa]" /></span>
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#596981] sm:text-[11px]">Prévia da plataforma</span>
        </div>
        <span className="rounded-full bg-[#eaf7f2] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#11664d] sm:text-[10px]">Demonstração</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5 rounded-xl bg-[#f3f6fa] p-1" role="group" aria-label="Escolha uma prévia">
        {PREVIEWS.map((preview) => (
          <button
            key={preview.id}
            type="button"
            aria-pressed={activePreview === preview.id}
            onClick={() => setActivePreview(preview.id)}
            className={`min-h-9 flex-1 rounded-lg px-2.5 text-[11px] font-bold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#11664d] sm:text-xs ${
              activePreview === preview.id
                ? "bg-white text-[#10213f] shadow-sm"
                : "text-[#596981] hover:text-[#10213f]"
            }`}
          >
            {preview.label}
          </button>
        ))}
      </div>

      <div key={activePreview} className="mt-4 min-h-[300px] rounded-2xl bg-[#f8fafc] p-3.5 sm:min-h-[326px] sm:p-4" aria-live="polite">
        <PreviewContent preview={activePreview} />
      </div>

      <div className="mt-3 flex items-center gap-2 px-1 text-[10px] leading-4 text-[#596981]">
        <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-[#cad4e1] text-[9px] font-bold">i</span>
        Conteúdo ilustrativo. Seus dados só aparecem após entrar na conta.
      </div>
    </section>
  );
}
