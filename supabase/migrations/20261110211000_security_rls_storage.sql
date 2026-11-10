-- =====================================================================
-- Segurança: RLS, perfis automáticos, histórico automático, Storage,
-- desativação automática de ofertas/banners/destaques vencidos.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Perfil criado automaticamente quando alguém se cadastra
-- (e-mail/senha ou Google). Dados vêm do user_metadata.
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Ofertas: products.is_offer / promo_price são DERIVADOS da tabela
-- offers (fonte única da verdade com período).
-- ---------------------------------------------------------------------
create or replace function public.refresh_product_offer(p_product_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare v_price numeric(10,2);
begin
  select o.promo_price into v_price
  from public.offers o
  where o.product_id = p_product_id
    and o.is_active
    and (o.starts_at is null or o.starts_at <= now())
    and (o.ends_at is null or o.ends_at > now())
  order by o.sort_order, o.created_at desc
  limit 1;

  update public.products p
     set is_offer = (v_price is not null),
         promo_price = v_price
   where p.id = p_product_id
     and (p.is_offer is distinct from (v_price is not null) or p.promo_price is distinct from v_price);
end;
$$;

create or replace function public.offers_sync_product()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op in ('UPDATE','DELETE') then
    perform public.refresh_product_offer(old.product_id);
  end if;
  if tg_op in ('INSERT','UPDATE') then
    perform public.refresh_product_offer(new.product_id);
  end if;
  return null;
end;
$$;

create trigger offers_sync_product
  after insert or update or delete on public.offers
  for each row execute function public.offers_sync_product();

-- Rotina periódica: desativa itens vencidos e recalcula ofertas.
create or replace function public.expire_scheduled_items()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare r record;
begin
  update public.offers     set is_active = false where is_active and ends_at is not null and ends_at <= now();
  update public.highlights set is_active = false where is_active and ends_at is not null and ends_at <= now();
  update public.banners    set is_active = false where is_active and ends_at is not null and ends_at <= now();
  update public.theme_schedules set is_active = false where is_active and ends_at <= now();
  -- ofertas que começaram agora também precisam refletir no produto
  for r in select distinct product_id from public.offers loop
    perform public.refresh_product_offer(r.product_id);
  end loop;
end;
$$;

revoke execute on function public.refresh_product_offer(uuid) from public, anon, authenticated;
revoke execute on function public.expire_scheduled_items() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.offers_sync_product() from public, anon, authenticated;

create extension if not exists pg_cron;
select cron.schedule('expire-scheduled-items', '*/10 * * * *', $$select public.expire_scheduled_items();$$);

-- ---------------------------------------------------------------------
-- Histórico automático (audit_logs) para tudo que o admin altera
-- ---------------------------------------------------------------------
create or replace function public.log_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old jsonb := case when tg_op <> 'INSERT' then to_jsonb(old) end;
  v_new jsonb := case when tg_op <> 'DELETE' then to_jsonb(new) end;
  v_rec jsonb := coalesce(v_new, v_old);
  v_entity text;
  v_label text;
  v_action text;
  v_changes jsonb;
  v_user uuid := auth.uid();
  v_user_label text;
  k text;
begin
  v_entity := case tg_table_name
    when 'products' then 'Produto'
    when 'categories' then 'Categoria'
    when 'offers' then 'Oferta'
    when 'highlights' then 'Destaque'
    when 'news' then 'Novidade'
    when 'banners' then 'Banner'
    when 'services' then 'Serviço'
    when 'cafe_categories' then 'Categoria da cafeteria'
    when 'cafe_items' then 'Item da cafeteria'
    when 'site_content' then 'Texto'
    when 'site_settings' then 'Configurações'
    when 'themes' then 'Tema'
    when 'theme_schedules' then 'Agendamento de tema'
    when 'admins' then 'Acesso administrativo'
    else tg_table_name end;

  v_label := coalesce(v_rec->>'name', v_rec->>'title', v_rec->>'label', v_rec->>'username', v_rec->>'store_name');
  if v_label is null and v_rec ? 'product_id' then
    select p.name into v_label from public.products p where p.id = (v_rec->>'product_id')::uuid;
  end if;
  if v_label is null and v_rec ? 'theme_id' then
    select t.name into v_label from public.themes t where t.id = (v_rec->>'theme_id')::uuid;
  end if;

  if tg_op = 'INSERT' then
    v_action := 'criado';
  elsif tg_op = 'DELETE' then
    v_action := 'excluído';
  else
    -- diferença coluna a coluna (ignora updated_at)
    v_changes := '{}'::jsonb;
    for k in select jsonb_object_keys(v_new) loop
      if k <> 'updated_at' and (v_new->k) is distinct from (v_old->k) then
        v_changes := v_changes || jsonb_build_object(k, jsonb_build_object('de', v_old->k, 'para', v_new->k));
      end if;
    end loop;
    if v_changes = '{}'::jsonb then
      return null;
    end if;
    if v_changes ? 'is_active' and (select count(*) from jsonb_object_keys(v_changes)) = 1 then
      v_action := case when (v_new->>'is_active')::boolean then 'ativado' else 'desativado' end;
    elsif v_changes ? 'is_default' and (v_new->>'is_default')::boolean then
      v_action := 'definido como padrão';
    else
      v_action := 'alterado';
    end if;
  end if;

  if v_user is null then
    v_user_label := 'Sistema (automático)';
  else
    select a.username into v_user_label from public.admins a where a.user_id = v_user;
    v_user_label := coalesce(v_user_label, 'usuário');
  end if;

  insert into public.audit_logs (user_id, user_label, action, entity, entity_id, entity_label, summary, changes)
  values (
    v_user, v_user_label, v_action, tg_table_name,
    coalesce(v_rec->>'id', v_rec->>'key', v_rec->>'user_id'),
    v_label,
    v_entity || coalesce(' ' || v_label, '') || ' ' || v_action || '.',
    v_changes
  );
  return null;
end;
$$;
revoke execute on function public.log_change() from public, anon, authenticated;

do $$
declare t text;
begin
  foreach t in array array[
    'products','categories','offers','highlights','news','banners','services',
    'cafe_categories','cafe_items','site_content','site_settings','themes','theme_schedules','admins'
  ] loop
    execute format(
      'create trigger %I after insert or update or delete on public.%I for each row execute function public.log_change()',
      t || '_audit', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- RLS — ligado em TODAS as tabelas
-- ---------------------------------------------------------------------
alter table public.profiles            enable row level security;
alter table public.admins              enable row level security;
alter table public.categories          enable row level security;
alter table public.products            enable row level security;
alter table public.offers              enable row level security;
alter table public.highlights          enable row level security;
alter table public.news                enable row level security;
alter table public.banners             enable row level security;
alter table public.services            enable row level security;
alter table public.cafe_categories     enable row level security;
alter table public.cafe_items          enable row level security;
alter table public.site_content        enable row level security;
alter table public.site_content_drafts enable row level security;
alter table public.site_settings       enable row level security;
alter table public.themes              enable row level security;
alter table public.theme_schedules     enable row level security;
alter table public.media               enable row level security;
alter table public.audit_logs          enable row level security;

-- Perfis: cada cliente vê e edita somente o próprio; admin pode ver todos.
create policy "perfil: ler o próprio ou admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));
create policy "perfil: inserir o próprio" on public.profiles
  for insert to authenticated
  with check (id = (select auth.uid()));
create policy "perfil: editar o próprio" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Admin: só o próprio admin enxerga/edita o seu usuário. Sem INSERT/DELETE.
create policy "admin: ler o próprio" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));
create policy "admin: alterar o próprio usuário" on public.admins
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Tabelas de catálogo: público lê o que está ativo; admin faz tudo.
do $$
declare t text;
begin
  foreach t in array array['categories','products','news','services','cafe_categories','cafe_items','themes'] loop
    execute format($f$
      create policy "público: ler ativos" on public.%1$I
        for select to anon, authenticated
        using (is_active or (select public.is_admin()));
      create policy "admin: inserir" on public.%1$I
        for insert to authenticated with check ((select public.is_admin()));
      create policy "admin: alterar" on public.%1$I
        for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
      create policy "admin: excluir" on public.%1$I
        for delete to authenticated using ((select public.is_admin()));
    $f$, t);
  end loop;
