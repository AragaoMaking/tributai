# TributAI Web

Aplicação Next.js em português, com autenticação Supabase, isolamento por escritório via RLS e persistência de clientes e rascunhos de simulação no banco local.

## Executar localmente no Windows

Na raiz do projeto, inicie o Supabase:

```powershell
.\apps\web\node_modules\.bin\supabase.cmd start
```

Crie `apps/web/.env.local` com a URL local e a chave **anon/publishable** mostradas por `supabase status -o env`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<valor ANON_KEY do Supabase local>
```

Não coloque `SECRET_KEY`, `SERVICE_ROLE_KEY` ou `JWT_SECRET` no frontend. O `.env.local` é ignorado pelo Git.

Depois, em `apps/web`:

```powershell
npm.cmd install
npm.cmd run dev
```

Abra <http://localhost:3000>. O Supabase Studio fica em <http://localhost:54323>; e-mails locais de cadastro/recuperação aparecem no Mailpit em <http://localhost:54324>.

O cadastro cria perfil, escritório, associação de administrador e uma assinatura de teste Starter no mesmo fluxo. O usuário pode escolher outro plano de teste, sem cobrança. O acesso às áreas privadas é protegido por sessão; as políticas RLS continuam sendo a proteção dos dados.

## Verificações

```powershell
npm.cmd run lint
npm.cmd run build
```

## Preparar publicação

O deploy recomendado usa o repositório Git como raiz, com a pasta `apps/web`
selecionada como **Root Directory** na Vercel. Configure no ambiente Production:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-key-do-projeto>
NEXT_PUBLIC_SITE_URL=https://<dominio-publico>
```

Use somente a chave pública `publishable`/`anon` no navegador. Nunca configure
`service_role`, `secret key`, `JWT_SECRET` ou senha do banco como variável
`NEXT_PUBLIC_*`.

### Atendimento com IA

O chat de atendimento aparece no site público e na área logada. Para ativar as
respostas, configure `GEMINI_API_KEY` como variável de ambiente **Production**
na Vercel. A chave deve ser criada no Google AI Studio e mantida como segredo
do servidor; não use o prefixo `NEXT_PUBLIC_`. Opcionalmente, configure
`NEXT_PUBLIC_SUPPORT_EMAIL` para mudar o endereço público de atendimento
humano.

O chat não lê nem salva dados da conta, e recusa mensagens com e-mail, CPF ou
CNPJ. As mensagens enviadas são processadas pelo Google Gemini; não inclua
informações pessoais ou de clientes. O pedido usa `store: false`, mas a
utilização gratuita do Gemini pode estar sujeita a termos de tratamento de
dados diferentes do plano pago. Confira os termos e limites atuais do Google
antes de receber conversas reais. A integração pesquisa fontes públicas e
mostra apenas citações de domínios oficiais permitidos; ainda assim, confirme
informações tributárias com um profissional. O agente não substitui cálculo
fiscal nem parecer contábil.

A API limita o tamanho e a frequência de mensagens por instância; essa proteção
em memória não é um limite global garantido em funções serverless. Configure
limites de uso no Google AI Studio e monitore o consumo antes de divulgar o
chat amplamente.

Antes de liberar o cadastro público:

1. Crie um projeto Supabase hospedado e confira o projeto vinculado antes de
   aplicar as migrações em `supabase/migrations`.
2. No Supabase Auth, configure a URL pública do site e permita
   `https://<dominio-publico>/auth/callback` como URL de redirecionamento.
3. Configure SMTP de produção, confirme as políticas RLS no projeto hospedado e
   faça um teste funcional com uma conta descartável.
4. Adicione e valide o domínio na Vercel; depois defina a mesma URL em
   `NEXT_PUBLIC_SITE_URL` e publique novamente. Essa variável alimenta o
   sitemap e os metadados públicos.
5. Cadastre o domínio no Google Search Console e envie `/sitemap.xml`.

O projeto local não é um destino de produção. As funcionalidades tributárias
permanecem limitadas conforme descrito abaixo.

O teste SQL de provisionamento e isolamento usa uma transação que termina em `ROLLBACK`:

```powershell
Get-Content ..\..\supabase\tests\rls_isolation.sql -Raw | docker exec -i supabase_db_tributai psql -U postgres -X -v ON_ERROR_STOP=1 -q
```

## Limitações atuais

- As simulações são persistidas como entradas com pendências; nenhum tributo é calculado ou apresentado como oficial.
- Os motores Java/Go ainda não estão conectados ao fluxo da aplicação.
- Comparador, relatórios, portal do empresário, equipe e assistente permanecem identificados como módulos planejados.
- Não há gateway de pagamento nem cobrança real.
- A configuração local não substitui configuração de produção, SMTP de envio, revisão final das políticas/RLS, testes de segurança e operação/backup do banco.
