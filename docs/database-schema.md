# Database schema

The schema is defined in `supabase/migrations/`:

- `20261027000001_initial_schema.sql`: content, forms, admin, storage, audit.
- `20261027000002_commerce.sql`: the commerce data model.

## Security model

- **Row-level security is on for every table.**
- **Anonymous visitors can only read published content:** `products`, `faqs` and `articles` where `is_published` is set, plus `site_content`, `legal_documents` and `media_assets`.
- **Visitor submissions are written by our server.** The contact form, new-customer form and Dr. Peptide logs never come from the browser. Next.js API routes (`/api/inquiries`, `/api/registrations`, `/api/dr-peptide`) validate each request, enforce the spam guards and insert with the service-role key, which exists only on the server. This is the main security change from the original site, which inserted into Supabase directly from the browser using its public key.
- **Admins sign in with Supabase Auth.** Each admin's role is stored in `admin_users`:

  | Role | Can |
  |---|---|
  | `viewer` | Read |
  | `editor` | Edit content and update submissions |
  | `admin` | Prices, integrations, deletes, imports, audit log |
  | `owner` | Manage admin users |

  The database enforces this with the `has_admin_role()` RLS function. The app also checks the role on every page and server action through `requireAdmin()`.
- **`audit_log` is append-only.** A trigger rejects any UPDATE or DELETE.
- **Visitor IPs are never stored in the clear.** They are SHA-256 hashed with `IP_HASH_SALT` first.

## Tables

### Admin

| Table | Purpose | Key columns |
|---|---|---|
| `admin_users` | Who can use /admin, and with which role | `user_id` (→ auth.users), `email`, `role` (owner/admin/editor/viewer) |
| `audit_log` | Every admin change | `actor_id`, `actor_email`, `action`, `entity`, `entity_id`, `before`, `after`, `created_at` |
| `integrations` | Non-secret integration settings | `key` (dr_peptide, email_notifications, payments), `enabled`, `config` jsonb |

### Visitor submissions

These tables keep the same columns as the original site's tables. Status and notes columns were added for the admin.

| Table | Purpose | Columns |
|---|---|---|
| `inquiries` | `/contact` form | `name`, `email`, `organization`, `inquiry_type` (catalog/coa/procurement/collaboration/other), `message`, `status` (new/in_progress/closed/spam), `admin_notes`, `ip_hash`, `user_agent`, timestamps |
| `customer_registrations` | `/new-customer` form | `legal_name`, `business_name`, `role_title`, `email`, `phone`, `address_street`, `address_city`, `address_state`, `address_postal_code`, `address_country`, `intended_use`, `referral_source`, `ruo_acknowledged`, `status`, `admin_notes`, `ip_hash`, `user_agent`, timestamps |
| `chat_messages` | Dr. Peptide question/answer log | `session_id`, `question`, `answer`, `model`, `ip_hash`, `created_at` |

### Public content

The public site reads these tables first. When a table has no rows, or the database is unreachable, it falls back to the seed content in `src/content/`, which is identical to the original.

| Table | Purpose | Columns |
|---|---|---|
| `products` | Catalog and product pages | `slug` (unique), `name`, `category` (wellness-longevity / performance-recovery), `tagline`, `summary`, `mechanism`, `research_areas` text[], `purity`, `references` jsonb `[{title,source,year,url}]`, `specs` jsonb `{cas, molecularWeight, molecularFormula, sequence, form, storage}`, `product_image`, `coas` jsonb `[{label,purity,image}]`, `sort_order`, `is_published` |
| `faqs` | `/research` questions | `question`, `answer`, `sort_order`, `is_published` |
| `articles` | Educational articles: storage only, since the original has no public article route | `slug`, `title`, `excerpt`, `body`, `is_published`, `published_at` |
| `site_content` | Overrides for shared copy | `key`, `value` |
| `legal_documents` | Legal page overrides | `slug` (terms/privacy/disclaimer/acceptable-use/shipping), `content` jsonb (same shape as `src/content/legal/*.ts`) |
| `media_assets` | Media library index | `path`, `public_url`, `alt_text`, `mime_type`, `size_bytes` |

The `site_content` keys currently wired into the site are:

- `site.announcement`: the top announcement bar
- `footer.blurb`: the footer description
- `footer.disclaimer`: the footer disclaimer

### Commerce (Phase 5: payment-ready, not enabled)

| Table | Purpose |
|---|---|
| `product_variants` | Sellable units per product: `sku`, `label`, `is_active`, `is_purchasable` (defaults to **false**) |
| `prices` | `unit_amount_cents`, `currency`, `provider_price_id`. At most one active price per variant per currency. |
| `inventory` | `quantity_on_hand`, `quantity_reserved`, `low_stock_threshold` |
| `customers` | `email`, `full_name`, `business_name`, `phone`, `registration_id` → customer_registrations, `is_approved` (vetting gate), `provider_customer_id` |
| `orders` | `order_number` (from 10001), `customer_id`, `status` (draft, pending_payment, paid, processing, shipped, delivered, cancelled, refunded), money columns in cents, `shipping_address` jsonb |
| `order_items` | Snapshot of what was ordered: `description`, `quantity`, `unit_amount_cents` |
| `order_status_history` | Status transitions with who changed them and when |
| `payment_transactions` | Processor **references only**: `provider`, `provider_payment_id`, `provider_event_id` (unique, for webhook idempotency), `status`, `amount_cents`. No card or bank data, by design. |

### Storage

One bucket, `media`. It is public-read, and only editors and above can write to it. Uploaded images can be used as product images and COAs by pasting their public URL into the product editor.
