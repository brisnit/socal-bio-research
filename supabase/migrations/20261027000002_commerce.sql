-- Commerce data model (Phase 5): payment-READY, not payment-ENABLED.
--
-- Nothing in the public site reads or writes these tables yet. There is no
-- checkout, and no card data is ever stored here: payment_transactions keeps
-- only the processor's reference IDs and statuses. Purchases stay disabled
-- until the client confirms (a) which processor approved the business in
-- writing and (b) which products may legally be sold through it. Then they
-- flip integrations.payments.enabled and wire the provider adapter in
-- src/lib/payments/.

create type public.order_status_t as enum (
  'draft', 'pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
);
create type public.payment_status_t as enum (
  'pending', 'authorized', 'succeeded', 'failed', 'cancelled', 'refunded', 'partially_refunded'
);

create table public.product_variants (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products (id) on delete cascade,
  sku           text not null unique,
  label         text not null,             -- e.g. '10 mg vial'
  is_active     boolean not null default false,
  is_purchasable boolean not null default false,  -- per-variant kill switch, default OFF
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger product_variants_touch before update on public.product_variants for each row execute function public.touch_updated_at();

create table public.prices (
  id                uuid primary key default gen_random_uuid(),
  variant_id        uuid not null references public.product_variants (id) on delete cascade,
  currency          char(3) not null default 'USD',
  unit_amount_cents integer not null check (unit_amount_cents >= 0),
  is_active         boolean not null default true,
  provider_price_id text,                  -- processor-side price id, if any
  created_at        timestamptz not null default now()
);
create unique index prices_one_active_per_currency on public.prices (variant_id, currency) where is_active;

create table public.inventory (
  variant_id        uuid primary key references public.product_variants (id) on delete cascade,
  quantity_on_hand  integer not null default 0 check (quantity_on_hand >= 0),
  quantity_reserved integer not null default 0 check (quantity_reserved >= 0),
  low_stock_threshold integer not null default 0,
  updated_at        timestamptz not null default now()
);
create trigger inventory_touch before update on public.inventory for each row execute function public.touch_updated_at();

create table public.customers (
  id               uuid primary key default gen_random_uuid(),
  email            text not null unique,
  full_name        text,
  business_name    text,
  phone            text,
  registration_id  uuid references public.customer_registrations (id) on delete set null,
  is_approved      boolean not null default false,  -- RUO/vetting gate before any sale
  provider_customer_id text,                         -- processor-side customer id
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger customers_touch before update on public.customers for each row execute function public.touch_updated_at();

create sequence public.order_number_seq start 10001;

create table public.orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     bigint not null unique default nextval('public.order_number_seq'),
  customer_id      uuid references public.customers (id) on delete restrict,
  status           public.order_status_t not null default 'draft',
  currency         char(3) not null default 'USD',
  subtotal_cents   integer not null default 0,
  shipping_cents   integer not null default 0,
  tax_cents        integer not null default 0,
  total_cents      integer not null default 0,
  shipping_address jsonb,
  notes            text,
  placed_at        timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index orders_customer_idx on public.orders (customer_id, created_at desc);
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

create table public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders (id) on delete cascade,
  variant_id        uuid references public.product_variants (id) on delete set null,
  description       text not null,        -- snapshot of product + variant label
  quantity          integer not null check (quantity > 0),
  unit_amount_cents integer not null check (unit_amount_cents >= 0)
);

create table public.order_status_history (
  id          bigint generated always as identity primary key,
  order_id    uuid not null references public.orders (id) on delete cascade,
  from_status public.order_status_t,
  to_status   public.order_status_t not null,
  changed_by  uuid references auth.users (id),
  note        text,
  created_at  timestamptz not null default now()
);

-- Processor references only. NEVER add columns for card numbers, CVC, or bank details.
create table public.payment_transactions (
  id                    uuid primary key default gen_random_uuid(),
  order_id              uuid not null references public.orders (id) on delete restrict,
  provider              text not null,          -- e.g. 'manual', or the approved processor's key
  provider_payment_id   text,                   -- processor's payment/charge/intent id
  provider_event_id     text unique,            -- webhook event id for idempotency
  status                public.payment_status_t not null default 'pending',
  amount_cents          integer not null,
  currency              char(3) not null default 'USD',
  metadata              jsonb not null default '{}'::jsonb,  -- non-sensitive processor metadata only
  created_at            timestamptz not null default now()
);
create index payment_transactions_order_idx on public.payment_transactions (order_id);

alter table public.product_variants     enable row level security;
alter table public.prices               enable row level security;
alter table public.inventory            enable row level security;
alter table public.customers            enable row level security;
alter table public.orders               enable row level security;
alter table public.order_items          enable row level security;
alter table public.order_status_history enable row level security;
alter table public.payment_transactions enable row level security;

-- No public policies: none of this is exposed to visitors yet.
create policy "admins read variants" on public.product_variants for select using (public.has_admin_role('viewer'));
create policy "editors write variants" on public.product_variants for all using (public.has_admin_role('editor')) with check (public.has_admin_role('editor'));
create policy "admins read prices" on public.prices for select using (public.has_admin_role('viewer'));
create policy "admins write prices" on public.prices for all using (public.has_admin_role('admin')) with check (public.has_admin_role('admin'));
create policy "admins read inventory" on public.inventory for select using (public.has_admin_role('viewer'));
create policy "editors write inventory" on public.inventory for all using (public.has_admin_role('editor')) with check (public.has_admin_role('editor'));
create policy "admins read customers" on public.customers for select using (public.has_admin_role('viewer'));
create policy "admins write customers" on public.customers for all using (public.has_admin_role('admin')) with check (public.has_admin_role('admin'));
create policy "admins read orders" on public.orders for select using (public.has_admin_role('viewer'));
create policy "admins write orders" on public.orders for all using (public.has_admin_role('admin')) with check (public.has_admin_role('admin'));
create policy "admins read order items" on public.order_items for select using (public.has_admin_role('viewer'));
create policy "admins write order items" on public.order_items for all using (public.has_admin_role('admin')) with check (public.has_admin_role('admin'));
create policy "admins read order history" on public.order_status_history for select using (public.has_admin_role('viewer'));
create policy "admins read payments" on public.payment_transactions for select using (public.has_admin_role('admin'));
-- payment_transactions are written only by server code (service role) from verified webhooks.
