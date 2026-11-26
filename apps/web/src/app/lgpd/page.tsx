import type { Metadata } from "next";
import DataRequestForm from "@/components/data-request-form";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Solicitações sobre dados pessoais",
  description: "Solicite acesso, correção ou outras medidas sobre seus dados no TributAI.",
};

export default function LgpdPage() {
  return (
    <LegalLayout
      title="Solicitações sobre dados pessoais"
      summary="Use este canal para exercer direitos relacionados aos seus dados tratados pelo TributAI."
    >
      <section>
        <h2>Como fazer uma solicitação</h2>
        <p>
          Você pode pedir confirmação e acesso aos dados, correção, anonimização, bloqueio,
          eliminação quando aplicável, informações sobre compartilhamento ou apresentar outra
          solicitação relacionada à privacidade. O atendimento pode pedir informações
          proporcionais para confirmar que a solicitação é sua.
        </p>
        <p>
          O formulário abaixo apenas prepara uma mensagem no seu aplicativo de e-mail; o pedido
          só chega ao TributAI quando você envia essa mensagem. Não anexe documentos nem envie
          CPF, CNPJ ou dados de clientes.
        </p>
      </section>
      <DataRequestForm />
      <p className="text-sm leading-6 text-[var(--muted)]">
        Se o aplicativo de e-mail não abrir, envie sua solicitação diretamente para o endereço
        de atendimento indicado no início desta página.
      </p>
    </LegalLayout>
  );
}
