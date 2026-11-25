-- TributAI — esquema inicial (PostgreSQL / Supabase). NÃO testado contra um banco real ainda.
-- Isolamento entre escritórios via Row Level Security (RLS). Dados sensíveis: usar Supabase Vault/pgcrypto.
create extension if not exists pgcrypto;

create type papel_escritorio as enum ('admin_escritorio','contador','analista','assistente','visualizador');
-- 'origem' diz de onde veio um número: nunca apresentar estimativa como cálculo oficial.
create type origem_calculo as enum ('motor_rfb','regra_documentada','pendente');

create table perfis (
  id uuid primary key references auth.users on delete cascade,
  nome text not null, is_admin_plataforma boolean not null default false,
  criado_em timestamptz not null default now());

create table planos (
  id text primary key, nome text not null,
  limite_clientes int,                       -- null = configurável por escritório
  recursos jsonb not null default '{}');
insert into planos values
  ('starter','Starter',10,'{"simulador":"basico","relatorios_limitados":true}'),
  ('profissional','Profissional',100,'{"simulador":"completo","portal_empresario":true}'),
  ('escritorio','Escritório',null,'{"equipe":true,"permissoes_avancadas":true}');

create table escritorios (
  id uuid primary key default gen_random_uuid(),
  nome text not null, cnpj char(14), logo_path text,
  criado_em timestamptz not null default now());

create table assinaturas (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references escritorios on delete cascade,
  plano_id text not null references planos,
  status text not null check (status in ('teste','ativa','vencida','cancelada')),
  teste_ate date, vigente_ate date, limite_clientes_custom int,
  gateway text, gateway_ref text);        -- gateway ainda não definido

create table pagamentos (
  id uuid primary key default gen_random_uuid(),
  assinatura_id uuid not null references assinaturas on delete cascade,
  valor numeric(12,2) not null, status text not null,
  gateway_ref text, pago_em timestamptz, criado_em timestamptz not null default now());

create table membros (
  escritorio_id uuid references escritorios on delete cascade,
  usuario_id uuid references perfis on delete cascade,
  papel papel_escritorio not null, ativo boolean not null default true,
  primary key (escritorio_id, usuario_id));

create table empresas (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references escritorios on delete cascade,
  cnpj char(14) not null, razao_social text not null, nome_fantasia text,
  data_abertura date, situacao_cadastral text, ie text, im text,
  regime text check (regime in ('simples','presumido','real')),
  cnae_principal text, cnaes_secundarios text[], municipio text, uf char(2),
  tipo_operacao text, enquadramentos jsonb not null default '{}',
  faturamento_mensal numeric(18,2), faturamento_anual numeric(18,2),
  financeiro jsonb not null default '{}',   -- despesas, custos, compras, vendas, créditos
  contato jsonb not null default '{}',
  status text not null default 'rascunho' check (status in ('rascunho','ativo','arquivado')),
  responsavel_id uuid references perfis, observacoes text,
  atualizado_em timestamptz not null default now(),
  unique (escritorio_id, cnpj));

-- Colaboradores restritos a clientes específicos (admin/contador veem todos).
create table membros_empresas (
  empresa_id uuid references empresas on delete cascade,
  usuario_id uuid references perfis on delete cascade,
  primary key (empresa_id, usuario_id));

-- Empresário (portal): só enxerga a própria empresa.
create table portal_acessos (
  empresa_id uuid references empresas on delete cascade,
  usuario_id uuid references perfis on delete cascade,
  primary key (empresa_id, usuario_id));

create table motor_versoes (
  id uuid primary key default gen_random_uuid(),
  motor text not null,                       -- 'rfb-regime-regular' | 'rfb-simples-nacional' | 'regras-atuais'
  versao text not null, commit_ref text, banco_tabelas_data date,
  registrado_em timestamptz not null default now(),
  unique (motor, versao));

create table regras_tributarias (
  id uuid primary key default gen_random_uuid(),
  tributo text not null, descricao text not null,
  fundamento_legal text not null,            -- sem fundamento citado, a regra não entra
  vigencia_inicio date not null, vigencia_fim date,
  parametros jsonb not null, revisada_por uuid references perfis, revisada_em timestamptz);

-- Simulações são imutáveis: nova simulação = nova linha.
create table simulacoes (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references escritorios,
  empresa_id uuid not null references empresas on delete cascade,
  usuario_id uuid not null references perfis,
  periodo_ano int not null check (periodo_ano between 2026 and 2033),
  entrada jsonb not null, premissas jsonb not null default '[]',
  pendencias jsonb not null default '[]', observacoes text,
  compartilhada boolean not null default false,
  criada_em timestamptz not null default now());

