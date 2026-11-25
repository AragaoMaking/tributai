begin;

alter table public.empresas
  alter column cnpj drop not null;

create or replace function public.pode_gerenciar_escritorio(p_escritorio_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.membros m
    where m.escritorio_id = p_escritorio_id
      and m.usuario_id = auth.uid()
      and m.ativo
      and m.papel in ('admin_escritorio', 'contador')
  );
$$;

create or replace function public.provisionar_novo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_nome text;
  v_nome_escritorio text;
  v_escritorio_id uuid;
begin
  v_nome := nullif(left(btrim(coalesce(new.raw_user_meta_data ->> 'name', '')), 120), '');
  if v_nome is null then
    v_nome := coalesce(nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 'Usuário');
  end if;

  v_nome_escritorio := nullif(left(btrim(coalesce(new.raw_user_meta_data ->> 'office', '')), 160), '');
  if v_nome_escritorio is null then
    v_nome_escritorio := 'Meu escritório';
  end if;

  insert into public.perfis (id, nome)
  values (new.id, v_nome);

  insert into public.escritorios (nome)
  values (v_nome_escritorio)
  returning id into v_escritorio_id;

  insert into public.membros (escritorio_id, usuario_id, papel)
  values (v_escritorio_id, new.id, 'admin_escritorio');

  insert into public.assinaturas (escritorio_id, plano_id, status, teste_ate)
  values (v_escritorio_id, 'starter', 'teste', current_date + 14);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.provisionar_novo_usuario();

revoke all on function public.provisionar_novo_usuario() from public, anon, authenticated;

drop policy if exists p_empresas on public.empresas;
drop policy if exists p_empresas_portal on public.empresas;

create policy p_empresas_select on public.empresas
  for select using (public.pode_acessar_empresa(id));

create policy p_empresas_insert on public.empresas
  for insert with check (public.pode_gerenciar_escritorio(escritorio_id));

create policy p_empresas_update on public.empresas
  for update
  using (public.pode_gerenciar_escritorio(escritorio_id))
  with check (public.pode_gerenciar_escritorio(escritorio_id));

create policy p_empresas_delete on public.empresas
  for delete using (public.pode_gerenciar_escritorio(escritorio_id));

create policy p_empresas_portal on public.empresas
  for select using (public.empresa_do_portal(id));

drop policy if exists p_sim_ins on public.simulacoes;
create policy p_sim_ins on public.simulacoes
  for insert with check (
    usuario_id = auth.uid()
    and public.pode_acessar_empresa(empresa_id)
    and exists (
      select 1
      from public.empresas e
      where e.id = simulacoes.empresa_id
        and e.escritorio_id = simulacoes.escritorio_id
    )
  );

create or replace function public.selecionar_plano(
  p_escritorio_id uuid,
  p_plano_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Autenticação obrigatória.';
  end if;

  if not exists (
    select 1
    from public.planos p
    where p.id = p_plano_id
  ) then
    raise exception 'Plano inválido.';
  end if;

  update public.assinaturas a
  set plano_id = p_plano_id
  where a.escritorio_id = p_escritorio_id
    and a.status = 'teste'
    and exists (
      select 1
      from public.membros m
      where m.escritorio_id = a.escritorio_id
        and m.usuario_id = auth.uid()
        and m.ativo
        and m.papel = 'admin_escritorio'
    );

  if not found then
    raise exception 'Não há assinatura de teste que possa ser alterada.';
  end if;
end;
$$;

revoke all on function public.selecionar_plano(uuid, text) from public, anon;
grant execute on function public.selecionar_plano(uuid, text) to authenticated;

commit;
