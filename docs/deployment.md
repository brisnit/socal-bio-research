# Deployment and local development

> **Nothing has been deployed.** No accounts were created, no services purchased, and DNS for socalbioresearch.org is untouched. The client should do each step below under **their own** accounts. The live site keeps running on the original host until the client chooses to switch DNS (step 6).

## 1. Prerequisites

- Node.js 20 or newer (tested on 24) and npm
- A GitHub account that owns this repository
- A Supabase account, a Vercel account, and an Anthropic Console account, all owned by the client (see the [handoff checklist](handoff-checklist.md))

## 2. Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The site works without any env vars, using the built-in content. To exercise the backend locally, point `.env.local` at a Supabase project. That can be a dev project, or a local stack started with `supabase start`.

## 3. Supabase (database, auth, storage)

1. Create a new project at supabase.com under the client's organization. Pick a region near the customers, for example US West.
2. Apply the schema, using either method:
   - CLI: `npx supabase link --project-ref <ref>`, then `npx supabase db push`
   - Dashboard: open the SQL editor and run `supabase/migrations/20261027000001_initial_schema.sql`, then `..._commerce.sql`.
3. Go to **Authentication → Providers → Email**, keep it enabled, and **turn off "Allow new users to sign up"**. Admins are invited only.
4. Go to **Authentication → URL Configuration** and set the Site URL to the production URL. Add `https://<your-domain>/admin/login` to the redirect allow-list.
5. Copy the Project URL, the anon key and the service-role key into the env vars (step 5).
6. Create the first owner account:

   ```bash
   node --env-file=.env.local scripts/create-owner.mjs you@yourdomain.com 'a-long-unique-password'
   ```

7. Sign in at `/admin/login`.
   1. Open **Products** and click **Import original catalog**.
   2. Open **FAQs** and click **Import original FAQs**.

   From then on the public site reads from the database. It looks the same, because the rows were copied from the original. Before the import, the site serves the identical built-in copy.

## 4. Anthropic (Dr. Peptide)

1. In console.anthropic.com, under the client's organization, create an API key restricted to a workspace for this site.
2. Set a monthly spend limit in **Billing → Limits** to cap cost.
3. Put the key in `ANTHROPIC_API_KEY`.

The default model is `claude-opus-5-5`. You can override it with `DR_PEPTIDE_MODEL`.

## 5. Vercel (hosting)

1. Import the GitHub repository at vercel.com/new, under the client's team. Vercel detects Next.js automatically.
2. Add the environment variables from `.env.example` for Production (and for Preview if you want a staging copy):

   | Variable | Secret? |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | No |
   | `NEXT_PUBLIC_SUPABASE_URL` | No |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No |
   | `SUPABASE_SERVICE_ROLE_KEY` | **Yes** |
   | `ANTHROPIC_API_KEY` | **Yes** |
   | `IP_HASH_SALT` | **Yes** |
   | `RESEND_API_KEY` | **Yes** (optional) |
   | `NOTIFY_FROM_EMAIL` | No (optional) |

3. Deploy. Verify the result on the `*.vercel.app` URL:
   - `node tests/functional.mjs https://<project>.vercel.app`
   - `node tests/links.mjs https://<project>.vercel.app`
   - Submit a test inquiry and confirm it appears in `/admin/inquiries`.

## 6. Go-live: domain cutover (client decision, needs explicit approval)

1. Add `socalbioresearch.org` and `www.socalbioresearch.org` in **Vercel → Project → Domains**.
2. At the registrar or DNS host, change the records to the ones Vercel shows. Lower the TTL a day in advance.
3. After propagation:
   - Re-verify the domain in Google Search Console.
   - Resubmit `/sitemap.xml`.
   - Update the Supabase Site URL.
4. Keep the original host running for a few days as a rollback path, then cancel it.

The page content includes a Google site-verification meta tag. That tag belongs to whoever verified the domain originally, so the client should verify with their own Google account and replace it: in `src/app/layout.tsx`, update `verification.google`.

## 7. Updating the site

- **Content changes** (products, FAQs, site text, legal copy, media) are made in `/admin`. No deploy is needed. Pages refresh immediately on save, and within 5 minutes at most.
- **Code and design changes** go through GitHub. Pushing to `main` redeploys on Vercel.
