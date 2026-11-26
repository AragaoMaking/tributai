import { NextResponse, type NextRequest } from "next/server";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

type GeminiCitation = {
  type?: string;
  url?: string;
  title?: string;
};

type GeminiResponse = {
  status?: string;
  steps?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
      annotations?: GeminiCitation[];
    }>;
  }>;
};

const SYSTEM_INSTRUCTION = `Você é o assistente virtual de atendimento do TributAI. Responda em português brasileiro, com clareza e cordialidade.

Sobre o produto: o TributAI ajuda escritórios contábeis a organizar empresas e registrar rascunhos de simulação. O cadastro inicia um período de teste; o site não tem checkout nem cobrança automática, mas planos pagos podem ser acertados fora da plataforma. Não invente preços, formas de pagamento ou condições. Oriente a pessoa a confirmar por escrito valores, periodicidade, cancelamento e reembolso com o atendimento antes de pagar. Atualmente não há uma política formal de cancelamento/reembolso publicada. O simulador salva dados como pendentes, mas os motores tributários não estão conectados e nenhum tributo oficial é calculado. Comparador, relatórios, alertas e equipe são recursos em desenvolvimento; o chat de atendimento pode responder quando a integração estiver configurada.

Você pode responder dúvidas gerais sobre o produto e informações tributárias gerais. Para qualquer assunto tributário, use a pesquisa e baseie as afirmações em fontes oficiais brasileiras; indique as fontes fornecidas na resposta. Se não encontrar fonte oficial adequada, diga claramente que não conseguiu confirmar a informação e encaminhe a pessoa a um contador ou ao atendimento humano.

Nunca faça cálculos fiscais, recomende um regime para uma empresa específica, interprete documentos ou dados de clientes, nem apresente uma resposta como parecer profissional. Não afirme que acessa contas ou dados do sistema. Não peça nem use CNPJ, CPF, faturamento, credenciais, documentos ou dados identificáveis. Se a pergunta exigir análise individual, explique a limitação e sugira atendimento humano.`;

const OFFICIAL_SOURCE_DOMAINS = [
  "gov.br",
  "fazenda.gov.br",
  "planalto.gov.br",
  "leg.br",
  "cfc.org.br",
];

const TAX_TOPIC_PATTERN = /\b(tribut\w*|impost\w*|fiscal|regime|simples nacional|lucro presumido|lucro real|ibs|cbs|icms|iss|irpj|csll|pis|cofins|das|reforma tributária|alíquota|nota fiscal)\b/i;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 6;
const requestsByAddress = new Map<string, number[]>();

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "model")
    && typeof candidate.text === "string"
    && candidate.text.trim().length > 0
    && candidate.text.length <= 1200
  );
}

function containsPersonalData(text: string) {
  const containsEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text);
  const containsCpf = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/.test(text);
  const containsCnpj = /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/.test(text);
  return containsEmail || containsCpf || containsCnpj;
}

