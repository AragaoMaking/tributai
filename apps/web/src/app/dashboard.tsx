"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SupportAgent from "@/components/support-agent";
import { createClient } from "@/lib/supabase/client";

type IconName =
  | "grid"
  | "users"
  | "calculator"
  | "compare"
  | "book"
  | "report"
  | "bell"
  | "spark"
  | "team"
  | "card"
  | "settings"
  | "search"
  | "theme"
  | "menu"
  | "plus"
  | "chevron"
  | "trend"
  | "pending"
  | "arrow";

type ClientRecord = {
  id: string;
  razao: string;
  fantasia: string;
  cnpj: string;
  regime: string;
  cnae: string;
  uf: string;
  municipio: string;
  faturamento: string;
  email: string;
  status: "ativo" | "rascunho" | "arquivado";
};

function validCnpj(value: string) {
  const cnpj = value.replace(/\D/g, "");
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  const calculateDigit = (digits: string, weights: number[]) => {
    const sum = digits.split("").reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calculateDigit(cnpj.slice(0, 12) + firstDigit, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return cnpj.endsWith(`${firstDigit}${secondDigit}`);
}

function regimeLabel(regime: string | null) {
  const labels: Record<string, string> = {
    simples: "Simples Nacional",
    presumido: "Lucro Presumido",
    real: "Lucro Real",
  };
  return regime ? labels[regime] || regime : "";
}

const NAV = [
  { slug: "visao-geral", label: "Visão geral", icon: "grid" },
  { slug: "clientes", label: "Clientes", icon: "users" },
  { slug: "simulador", label: "Simulador tributário", icon: "calculator" },
  { slug: "comparador", label: "Comparador de regimes", icon: "compare", phase: "Fase 6" },
  { slug: "reforma", label: "Reforma Tributária", icon: "book", phase: "Fase 9" },
  { slug: "relatorios", label: "Relatórios", icon: "report", phase: "Fase 7" },
  { slug: "alertas", label: "Alertas tributários", icon: "bell", phase: "Fase 9" },
  { slug: "assistente", label: "Assistente IA", icon: "spark" },
  { slug: "equipe", label: "Equipe", icon: "team", phase: "Fase 2" },
  { slug: "assinatura", label: "Assinatura", icon: "card" },
  { slug: "configuracoes", label: "Configurações", icon: "settings" },
] as const;

function Icon({ name, size = 18 }: { name: IconName | string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    calculator: <><rect x="4" y="2" width="16" height="20" rx="3"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></>,
    compare: <><path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/><path d="m3 8 5 5-5 3M21 8l-5 5 5 3"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    report: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    spark: <><path d="m12 3-1.7 4.3L6 9l4.3 1.7L12 15l1.7-4.3L18 9l-4.3-1.7L12 3z"/><path d="m19 15-.8 2.2L16 18l2.2.8L19 21l.8-2.2L22 18l-2.2-.8L19 15z"/></>,
    team: <><circle cx="12" cy="8" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></>,
    card: <><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h3"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06A1.7 1.7 0 0 0 16 18.34a1.7 1.7 0 0 0-1 .66l-.09.16V21h-2.54v-.84l-.09-.16a1.7 1.7 0 0 0-1-.66 1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 7.94 16a1.7 1.7 0 0 0-.66-1l-.16-.09H4v-2.54h.84l.16-.09a1.7 1.7 0 0 0 .66-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.8-1.8.06.06A1.7 1.7 0 0 0 9 7.94a1.7 1.7 0 0 0 1-.66l.09-.16V4h2.54v.84l.09.16a1.7 1.7 0 0 0 1 .66 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.8 1.8-.06.06A1.7 1.7 0 0 0 18.06 9a1.7 1.7 0 0 0 .66 1l.16.09H21v2.54h-.84l-.16.09a1.7 1.7 0 0 0-.66 1z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    theme: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    trend: <><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></>,
    pending: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10">
        <span className="text-xl font-black tracking-tight text-white">T<span className="text-[#62d6aa]">A</span></span>
      </div>
      <div>
        <div className="text-[20px] font-bold leading-none tracking-tight text-white">Tribut<span className="text-[#62d6aa]">AI</span></div>
        <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.16em] text-[#91a2bc]">Inteligência tributária</div>
      </div>
    </div>
  );
}

function Metric({ label, value, note, tone = "neutral", icon }: { label: string; value: string; note: string; tone?: "neutral" | "good" | "warn"; icon: IconName }) {
  const toneClass = tone === "good" ? "bg-[var(--green-soft)] text-[var(--green)]" : tone === "warn" ? "bg-[var(--amber-soft)] text-[var(--amber)]" : "bg-[var(--blue-soft)] text-[var(--blue)]";
  return (
    <article className="card-shell interactive-card p-5">
      <div className="flex items-start justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]">{label}</span>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${toneClass}`}><Icon name={icon} size={17}/></span>
      </div>
      <div className="mt-4 text-[28px] font-bold tracking-tight text-[var(--foreground)]">{value}</div>
      <div className="mt-1 text-[12px] text-[var(--muted)]">{note}</div>
    </article>
  );
}

function Placeholder({ title, phase, description }: { title: string; phase: string; description: string }) {
  const router = useRouter();
  return (
    <div className="fade-in">
      <div className="card-shell relative overflow-hidden p-8 md:p-10">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[var(--blue-soft)] opacity-70"/>
        <div className="relative max-w-xl">
          <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{phase}</span>
          <h2 className="mt-5 text-2xl font-bold tracking-tight">{title}</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">{description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => router.push("/visao-geral")} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface-soft)]">Voltar ao painel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ slug }: { slug: string }) {
  const router = useRouter();
  const item = NAV.find((entry) => entry.slug === slug) || NAV[0];
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [period, setPeriod] = useState<"Semestral" | "Anual">("Semestral");
  const [clientSearch, setClientSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [accountName, setAccountName] = useState("Administrador");
  const [officeName, setOfficeName] = useState("Meu escritório");
  const [planName, setPlanName] = useState("Profissional");
  const [officeId, setOfficeId] = useState("");
  const [userId, setUserId] = useState("");
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [dataReady, setDataReady] = useState(false);
  const [dataError, setDataError] = useState("");
  const [savingClient, setSavingClient] = useState(false);
  const [clientWizardOpen, setClientWizardOpen] = useState(false);
  const [clientStep, setClientStep] = useState(1);
  const [clientDraft, setClientDraft] = useState({
    razao: "",
    fantasia: "",
    cnpj: "",
    regime: "",
    cnae: "",
    uf: "",
    municipio: "",
    faturamento: "",
    email: "",
  });
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [simulations, setSimulations] = useState<Array<{ id: string; name: string; year: string; status: string }>>([]);
  const [simulationItems, setSimulationItems] = useState<Array<{ id: string; description: string; base: string }>>([]);
  const [simulationCompanyId, setSimulationCompanyId] = useState("");
  const [simulationYear, setSimulationYear] = useState("2027");
  const [simulationDate, setSimulationDate] = useState("");
  const [simulationMunicipality, setSimulationMunicipality] = useState("");
  const [savingSimulation, setSavingSimulation] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ title: string; message: string; read: boolean }>>([]);
  const [viewClientId, setViewClientId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const savedTheme = window.localStorage.getItem("tributai-theme");
    if (savedTheme === "dark") window.requestAnimationFrame(() => setDark(true));

    async function loadWorkspace() {
      try {
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          router.replace("/login");
          return;
        }

        const [profileResult, membershipResult] = await Promise.all([
          supabase.from("perfis").select("nome").eq("id", user.id).maybeSingle(),
          supabase.from("membros").select("escritorio_id").eq("usuario_id", user.id).eq("ativo", true).limit(1).maybeSingle(),
        ]);
        if (profileResult.error) throw profileResult.error;
        if (membershipResult.error) throw membershipResult.error;
        if (!membershipResult.data?.escritorio_id) {
          throw new Error("Sua conta ainda não está vinculada a um escritório. Peça ao administrador para revisar o cadastro.");
        }

        const currentOfficeId = membershipResult.data.escritorio_id;
        const [officeResult, companiesResult, simulationsResult, subscriptionResult, notificationsResult] = await Promise.all([
          supabase.from("escritorios").select("nome").eq("id", currentOfficeId).single(),
          supabase.from("empresas").select("id, razao_social, nome_fantasia, cnpj, regime, cnae_principal, uf, municipio, faturamento_mensal, contato, status").order("atualizado_em", { ascending: false }),
          supabase.from("simulacoes").select("id, empresa_id, periodo_ano, pendencias").order("criada_em", { ascending: false }),
          supabase.from("assinaturas").select("plano_id").eq("escritorio_id", currentOfficeId).maybeSingle(),
          supabase.from("notificacoes").select("titulo, mensagem, lida").order("criada_em", { ascending: false }).limit(10),
        ]);
        if (officeResult.error) throw officeResult.error;
        if (companiesResult.error) throw companiesResult.error;
        if (simulationsResult.error) throw simulationsResult.error;
        if (subscriptionResult.error) throw subscriptionResult.error;
        if (notificationsResult.error) throw notificationsResult.error;

        const loadedClients: ClientRecord[] = (companiesResult.data || []).map((company) => {
          const contact = company.contato && typeof company.contato === "object"
            ? company.contato as { email?: string }
            : {};
          const revenue = company.faturamento_mensal === null ? "" : new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(Number(company.faturamento_mensal));
          return {
            id: company.id,
            razao: company.razao_social,
            fantasia: company.nome_fantasia || "",
            cnpj: (company.cnpj || "").trim(),
            regime: regimeLabel(company.regime),
            cnae: company.cnae_principal || "",
            uf: company.uf || "",
            municipio: company.municipio || "",
            faturamento: revenue,
            email: contact.email || "",
            status: company.status as ClientRecord["status"],
          };
        });
        const planLabels: Record<string, string> = {
          starter: "Starter",
          profissional: "Profissional",
          escritorio: "Escritório",
        };
        const clientNames = new Map(loadedClients.map((client) => [client.id, client.razao]));

        if (!active) return;
        setUserId(user.id);
        setOfficeId(currentOfficeId);
        setAccountName(profileResult.data?.nome || user.email || "Usuário");
        setOfficeName(officeResult.data.nome);
        setPlanName(planLabels[subscriptionResult.data?.plano_id || "starter"] || "Starter");
        setClients(loadedClients);
        setSimulations((simulationsResult.data || []).map((simulation) => ({
          id: simulation.id,
          name: clientNames.get(simulation.empresa_id) || "Empresa",
          year: String(simulation.periodo_ano),
          status: Array.isArray(simulation.pendencias) && simulation.pendencias.length
            ? "Pendente do motor"
            : "Registrada",
        })));
        setNotifications((notificationsResult.data || []).map((notification) => ({
          title: notification.titulo,
          message: notification.mensagem || "",
          read: notification.lida,
        })));
      } catch (error) {
        if (!active) return;
        setDataError(error instanceof Error
          ? error.message
          : "Não foi possível carregar os dados do escritório.");
      } finally {
        if (active) setDataReady(true);
      }
    }

    void loadWorkspace();
    return () => { active = false; };
  }, [router]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("tributai-theme", dark ? "dark" : "light");
  }, [dark]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };

  const signOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast("Não foi possível encerrar a sessão. Tente novamente.");
      return;
    }
    router.replace("/login");
    router.refresh();
  };

  const saveClientDraft = async (status: ClientRecord["status"]) => {
    if (!clientDraft.razao.trim()) {
      showToast("Informe a razão social.");
      return;
    }
    const cnpj = clientDraft.cnpj.replace(/\D/g, "");
    if (status === "ativo" && !validCnpj(cnpj)) {
      showToast("Informe um CNPJ válido para ativar a empresa.");
      return;
    }
    if (!officeId) {
      showToast("Não foi possível identificar o escritório desta conta.");
      return;
    }
    const regimeValues: Record<string, string | null> = {
      "Simples Nacional": "simples",
      "Lucro Presumido": "presumido",
      "Lucro Real": "real",
      "": null,
    };
    const revenueText = clientDraft.faturamento.trim().replace(/\./g, "").replace(",", ".");
    const revenue = revenueText ? Number(revenueText) : null;
    if (revenueText && (revenue === null || !Number.isFinite(revenue) || revenue < 0)) {
      showToast("Informe um faturamento válido ou deixe o campo vazio.");
      return;
    }

    setSavingClient(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("empresas").insert({
      escritorio_id: officeId,
      cnpj: cnpj || null,
      razao_social: clientDraft.razao.trim(),
      nome_fantasia: clientDraft.fantasia.trim() || null,
      regime: regimeValues[clientDraft.regime] ?? null,
      cnae_principal: clientDraft.cnae.trim() || null,
      uf: clientDraft.uf.trim().toUpperCase() || null,
      municipio: clientDraft.municipio.trim() || null,
      faturamento_mensal: revenue,
      contato: clientDraft.email.trim() ? { email: clientDraft.email.trim() } : {},
      status,
    }).select("id, razao_social, nome_fantasia, cnpj, regime, cnae_principal, uf, municipio, faturamento_mensal, contato, status").single();
    setSavingClient(false);
    if (error) {
      const message = error.code === "23505"
        ? "Esse CNPJ já está cadastrado neste escritório."
        : error.message.includes("Limite do plano")
          ? "O limite de clientes do plano foi atingido."
          : error.message.includes("teste expirou") || error.message.includes("assinatura")
            ? "O plano de teste expirou ou não está ativo."
            : "Não foi possível salvar a empresa. Verifique os dados e tente novamente.";
      showToast(message);
      return;
    }

    const next: ClientRecord = {
      id: data.id,
      razao: data.razao_social,
      fantasia: data.nome_fantasia || "",
      cnpj: (data.cnpj || "").trim(),
      regime: regimeLabel(data.regime),
      cnae: data.cnae_principal || "",
      uf: data.uf || "",
      municipio: data.municipio || "",
      faturamento: data.faturamento_mensal === null ? "" : new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(data.faturamento_mensal)),
      email: clientDraft.email.trim(),
      status: data.status as ClientRecord["status"],
    };
    setClients((current) => [next, ...current]);
    setClientWizardOpen(false);
    setClientStep(1);
    setClientDraft({ razao: "", fantasia: "", cnpj: "", regime: "", cnae: "", uf: "", municipio: "", faturamento: "", email: "" });
    showToast(status === "rascunho" ? "Rascunho salvo no banco de dados." : "Cliente cadastrado no banco de dados.");
  };

  const addSimulationItem = () => {
    setSimulationItems((items) => [
      ...items,
      { id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), description: "Novo item", base: "" },
    ]);
  };

  const saveSimulation = async () => {
    if (!officeId || !userId || !simulationCompanyId) {
      showToast("Selecione uma empresa antes de salvar a simulação.");
      return;
    }
    if (simulationItems.length === 0) {
      showToast("Adicione ao menos um item à operação.");
      return;
    }
    const selectedClient = clients.find((client) => client.id === simulationCompanyId);
    if (!selectedClient) {
      showToast("A empresa selecionada não está disponível.");
      return;
    }

    setSavingSimulation(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("simulacoes").insert({
      escritorio_id: officeId,
      empresa_id: simulationCompanyId,
      usuario_id: userId,
      periodo_ano: Number(simulationYear),
      entrada: {
        data_fato_gerador: simulationDate || null,
        municipio: simulationMunicipality.trim() || null,
        itens: simulationItems.map(({ description, base }) => ({
          descricao: description.trim(),
          base_informada: base.trim() || null,
        })),
      },
      premissas: ["Nenhum tributo foi calculado nesta simulação."],
      pendencias: ["Integração com motor tributário oficial ainda pendente."],
    }).select("id, periodo_ano, pendencias").single();
    setSavingSimulation(false);
    if (error) {
      showToast("Não foi possível salvar a simulação. Confira o acesso à empresa e os dados informados.");
      return;
    }
    setSimulations((current) => [{
      id: data.id,
      name: selectedClient.razao,
      year: String(data.periodo_ano),
      status: "Pendente do motor",
    }, ...current]);
    setSimulationItems([]);
    showToast("Simulação registrada; os valores tributários permanecem pendentes.");
  };

  const changeClientStatus = async (client: ClientRecord) => {
    const status = client.status === "arquivado" ? "ativo" : "arquivado";
    const supabase = createClient();
    const { error } = await supabase
      .from("empresas")
      .update({ status, atualizado_em: new Date().toISOString() })
      .eq("id", client.id);
    if (error) {
      showToast("Não foi possível atualizar o status da empresa.");
      return;
    }
    setClients((current) => current.map((item) => item.id === client.id ? { ...item, status } : item));
    showToast(status === "arquivado" ? "Empresa arquivada." : "Empresa reativada.");
  };

  const deleteClient = async (clientId: string) => {
    const supabase = createClient();
    const { count, error: simulationsError } = await supabase
      .from("simulacoes")
      .select("id", { count: "exact", head: true })
      .eq("empresa_id", clientId);
    if (simulationsError) {
      showToast("Não foi possível conferir o histórico da empresa.");
      return;
    }
    if ((count || 0) > 0) {
      showToast("Esta empresa tem simulações imutáveis. Arquive-a para preservar o histórico.");
      setDeleteClientId(null);
      return;
    }
    const { error } = await supabase.from("empresas").delete().eq("id", clientId);
    if (error) {
      showToast("Não foi possível excluir a empresa. Verifique se há documentos ou relatórios vinculados.");
      return;
    }
    setClients((current) => current.filter((item) => item.id !== clientId));
    setDeleteClientId(null);
    showToast("Empresa excluída.");
  };

  const selectPlan = async (planId: string, label: string) => {
    if (!officeId) {
      showToast("Não foi possível identificar o escritório desta conta.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.rpc("selecionar_plano", {
      p_escritorio_id: officeId,
      p_plano_id: planId,
    });
    if (error) {
      showToast("Não foi possível alterar o plano. A opção local está disponível apenas durante o período de teste.");
      return;
    }
    setPlanName(label);
    showToast(`Plano ${label} selecionado para teste. Esta ação não cobrou; pagamentos de planos são externos ao site.`);
  };

  const renderContent = () => {
    if (slug !== "visao-geral" && slug !== "clientes" && slug !== "simulador" && slug !== "assinatura" && slug !== "configuracoes" && slug !== "assistente") {
      const phases: Record<string, string> = { comparador: "Fase 6", reforma: "Fase 9", relatorios: "Fase 7", alertas: "Fase 9", equipe: "Fase 2" };
      const descriptions: Record<string, string> = {
        comparador: "Compare Simples Nacional, Lucro Presumido e Lucro Real lado a lado, sem apresentar um regime como melhor enquanto faltarem dados oficiais.",
        reforma: "Acompanhe a transição tributária de 2026 a 2033 com fontes oficiais e pendências identificadas.",
        relatorios: "Visualize, baixe e compartilhe relatórios com memória de cálculo, premissas e fundamentação.",
        alertas: "Receba novidades relevantes por empresa, mantendo eventos fiscais separados das estimativas.",
        equipe: "Convide colaboradores, atribua papéis e restrinja o acesso a empresas específicas.",
      };
      return <Placeholder title={item.label} phase={phases[slug] ? `Planejado · ${phases[slug]}` : "Planejado"} description={descriptions[slug]}/>;
    }

    if (slug === "assistente") {
      return (
        <div className="fade-in mx-auto w-full max-w-3xl space-y-5">
          <section className="card-shell p-6 md:p-8">
            <span className="inline-flex rounded-full bg-[var(--green-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--green)]">Atendimento com IA</span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight">Como posso ajudar?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Tire dúvidas sobre o TributAI e consulte informações tributárias gerais com referências oficiais. O assistente não faz cálculos fiscais nem substitui um contador.
            </p>
          </section>
          <SupportAgent embedded />
        </div>
      );
    }

    if (slug === "clientes") {
      const filteredClients = clients.filter((client) => {
        const query = clientSearch.trim().toLowerCase();
        return !query || `${client.razao} ${client.cnpj} ${client.fantasia}`.toLowerCase().includes(query);
      });
      return (
        <div className="fade-in space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"><Icon name="search" size={17}/></span>
              <input value={clientSearch} onChange={(event) => setClientSearch(event.target.value)} className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-[var(--blue-soft)]" placeholder="Buscar empresa ou CNPJ"/>
            </div>
            <button onClick={() => { setClientStep(1); setClientWizardOpen(true); }} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:brightness-110">
              <Icon name="plus" size={17}/> Novo cliente
            </button>
          </div>
          <div className="card-shell overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--surface-soft)] text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                  <tr><th className="px-5 py-3 font-semibold">Empresa</th><th className="px-5 py-3 font-semibold">Regime</th><th className="px-5 py-3 font-semibold">Faturamento</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3"/></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredClients.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-[var(--muted)]">Nenhuma empresa cadastrada. Clique em “Novo cliente” para começar.</td></tr>
                  ) : filteredClients.map((client) => (
                    <tr key={client.id} className="transition hover:bg-[var(--surface-soft)]">
                      <td className="px-5 py-4"><div className="font-bold">{client.razao}</div><div className="mt-1 text-xs text-[var(--muted)]">{client.cnpj || "CNPJ não informado"}</div></td>
                      <td className="px-5 py-4 text-[var(--muted)]">{client.regime || "Não definido"}</td>
                      <td className="px-5 py-4 font-semibold">{client.faturamento ? `R$ ${client.faturamento}` : "—"}</td>
                      <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${client.status === "rascunho" ? "bg-[var(--amber-soft)] text-[var(--amber)]" : client.status === "arquivado" ? "bg-[var(--surface-soft)] text-[var(--muted)]" : "bg-[var(--green-soft)] text-[var(--green)]"}`}>{client.status === "rascunho" ? "Rascunho" : client.status === "arquivado" ? "Arquivado" : "Ativo"}</span></td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button onClick={() => setViewClientId(client.id)} className="mr-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-bold hover:bg-[var(--surface-soft)]">Abrir</button>
                        <button onClick={() => void changeClientStatus(client)} className="mr-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-bold hover:bg-[var(--surface-soft)]">{client.status === "arquivado" ? "Reativar" : "Arquivar"}</button>
                        {deleteClientId === client.id ? (
                          <button onClick={() => void deleteClient(client.id)} className="rounded-lg bg-[var(--red-soft)] px-3 py-1.5 text-xs font-bold text-[var(--red)]">Confirmar</button>
                        ) : (
                          <button onClick={() => setDeleteClientId(client.id)} className="rounded-lg border border-[var(--red-soft)] px-3 py-1.5 text-xs font-bold text-[var(--red)]">Excluir</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (slug === "simulador") {
      return (
        <div className="fade-in grid gap-5 xl:grid-cols-[1fr_340px]">
          <div className="card-shell p-5 md:p-7">
            <div className="flex items-center justify-between">
              <div><h2 className="font-bold">Nova simulação</h2><p className="mt-1 text-sm text-[var(--muted)]">Monte a operação antes do motor oficial.</p></div>
              <span className="rounded-full bg-[var(--amber-soft)] px-3 py-1 text-xs font-bold text-[var(--amber)]">Rascunho</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold text-[var(--muted)]">Empresa<select value={simulationCompanyId} onChange={(event) => setSimulationCompanyId(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"><option value="">Selecione uma empresa</option>{clients.filter((client) => client.status === "ativo").map((client) => <option key={client.id} value={client.id}>{client.razao}</option>)}</select></label>
              <label className="text-xs font-bold text-[var(--muted)]">Ano de referência<select value={simulationYear} onChange={(event) => setSimulationYear(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm">{Array.from({ length: 8 }, (_, index) => 2026 + index).map((year) => <option key={year}>{year}</option>)}</select></label>
              <label className="text-xs font-bold text-[var(--muted)]">Data do fato gerador<input value={simulationDate} onChange={(event) => setSimulationDate(event.target.value)} type="date" className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"/></label>
              <label className="text-xs font-bold text-[var(--muted)]">Município<input value={simulationMunicipality} onChange={(event) => setSimulationMunicipality(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" placeholder="Código IBGE"/></label>
            </div>
            <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-5">
              <div className="flex items-center justify-between"><div><h3 className="text-sm font-bold">Itens da operação</h3><p className="mt-1 text-xs text-[var(--muted)]">{simulationItems.length ? `${simulationItems.length} item(ns) preparado(s)` : "Nenhum item adicionado"}</p></div><button onClick={addSimulationItem} className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] transition hover:bg-[var(--surface-soft)]"><Icon name="plus" size={16}/></button></div>
              {simulationItems.map((item) => (
                <div key={item.id} className="mt-3 grid gap-3 sm:grid-cols-[1fr_180px_auto]">
                  <input value={item.description} onChange={(event) => setSimulationItems((items) => items.map((entry) => entry.id === item.id ? { ...entry, description: event.target.value } : entry))} className="h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" placeholder="Descrição"/>
                  <input value={item.base} onChange={(event) => setSimulationItems((items) => items.map((entry) => entry.id === item.id ? { ...entry, base: event.target.value } : entry))} className="h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" placeholder="Base de cálculo"/>
                  <button onClick={() => setSimulationItems((items) => items.filter((entry) => entry.id !== item.id))} className="h-10 rounded-lg border border-[var(--red-soft)] px-3 text-xs font-bold text-[var(--red)]">Remover</button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end"><button onClick={() => void saveSimulation()} disabled={savingSimulation || clients.filter((client) => client.status === "ativo").length === 0} className="rounded-xl bg-[var(--navy)] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{savingSimulation ? "Salvando..." : "Salvar simulação pendente"}</button></div>
            {clients.filter((client) => client.status === "ativo").length === 0 && <p className="mt-3 text-right text-xs text-[var(--muted)]">Cadastre uma empresa ativa antes de criar a simulação.</p>}
          </div>
          <aside className="card-shell p-5">
            <h3 className="font-bold">Origem dos valores</h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-[var(--surface-soft)] p-4"><div className="flex items-center gap-2 text-sm font-bold"><span className="h-2 w-2 rounded-full bg-[var(--green)]"/>Motor RFB</div><p className="mt-2 text-xs leading-5 text-[var(--muted)]">Conectado nesta fase: não</p></div>
              <div className="rounded-xl bg-[var(--surface-soft)] p-4"><div className="flex items-center gap-2 text-sm font-bold"><span className="h-2 w-2 rounded-full bg-[var(--amber)]"/>Pendente</div><p className="mt-2 text-xs leading-5 text-[var(--muted)]">ICMS, ISS, PIS, COFINS e IPI não serão estimados.</p></div>
            </div>
          </aside>
        </div>
      );
    }

    if (slug === "assinatura") {
      return (
        <div className="fade-in grid gap-5 lg:grid-cols-3">
          {[
            ["Starter", "Até 10 clientes", "R$ —", false],
            ["Profissional", "Até 100 clientes", "R$ —", true],
            ["Escritório", "Limite configurável", "Sob consulta", false],
          ].map(([name, limit, price, featured]) => (
            <article key={String(name)} className={`card-shell interactive-card relative p-6 ${featured ? "ring-2 ring-[var(--blue)]" : ""}`}>
              {featured && <span className="absolute right-4 top-4 rounded-full bg-[var(--blue-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--blue)]">Mais usado</span>}
              <h2 className="text-lg font-bold">{name}</h2><p className="mt-2 text-sm text-[var(--muted)]">{String(limit)}</p>
              <div className="mt-6 text-2xl font-bold">{String(price)}</div>
              <button onClick={() => void selectPlan(name === "Starter" ? "starter" : name === "Profissional" ? "profissional" : "escritorio", String(name))} className={`mt-6 h-11 w-full rounded-xl text-sm font-bold ${featured ? "bg-[var(--blue)] text-white" : "border border-[var(--border)]"}`}>Selecionar plano</button>
            </article>
          ))}
        </div>
      );
    }

    if (slug === "configuracoes") {
      return (
        <div className="fade-in grid gap-5 lg:grid-cols-2">
          <div className="card-shell p-6"><h2 className="font-bold">Aparência</h2><p className="mt-2 text-sm text-[var(--muted)]">Personalize o ambiente de trabalho.</p><button onClick={() => setDark((value) => !value)} className="mt-5 flex h-12 w-full items-center justify-between rounded-xl border border-[var(--border)] px-4 text-sm font-semibold"><span>Tema escuro</span><span className={`relative h-6 w-11 rounded-full transition ${dark ? "bg-[var(--blue)]" : "bg-[var(--border)]"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${dark ? "left-6" : "left-1"}`}/></span></button></div>
          <div className="card-shell p-6"><h2 className="font-bold">Workspace</h2><p className="mt-2 text-sm text-[var(--muted)]">Conta autenticada pelo Supabase e dados isolados por escritório com RLS.</p><div className="mt-5 rounded-xl bg-[var(--green-soft)] p-4 text-sm text-[var(--green)]">{officeName} · sessão protegida</div></div>
        </div>
      );
    }

    return (
      <div className="fade-in space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Clientes" value={String(clients.length)} note={clients.length ? `${clients.filter((client) => client.status === "ativo").length} ativos` : "Nenhum cadastrado"} icon="users" tone="good"/>
          <Metric label="Pendências" value={String(clients.filter((client) => client.status !== "ativo").length)} note="Cadastros incompletos" icon="pending" tone="warn"/>
          <Metric label="Simulações" value={String(simulations.length)} note={simulations.length ? "Todas aguardando cálculo oficial" : "Nenhuma salva nesta sessão"} icon="calculator"/>
          <Metric label="Relatórios" value="—" note="Disponível na fase 7" icon="report"/>
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
          <article className="card-shell p-5 md:p-6">
            <div className="flex items-center justify-between"><div><h2 className="font-bold">Atividade tributária</h2><p className="mt-1 text-sm text-[var(--muted)]">{period === "Semestral" ? "Últimos 6 meses" : "Últimos 12 meses"}</p></div><button onClick={() => setPeriod((value) => value === "Semestral" ? "Anual" : "Semestral")} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold">{period}</button></div>
            <div className="mt-8 grid h-52 place-items-center rounded-xl border border-dashed border-[var(--border)] px-6 text-center text-sm text-[var(--muted)]">
              Ainda não há histórico de cálculos oficiais para exibir. Simulações sem motor conectado não entram neste gráfico.
            </div>
          </article>
          <article className="card-shell p-5 md:p-6">
            <div className="flex items-center justify-between"><h2 className="font-bold">Ações rápidas</h2><span className="text-xs text-[var(--muted)]">Hoje</span></div>
            <div className="mt-4 space-y-2">
              {[
                ["Novo cliente", "Cadastrar uma empresa", "users"],
                ["Nova simulação", "Preparar operação fiscal", "calculator"],
                ["Gerar relatório", "Planejado para fase 7", "report"],
              ].map(([title, description, icon], index) => (
                <button key={title} onClick={() => {
                  if (index === 0) setModalOpen(true);
                  else if (index === 1) router.push("/simulador");
                  else router.push("/relatorios");
                }} className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] p-3 text-left transition hover:bg-[var(--surface-soft)]">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--blue-soft)] text-[var(--blue)]"><Icon name={icon} size={17}/></span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-bold">{title}</span><span className="mt-0.5 block text-xs text-[var(--muted)]">{description}</span></span>
                  <Icon name="chevron" size={15}/>
                </button>
              ))}
            </div>
          </article>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <article className="card-shell p-5 md:p-6">
            <div className="flex items-center justify-between"><h2 className="font-bold">Empresas com pendências</h2><Link href="/clientes" className="text-xs font-bold text-[var(--blue)]">Ver todas</Link></div>
            <div className="mt-4 space-y-3">
              {clients.filter((client) => client.status !== "ativo").slice(0, 5).map((client) => (
                <div key={client.id} className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3"><span className="h-2.5 w-2.5 rounded-full bg-[var(--amber)]"/><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{client.razao}</div><div className="mt-0.5 text-xs text-[var(--muted)]">{client.status === "rascunho" ? "Cadastro em rascunho" : "Empresa arquivada"}</div></div><Icon name="chevron" size={15}/></div>
              ))}
              {clients.filter((client) => client.status !== "ativo").length === 0 && <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted)]">Nenhuma pendência cadastrada.</p>}
            </div>
          </article>
          <article className="card-shell p-5 md:p-6">
            <div className="flex items-center justify-between"><h2 className="font-bold">Atividades recentes</h2><span className="text-xs text-[var(--muted)]">Auditoria pendente</span></div>
            <div className="mt-4 space-y-4">
              <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted)]">O histórico de auditoria será exibido aqui quando as ações do sistema estiverem conectadas ao log do banco.</p>
            </div>
          </article>
        </div>
      </div>
    );
  };

  if (!dataReady) {
    return (
      <main id="main-content" className="grid min-h-screen place-items-center bg-[var(--background)] px-5">
        <p role="status" className="text-sm font-semibold text-[var(--muted)]">Carregando os dados protegidos do escritório...</p>
      </main>
    );
  }

  if (dataError) {
    return (
      <main id="main-content" className="grid min-h-screen place-items-center bg-[var(--background)] px-5">
        <section className="card-shell w-full max-w-lg p-7">
          <h1 className="text-xl font-bold">Não foi possível abrir o escritório</h1>
          <p role="alert" className="mt-3 text-sm leading-6 text-[var(--muted)]">{dataError}</p>
          <button onClick={() => router.replace("/login")} className="mt-5 h-11 rounded-xl bg-[var(--navy)] px-5 text-sm font-bold text-white">Voltar ao login</button>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {menuOpen && <button aria-label="Fechar menu" className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMenuOpen(false)}/>}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[264px] bg-[var(--navy)] px-3 py-5 transition-transform duration-200 lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-3"><Brand/></div>
        <nav className="scrollbar-subtle mt-7 max-h-[calc(100vh-180px)] space-y-1 overflow-y-auto px-1">
          {NAV.map((nav) => {
            const phase = "phase" in nav ? nav.phase : undefined;
            return (
              <Link key={nav.slug} href={`/${nav.slug}`} onClick={() => setMenuOpen(false)} className={`flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] transition ${slug === nav.slug ? "bg-white/[0.14] font-bold text-white" : "text-[#c2cfe2] hover:bg-white/[0.07] hover:text-white"}`}>
                <Icon name={nav.icon} size={17}/><span className="flex-1">{nav.label}</span>{phase && <span className="rounded-md bg-white/[0.07] px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-[#91a2bc]">{phase}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-5 left-3 right-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-[10px] leading-5 text-[#91a2bc]">
          <span className="font-bold text-[#cfe0f8]">Supabase local</span><br/>Dados protegidos por escritório.
        </div>
      </aside>

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 backdrop-blur-md md:px-7">
          <button aria-label="Abrir menu" onClick={() => setMenuOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] lg:hidden"><Icon name="menu"/></button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Painel tributário</p>
            <h1 className="truncate text-[17px] font-bold">{item.label}</h1>
          </div>
          <div className="relative hidden max-w-[280px] flex-1 md:block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"><Icon name="search" size={16}/></span>
            <input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && globalSearch.trim()) { setClientSearch(globalSearch); router.push("/clientes"); } }} className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm outline-none focus:border-[var(--blue)]" placeholder="Buscar no TributaAI"/>
          </div>
          <button aria-label="Alternar tema" onClick={() => setDark((value) => !value)} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--foreground)]"><Icon name="theme" size={17}/></button>
          <div className="relative">
            <button aria-label="Notificações" onClick={() => setNoticeOpen((value) => !value)} className="relative grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"><Icon name="bell" size={17}/>{notifications.some((notification) => !notification.read) && <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[var(--surface)] bg-[var(--red)]"/>}</button>
            {noticeOpen && <div className="absolute right-0 top-12 w-[280px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl"><div className="px-2 py-1 text-sm font-bold">Notificações</div>{notifications.length ? notifications.map((notification, index) => <div key={`${notification.title}-${index}`} className="mt-2 rounded-lg bg-[var(--surface-soft)] p-3 text-xs leading-5"><div className="font-bold">{notification.title}</div>{notification.message && <p className="mt-1 text-[var(--muted)]">{notification.message}</p>}</div>) : <div className="mt-2 rounded-lg bg-[var(--surface-soft)] p-3 text-xs leading-5 text-[var(--muted)]">Nenhuma notificação registrada.</div>}</div>}
          </div>
          <button onClick={() => setModalOpen(true)} className="hidden h-10 items-center gap-2 rounded-xl bg-[var(--navy)] px-4 text-sm font-bold text-white md:flex"><Icon name="plus" size={16}/>Novo</button>
          <div className="relative">
            <button aria-label="Menu da conta" onClick={() => setAccountOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full bg-[var(--navy-soft)] text-xs font-bold text-white ring-2 ring-[var(--surface)]">
              {accountName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-12 w-[260px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl">
                <div className="px-2 pb-3"><div className="text-sm font-bold">{accountName}</div><div className="mt-1 text-xs text-[var(--muted)]">{officeName}</div><div className="mt-2 inline-flex rounded-full bg-[var(--blue-soft)] px-2 py-1 text-[10px] font-bold text-[var(--blue)]">{planName}</div></div>
                <button onClick={() => router.push("/configuracoes")} className="h-9 w-full rounded-lg px-3 text-left text-sm font-semibold hover:bg-[var(--surface-soft)]">Configurações</button>
                <button onClick={() => void signOut()} className="mt-1 h-9 w-full rounded-lg px-3 text-left text-sm font-semibold text-[var(--red)] hover:bg-[var(--red-soft)]">Sair da conta</button>
              </div>
            )}
          </div>
        </header>
        <main id="main-content" className="mx-auto max-w-[1320px] px-4 py-6 md:px-7 md:py-7">{renderContent()}</main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#07111f]/55 p-4" role="dialog" aria-modal="true">
          <div className="fade-in w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
            <div className="flex items-start justify-between"><div><h2 className="text-lg font-bold">Novo cadastro</h2><p className="mt-1 text-sm text-[var(--muted)]">Escolha o que deseja cadastrar.</p></div><button onClick={() => setModalOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)]">×</button></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link onClick={() => setModalOpen(false)} href="/clientes" className="rounded-xl border border-[var(--border)] p-4 transition hover:bg-[var(--surface-soft)]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--blue-soft)] text-[var(--blue)]"><Icon name="users"/></span><div className="mt-3 text-sm font-bold">Nova empresa</div><div className="mt-1 text-xs text-[var(--muted)]">Cadastro completo em etapas</div></Link>
              <Link onClick={() => setModalOpen(false)} href="/simulador" className="rounded-xl border border-[var(--border)] p-4 transition hover:bg-[var(--surface-soft)]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--green-soft)] text-[var(--green)]"><Icon name="calculator"/></span><div className="mt-3 text-sm font-bold">Nova simulação</div><div className="mt-1 text-xs text-[var(--muted)]">Preparar operação tributária</div></Link>
            </div>
          </div>
        </div>
      )}
      {clientWizardOpen && (
        <div className="fixed inset-0 z-[65] grid place-items-center bg-[#07111f]/55 p-4" role="dialog" aria-modal="true">
          <div className="fade-in w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--blue)]">Etapa {clientStep} de 5</p><h2 className="mt-1 text-xl font-bold">Cadastro da empresa</h2></div>
              <button onClick={() => setClientWizardOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)]">×</button>
            </div>
            <div className="mt-5 flex gap-1">{[1,2,3,4,5].map((step) => <span key={step} className={`h-1.5 flex-1 rounded-full ${step <= clientStep ? "bg-[var(--blue)]" : "bg-[var(--border)]"}`}/>)}</div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {clientStep === 1 && <>
                <label className="text-xs font-bold text-[var(--muted)] sm:col-span-2">Razão social<input value={clientDraft.razao} onChange={(event) => setClientDraft({ ...clientDraft, razao: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" placeholder="Nome oficial da empresa"/></label>
                <label className="text-xs font-bold text-[var(--muted)]">Nome fantasia<input value={clientDraft.fantasia} onChange={(event) => setClientDraft({ ...clientDraft, fantasia: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"/></label>
                <label className="text-xs font-bold text-[var(--muted)]">CNPJ<input value={clientDraft.cnpj} onChange={(event) => setClientDraft({ ...clientDraft, cnpj: event.target.value.replace(/\D/g, "").slice(0,14).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") })} className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" placeholder="00.000.000/0000-00"/></label>
              </>}
              {clientStep === 2 && <>
                <label className="text-xs font-bold text-[var(--muted)]">Regime tributário<select value={clientDraft.regime} onChange={(event) => setClientDraft({ ...clientDraft, regime: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"><option value="">Selecione</option><option>Simples Nacional</option><option>Lucro Presumido</option><option>Lucro Real</option></select></label>
                <label className="text-xs font-bold text-[var(--muted)]">CNAE principal<input value={clientDraft.cnae} onChange={(event) => setClientDraft({ ...clientDraft, cnae: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" placeholder="0000-0/00"/></label>
              </>}
              {clientStep === 3 && <>
                <label className="text-xs font-bold text-[var(--muted)]">Faturamento mensal<input value={clientDraft.faturamento} onChange={(event) => setClientDraft({ ...clientDraft, faturamento: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" inputMode="decimal"/></label>
                <label className="text-xs font-bold text-[var(--muted)]">UF<input value={clientDraft.uf} maxLength={2} onChange={(event) => setClientDraft({ ...clientDraft, uf: event.target.value.toUpperCase() })} className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"/></label>
                <label className="text-xs font-bold text-[var(--muted)] sm:col-span-2">Município<input value={clientDraft.municipio} onChange={(event) => setClientDraft({ ...clientDraft, municipio: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"/></label>
              </>}
              {clientStep === 4 && <>
                <label className="text-xs font-bold text-[var(--muted)] sm:col-span-2">E-mail de contato<input value={clientDraft.email} type="email" onChange={(event) => setClientDraft({ ...clientDraft, email: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" placeholder="contato@empresa.com.br"/></label>
              </>}
              {clientStep === 5 && <div className="sm:col-span-2 rounded-xl bg-[var(--surface-soft)] p-5">
                <h3 className="font-bold">Resumo do cadastro</h3>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-xs text-[var(--muted)]">Empresa</dt><dd className="mt-1 font-bold">{clientDraft.razao || "Não informado"}</dd></div><div><dt className="text-xs text-[var(--muted)]">Regime</dt><dd className="mt-1 font-bold">{clientDraft.regime || "Não informado"}</dd></div><div><dt className="text-xs text-[var(--muted)]">CNPJ</dt><dd className="mt-1 font-bold">{clientDraft.cnpj || "Não informado"}</dd></div><div><dt className="text-xs text-[var(--muted)]">Localização</dt><dd className="mt-1 font-bold">{[clientDraft.municipio, clientDraft.uf].filter(Boolean).join(" / ") || "Não informada"}</dd></div></dl>
              </div>}
            </div>

            <div className="mt-7 flex justify-between">
              <button onClick={() => setClientStep((step) => Math.max(1, step - 1))} disabled={clientStep === 1} className="h-11 rounded-xl border border-[var(--border)] px-4 text-sm font-bold disabled:opacity-40">Voltar</button>
              {clientStep < 5 ? (
                <button onClick={() => setClientStep((step) => Math.min(5, step + 1))} className="h-11 rounded-xl bg-[var(--navy)] px-5 text-sm font-bold text-white">Continuar</button>
              ) : (
                <div className="flex gap-2"><button disabled={savingClient} onClick={() => void saveClientDraft("rascunho")} className="h-11 rounded-xl border border-[var(--border)] px-4 text-sm font-bold disabled:opacity-50">{savingClient ? "Salvando..." : "Salvar rascunho"}</button><button disabled={savingClient} onClick={() => void saveClientDraft("ativo")} className="h-11 rounded-xl bg-[var(--navy)] px-5 text-sm font-bold text-white disabled:opacity-50">{savingClient ? "Salvando..." : "Salvar cliente"}</button></div>
              )}
            </div>
          </div>
        </div>
      )}
      {viewClientId && (() => {
        const client = clients.find((item) => item.id === viewClientId);
        if (!client) return null;
        return (
          <div className="fixed inset-0 z-[65] grid place-items-center bg-[#07111f]/55 p-4" role="dialog" aria-modal="true" aria-labelledby="client-detail-title">
            <section className="fade-in w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--blue)]">Dados do cliente</p>
                  <h2 id="client-detail-title" className="mt-1 text-xl font-bold">{client.razao}</h2>
                </div>
                <button onClick={() => setViewClientId(null)} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)]">×</button>
              </div>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Nome fantasia", client.fantasia],
                  ["CNPJ", client.cnpj || "Não informado"],
                  ["Regime tributário", client.regime || "Não definido"],
                  ["CNAE principal", client.cnae || "Não informado"],
                  ["Localização", [client.municipio, client.uf].filter(Boolean).join(" / ") || "Não informada"],
                  ["Faturamento mensal", client.faturamento ? `R$ ${client.faturamento}` : "Não informado"],
                  ["E-mail de contato", client.email || "Não informado"],
                  ["Status", client.status],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold text-[var(--muted)]">{label}</dt>
                    <dd className="mt-1 break-words text-sm font-bold">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        );
      })()}
      {toast && <div className="fixed bottom-5 right-5 z-[70] max-w-[320px] rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold shadow-xl">{toast}</div>}
    </div>
  );
}
