-- =====================================================================
-- Supermercado Japão — Estrutura principal do banco
-- =====================================================================
-- Convenções:
--  * Todas as tabelas têm created_at / updated_at.
--  * Imagens são guardadas como caminho dentro do bucket "site-media"
--    (ex.: "products/arroz.webp"), nunca como arquivo no banco.
--  * Colunas external_source / external_id preparam a futura
--    sincronização com Hipcom/ERP sem nenhuma integração ativa agora.
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------
-- Função utilitária: atualiza updated_at automaticamente
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- PERFIS (clientes e admin) — ligado a auth.users. Nunca guarda senha.
-- ---------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- ADMINISTRADOR — um único admin (requisito). O "usuário" exibido no
-- login fica aqui; a senha é gerenciada pelo
-- Supabase Auth (bcrypt). Ninguém consegue se auto-promover: não existe
-- política de INSERT para usuários comuns.
-- ---------------------------------------------------------------------
create table public.admins (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  username    text not null unique check (username ~ '^[a-z0-9._-]{3,40}$'),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- CATEGORIAS / SETORES
-- ---------------------------------------------------------------------
create table public.categories (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text not null unique,
  description      text,
  icon             text,               -- nome do ícone (lucide) exibido no menu
  image_path       text,               -- imagem do card de "Setores"
  show_in_sectors  boolean not null default false,
  sort_order       int not null default 0,
  is_active        boolean not null default true,
  external_source  text,
  external_id      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (external_source, external_id)
);

-- ---------------------------------------------------------------------
-- PRODUTOS
-- ---------------------------------------------------------------------
create table public.products (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text not null unique,
  unit_label       text,               -- "Kg", "5kg", "Lata 350ml"...
  description      text,
  category_id      uuid references public.categories(id) on delete set null,
  price            numeric(10,2) not null check (price >= 0),
  promo_price      numeric(10,2) check (promo_price is null or promo_price >= 0),
  image_path       text,
  is_active        boolean not null default true,
  is_offer         boolean not null default false,
  is_featured      boolean not null default false,
  is_new           boolean not null default false,
  sort_order       int not null default 0,
  external_source  text,               -- futuro: 'hipcom'
  external_id      text,               -- futuro: código do produto no ERP
  stock_quantity   numeric(12,3),      -- futuro: estoque vindo do ERP
  synced_at        timestamptz,        -- futuro: última sincronização
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (external_source, external_id)
);
create index products_category_idx on public.products(category_id);
create index products_flags_idx on public.products(is_active, is_offer, is_new);

-- ---------------------------------------------------------------------
-- OFERTAS (com período; desativação automática ao terminar)
-- ---------------------------------------------------------------------
create table public.offers (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products(id) on delete cascade,
  title        text,
  description  text,
  promo_price  numeric(10,2) not null check (promo_price >= 0),
  badge_label  text default 'Oferta especial',
  starts_at    timestamptz,
  ends_at      timestamptz,
  is_active    boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);
create index offers_product_idx on public.offers(product_id);

-- ---------------------------------------------------------------------
-- DESTAQUE DA SEMANA
-- ---------------------------------------------------------------------
create table public.highlights (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid references public.products(id) on delete set null,
  title        text not null default 'Destaque da Semana',
  description  text,
  image_path   text,
  starts_at    timestamptz,
  ends_at      timestamptz,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index highlights_product_idx on public.highlights(product_id);

-- ---------------------------------------------------------------------
-- NOVIDADES / "Acontece no Japão" (produtos ou conteúdos)
-- ---------------------------------------------------------------------
create table public.news (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid references public.products(id) on delete set null,
  title        text not null,
  description  text,
  image_path   text,
  link_url     text,
  is_active    boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index news_product_idx on public.news(product_id);

-- ---------------------------------------------------------------------
-- BANNERS (tamanho padrão 728x110 para faixas; também usados nos
-- carrosséis "Acontece no Japão" e cabeçalhos de página)
-- ---------------------------------------------------------------------
create table public.banners (
  id           uuid primary key default gen_random_uuid(),
  placement    text not null default 'home_carousel'
               check (placement in ('home_hero','home_carousel','strip','offers_header','sectors_header','services_header','cafe_header')),
  image_path   text,
  title        text,
  description  text,
  button_text  text,
  link_url     text,
  sort_order   int not null default 0,
  is_active    boolean not null default true,
  starts_at    timestamptz,
  ends_at      timestamptz,
  theme_id     uuid,                    -- banner exclusivo de um tema (opcional)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- SERVIÇOS (Lotérica, Chaveiro, ...)
-- ---------------------------------------------------------------------
create table public.services (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  icon         text,
  image_path   text,
  link_url     text,
  sort_order   int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- CAFETERIA
-- ---------------------------------------------------------------------
create table public.cafe_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  icon        text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.cafe_items (
  id               uuid primary key default gen_random_uuid(),
  cafe_category_id uuid references public.cafe_categories(id) on delete set null,
  name             text not null,
  description      text,
  price            numeric(10,2) check (price is null or price >= 0),
  image_path       text,
  images_url       text,             -- link aberto pelo botão "Ver imagens"
  sort_order       int not null default 0,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index cafe_items_category_idx on public.cafe_items(cafe_category_id);

-- ---------------------------------------------------------------------
-- CONTEÚDO EDITÁVEL (todos os textos do site)
--  site_content        -> versão publicada (pública)
--  site_content_drafts -> rascunhos (somente admin)
-- ---------------------------------------------------------------------
create table public.site_content (
  key          text primary key check (key ~ '^[a-z0-9_.]+$'),
  value        text not null default '',
  group_name   text not null default 'geral',
  label        text not null,
  multiline    boolean not null default false,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.site_content_drafts (
  key          text primary key references public.site_content(key) on delete cascade,
  value        text not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- CONFIGURAÇÕES GERAIS (linha única)
-- ---------------------------------------------------------------------
create table public.site_settings (
  id              int primary key default 1 check (id = 1),
  store_name      text not null default 'Supermercado Japão',
  logo_path       text,               -- vazio = usa a logo oficial em /public
  favicon_path    text,
  phone           text,
  whatsapp        text,
  email           text,
  instagram_url   text,
  facebook_url    text,
  youtube_url     text,
  tiktok_url      text,
  address         text,
  address_city    text,
  maps_url        text,
  store_photo_path text,
  opening_hours   text,
  cafe_hours_weekdays text,
  cafe_hours_sunday   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- TEMAS SAZONAIS E AGENDAMENTOS
-- ---------------------------------------------------------------------
create table public.themes (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  is_default   boolean not null default false,
  colors       jsonb not null default '{}'::jsonb,   -- {primary, primaryDark, accent, ...}
  decorations  jsonb not null default '{}'::jsonb,   -- {emoji, ribbonText, pattern}
  texts        jsonb not null default '{}'::jsonb,   -- sobrescreve chaves de site_content
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create unique index themes_single_default on public.themes(is_default) where is_default;

alter table public.banners
  add constraint banners_theme_fk foreign key (theme_id) references public.themes(id) on delete set null;
create index banners_theme_idx on public.banners(theme_id);

create table public.theme_schedules (
  id          uuid primary key default gen_random_uuid(),
  theme_id    uuid not null references public.themes(id) on delete cascade,
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  priority    int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index theme_schedules_theme_idx on public.theme_schedules(theme_id);

-- Tema vigente agora: agendamento ativo de maior prioridade; senão o padrão.
create or replace function public.current_theme()
returns setof public.themes
language sql
stable
security definer
set search_path = ''
as $$
  (
    select t.*
    from public.theme_schedules s
    join public.themes t on t.id = s.theme_id
    where s.is_active and t.is_active
      and now() >= s.starts_at and now() < s.ends_at
    order by s.priority desc, s.starts_at desc
    limit 1
  )
  union all
  (
    select t.* from public.themes t
    where t.is_default
      and not exists (
        select 1 from public.theme_schedules s
        join public.themes t2 on t2.id = s.theme_id
        where s.is_active and t2.is_active and now() >= s.starts_at and now() < s.ends_at
      )
    limit 1
  );
$$;

-- ---------------------------------------------------------------------
-- MÍDIA (registro dos arquivos enviados ao Storage)
-- ---------------------------------------------------------------------
create table public.media (
  id           uuid primary key default gen_random_uuid(),
  bucket       text not null default 'site-media',
  path         text not null,
  folder       text not null,
  mime_type    text,
  size_bytes   bigint,
  alt_text     text,
  uploaded_by  uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (bucket, path)
);
create index media_uploaded_by_idx on public.media(uploaded_by);

-- ---------------------------------------------------------------------
-- HISTÓRICO DE ALTERAÇÕES
-- ---------------------------------------------------------------------
create table public.audit_logs (
  id           bigint generated always as identity primary key,
  user_id      uuid references auth.users(id) on delete set null,
  user_label   text,
  action       text not null,          -- criado / alterado / excluído / publicado / ativado
  entity       text not null,          -- tabela
  entity_id    text,
  entity_label text,                   -- ex.: "Café"
  summary      text not null,          -- ex.: "Produto Café alterado."
  changes      jsonb,
  created_at   timestamptz not null default now()
);
create index audit_logs_created_idx on public.audit_logs(created_at desc);
create index audit_logs_user_idx on public.audit_logs(user_id);

-- ---------------------------------------------------------------------
-- Triggers de updated_at
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','admins','categories','products','offers','highlights','news',
    'banners','services','cafe_categories','cafe_items','site_content',
    'site_content_drafts','site_settings','themes','theme_schedules','media'
  ] loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      t || '_set_updated_at', t);
  end loop;
end $$;
