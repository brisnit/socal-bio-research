# Payment readiness

**Payments are not active.**

- No payment processor is connected.
- No checkout exists, and the public design is unchanged.
- No card data is collected or stored, anywhere.

This document lays out what the client needs to decide, and what the codebase already has ready.

## 1. What is being sold today

This is based on the public site:

- **Catalog:** 22 peptides in two groups. Retatrutide was removed at the client's request.
  - "Wellness & Longevity" (13): GLP 1, MOTS C, Semaglutide, Tirzepatide, Cagrilintide, NAD+, Glutathione, Epitalon, Thymosin Alpha 1, Selank, Semax, PT 141, Melanotan II
  - "Performance & Recovery" (9): BPC 157, TB 500, BPC 157 / TB 500 Blend, CJC 1295, Ipamorelin, Sermorelin, Tesamorelin, GHK Cu, AOD 9604
- **How it is sold today:** there is no online purchase.
  1. A visitor uses "Ask about X", which opens `/contact?type=catalog`, or "I'd like to order", which uses the procurement inquiry type.
  2. New buyers register at `/new-customer`. That form records a **Research Use Only** acknowledgement, the intended use and the business details.
  3. A person on the team follows up by email or phone.
- **Positioning:** the site describes itself as education plus research-use products. It says it is "not a pharmacy" and does not prescribe. The Shipping & Returns policy describes how orders are handled offline.

## 2. Why the processor cannot be assumed

Peptides sold "for research use only" fall into categories that most mainstream processors restrict or prohibit. Several of the listed compounds are, or are closely related to, FDA-approved prescription drugs (semaglutide, tirzepatide, tesamorelin, bremelanotide/PT 141). Others are investigational. Stripe, Square, PayPal and Shopify Payments generally treat these as restricted or prohibited businesses. Accounts can be approved at signup and then **frozen later, with funds held**.

Before any payment code is turned on, the client should:

1. Get the business model reviewed by counsel. This covers FDA status per compound, state law, research-use-only labeling, and age and vetting requirements.
2. Apply to processors that explicitly underwrite this category. These are usually high-risk merchant account providers.
3. Get **written approval** that names the product categories, then share it with whoever enables payments.

## 3. What is already built

- **Data model** (`supabase/migrations/20261027000002_commerce.sql`):
  - products → variants → prices
  - inventory
  - customers, linked to registrations, with an `is_approved` vetting flag
  - orders, order items and status history
  - payment transactions that hold processor reference IDs only
- **Safety defaults:**
  - `product_variants.is_purchasable` defaults to `false`.
  - `customers.is_approved` defaults to `false`.
  - The `integrations.payments` row is `enabled = false` and `provider = null`.
- **Admin:**
  - `/admin/commerce` manages variants, prices (in cents) and inventory, and lists orders.
  - `/admin/registrations` is where buyers get vetted.

## 4. Integration architecture, for when a provider is approved

```
Browser ──(no card data)──▶ provider-hosted checkout or payment page
   ▲                                   │
   │ redirect                          │ signed webhook
   │                                   ▼
Next.js /api/payments/webhook ──▶ verify signature ──▶ upsert payment_transactions
                                                    └─▶ advance orders.status
```

**Rules for the adapter:**

- **Use hosted checkout or hosted fields only.** Card data must never touch this server. That keeps PCI scope at SAQ A.
- **Price on the server.** The server builds the order from `prices`. It never trusts amounts sent by the browser.
- **Gate every sale.** A sale requires all of the following:
  - `integrations.payments.enabled`
  - the variant's `is_purchasable` flag
  - the customer's `is_approved` flag
  - the product category being on the processor's approved list
- **Make webhooks idempotent.** `payment_transactions.provider_event_id` is unique, so a repeated webhook cannot be recorded twice.
- **Keep secrets in env vars only:** `PAYMENTS_SECRET_KEY` and `PAYMENTS_WEBHOOK_SECRET`. Never put them in the database or the admin UI.

**Steps to enable**, once approved:

1. Implement `src/lib/payments/<provider>.ts` with three functions:
   - `createCheckout(order)` returns a redirect URL
   - `verifyWebhook(req)` returns an event
   - `refund(tx)`
2. Add `/api/payments/webhook`.
3. Design and approve the customer-facing purchase UI. This would be a new design element: placement and appearance need client sign-off, because the brief forbids changing the existing design.
4. Test in the provider's sandbox, then switch to live keys.
