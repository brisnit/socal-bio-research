-- Socal Bioresearch: client-owned schema.
-- Apply with `supabase db push` (or paste into the SQL editor) on a NEW
-- Supabase project owned by the client.
--
-- Security model
--   * Every table has RLS enabled.
--   * Anonymous visitors can only READ published catalog/content rows.
--   * Public form submissions and chat logs are written by Next.js API routes
--     using the service-role key (server-only), after validation + spam checks.
--   * Admin users authenticate with Supabase Auth; their role lives in
--     public.admin_users. RLS policies use public.admin_role() so a signed-in
--     non-admin gets nothing.

-- gen_random_uuid() is built into Postgres 13+ (no pgcrypto needed).

-- ---------------------------------------------------------------------------
-- Admin users and roles
-- ---------------------------------------------------------------------------
create type public.admin_role_t as enum ('owner', 'admin', 'editor', 'viewer');

create table public.admin_users (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text not null unique,
  role        public.admin_role_t not null default 'viewer',
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id)
);

-- Role of the current JWT user, or null.
create or replace function public.admin_role() returns public.admin_role_t
language sql stable security definer set search_path = public as $$
  select role from public.admin_users where user_id = auth.uid()
$$;

create or replace function public.has_admin_role(min_role public.admin_role_t) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select case role
       when 'owner'  then 4 when 'admin' then 3 when 'editor' then 2 when 'viewer' then 1 end
     from public.admin_users where user_id = auth.uid())
    >= case min_role when 'owner' then 4 when 'admin' then 3 when 'editor' then 2 when 'viewer' then 1 end,
    false)
$$;

-- ---------------------------------------------------------------------------
-- Shared trigger: updated_at
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

-- ---------------------------------------------------------------------------
-- Public form data (same columns the original site inserted)
-- ---------------------------------------------------------------------------
create type public.inquiry_status_t as enum ('new', 'in_progress', 'closed', 'spam');

create table public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  name          text not null check (char_length(name) between 1 and 200),
  email         text not null check (char_length(email) between 3 and 320),
  organization  text check (char_length(organization) <= 200),
  inquiry_type  text check (inquiry_type in ('catalog', 'coa', 'procurement', 'collaboration', 'other')),
  message       text not null check (char_length(message) between 1 and 5000),
  status        public.inquiry_status_t not null default 'new',
  admin_notes   text,
  ip_hash       text,
  user_agent    text
);
create index inquiries_created_idx on public.inquiries (created_at desc);
create trigger inquiries_touch before update on public.inquiries for each row execute function public.touch_updated_at();

create table public.customer_registrations (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  legal_name           text not null,
  business_name        text not null,
  role_title           text,
  email                text not null,
  phone                text not null,
  address_street       text not null,
  address_city         text not null,
  address_state        text not null,
  address_postal_code  text not null,
  address_country      text not null,
  intended_use         text not null,
  referral_source      text,
  ruo_acknowledged     boolean not null default false,
  status               public.inquiry_status_t not null default 'new',
  admin_notes          text,
  ip_hash              text,
  user_agent           text
);
create index customer_registrations_created_idx on public.customer_registrations (created_at desc);
create trigger customer_registrations_touch before update on public.customer_registrations for each row execute function public.touch_updated_at();

create table public.chat_messages (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  session_id  text,
  question    text not null,
  answer      text not null,
  model       text,
  ip_hash     text
);
create index chat_messages_session_idx on public.chat_messages (session_id, created_at);