create table simulacao_resultados (
  id uuid primary key default gen_random_uuid(),
  simulacao_id uuid not null references simulacoes on delete cascade,
  tributo text not null,                     -- CBS, IBS, IS, ICMS, ISS, PIS, COFINS, IPI
  origem origem_calculo not null,
  motor_versao_id uuid references motor_versoes,
  regra_id uuid references regras_tributarias,
  valor numeric(18,2), aliquota_efetiva numeric(9,4),
  memoria_calculo jsonb, fundamento_legal text,
  check (origem <> 'motor_rfb' or motor_versao_id is not null),
  check (origem <> 'regra_documentada' or regra_id is not null));

create table relatorios (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references escritorios,
  empresa_id uuid not null references empresas on delete cascade,
  simulacao_id uuid references simulacoes, gerado_por uuid references perfis,
  arquivo_path text not null, compartilhado boolean not null default false,
  criado_em timestamptz not null default now());

create table documentos (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references escritorios,
  empresa_id uuid not null references empresas on delete cascade,
  nome text not null, arquivo_path text not null,   -- bucket PRIVADO
  enviado_por uuid references perfis, criado_em timestamptz not null default now());

create table notificacoes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references perfis on delete cascade,
  tipo text not null check (tipo in ('sucesso','erro','atencao','info')),
  titulo text not null, mensagem text, lida boolean not null default false,
  criada_em timestamptz not null default now());

create table atividades (                    -- log de auditoria (só inserção)
  id bigint generated always as identity primary key,
  escritorio_id uuid references escritorios, usuario_id uuid references perfis,
  acao text not null, entidade text, entidade_id uuid, detalhes jsonb,
  criada_em timestamptz not null default now());

-- ===== Funções de acesso =====
create function meus_escritorios() returns setof uuid
language sql stable security definer set search_path = public as
$$ select escritorio_id from membros where usuario_id = auth.uid() and ativo $$;

create function pode_acessar_empresa(emp uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from empresas e join membros m on m.escritorio_id = e.escritorio_id
    where e.id = emp and m.usuario_id = auth.uid() and m.ativo
      and (m.papel in ('admin_escritorio','contador')
           or exists (select 1 from membros_empresas me where me.empresa_id = e.id and me.usuario_id = auth.uid())));
$$;

create function empresa_do_portal(emp uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from portal_acessos where empresa_id = emp and usuario_id = auth.uid()) $$;

-- ===== RLS =====
do $$ declare t text; begin
  foreach t in array array['perfis','planos','escritorios','assinaturas','pagamentos','membros','empresas',
    'membros_empresas','portal_acessos','motor_versoes','regras_tributarias','simulacoes',
    'simulacao_resultados','relatorios','documentos','notificacoes','atividades'] loop
    execute format('alter table %I enable row level security', t);
  end loop; end $$;

create policy p_perfil      on perfis       for select using (id = auth.uid());
create policy p_planos      on planos       for select using (true);
create policy p_motores     on motor_versoes for select using (auth.uid() is not null);
create policy p_regras      on regras_tributarias for select using (auth.uid() is not null);
create policy p_escritorio  on escritorios  for select using (id in (select meus_escritorios()));
create policy p_assinatura  on assinaturas  for select using (escritorio_id in (select meus_escritorios()));
create policy p_pagamento   on pagamentos   for select using (assinatura_id in
  (select id from assinaturas where escritorio_id in (select meus_escritorios())));
create policy p_membros     on membros      for select using (escritorio_id in (select meus_escritorios()));
create policy p_notif       on notificacoes for all using (usuario_id = auth.uid());
create policy p_atividades  on atividades   for select using (escritorio_id in (select meus_escritorios()));

create policy p_empresas    on empresas     for all using (pode_acessar_empresa(id));
create policy p_empresas_portal on empresas for select using (empresa_do_portal(id));
create policy p_sim         on simulacoes   for select using (pode_acessar_empresa(empresa_id));
create policy p_sim_ins     on simulacoes   for insert with check (pode_acessar_empresa(empresa_id) and usuario_id = auth.uid());
create policy p_sim_portal  on simulacoes   for select using (compartilhada and empresa_do_portal(empresa_id));
create policy p_res         on simulacao_resultados for select using (simulacao_id in (select id from simulacoes));
create policy p_rel         on relatorios   for all using (pode_acessar_empresa(empresa_id));
create policy p_rel_portal  on relatorios   for select using (compartilhado and empresa_do_portal(empresa_id));
create policy p_doc         on documentos   for all using (pode_acessar_empresa(empresa_id));

-- Simulações e auditoria nunca são alteradas nem apagadas.
create function bloquear_alteracao() returns trigger language plpgsql as
$$ begin raise exception 'Registro imutável: crie uma nova entrada.'; end $$;
create trigger t_sim_imutavel before update or delete on simulacoes for each row execute function bloquear_alteracao();
create trigger t_res_imutavel before update or delete on simulacao_resultados for each row execute function bloquear_alteracao();
create trigger t_ativ_imutavel before update or delete on atividades for each row execute function bloquear_alteracao();
