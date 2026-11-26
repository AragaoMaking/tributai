import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: "Condições gerais de uso do TributAI.",
};

export default function TermosPage() {
  return (
    <LegalLayout
      title="Termos de uso"
      summary="Condições gerais para criar uma conta e usar as funções atualmente disponíveis no TributAI."
    >
      <section>
        <h2>1. Serviço e responsável</h2>
        <p>
          O TributAI é uma ferramenta para escritórios contábeis organizarem empresas e
          registrarem rascunhos de simulação. O responsável informado é Miguel Dos Santos
          Aragão. CNPJ e endereço comercial ainda não foram informados para publicação; a
          identificação deve ser completada antes de formalizar condições comerciais.
        </p>
      </section>

      <section>
        <h2>2. Conta e uso adequado</h2>
        <p>
          Informe dados corretos, proteja suas credenciais e use a conta apenas para fins
          autorizados. Você é responsável por ter autorização para inserir informações de
          empresas e por não compartilhar dados pessoais ou sigilosos no assistente de IA.
        </p>
      </section>

      <section>
        <h2>3. Limites das funções tributárias</h2>
        <p>
          O sistema pode salvar rascunhos e organizar informações, mas os motores tributários
          oficiais não estão conectados ao fluxo. Nenhuma estimativa, resposta do chat ou
          registro deve ser tratada como cálculo oficial, parecer contábil, fiscal ou jurídico.
          Confirme decisões com profissional habilitado e fontes oficiais.
        </p>
      </section>

      <section>
        <h2>4. Planos e pagamentos</h2>
        <p>
          Selecionar um plano na plataforma apenas registra uma opção de acesso de teste e não
          inicia pagamento pelo site. Pagamentos de planos podem ser combinados e realizados
          fora da plataforma. Valores, forma e periodicidade de pagamento devem ser confirmados
          por escrito antes de qualquer pagamento.
        </p>
        <p>
          Não há uma política formal de cancelamento ou reembolso publicada neste momento.
          Solicite e confirme por escrito as condições aplicáveis antes de pagar. Esta cláusula
          não cria nem promete uma condição específica de reembolso.
        </p>
      </section>

      <section>
        <h2>5. Disponibilidade e terceiros</h2>
        <p>
          O serviço depende de provedores externos e pode ser atualizado, ficar temporariamente
          indisponível ou ter funções alteradas. O assistente envia mensagens ao Google Gemini;
          consulte também a <Link href="/privacidade">Política de privacidade</Link> e evite enviar
          dados de clientes.
        </p>
      </section>

      <section>
        <h2>6. Contato e atualização</h2>
        <p>
          Dúvidas sobre estes termos podem ser enviadas ao canal de atendimento indicado nesta
          página. Os termos podem ser atualizados; a data mais recente aparece no início do
          documento.
        </p>
      </section>
    </LegalLayout>
  );
}
