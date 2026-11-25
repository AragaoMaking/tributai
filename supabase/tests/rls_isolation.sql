begin;

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, created_at, updated_at
)
values
  (
    '00000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated',
    'rls-a@example.test', 'not-a-password', now(),
    '{"name":"Teste A","office":"Escritório A"}', now(), now()
  ),
  (
    '00000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated',
    'rls-b@example.test', 'not-a-password', now(),
    '{"name":"Teste B","office":"Escritório B"}', now(), now()
  );

select set_config(
  'tributai.test.office_a',
  (select escritorio_id::text from public.membros where usuario_id = '00000000-0000-4000-8000-000000000001'),
  true
);
select set_config(
  'tributai.test.office_b',
  (select escritorio_id::text from public.membros where usuario_id = '00000000-0000-4000-8000-000000000002'),
  true
);

insert into public.empresas (escritorio_id, razao_social, status)
values
  (current_setting('tributai.test.office_a')::uuid, 'Empresa de teste A', 'ativo'),
  (current_setting('tributai.test.office_b')::uuid, 'Empresa de teste B', 'ativo');

insert into public.empresas (escritorio_id, razao_social, status)
select current_setting('tributai.test.office_b')::uuid, 'Empresa adicional B ' || n, 'ativo'
from generate_series(1, 9) as n;

select set_config(
  'tributai.test.company_a',
  (select id::text from public.empresas where razao_social = 'Empresa de teste A'),
  true
);
select set_config(
  'tributai.test.company_b',
  (select id::text from public.empresas where razao_social = 'Empresa de teste B'),
  true
);

do $$
begin
  if (select count(*) from public.perfis where id in (
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000002'
  )) <> 2 then
    raise exception 'Cadastro não provisionou os dois perfis.';
  end if;

  if (select count(*) from public.assinaturas where escritorio_id in (
    current_setting('tributai.test.office_a')::uuid,
    current_setting('tributai.test.office_b')::uuid
  ) and status = 'teste') <> 2 then
    raise exception 'Cadastro não provisionou as assinaturas de teste.';
  end if;
end;
$$;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}', true);

insert into public.empresas (escritorio_id, razao_social, status)
values (current_setting('tributai.test.office_a')::uuid, 'Nova empresa A', 'rascunho');

insert into public.simulacoes (
  escritorio_id, empresa_id, usuario_id, periodo_ano, entrada, premissas, pendencias
)
values (
  current_setting('tributai.test.office_a')::uuid,
  current_setting('tributai.test.company_a')::uuid,
  '00000000-0000-4000-8000-000000000001',
  2027, '{}', '[]', '["motor pendente"]'
);

do $$
declare
  affected integer;
  denied boolean := false;
begin
  if (select count(*) from public.empresas) <> 2 then
    raise exception 'Usuário A enxerga dados de outro escritório.';
  end if;

  if (select count(*) from public.simulacoes) <> 1 then
    raise exception 'Usuário A não consegue criar e ler a própria simulação.';
  end if;

  if (select count(*) from public.escritorios) <> 1 then
    raise exception 'Usuário A enxerga outro escritório.';
  end if;

  update public.empresas
  set razao_social = 'Alteração indevida'
  where escritorio_id = current_setting('tributai.test.office_b')::uuid;
  get diagnostics affected = row_count;
  if affected <> 0 then
    raise exception 'Usuário A alterou empresa de outro escritório.';
  end if;

  begin
    insert into public.empresas (escritorio_id, razao_social, status)
    values (current_setting('tributai.test.office_b')::uuid, 'Inserção indevida', 'arquivado');
    raise exception 'Usuário A inseriu empresa em outro escritório.';
  exception when insufficient_privilege then
    null;
  end;

  begin
    insert into public.simulacoes (
      escritorio_id, empresa_id, usuario_id, periodo_ano, entrada, premissas, pendencias
    )
    values (
      current_setting('tributai.test.office_b')::uuid,
      current_setting('tributai.test.company_b')::uuid,
      '00000000-0000-4000-8000-000000000001',
      2027, '{}', '[]', '["motor pendente"]'
    );
    raise exception 'Usuário A inseriu simulação em outro escritório.';
  exception when insufficient_privilege then
    null;
  end;

  perform public.selecionar_plano(
    current_setting('tributai.test.office_a')::uuid,
    'profissional'
  );
  begin
    perform public.selecionar_plano(
      current_setting('tributai.test.office_b')::uuid,
      'profissional'
    );
  exception when raise_exception then
    denied := true;
  end;
  if not denied then
    raise exception 'Usuário A alterou plano de outro escritório.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}', true);

do $$
declare
  blocked boolean := false;
begin
  if (select count(*) from public.empresas) <> 10 then
    raise exception 'Usuário B enxerga dados de outro escritório.';
  end if;

  if (select count(*) from public.simulacoes) <> 0 then
    raise exception 'Usuário B enxerga simulações de outro escritório.';
  end if;

  if (
    select plano_id
    from public.assinaturas
    where escritorio_id = current_setting('tributai.test.office_b')::uuid
  ) <> 'starter' then
    raise exception 'Plano do escritório B foi alterado por outro usuário.';
  end if;

  begin
    insert into public.empresas (escritorio_id, razao_social, status)
    values (current_setting('tributai.test.office_b')::uuid, 'Empresa acima do limite', 'rascunho');
  exception when raise_exception then
    if sqlerrm like 'Limite do plano atingido%' then
      blocked := true;
    else
      raise;
    end if;
  end;
  if not blocked then
    raise exception 'O plano Starter permitiu mais de dez clientes.';
  end if;
end;
$$;

reset role;
rollback;
