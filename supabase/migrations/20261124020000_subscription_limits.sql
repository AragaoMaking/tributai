begin;

create or replace function public.verificar_limite_empresas()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_teste_ate date;
  v_vigente_ate date;
  v_limite integer;
  v_total integer;
begin
  if new.status = 'arquivado' then
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if old.status <> 'arquivado' and old.escritorio_id = new.escritorio_id then
      return new;
    end if;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(new.escritorio_id::text, 0));

  select a.status,
         a.teste_ate,
         a.vigente_ate,
         coalesce(a.limite_clientes_custom, p.limite_clientes)
  into v_status, v_teste_ate, v_vigente_ate, v_limite
  from public.assinaturas a
  join public.planos p on p.id = a.plano_id
  where a.escritorio_id = new.escritorio_id
  order by case when a.status in ('teste', 'ativa') then 0 else 1 end
  limit 1;

  if not found then
    raise exception 'O escritório não possui uma assinatura válida.';
  end if;

  if v_status = 'teste' and (v_teste_ate is null or v_teste_ate < current_date) then
    raise exception 'O período de teste expirou.';
  end if;

  if v_status = 'ativa' and v_vigente_ate is not null and v_vigente_ate < current_date then
    raise exception 'A assinatura está vencida.';
  end if;

  if v_status not in ('teste', 'ativa') then
    raise exception 'A assinatura não permite novos clientes.';
  end if;

  if v_limite is not null then
    select count(*)::integer
    into v_total
    from public.empresas e
    where e.escritorio_id = new.escritorio_id
      and e.status <> 'arquivado';

    if v_total >= v_limite then
      raise exception 'Limite do plano atingido (% clientes).', v_limite;
    end if;
  end if;

  return new;
end;
$$;

create trigger t_empresas_limite_plano
  before insert or update of escritorio_id, status on public.empresas
  for each row execute function public.verificar_limite_empresas();

revoke all on function public.verificar_limite_empresas() from public, anon, authenticated;

commit;
