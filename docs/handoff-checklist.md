# Ownership and access handoff checklist

Follow this list in order to put every account, credential and asset under the client's control. Nothing in the new stack depends on the original developer.

## A. Accounts the client must own

Create these accounts under a company email address (for example `admin@yourdomain`), never a personal one, and turn on 2FA for every account.

| # | Service | Purpose | Plan / typical cost* | Done |
|---|---|---|---|---|
| 1 | **GitHub** | Source code (this repo) | Free (private repos included) | ☐ |
| 2 | **Vercel** | Hosting, SSL, CDN, deploys | Hobby is free but limited to non-commercial use. A business site needs **Pro, about $20 per user per month**. | ☐ |
| 3 | **Supabase** | Database, admin login, media storage | Free tier, but inactive projects pause after a week. **Pro is about $25/month** and recommended for production (backups, no pausing). | ☐ |
| 4 | **Anthropic Console** | Dr. Peptide AI answers | Pay as you go. Claude Opus 5.5 costs $4 per million input tokens and $20 per million output tokens. A typical chat reply costs well under $0.05, and prompt caching lowers it further. **Set a monthly spend cap.** | ☐ |
| 5 | **Domain registrar** (current owner of socalbioresearch.org) | The domain | About $10–20/year. **Confirm the domain is registered to the client.** If the original developer registered it, request a transfer first. | ☐ |
| 6 | **Google Search Console** | SEO, sitemap | Free. Re-verify with the client's own Google account. | ☐ |
| 7 | *(optional)* **Resend** | Email alerts for new inquiries and registrations | Free tier (about 3,000 emails/month), or about $20/month | ☐ |
| 8 | *(later)* **Payment processor** | Only after written approval; see `payment-readiness.md` | Varies; high-risk processors charge more | ☐ |

\*Prices are approximate as of October 2026. Check each vendor's current pricing page.

## B. Credentials (type, where it lives, who holds it)

| Credential | Type | Stored in | Notes |
|---|---|---|---|
| Supabase service-role key | Secret | Vercel env var `SUPABASE_SERVICE_ROLE_KEY` | Full database access. Never paste it into code, chat or email. Rotate it in Supabase if it leaks. |
| Supabase anon key | Public | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Safe in the browser; RLS protects the data |
| Anthropic API key | Secret | `ANTHROPIC_API_KEY` | Restrict it to one workspace and set a spend limit |
| IP hash salt | Secret | `IP_HASH_SALT` | Any long random string. Changing it later only affects how new rows are hashed. |
| Resend API key | Secret | `RESEND_API_KEY` | Optional |
| Admin logins | Password + email | Supabase Auth | Each person has their own login. The owner invites others at `/admin/users`. |
| GitHub, Vercel, Supabase, Anthropic, registrar account logins | Password + 2FA | The client's password manager | Record recovery codes |

## C. Steps

1. ☐ Create accounts A1–A4 under the client's organization, with 2FA on.
2. ☐ Accept transfer of the GitHub repository (`brisnit/socal-bio-research`), or fork it into the client's org. Then remove anyone who should not have access.
3. ☐ Create the Supabase project and apply the migrations (see `deployment.md` §3).
4. ☐ Create the owner account with `scripts/create-owner.mjs`, sign in to `/admin`, and import the original catalog and FAQs.
5. ☐ Create the Vercel project from the repo, set the env vars, deploy, and test on the `*.vercel.app` URL.
6. ☐ Confirm who controls the **domain registrar** account and the **DNS**. Move them to the client if needed.
7. ☐ **With explicit approval**, point DNS to Vercel (see `deployment.md` §6).
8. ☐ Ask the original developer for:
   - a CSV export of past `inquiries` and `customer_registrations` (the data lives in their Supabase project), and
   - the hero video source file and logo source files (AI/SVG/PSD), if they exist.
9. ☐ Confirm the client owns the rights to every asset (see `asset-inventory.md`): logo, hero video, product photos, Certificates of Analysis and OG images.
10. ☐ After cutover, cancel the original hosting and Lovable project once the client no longer needs them.
11. ☐ Store all recovery codes and keys in a company password manager.

## D. What does *not* depend on the original developer

- **Source code, assets, content and the database schema** are all in this repo.
- **No credential, API or service from the original build is used.** The original Supabase project, Lovable analytics and the original Dr. Peptide backend are all left out.
- **The site renders fully without a database**, from the content in `src/content/`, so the backend cannot block the public site.
