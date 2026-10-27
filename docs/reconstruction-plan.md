# Reconstruction Plan

## Starting point

Reconnaissance turned up four facts that shape this plan:

- **The original is a Lovable-generated TanStack Start app.** It is styled with **Tailwind CSS v4** and uses **Supabase** for form storage.
- **Its JavaScript bundles are public.** They contain the exact JSX structure, Tailwind class strings, copy, product data, animation timings and validation rules for every page. See `site-inventory.md`, `design-audit.md` and `interaction-audit.md`.
- **Every asset is publicly downloadable.** That includes the logo, hero video, product images, Certificates of Analysis (COAs), OG images and favicons. See `asset-inventory.md`.
- **Recreating the markup and classes under Tailwind v4 reproduces the rendering exactly.** It is the same CSS engine, the same tokens and the same class names. This is far more accurate than re-deriving the design from screenshots, so it is the approach taken.

## Architecture

| Concern | Original | Reconstruction |
|---|---|---|
| Framework | TanStack Start (React 19, Vite) | **Next.js 15 App Router**, React 19, TypeScript |
| Styling | Tailwind v4, compiled | **Tailwind v4**, same `@theme` tokens, custom utilities and keyframes copied from the shipped stylesheet |
| Fonts | Google Fonts `<link>` (Inter, Inter Tight, JetBrains Mono) | Same Google Fonts stylesheet link, so the font files and metrics are identical |
| Icons | lucide-react | lucide-react (same icon set) |
| Content | Hard-coded in bundles | Typed seed content in `src/content/*`, **overridable from Supabase**. Pages render identically with or without a database. |
| Contact / registration | Browser → Supabase anon insert | Browser → **Next.js route handler** → Supabase (service role, server only). Same client-side validation and states. |
| Dr. Peptide | `/api/dr-peptide`, backend inaccessible | New `/api/dr-peptide` route handler. Calls the Claude API and re-emits the **same OpenAI-style SSE** wire format, so the original widget code works unchanged. It runs a strict educational-only system prompt plus server-side guardrails. |
| Admin | None publicly visible | New `/admin` (Supabase Auth, role-based access control, audit log). It is not linked from the public navigation. |
| Commerce | None | Schema only: products, variants, prices, inventory, orders, customers, payment references. **No checkout UI and no live payments.** |
| Hosting | Lovable + Cloudflare | Vercel, on the client's own account (prepared, **not deployed**) |

## Route map (1:1)

`/`, `/products`, `/products/[slug]` (23 static params), `/research`, `/about`, `/contact`, `/new-customer`, `/legal`, `/legal/{terms,privacy,disclaimer,acceptable-use,shipping}`, and a 404. Static files keep the same paths: `/coa/*.webp`, `/products/*.webp`, `/og/*.jpg`, `/hero-video.mp4`, `/hero-video-poster.jpg`, `/logo.png` and the favicons. Also served: `/robots.txt` and `/sitemap.xml`, same content and URLs.

The only path collision is between product images under `/products/*.webp` and the `/products/[slug]` route. Next.js serves `public/` files before dynamic routes, so `/products/tirzepatide.webp` (file) and `/products/tirzepatide` (page) both resolve, the same as on the original.

## Build order

1. **Phase 2 and 3, frontend:** shared chrome first (layout, header, footer, age gate, Dr. Peptide widget, back button, Reveal, OrangeWord, PageHero), then each page ported from its bundle. Copy and class strings are kept verbatim.
2. **Phase 6, visual regression:** Playwright screenshots of original and reconstruction at 1440, 1024, 768, 390 and 375px, with animations frozen, pixel-diffed using pixelmatch. Fix discrepancies and repeat.
3. **Phase 4, backend:** Supabase schema and RLS migrations, form APIs, the content override layer, and the admin dashboard.
4. **Phase 5, commerce:** data model and payment-provider abstraction, disabled by default.
5. **Phase 7 and 8:** link check, build, accessibility basics, docs and handoff checklist.

## Items that cannot be reproduced exactly

| Item | Why | Closest sound alternative |
|---|---|---|
| Dr. Peptide's original model, prompt and logic | Server code and AI provider are private | New Claude-backed service with a documented, educational-only prompt. Same UI and wire protocol. It refuses dosing, injection, reconstitution and individualized advice and points people to a real person or a licensed provider. |
| Existing submitted inquiries and registrations | They live in the original developer's Supabase project. We have no credentials and must not attempt access. | New, empty Supabase project owned by the client. The client can ask the original developer for a CSV export. |
| Lovable analytics (`/~flock.js`, `/__l5e/events`) | Platform-proprietary | Omitted. Vercel Analytics or similar can be added if the client wants it; it is invisible to visitors. |
| Cloudflare edge features | Hosting-level | Vercel defaults. HSTS and security headers are set in `next.config`. |
| Google Search Console verification meta | Tied to whoever verified the domain | Kept verbatim. The client should re-verify with their own Google account after the DNS cutover. |
| Byte-identical HTML | Different framework | Rendered DOM and CSS match. Visual parity is checked by pixel diff. |