-- ---------------------------------------------------------------------------
-- Catalog (content shown on /products and /products/[slug])
-- ---------------------------------------------------------------------------
create table public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name            text not null,
  category        text not null check (category in ('wellness-longevity', 'performance-recovery')),
  tagline         text not null default '',
  summary         text not null default '',
  mechanism       text not null default '',
  research_areas  text[] not null default '{}',
  purity          text not null default '',
  "references"    jsonb not null default '[]'::jsonb,   -- [{title, source, year, url}]
  specs           jsonb not null default '{}'::jsonb,   -- {cas, molecularWeight, molecularFormula, sequence, form, storage}
  product_image   text,                                 -- public path or storage URL
  coas            jsonb not null default '[]'::jsonb,   -- [{label, purity, image}]
  sort_order      integer not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index products_sort_idx on public.products (sort_order);
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Editable content: FAQs, articles, page text, legal documents
-- ---------------------------------------------------------------------------
create table public.faqs (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  answer        text not null,
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger faqs_touch before update on public.faqs for each row execute function public.touch_updated_at();

create table public.articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text not null default '',
  body          text not null default '',
  is_published  boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger articles_touch before update on public.articles for each row execute function public.touch_updated_at();

-- Key/value overrides for site copy, e.g. key 'site.announcement'.
create table public.site_content (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users (id)
);
create trigger site_content_touch before update on public.site_content for each row execute function public.touch_updated_at();

create table public.legal_documents (
  slug        text primary key check (slug in ('terms', 'privacy', 'disclaimer', 'acceptable-use', 'shipping')),
  content     jsonb not null,           -- same shape as src/content/legal/<slug>.ts
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users (id)
);
create trigger legal_documents_touch before update on public.legal_documents for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Media library (files live in the 'media' storage bucket)
-- ---------------------------------------------------------------------------
create table public.media_assets (
  id           uuid primary key default gen_random_uuid(),
  path         text not null unique,     -- object path inside bucket 'media'
  public_url   text not null,
  alt_text     text not null default '',
  mime_type    text,
  size_bytes   bigint,
  created_at   timestamptz not null default now(),
  created_by   uuid references auth.users (id)
);

-- ---------------------------------------------------------------------------
-- Integrations (non-secret settings only; secrets stay in env vars)
-- ---------------------------------------------------------------------------
create table public.integrations (
  key         text primary key,          -- e.g. 'payments', 'email_notifications', 'dr_peptide'
  enabled     boolean not null default false,
  config      jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users (id)
);
create trigger integrations_touch before update on public.integrations for each row execute function public.touch_updated_at();

insert into public.integrations (key, enabled, config) values
  ('dr_peptide', true, '{"model": "claude-opus-5-5"}'),
  ('email_notifications', false, '{"notify_to": []}'),
  ('payments', false, '{"provider": null, "mode": "disabled"}');

-- ---------------------------------------------------------------------------
-- Audit log (append-only)
-- ---------------------------------------------------------------------------
create table public.audit_log (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  actor_id     uuid references auth.users (id),
  actor_email  text,
  action       text not null,            -- e.g. 'product.update'
  entity       text not null,            -- table name
  entity_id    text,
  before       jsonb,
  after        jsonb
);
create index audit_log_created_idx on public.audit_log (created_at desc);

create or replace function public.audit_log_immutable() returns trigger
language plpgsql as $$ begin raise exception 'audit_log is append-only'; end $$;
create trigger audit_log_no_update before update or delete on public.audit_log
  for each row execute function public.audit_log_immutable();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.admin_users            enable row level security;
alter table public.inquiries              enable row level security;
alter table public.customer_registrations enable row level security;
alter table public.chat_messages          enable row level security;
alter table public.products               enable row level security;
alter table public.faqs                   enable row level security;
alter table public.articles               enable row level security;
alter table public.site_content           enable row level security;
alter table public.legal_documents        enable row level security;
alter table public.media_assets           enable row level security;
alter table public.integrations           enable row level security;
alter table public.audit_log              enable row level security;

-- Public read of published content.
create policy "public read products"  on public.products        for select using (is_published);
create policy "public read faqs"      on public.faqs            for select using (is_published);
create policy "public read articles"  on public.articles        for select using (is_published);
create policy "public read content"   on public.site_content    for select using (true);
create policy "public read legal"     on public.legal_documents for select using (true);
create policy "public read media"     on public.media_assets    for select using (true);

-- Admin access (viewers read, editors write content, admins manage everything).
create policy "admins read admin_users" on public.admin_users for select using (public.has_admin_role('viewer'));
create policy "owners manage admin_users" on public.admin_users for all
  using (public.has_admin_role('owner')) with check (public.has_admin_role('owner'));

create policy "admins read inquiries" on public.inquiries for select using (public.has_admin_role('viewer'));
create policy "editors update inquiries" on public.inquiries for update using (public.has_admin_role('editor'));
create policy "admins read registrations" on public.customer_registrations for select using (public.has_admin_role('viewer'));
create policy "editors update registrations" on public.customer_registrations for update using (public.has_admin_role('editor'));
create policy "admins read chat" on public.chat_messages for select using (public.has_admin_role('viewer'));

create policy "admins read all products" on public.products for select using (public.has_admin_role('viewer'));
create policy "editors write products" on public.products for all
  using (public.has_admin_role('editor')) with check (public.has_admin_role('editor'));
create policy "admins read all faqs" on public.faqs for select using (public.has_admin_role('viewer'));
create policy "editors write faqs" on public.faqs for all
  using (public.has_admin_role('editor')) with check (public.has_admin_role('editor'));
create policy "admins read all articles" on public.articles for select using (public.has_admin_role('viewer'));
create policy "editors write articles" on public.articles for all
  using (public.has_admin_role('editor')) with check (public.has_admin_role('editor'));
create policy "editors write content" on public.site_content for all
  using (public.has_admin_role('editor')) with check (public.has_admin_role('editor'));
create policy "editors write legal" on public.legal_documents for all
  using (public.has_admin_role('editor')) with check (public.has_admin_role('editor'));
create policy "editors write media" on public.media_assets for all
  using (public.has_admin_role('editor')) with check (public.has_admin_role('editor'));
create policy "admins read integrations" on public.integrations for select using (public.has_admin_role('viewer'));
create policy "admins write integrations" on public.integrations for all
  using (public.has_admin_role('admin')) with check (public.has_admin_role('admin'));
create policy "admins read audit" on public.audit_log for select using (public.has_admin_role('admin'));

-- ---------------------------------------------------------------------------
-- Storage bucket for media
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media bucket" on storage.objects for select using (bucket_id = 'media');
create policy "editors upload media" on storage.objects for insert with check (bucket_id = 'media' and public.has_admin_role('editor'));
create policy "editors update media" on storage.objects for update using (bucket_id = 'media' and public.has_admin_role('editor'));
create policy "editors delete media" on storage.objects for delete using (bucket_id = 'media' and public.has_admin_role('editor'));
