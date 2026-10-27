# Socal Bioresearch website

This repository is a client-owned rebuild of **https://socalbioresearch.org**.

The public site is a faithful copy of the original. It uses the same layout, copy, styles, images, animations and behavior. The original was built and hosted by a third party, and the client had no access to its code. Everything here was rebuilt from the publicly served site. See [`docs/`](docs/) for the full audit trail.

In addition to the copied public site, this project adds:

- a new **Supabase backend**, with forms, content, a media library and audit logging;
- a secure **admin dashboard** at `/admin`;
- a **commerce data model**. It is payment-ready, but no processor is connected and nothing can be purchased.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 (same engine and tokens as the original), `tw-animate-css` |
| Fonts / icons | Google Fonts (Inter, Inter Tight, JetBrains Mono), `lucide-react` |
| Data / auth / files | Supabase (Postgres + RLS, Auth, Storage) |
| AI assistant | Claude API (`@anthropic-ai/sdk`), used by "Ask Dr. Peptide" |
| Hosting | Vercel (recommended) |
| Tests | Playwright: visual diff against the live site, functional checks, link check |

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in values; the site runs without them (see below)
npm run dev                  # http://localhost:3000
```

**With no environment variables set**, the public site still renders exactly as the original, because content ships in `src/content/`. A few features are unavailable:

- The forms show their original error message.
- Dr. Peptide says it is offline.
- `/admin` sign-in is unavailable.

Full backend setup is in [`docs/deployment.md`](docs/deployment.md).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | TypeScript check |
| `node tests/functional.mjs [url]` | End-to-end checks of interactive behavior: age gate, menu, search, forms, chat, 404, admin protection |
| `node tests/links.mjs [url]` | Crawls every page and checks internal links, images and console errors |
| `node tests/seo.mjs [origUrl] [newUrl]` | Compares SEO metadata with the live site, route by route |
| `node tests/a11y.mjs [origUrl] [newUrl]` | axe accessibility scan of both sites, compared |
| `node tests/db-policies.mjs` | Applies the migrations to an in-memory Postgres and tests the RLS policies |
| `node tests/visual/states.mjs <origUrl> <newUrl> <dir>` | Pixel-diffs interactive states: age gate, chat, mobile menu, form errors |
| `node tests/visual/shoot.mjs <url> <dir>` | Full-page screenshots of all 35 routes at 1440/1024/768/390/375 px |
| `node tests/visual/compare.mjs <origDir> <newDir> <outDir>` | Pixel diff plus an HTML report |
| `node --env-file=.env.local scripts/create-owner.mjs <email> <password>` | Creates the first admin owner |

## Project layout

```
src/
  app/(site)/        public pages: identical to the original
  app/admin/         admin dashboard (not linked publicly, noindex)
  app/api/           dr-peptide (Claude, SSE), inquiries, registrations
  components/site/   header, footer, age gate, Dr. Peptide widget, shared pieces
  components/{home,products,forms,legal}/   page sections ported from the original
  content/           seed content copied verbatim from the original site
  lib/content.ts     content layer: database overrides first, seed as fallback
supabase/migrations/ database schema, RLS policies, storage bucket
public/              original assets (logo, video, product images, COAs, OG images)
tests/               visual, functional and link tests
docs/                audit, plans, schema, deployment, payments, handoff
```

## Documentation

- Reconnaissance: [site inventory](docs/site-inventory.md), [design audit](docs/design-audit.md), [interaction audit](docs/interaction-audit.md), [asset inventory](docs/asset-inventory.md), [reconstruction plan](docs/reconstruction-plan.md)
- Verification: [visual regression report](docs/visual-regression-report.md)
- Operations: [deployment](docs/deployment.md), [database schema](docs/database-schema.md), [payment readiness](docs/payment-readiness.md), [ownership and handoff checklist](docs/handoff-checklist.md), [features not independently verifiable](docs/unverified-features.md)
