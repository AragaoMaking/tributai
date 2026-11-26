import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Cookies e armazenamento local",
  description: "Como o TributAI usa cookies e armazenamento local.",
};

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookies e armazenamento local"
      summary="O que o TributAI armazena no navegador e como a preferência do aviso funciona."
    >
      <section>
        <h2>1. Armazenamento técnico</h2>
        <p>
          A autenticação do Supabase usa armazenamento de sessão necessário para manter o acesso
          à conta. A aplicação também usa o armazenamento local do navegador para guardar o tema
          escolhido e a preferência de fechar este aviso. Esses itens não são usados para
          publicidade.
        </p>
      </section>

      <section>
        <h2>2. Analytics e publicidade</h2>
        <p>
          Na versão verificada em 26/11/2026, não identificamos scripts de analytics, pixels de
          publicidade ou cookies opcionais ativos no site. Se ferramentas desse tipo forem
          adicionadas no futuro, esta página e os controles de escolha deverão ser atualizados
          antes da ativação.
        </p>
      </section>

      <section>
        <h2>3. Gerenciar armazenamento</h2>
        <p>
          Você pode apagar cookies e armazenamento local nas configurações do navegador. Apagar
          dados de sessão pode desconectar sua conta; apagar preferências fará o aviso de cookies
          aparecer novamente. O site não oferece atualmente um painel separado para gerenciar
          cookies opcionais porque não identificamos cookies opcionais ativos.
        </p>
      </section>

      <section>
        <h2>4. Dúvidas</h2>
        <p>
          Para dúvidas sobre dados pessoais ou armazenamento, consulte a{" "}
          <Link href="/privacidade">Política de privacidade</Link> ou acesse{" "}
          <Link href="/lgpd">Direitos sobre dados</Link>.
        </p>
      </section>
    </LegalLayout>
  );
}