end $$;

-- Tabelas com período (ofertas, destaques, banners): público lê se ativo E dentro do período.
do $$
declare t text;
begin
  foreach t in array array['offers','highlights','banners'] loop
    execute format($f$
      create policy "público: ler vigentes" on public.%1$I
        for select to anon, authenticated
        using (
          (is_active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now()))
          or (select public.is_admin())
        );
      create policy "admin: inserir" on public.%1$I
        for insert to authenticated with check ((select public.is_admin()));
      create policy "admin: alterar" on public.%1$I
        for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
      create policy "admin: excluir" on public.%1$I
        for delete to authenticated using ((select public.is_admin()));
    $f$, t);
  end loop;
end $$;

-- Conteúdo publicado e configurações: leitura pública; escrita admin.
create policy "público: ler textos publicados" on public.site_content
  for select to anon, authenticated using (true);
create policy "admin: inserir" on public.site_content
  for insert to authenticated with check ((select public.is_admin()));
create policy "admin: alterar" on public.site_content
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin: excluir" on public.site_content
  for delete to authenticated using ((select public.is_admin()));

create policy "público: ler configurações" on public.site_settings
  for select to anon, authenticated using (true);
create policy "admin: alterar" on public.site_settings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Somente admin (rascunhos, agendamentos, mídia, histórico).
do $$
declare t text;
begin
  foreach t in array array['site_content_drafts','theme_schedules','media'] loop
    execute format($f$
      create policy "admin: ler" on public.%1$I
        for select to authenticated using ((select public.is_admin()));
      create policy "admin: inserir" on public.%1$I
        for insert to authenticated with check ((select public.is_admin()));
      create policy "admin: alterar" on public.%1$I
        for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
      create policy "admin: excluir" on public.%1$I
        for delete to authenticated using ((select public.is_admin()));
    $f$, t);
  end loop;
end $$;

-- Histórico: somente leitura para o admin (gravação apenas pelo trigger).
create policy "admin: ler histórico" on public.audit_logs
  for select to authenticated using ((select public.is_admin()));

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.current_theme() to anon, authenticated;

-- ---------------------------------------------------------------------
-- STORAGE — bucket único organizado por pastas:
--   products/ banners/ branding/ campaigns/ institutional/
--   sectors/ services/ cafe/ news/ highlights/
-- Leitura pública por URL; envio/alteração/remoção só admin.
-- Somente JPG, PNG e WEBP até 5 MB.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "site-media: admin lista" on storage.objects
  for select to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()));
create policy "site-media: admin envia" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'site-media' and (select public.is_admin())
    and (storage.foldername(name))[1] in ('products','banners','branding','campaigns','institutional','sectors','services','cafe','news','highlights')
  );
create policy "site-media: admin substitui" on storage.objects
  for update to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()))
  with check (bucket_id = 'site-media' and (select public.is_admin()));
create policy "site-media: admin remove" on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()));
