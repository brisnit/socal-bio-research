# Original features that could not be independently verified or reproduced

Reconnaissance covered only what the live site serves publicly: the HTML, JavaScript bundles, CSS and assets. It did not go beyond that. No authentication was bypassed, and no private service was accessed.

| # | Feature | What we could see | What we could not verify | What the rebuild does |
|---|---|---|---|---|
| 1 | **Dr. Peptide backend** (`POST /api/dr-peptide`) | The widget's code: the request shape (`{sessionId, messages}`), the streamed response format (OpenAI-style SSE), the error messages and the 4000-character limit | Which AI model it uses, its system prompt, any retrieval or knowledge base, its guardrails, whether it logs conversations, and its rate limits | A new route that sends the same streamed format back to the same widget. It is backed by Claude and follows a documented, educational-only prompt (`src/lib/dr-peptide-prompt.ts`) that refuses dosing, administration and personal advice. It answers will differ from the original's. |
| 2 | **Original form storage** (Supabase project `qtaxaooknoeriojvjdml`) | The table names and the columns the browser inserts | Server-side triggers, emails or notifications fired on insert, and any existing data | New tables with the same columns plus admin status fields, and optional email notification through Resend. Past submissions must be exported by the original developer. |
| 3 | **Whether anyone received form or chat notifications** | Nothing in the client code | Any email or Slack alerts the original backend may have sent | Optional email notification (`integrations.email_notifications`) |
| 4 | **Analytics** (`/~flock.js`, `/__l5e/events…`) | Lovable platform scripts | What data was collected and where it went | Omitted. Analytics can be added if the client wants it. |
| 5 | **Exact server responses for unknown URLs** | Rendered 404 content | The status code the original host returned for unknown routes (single-page apps often return 200) | Returns a proper **404** with the identical 404 page |
| 6 | **The `/api/broadcast` path** in the bundle | A Supabase Realtime library default string | Not used by the site | Not reproduced |
| 7 | **Animation randomness** | The hero molecule's particles and drift use `Math.random()` on every load | Frame-exact comparison is impossible, even between two loads of the original | The same algorithm and constants. Visual diffs in that region are expected. |
| 8 | **Cloudflare edge behavior** | `server: cloudflare` headers and the `__cf_bm` bot cookie | Firewall, bot or caching rules | Vercel defaults plus security headers. Use Vercel Firewall or Cloudflare in front if needed. |
| 9 | **Google Search Console verification** | The meta tag value | That the tag belongs to the client | Kept verbatim. The client should re-verify and replace it. |

## Verified only partially in this environment

- **Admin dashboard against a live Supabase project.** No Supabase project or Docker was available, so these are the checks that ran:
  - The migrations and RLS policies were tested in an in-memory Postgres (`tests/db-policies.mjs`, 12/12 pass).
  - Every admin route compiles and type-checks.
  - Signed-out users are redirected to login.

  The sign-in, CRUD, upload and invite flows have not yet been clicked through against a real project. That is the first task after creating the client's Supabase project (`deployment.md` §3).
- **Dr. Peptide with real model output.** No API key was available. The streaming bridge was verified end to end against a mock Anthropic endpoint. The quality of real answers and refusals should be reviewed with the client's key before launch.

## Small behavior differences, intentional and invisible to visitors

- **Forms post to the new server API instead of writing to Supabase from the browser.** Validation, messages and states are unchanged. The server repeats the honeypot, minimum-time and rate-limit checks. This is a security improvement.
- **Dr. Peptide's "Connect me to a real person" stores the hand-off text before navigating.** The original stored it after navigating, so the text was missed when the visitor was already on `/contact`. Same text, more reliable delivery.
- **Product pages emit `og:type` with a `<meta>` tag rendered inside the page.** React moves it into `<head>`, so its position there differs. Its content is identical.
