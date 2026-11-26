import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Informações sobre dados pessoais tratados pelo TributAI.",
};

export default function PrivacidadePage() {
  return (
    <LegalLayout
      title="Política de privacidade"
      summary="Como o TributAI trata informações de conta, escritório, empresas cadastradas e mensagens enviadas ao assistente."
    >
      <section>
        <h2>1. Quem é responsável</h2>
        <p>
          O responsável informado pelo TributAI é Miguel Dos Santos Aragão. O canal de contato
          para dúvidas e solicitações sobre dados pessoais é o endereço de atendimento exibido
          nesta página. CNPJ e endereço comercial ainda não foram informados para publicação.
        </p>
      </section>

      <section>
        <h2>2. Informações tratadas</h2>
        <ul>
          <li>
            Cadastro e autenticação: nome, nome do escritório, e-mail e dados técnicos necessários
            para autenticar a conta. A autenticação é fornecida pelo Supabase.
          </li>
          <li>
            Uso da plataforma: dados de empresas que o usuário escolhe cadastrar, que podem
            incluir razão social, nome fantasia, CNPJ, atividade, município, estado, faturamento e
            contato, além de rascunhos de simulação e pendências.
          </li>
          <li>
            Atendimento com IA: o texto enviado no chat é encaminhado ao Google Gemini para gerar
            uma resposta. O chat não deve ser usado para enviar dados pessoais, documentos ou
            informações de clientes.
          </li>
          <li>
            Dados técnicos necessários para operação e segurança podem ser tratados pelos
            provedores de hospedagem e infraestrutura.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Para que usamos as informações</h2>
        <p>
          As informações são usadas para criar e manter a conta, disponibilizar as funções
          solicitadas, organizar os registros vinculados ao escritório, responder a solicitações
          de atendimento e proteger a operação. O TributAI não usa os rascunhos para apresentar
          cálculos fiscais oficiais.
        </p>
        <p>
          A base legal e o prazo de retenção apropriados dependem da finalidade e da categoria
          de informação. O mapeamento detalhado por operação ainda precisa ser confirmado pelo
          responsável; esta página não estabelece uma base ou prazo único.
        </p>
      </section>

      <section>
        <h2>4. Fornecedores e compartilhamento</h2>
        <p>
          O Supabase fornece autenticação e banco de dados; a Vercel hospeda o site; e o Google
          Gemini processa mensagens enviadas ao assistente. Esses fornecedores tratam dados
          conforme seus próprios serviços e termos. O TributAI não controla as práticas de
          retenção de terceiros e não promete que o processamento do Gemini seja livre de
          retenção ou uso conforme o plano contratado pelo usuário.
        </p>
      </section>

      <section>
        <h2>5. Chat com inteligência artificial</h2>
        <p>
          As mensagens do chat são enviadas ao Google para processamento. A aplicação solicita
          que a conversa não seja armazenada pela API, mas isso não substitui os termos e
          configurações aplicáveis do Google. Não envie nome, e-mail, CPF, CNPJ, faturamento,
          credenciais, documentos ou qualquer dado identificável de clientes. O chat possui
          filtros para alguns desses dados, mas eles não garantem a detecção de toda informação
          pessoal.
        </p>
      </section>

      <section>
        <h2>6. Armazenamento e segurança</h2>
        <p>
          Os registros da plataforma ficam associados à conta e ao escritório conforme as
          permissões configuradas no sistema. São adotadas medidas técnicas disponíveis na
          aplicação e nos provedores, mas nenhum serviço conectado à internet pode garantir
          segurança absoluta. Não há nesta política um prazo fixo de retenção; para solicitar
          acesso, correção ou exclusão, use o canal de atendimento.
        </p>
      </section>

      <section>
        <h2>7. Seus direitos</h2>
        <p>
          Você pode solicitar confirmação do tratamento, acesso, correção, anonimização,
          bloqueio ou eliminação nos casos aplicáveis, informações sobre compartilhamento e
          outras providências previstas na legislação. Para isso, informe o e-mail da conta em
          <Link href="/lgpd"> Direitos sobre dados</Link>. Podemos pedir confirmação razoável de
          identidade antes de atender ao pedido, sem solicitar documentos desnecessários. Você
          também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados, quando
          aplicável.
        </p>
      </section>

      <section>
        <h2>8. Alterações</h2>
        <p>
          Esta política pode mudar quando o produto ou seus fornecedores mudarem. A data de
          atualização aparece no início da página. A identificação comercial ainda está
          incompleta e deve ser atualizada quando os dados pendentes forem definidos.
        </p>
      </section>
    </LegalLayout>
  );
}