function isOfficialSource(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:"
      && OFFICIAL_SOURCE_DOMAINS.some((domain) =>
        parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`),
      );
  } catch {
    return false;
  }
}

function exceedsRateLimit(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const address = forwardedFor?.split(",").pop()?.trim() || "unknown";
  const now = Date.now();
  const recentRequests = (requestsByAddress.get(address) || [])
    .filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestsByAddress.set(address, recentRequests);
    return true;
  }

  requestsByAddress.set(address, [...recentRequests, now]);
  if (requestsByAddress.size > 2000) {
    for (const [storedAddress, timestamps] of requestsByAddress) {
      if (timestamps.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW_MS)) {
        requestsByAddress.delete(storedAddress);
      }
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== request.nextUrl.origin) {
        return NextResponse.json({ error: "Origem da solicitação inválida." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Origem da solicitação inválida." }, { status: 403 });
    }
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 16_000) {
    return NextResponse.json({ error: "A conversa enviada é muito longa." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Não foi possível ler a mensagem enviada." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !Array.isArray((body as Record<string, unknown>).messages)) {
    return NextResponse.json({ error: "Formato de conversa inválido." }, { status: 400 });
  }

  const messages = (body as { messages: unknown[] }).messages;
  if (messages.length < 1 || messages.length > 10 || !messages.every(isChatMessage)) {
    return NextResponse.json({ error: "A conversa deve ter até 10 mensagens válidas." }, { status: 400 });
  }

  if (messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Envie uma pergunta para continuar." }, { status: 400 });
  }

  if (messages.some((message) => message.role === "user" && containsPersonalData(message.text))) {
    return NextResponse.json({
      error: "Por segurança, não envie e-mails, CPF, CNPJ ou dados de clientes pelo chat. Remova esses dados e tente novamente.",
    }, { status: 400 });
  }

  if (messages.reduce((total, message) => total + message.text.length, 0) > 8_000) {
    return NextResponse.json({ error: "A conversa está muito longa. Inicie um novo atendimento." }, { status: 413 });
  }

  if (exceedsRateLimit(request)) {
    return NextResponse.json({ error: "Você enviou muitas mensagens em pouco tempo. Aguarde um minuto e tente novamente." }, { status: 429 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      error: `O atendimento automático ainda está sendo configurado. Fale com a equipe pelo e-mail ${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "miguel.norton@icloud.com"}.`,
    }, { status: 503 });
  }

  const input = messages
    .map(({ role, text }) => `${role === "user" ? "Pessoa" : "Assistente"}: ${text}`)
    .join("\n\n");
  const needsTaxSources = TAX_TOPIC_PATTERN.test(messages[messages.length - 1].text);

  let upstream: Response;
  try {
    upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        model: "gemini-3.5-flash-lite",
        input,
        system_instruction: SYSTEM_INSTRUCTION,
        tools: needsTaxSources ? [{ type: "google_search" }] : [],
        store: false,
        generation_config: { max_output_tokens: 500 },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
    });
  } catch (error) {
    console.error("Gemini support request failed", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json({
      error: "O atendimento está temporariamente indisponível. Tente novamente ou fale com a equipe.",
    }, { status: 502 });
  }

  if (!upstream.ok) {
    console.error("Gemini support request returned status", upstream.status);
    const status = upstream.status === 429 ? 503 : 502;
    return NextResponse.json({
      error: upstream.status === 429
        ? "O limite temporário de atendimento foi atingido. Tente novamente mais tarde."
        : "O atendimento não conseguiu responder agora. Tente novamente ou fale com a equipe.",
    }, { status });
  }

  let result: GeminiResponse;
  try {
    result = await upstream.json() as GeminiResponse;
  } catch {
    console.error("Gemini support response was not valid JSON");
    return NextResponse.json({ error: "O atendimento recebeu uma resposta inválida. Tente novamente." }, { status: 502 });
  }

  const outputSteps = (result.steps || []).filter((step) => step.type === "model_output");
  const reply = outputSteps
    .flatMap((step) => step.content || [])
    .filter((content) => content.type === "text" && typeof content.text === "string")
    .map((content) => content.text!.trim())
    .filter(Boolean)
    .join("\n\n");

  if (result.status !== "completed" || !reply) {
    console.error("Gemini support response did not complete");
    return NextResponse.json({ error: "O atendimento não conseguiu concluir a resposta. Tente novamente." }, { status: 502 });
  }

  const citations = outputSteps
    .flatMap((step) => step.content || [])
    .flatMap((content) => content.annotations || [])
    .filter((citation) => citation.type === "url_citation" && typeof citation.url === "string" && isOfficialSource(citation.url))
    .map((citation) => ({
      title: (citation.title || new URL(citation.url!).hostname).slice(0, 120),
      url: citation.url!,
    }))
    .filter((citation, index, sources) =>
      sources.findIndex((source) => source.url === citation.url) === index,
    )
    .slice(0, 5);

  if (needsTaxSources && citations.length === 0) {
    return NextResponse.json({
      reply: "Não consegui confirmar essa informação tributária em uma fonte oficial nesta consulta. Para evitar uma orientação incorreta, fale com um contador ou com nosso atendimento humano.",
      citations: [],
    }, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  return NextResponse.json({ reply, citations }, {
    headers: { "Cache-Control": "no-store" },
  });
}
