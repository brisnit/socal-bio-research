# Site Inventory — socalbioresearch.org

Captured 2026-10-27 with Playwright (Chromium 1440×900) by crawling `/sitemap.xml` and following every same-origin link. All routes returned HTTP 200.

## Platform fingerprint (original)

- **Framework:** TanStack Start (React 19, SSR + client hydration, Vite build, code-split route chunks under `/assets/`). Built on **Lovable** (`lovp_` project id in the analytics context token; `/~flock.js` + `/__l5e/events.*.js` analytics).
- **CSS:** Tailwind CSS v4 (single compiled `/assets/styles-9bE31nz0.css`, oklch/lab colors).
- **Backend:** Supabase project `qtaxaooknoeriojvjdml` (tables `inquiries`, `customer_registrations`, inserted from the browser with the anon key) and a server route `POST /api/dr-peptide` that streams OpenAI-format SSE.
- **Hosting/CDN:** Cloudflare in front (`server: cloudflare`, `__cf_bm` cookie), HSTS enabled.
- **robots.txt:** `Allow: /`, `Disallow: /api/`, sitemap reference.

## Routes

| Route | Title | Canonical | Full height @1440 |
|---|---|---|---|
| `/` | Socal Bioresearch: Curious about peptides? Start here. | https://socalbioresearch.org/ | 5592px |
| `/products` | Peptide Catalog (23): Socal Bioresearch | https://socalbioresearch.org/products | 4407px |
| `/research` | Common questions about peptides: Socal Bioresearch | https://socalbioresearch.org/research | 2863px |
| `/about` | About: Socal Bioresearch | https://socalbioresearch.org/about | 2692px |
| `/contact` | Talk to a real person: Socal Bioresearch | https://socalbioresearch.org/contact | 2434px |
| `/new-customer` | New here?: Socal Bioresearch | https://socalbioresearch.org/new-customer | 3345px |
| `/legal` | Legal & Policies: Socal Bioresearch | https://socalbioresearch.org/legal | 2429px |
| `/legal/terms` | Terms of Service: Socal Bioresearch | https://socalbioresearch.org/legal/terms | 4746px |
| `/legal/privacy` | Privacy Policy: Socal Bioresearch | https://socalbioresearch.org/legal/privacy | 4800px |
| `/legal/disclaimer` | Disclaimer: Socal Bioresearch | https://socalbioresearch.org/legal/disclaimer | 4268px |
| `/legal/acceptable-use` | Acceptable Use: Socal Bioresearch | https://socalbioresearch.org/legal/acceptable-use | 3832px |
| `/legal/shipping` | Shipping & Returns: Socal Bioresearch | https://socalbioresearch.org/legal/shipping | 4017px |
| `/products/glp-1` | GLP 1: Socal Bioresearch | https://socalbioresearch.org/products/glp-1 | 3194px |
| `/products/mots-c` | MOTS C: Socal Bioresearch | https://socalbioresearch.org/products/mots-c | 3194px |
| `/products/bpc-157` | BPC 157: Socal Bioresearch | https://socalbioresearch.org/products/bpc-157 | 3194px |
| `/products/tb-500` | TB 500: Socal Bioresearch | https://socalbioresearch.org/products/tb-500 | 3165px |
| `/products/bpc-157-tb-500-blend` | BPC 157 / TB 500 Blend: Socal Bioresearch | https://socalbioresearch.org/products/bpc-157-tb-500-blend | 3890px |
| `/products/semaglutide` | Semaglutide: Socal Bioresearch | https://socalbioresearch.org/products/semaglutide | 3109px |
| `/products/tirzepatide` | Tirzepatide: Socal Bioresearch | https://socalbioresearch.org/products/tirzepatide | 3891px |
| `/products/retatrutide` | Retatrutide: Socal Bioresearch | https://socalbioresearch.org/products/retatrutide | 3862px |
| `/products/cagrilintide` | Cagrilintide: Socal Bioresearch | https://socalbioresearch.org/products/cagrilintide | 3079px |
| `/products/nad-plus` | NAD+: Socal Bioresearch | https://socalbioresearch.org/products/nad-plus | 2985px |
| `/products/glutathione` | Glutathione: Socal Bioresearch | https://socalbioresearch.org/products/glutathione | 3858px |
| `/products/epitalon` | Epitalon: Socal Bioresearch | https://socalbioresearch.org/products/epitalon | 3109px |
| `/products/thymosin-alpha-1` | Thymosin Alpha 1: Socal Bioresearch | https://socalbioresearch.org/products/thymosin-alpha-1 | 3137px |
| `/products/selank` | Selank: Socal Bioresearch | https://socalbioresearch.org/products/selank | 3109px |
| `/products/semax` | Semax: Socal Bioresearch | https://socalbioresearch.org/products/semax | 3141px |
| `/products/pt-141` | PT 141: Socal Bioresearch | https://socalbioresearch.org/products/pt-141 | 3141px |
| `/products/melanotan-ii` | Melanotan II: Socal Bioresearch | https://socalbioresearch.org/products/melanotan-ii | 3109px |
| `/products/cjc-1295` | CJC 1295: Socal Bioresearch | https://socalbioresearch.org/products/cjc-1295 | 3138px |
| `/products/ipamorelin` | Ipamorelin: Socal Bioresearch | https://socalbioresearch.org/products/ipamorelin | 3891px |
| `/products/sermorelin` | Sermorelin: Socal Bioresearch | https://socalbioresearch.org/products/sermorelin | 3079px |
| `/products/tesamorelin` | Tesamorelin: Socal Bioresearch | https://socalbioresearch.org/products/tesamorelin | 3112px |
| `/products/ghk-cu` | GHK Cu: Socal Bioresearch | https://socalbioresearch.org/products/ghk-cu | 3194px |
| `/products/aod-9604` | AOD 9604: Socal Bioresearch | https://socalbioresearch.org/products/aod-9604 | 3112px |

Also linked (static files, not pages): `/coa/bpc-157-tb-500-blend.webp`, `/coa/tirzepatide-20mg.webp`, `/coa/tirzepatide-30mg.webp`, `/coa/retatrutide.webp`, `/coa/glutathione.webp`, `/coa/ipamorelin.webp` (Certificate of Analysis images opened from product cards).

## Not found in public crawl

- **Ask Dr. Peptide** is not a route; it is a floating chat widget mounted on every page (bottom-right) plus "Ask Dr. Peptide" buttons in the header/mobile menu that open it.
- **Age gate** ("Are you 21 or older?") is a full-screen modal on first visit (localStorage `scbr:age-verified`).
- No search page, account/login, cart, checkout, or blog routes exist publicly. No `/admin` exists publicly.
- 404: unknown routes render a "404 / Page not found" component (see interaction audit).

## Per-route links, forms and media

### `/`

- **Title:** Socal Bioresearch: Curious about peptides? Start here.
- **Meta:** og:type="website"; twitter:card="summary_large_image"; description="Plain language answers about peptides: what they are, how they work, and how to explore them responsibly. Talk to a real person."; og:title="Socal Bioresearch: Curious about peptides? Start here."; og:description="Plain language answers about peptides. Talk to a real person before you order."; og:image="https://socalbioresearch.org/og/og-home.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-home.jpg"; og:url="https://socalbioresearch.org/"; twitter:title="Socal Bioresearch: Curious about peptides? Start here."; twitter:description="Plain language answers about peptides. Talk to a real person before you order."
- **JSON-LD:** 2 block(s): Organization, WebSite
- **Internal links (23):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/contact` ("Talk to a real person"), `/about` ("What are peptides?"), `/contact` ("Ask us anything"), `/products/glp-1` ("GLP 1"), `/products/mots-c` ("MOTS C"), `/products/semaglutide` ("Semaglutide"), `/products/tirzepatide` ("Tirzepatide"), `/products/bpc-157` ("BPC 157"), `/products/tb-500` ("TB 500"), `/products/bpc-157-tb-500-blend` ("BPC 157 / TB 500 Blend"), `/products/cjc-1295` ("CJC 1295"), `/contact` ("Reach out"), `/new-customer` ("I'm new to peptides"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer")
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png, /hero-video.mp4

### `/products`

- **Title:** Peptide Catalog (23): Socal Bioresearch
- **Meta:** og:type="website"; twitter:card="summary_large_image"; description="Browse 23 research peptides explained in plain English: what they are and what to ask before deciding."; og:title="Peptide Catalog: Socal Bioresearch"; og:description="23 peptides explained in plain English."; og:url="https://socalbioresearch.org/products"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="Peptide Catalog: Socal Bioresearch"; twitter:description="23 peptides explained in plain English."
- **JSON-LD:** 3 block(s): Organization, WebSite, ItemList
- **Internal links (34):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/products/aod-9604` ("01 · PERFORMANCE & RECOVERY AOD 9604 hGH C termina"), `/products/bpc-157` ("02 · PERFORMANCE & RECOVERY BPC 157 Body protectio"), `/products/bpc-157-tb-500-blend` ("03 · PERFORMANCE & RECOVERY BPC 157 / TB 500 Blend"), `/products/cagrilintide` ("04 · WELLNESS & LONGEVITY Cagrilintide Long acting"), `/products/cjc-1295` ("05 · PERFORMANCE & RECOVERY CJC 1295 GHRH analog R"), `/products/epitalon` ("06 · WELLNESS & LONGEVITY Epitalon Pineal derived "), `/products/ghk-cu` ("07 · PERFORMANCE & RECOVERY GHK Cu Copper binding "), `/products/glp-1` ("08 · WELLNESS & LONGEVITY GLP 1 Metabolic signalin"), `/products/glutathione` ("09 · WELLNESS & LONGEVITY Glutathione Endogenous a"), `/products/ipamorelin` ("10 · PERFORMANCE & RECOVERY Ipamorelin Selective G"), `/products/melanotan-ii` ("11 · WELLNESS & LONGEVITY Melanotan II Melanocorti"), `/products/mots-c` ("12 · WELLNESS & LONGEVITY MOTS C Mitochondrial der"), `/products/nad-plus` ("13 · WELLNESS & LONGEVITY NAD+ Nicotinamide adenin"), `/products/pt-141` ("14 · WELLNESS & LONGEVITY PT 141 Melanocortin rece"), `/products/retatrutide` ("15 · WELLNESS & LONGEVITY Retatrutide Triple incre"), `/products/selank` ("16 · WELLNESS & LONGEVITY Selank Tuftsin analog pe"), `/products/semaglutide` ("17 · WELLNESS & LONGEVITY Semaglutide GLP 1 recept"), `/products/semax` ("18 · WELLNESS & LONGEVITY Semax ACTH derived neuro"), `/products/sermorelin` ("19 · PERFORMANCE & RECOVERY Sermorelin GHRH 1 to 2"), `/products/tb-500` ("20 · PERFORMANCE & RECOVERY TB 500 Thymosin beta 4"), `/products/tesamorelin` ("21 · PERFORMANCE & RECOVERY Tesamorelin Stabilized"), `/products/thymosin-alpha-1` ("22 · WELLNESS & LONGEVITY Thymosin Alpha 1 Immunom"), `/products/tirzepatide` ("23 · WELLNESS & LONGEVITY Tirzepatide Dual GIP / G"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **Form fields (SSR):** <input type="search" class="flex w-full , <textarea placeholder="Ask about a pepti
- **Media:** /logo.png, /products/generic-vial.webp, /products/bpc-157-tb-500-blend.webp, /products/glutathione.webp, /products/ipamorelin.webp, /products/retatrutide.webp, /products/semax.webp, /products/sermorelin.webp, /products/tirzepatide.webp

### `/research`

- **Title:** Common questions about peptides: Socal Bioresearch
- **Meta:** og:type="website"; twitter:card="summary_large_image"; description="Plain language answers to the most common questions about peptides: what they are, why people talk about them, and how to think about them clearly."; og:title="Common questions about peptides"; og:description="Honest, plain language answers: no hype, no pressure."; og:image="https://socalbioresearch.org/og/og-research.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-research.jpg"; og:url="https://socalbioresearch.org/research"; twitter:title="Common questions about peptides"; twitter:description="Honest, plain language answers: no hype, no pressure."
- **JSON-LD:** 3 block(s): Organization, WebSite, FAQPage
- **Internal links (12):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/contact` ("Ask your question"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/about`

- **Title:** About: Socal Bioresearch
- **Meta:** og:type="website"; twitter:card="summary_large_image"; description="Socal Bioresearch is a small team helping curious people get honest, plain language answers about peptides: no hype, no pressure."; og:title="About Socal Bioresearch"; og:description="Honest, plain language answers about peptides. Talk to a real person."; og:image="https://socalbioresearch.org/og/og-about.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-about.jpg"; og:url="https://socalbioresearch.org/about"; twitter:title="About Socal Bioresearch"; twitter:description="Honest, plain language answers about peptides. Talk to a real person."
- **JSON-LD:** 2 block(s): Organization, WebSite
- **Internal links (13):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/contact` ("Reach out"), `/research` ("Common questions"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/contact`

- **Title:** Talk to a real person: Socal Bioresearch
- **Meta:** og:type="website"; twitter:card="summary_large_image"; description="Send a question about peptides: what they are, what they do, or whether they're right for you. A real person responds within a day."; og:title="Talk to a real person: Socal Bioresearch"; og:description="Honest answers, no pressure, no script."; og:image="https://socalbioresearch.org/og/og-contact.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-contact.jpg"; og:url="https://socalbioresearch.org/contact"; twitter:title="Talk to a real person: Socal Bioresearch"; twitter:description="Honest answers, no pressure, no script."
- **JSON-LD:** 2 block(s): Organization, WebSite
- **Internal links (12):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `mailto:vchollis05@gmail.com` ("vchollis05@gmail.com"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **Form fields (SSR):** website, <input class="flex w-full py-1 file:bord, <input type="email" class="flex w-full p, <input class="flex w-full py-1 file:bord, inquiry_type, <textarea class="flex w-full focus-visib, <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/new-customer`

- **Title:** New here?: Socal Bioresearch
- **Meta:** og:type="website"; twitter:card="summary_large_image"; description="New to peptides? Tell us a bit about yourself and we'll help you get started: honestly, with no pressure."; og:title="New here?: Socal Bioresearch"; og:description="Plain language intro for people new to peptides."; og:image="https://socalbioresearch.org/og/og-new-customer.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-new-customer.jpg"; og:url="https://socalbioresearch.org/new-customer"; twitter:title="New here?: Socal Bioresearch"; twitter:description="Plain language intro for people new to peptides."
- **JSON-LD:** 2 block(s): Organization, WebSite
- **Internal links (12):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/contact` ("Just have a question? Ask instead"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **Form fields (SSR):** website, <input type="text" class="flex w-full py, <input type="text" class="flex w-full py, <input type="text" class="flex w-full py, <input type="email" class="flex w-full p, <input type="tel" class="flex w-full py-, <input type="text" class="flex w-full py, <input type="text" class="flex w-full py, <input type="text" class="flex w-full py, <input type="text" class="flex w-full py, <input type="text" class="flex w-full py, <textarea class="flex min-h-[60px] w-ful, <input type="text" class="flex w-full py, <input type="checkbox" aria-hidden="true, <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/legal`

- **Title:** Legal & Policies: Socal Bioresearch
- **Meta:** og:type="website"; twitter:card="summary_large_image"; description="Plain language, formally documented policies: Terms, Privacy, Disclaimer, Acceptable Use, and Shipping &amp; Returns."; og:title="Legal &amp; Policies: Socal Bioresearch"; og:description="Every policy in plain English, with the formal clause underneath. Reviewed and updated regularly."; og:image="https://socalbioresearch.org/og/og-compliance.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-compliance.jpg"; og:url="https://socalbioresearch.org/legal"; twitter:title="Legal &amp;amp; Policies: Socal Bioresearch"; twitter:description="Every policy in plain English, with the formal clause underneath. Reviewed and updated regularly."
- **JSON-LD:** 2 block(s): Organization, WebSite
- **Internal links (18):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("BACK TO HOME"), `/legal/terms` ("01 / 05 Terms of Service The agreement between you"), `/legal/privacy` ("02 / 05 Privacy Policy What information we collect"), `/legal/disclaimer` ("03 / 05 Disclaimer Educational only. Not personal "), `/legal/acceptable-use` ("04 / 05 Acceptable Use How the site, the catalog, "), `/legal/shipping` ("05 / 05 Shipping & Returns How orders are handled,"), `/contact` ("contact us"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/legal/terms`

- **Title:** Terms of Service: Socal Bioresearch
- **Meta:** og:type="website"; twitter:card="summary_large_image"; description="The agreement between you and Socal Bioresearch when you use this site, the catalog, or Dr. Peptide."; og:title="Terms of Service: Socal Bioresearch"; og:description="Plain English summary of our Terms, with the formal clause underneath."; og:image="https://socalbioresearch.org/og/og-compliance.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-compliance.jpg"; og:url="https://socalbioresearch.org/legal/terms"; twitter:title="Terms of Service: Socal Bioresearch"; twitter:description="Plain English summary of our Terms, with the formal clause underneath."
- **JSON-LD:** 2 block(s): Organization, WebSite
- **Internal links (13):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/legal` ("ALL POLICIES"), `/contact` ("Contact us"), `/legal` ("Back to Legal"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer")
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/legal/privacy`

- **Title:** Privacy Policy: Socal Bioresearch
- **Meta:** og:type="website"; twitter:card="summary_large_image"; description="What information Socal Bioresearch collects from contact forms and Dr. Peptide, how we use it, and what we don't do with it."; og:title="Privacy Policy: Socal Bioresearch"; og:description="We only collect what we need to respond to you. Plain English summary, formal clause underneath."; og:image="https://socalbioresearch.org/og/og-compliance.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-compliance.jpg"; og:url="https://socalbioresearch.org/legal/privacy"; twitter:title="Privacy Policy: Socal Bioresearch"; twitter:description="We only collect what we need to respond to you. Plain English summary, formal clause underneath."
- **JSON-LD:** 2 block(s): Organization, WebSite
- **Internal links (13):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/legal` ("ALL POLICIES"), `/contact` ("Contact us"), `/legal` ("Back to Legal"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer")
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/legal/disclaimer`

- **Title:** Disclaimer: Socal Bioresearch
- **Meta:** og:type="website"; twitter:card="summary_large_image"; description="Educational content only. Not personal advice. Research use peptide language explained simply."; og:title="Disclaimer: Socal Bioresearch"; og:description="Plain English statement of what this site is for: and what it isn't."; og:image="https://socalbioresearch.org/og/og-compliance.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-compliance.jpg"; og:url="https://socalbioresearch.org/legal/disclaimer"; twitter:title="Disclaimer: Socal Bioresearch"; twitter:description="Plain English statement of what this site is for: and what it isn&amp;#x27;t."
- **JSON-LD:** 2 block(s): Organization, WebSite
- **Internal links (13):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/legal` ("ALL POLICIES"), `/contact` ("Contact us"), `/legal` ("Back to Legal"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer")
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/legal/acceptable-use`

- **Title:** Acceptable Use: Socal Bioresearch
- **Meta:** og:type="website"; twitter:card="summary_large_image"; description="How the site, the catalog, and Dr. Peptide may and may not be used."; og:title="Acceptable Use: Socal Bioresearch"; og:description="Clear, plain English rules for using the site responsibly."; og:image="https://socalbioresearch.org/og/og-compliance.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-compliance.jpg"; og:url="https://socalbioresearch.org/legal/acceptable-use"; twitter:title="Acceptable Use: Socal Bioresearch"; twitter:description="Clear, plain English rules for using the site responsibly."
- **JSON-LD:** 2 block(s): Organization, WebSite
- **Internal links (13):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/legal` ("ALL POLICIES"), `/contact` ("Contact us"), `/legal` ("Back to Legal"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer")
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/legal/shipping`

- **Title:** Shipping & Returns: Socal Bioresearch
- **Meta:** og:type="website"; twitter:card="summary_large_image"; description="How orders are handled, what to expect on delivery, and our return policy."; og:title="Shipping &amp; Returns: Socal Bioresearch"; og:description="Clear, plain language shipping and return expectations."; og:image="https://socalbioresearch.org/og/og-compliance.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-compliance.jpg"; og:url="https://socalbioresearch.org/legal/shipping"; twitter:title="Shipping &amp;amp; Returns: Socal Bioresearch"; twitter:description="Clear, plain language shipping and return expectations."
- **JSON-LD:** 2 block(s): Organization, WebSite
- **Internal links (13):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/legal` ("ALL POLICIES"), `/contact` ("Contact us"), `/legal` ("Back to Legal"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer")
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/glp-1`

- **Title:** GLP 1: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="GLP 1: Metabolic signaling peptide"; og:title="GLP 1: Socal Bioresearch"; og:description="Glucagon like peptide 1 analog discussed for its role in glucose homeostasis and appetite regulating pathways."; og:type="product"; og:url="https://socalbioresearch.org/products/glp-1"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="GLP 1: Socal Bioresearch"; twitter:description="Glucagon like peptide 1 analog discussed for its role in glucose homeostasis and appetite regulating pathways."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=GLP+1` ("Ask about GLP 1"), `/products/mots-c` ("01 · WELLNESS & LONGEVITY MOTS C Mitochondrial der"), `/products/semaglutide` ("02 · WELLNESS & LONGEVITY Semaglutide GLP 1 recept"), `/products/tirzepatide` ("03 · WELLNESS & LONGEVITY Tirzepatide Dual GIP / G"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8859727/, https://pubmed.ncbi.nlm.nih.gov/37196634/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/mots-c`

- **Title:** MOTS C: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="MOTS C: Mitochondrial derived peptide"; og:title="MOTS C: Socal Bioresearch"; og:description="A mitochondrial encoded peptide discussed in scientific models for its proposed role in metabolic regulation and cellular stress response."; og:type="product"; og:url="https://socalbioresearch.org/products/mots-c"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="MOTS C: Socal Bioresearch"; twitter:description="A mitochondrial encoded peptide discussed in scientific models for its proposed role in metabolic regulation and cellular stress response."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=MOTS+C` ("Ask about MOTS C"), `/products/glp-1` ("01 · WELLNESS & LONGEVITY GLP 1 Metabolic signalin"), `/products/semaglutide` ("02 · WELLNESS & LONGEVITY Semaglutide GLP 1 recept"), `/products/tirzepatide` ("03 · WELLNESS & LONGEVITY Tirzepatide Dual GIP / G"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://pubmed.ncbi.nlm.nih.gov/25738459/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10571067/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/bpc-157`

- **Title:** BPC 157: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="BPC 157: Body protection compound"; og:title="BPC 157: Socal Bioresearch"; og:description="A pentadecapeptide derived from a gastric protective protein, widely discussed in available scientific tissue repair research."; og:type="product"; og:url="https://socalbioresearch.org/products/bpc-157"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="BPC 157: Socal Bioresearch"; twitter:description="A pentadecapeptide derived from a gastric protective protein, widely discussed in available scientific tissue repair research."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=BPC+157` ("Ask about BPC 157"), `/products/tb-500` ("01 · PERFORMANCE & RECOVERY TB 500 Thymosin beta 4"), `/products/bpc-157-tb-500-blend` ("02 · PERFORMANCE & RECOVERY BPC 157 / TB 500 Blend"), `/products/cjc-1295` ("03 · PERFORMANCE & RECOVERY CJC 1295 GHRH analog V"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6096549/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9269931/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/tb-500`

- **Title:** TB 500: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="TB 500: Thymosin beta 4 fragment"; og:title="TB 500: Socal Bioresearch"; og:description="A synthetic fragment of thymosin beta 4 discussed in scientific contexts for cellular migration and actin regulation."; og:type="product"; og:url="https://socalbioresearch.org/products/tb-500"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="TB 500: Socal Bioresearch"; twitter:description="A synthetic fragment of thymosin beta 4 discussed in scientific contexts for cellular migration and actin regulation."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=TB+500` ("Ask about TB 500"), `/products/bpc-157` ("01 · PERFORMANCE & RECOVERY BPC 157 Body protectio"), `/products/bpc-157-tb-500-blend` ("02 · PERFORMANCE & RECOVERY BPC 157 / TB 500 Blend"), `/products/cjc-1295` ("03 · PERFORMANCE & RECOVERY CJC 1295 GHRH analog V"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3499781/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7766832/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/bpc-157-tb-500-blend`

- **Title:** BPC 157 / TB 500 Blend: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="BPC 157 / TB 500 Blend: Co formulated peptide blend"; og:title="BPC 157 / TB 500 Blend: Socal Bioresearch"; og:description="A combined preparation of BPC 157 and TB 500 used in studies exploring synergistic tissue repair pathways."; og:type="product"; og:url="https://socalbioresearch.org/products/bpc-157-tb-500-blend"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="BPC 157 / TB 500 Blend: Socal Bioresearch"; twitter:description="A combined preparation of BPC 157 and TB 500 used in studies exploring synergistic tissue repair pathways."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (18):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/coa/bpc-157-tb-500-blend.webp` ("BPC 157 / TB 500 10/10 mg PURITY 99.29%"), `/contact?type=catalog&product=BPC+157+%2F+TB+500+Blend` ("Ask about BPC 157 / TB 500 Blend"), `/products/bpc-157` ("01 · PERFORMANCE & RECOVERY BPC 157 Body protectio"), `/products/tb-500` ("02 · PERFORMANCE & RECOVERY TB 500 Thymosin beta 4"), `/products/cjc-1295` ("03 · PERFORMANCE & RECOVERY CJC 1295 GHRH analog V"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9269931/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7766832/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png, /coa/bpc-157-tb-500-blend.webp, /products/bpc-157-tb-500-blend.webp

### `/products/semaglutide`

- **Title:** Semaglutide: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="Semaglutide: GLP 1 receptor agonist"; og:title="Semaglutide: Socal Bioresearch"; og:description="A long acting GLP 1 analog widely discussed in metabolic available literature."; og:type="product"; og:url="https://socalbioresearch.org/products/semaglutide"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="Semaglutide: Socal Bioresearch"; twitter:description="A long acting GLP 1 analog widely discussed in metabolic available literature."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=Semaglutide` ("Ask about Semaglutide"), `/products/glp-1` ("01 · WELLNESS & LONGEVITY GLP 1 Metabolic signalin"), `/products/mots-c` ("02 · WELLNESS & LONGEVITY MOTS C Mitochondrial der"), `/products/tirzepatide` ("03 · WELLNESS & LONGEVITY Tirzepatide Dual GIP / G"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://www.nejm.org/doi/full/10.1056/NEJMoa2032183, https://www.nejm.org/doi/full/10.1056/NEJMoa2307563
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/tirzepatide`

- **Title:** Tirzepatide: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="Tirzepatide: Dual GIP / GLP 1 agonist"; og:title="Tirzepatide: Socal Bioresearch"; og:description="A dual incretin receptor agonist discussed for combined GIP and GLP 1 pathway activity."; og:type="product"; og:url="https://socalbioresearch.org/products/tirzepatide"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="Tirzepatide: Socal Bioresearch"; twitter:description="A dual incretin receptor agonist discussed for combined GIP and GLP 1 pathway activity."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (19):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/coa/tirzepatide-20mg.webp` ("Tirzepatide 20 mg PURITY 99.972%"), `/coa/tirzepatide-30mg.webp` ("Tirzepatide 30 mg PURITY 99.817%"), `/contact?type=catalog&product=Tirzepatide` ("Ask about Tirzepatide"), `/products/glp-1` ("01 · WELLNESS & LONGEVITY GLP 1 Metabolic signalin"), `/products/mots-c` ("02 · WELLNESS & LONGEVITY MOTS C Mitochondrial der"), `/products/semaglutide` ("03 · WELLNESS & LONGEVITY Semaglutide GLP 1 recept"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://www.nejm.org/doi/full/10.1056/NEJMoa2206038, https://www.nejm.org/doi/full/10.1056/NEJMoa2107519
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png, /coa/tirzepatide-20mg.webp, /coa/tirzepatide-30mg.webp, /products/tirzepatide.webp

### `/products/retatrutide`

- **Title:** Retatrutide: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="Retatrutide: Triple incretin receptor candidate"; og:title="Retatrutide: Socal Bioresearch"; og:description="An emerging tri agonist targeting GLP 1, GIP, and glucagon receptors in metabolic pathway discussions."; og:type="product"; og:url="https://socalbioresearch.org/products/retatrutide"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="Retatrutide: Socal Bioresearch"; twitter:description="An emerging tri agonist targeting GLP 1, GIP, and glucagon receptors in metabolic pathway discussions."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (18):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/coa/retatrutide.webp` ("Retatrutide 10 mg PURITY 99.941%"), `/contact?type=catalog&product=Retatrutide` ("Ask about Retatrutide"), `/products/glp-1` ("01 · WELLNESS & LONGEVITY GLP 1 Metabolic signalin"), `/products/mots-c` ("02 · WELLNESS & LONGEVITY MOTS C Mitochondrial der"), `/products/semaglutide` ("03 · WELLNESS & LONGEVITY Semaglutide GLP 1 recept"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://www.nejm.org/doi/full/10.1056/NEJMoa2301972, https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(23)01053-X/fulltext
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png, /coa/retatrutide.webp, /products/retatrutide.webp

### `/products/cagrilintide`

- **Title:** Cagrilintide: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="Cagrilintide: Long acting amylin analog"; og:title="Cagrilintide: Socal Bioresearch"; og:description="An amylin receptor agonist discussed in metabolic and satiety pathway research."; og:type="product"; og:url="https://socalbioresearch.org/products/cagrilintide"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="Cagrilintide: Socal Bioresearch"; twitter:description="An amylin receptor agonist discussed in metabolic and satiety pathway research."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=Cagrilintide` ("Ask about Cagrilintide"), `/products/glp-1` ("01 · WELLNESS & LONGEVITY GLP 1 Metabolic signalin"), `/products/mots-c` ("02 · WELLNESS & LONGEVITY MOTS C Mitochondrial der"), `/products/semaglutide` ("03 · WELLNESS & LONGEVITY Semaglutide GLP 1 recept"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)01751-7/fulltext, https://pubmed.ncbi.nlm.nih.gov/36495881/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/nad-plus`

- **Title:** NAD+: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="NAD+: Nicotinamide adenine dinucleotide"; og:title="NAD+: Socal Bioresearch"; og:description="A coenzyme central to redox biology and sirtuin research."; og:type="product"; og:url="https://socalbioresearch.org/products/nad-plus"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="NAD+: Socal Bioresearch"; twitter:description="A coenzyme central to redox biology and sirtuin research."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=NAD%2B` ("Ask about NAD+"), `/products/glp-1` ("01 · WELLNESS & LONGEVITY GLP 1 Metabolic signalin"), `/products/mots-c` ("02 · WELLNESS & LONGEVITY MOTS C Mitochondrial der"), `/products/semaglutide` ("03 · WELLNESS & LONGEVITY Semaglutide GLP 1 recept"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://www.nature.com/articles/s41580-020-00313-x, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6342515/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/glutathione`

- **Title:** Glutathione: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="Glutathione: Endogenous antioxidant tripeptide"; og:title="Glutathione: Socal Bioresearch"; og:description="A tripeptide widely discussed in oxidative stress and detoxification research."; og:type="product"; og:url="https://socalbioresearch.org/products/glutathione"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="Glutathione: Socal Bioresearch"; twitter:description="A tripeptide widely discussed in oxidative stress and detoxification research."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (18):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/coa/glutathione.webp` ("Glutathione 1500 mg PURITY 99.486%"), `/contact?type=catalog&product=Glutathione` ("Ask about Glutathione"), `/products/glp-1` ("01 · WELLNESS & LONGEVITY GLP 1 Metabolic signalin"), `/products/mots-c` ("02 · WELLNESS & LONGEVITY MOTS C Mitochondrial der"), `/products/semaglutide` ("03 · WELLNESS & LONGEVITY Semaglutide GLP 1 recept"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6316929/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6470349/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png, /coa/glutathione.webp, /products/glutathione.webp

### `/products/epitalon`

- **Title:** Epitalon: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="Epitalon: Pineal derived tetrapeptide"; og:title="Epitalon: Socal Bioresearch"; og:description="A short tetrapeptide discussed in chronobiology and telomere length research."; og:type="product"; og:url="https://socalbioresearch.org/products/epitalon"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="Epitalon: Socal Bioresearch"; twitter:description="A short tetrapeptide discussed in chronobiology and telomere length research."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=Epitalon` ("Ask about Epitalon"), `/products/glp-1` ("01 · WELLNESS & LONGEVITY GLP 1 Metabolic signalin"), `/products/mots-c` ("02 · WELLNESS & LONGEVITY MOTS C Mitochondrial der"), `/products/semaglutide` ("03 · WELLNESS & LONGEVITY Semaglutide GLP 1 recept"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://pubmed.ncbi.nlm.nih.gov/14523363/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7796954/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/thymosin-alpha-1`

- **Title:** Thymosin Alpha 1: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="Thymosin Alpha 1: Immunomodulatory peptide"; og:title="Thymosin Alpha 1: Socal Bioresearch"; og:description="A 28 amino acid peptide discussed in immune modulation research."; og:type="product"; og:url="https://socalbioresearch.org/products/thymosin-alpha-1"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="Thymosin Alpha 1: Socal Bioresearch"; twitter:description="A 28 amino acid peptide discussed in immune modulation research."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=Thymosin+Alpha+1` ("Ask about Thymosin Alpha 1"), `/products/glp-1` ("01 · WELLNESS & LONGEVITY GLP 1 Metabolic signalin"), `/products/mots-c` ("02 · WELLNESS & LONGEVITY MOTS C Mitochondrial der"), `/products/semaglutide` ("03 · WELLNESS & LONGEVITY Semaglutide GLP 1 recept"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6716096/, https://www.frontiersin.org/articles/10.3389/fimmu.2021.673239/full
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/selank`

- **Title:** Selank: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="Selank: Tuftsin analog peptide"; og:title="Selank: Socal Bioresearch"; og:description="A synthetic heptapeptide discussed in neuropeptide and stress response research."; og:type="product"; og:url="https://socalbioresearch.org/products/selank"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="Selank: Socal Bioresearch"; twitter:description="A synthetic heptapeptide discussed in neuropeptide and stress response research."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=Selank` ("Ask about Selank"), `/products/glp-1` ("01 · WELLNESS & LONGEVITY GLP 1 Metabolic signalin"), `/products/mots-c` ("02 · WELLNESS & LONGEVITY MOTS C Mitochondrial der"), `/products/semaglutide` ("03 · WELLNESS & LONGEVITY Semaglutide GLP 1 recept"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://pubmed.ncbi.nlm.nih.gov/17542195/, https://pubmed.ncbi.nlm.nih.gov/28534230/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/semax`

- **Title:** Semax: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="Semax: ACTH derived neuropeptide"; og:title="Semax: Socal Bioresearch"; og:description="A heptapeptide fragment of ACTH discussed in cognitive and neurotrophic research."; og:type="product"; og:url="https://socalbioresearch.org/products/semax"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="Semax: Socal Bioresearch"; twitter:description="A heptapeptide fragment of ACTH discussed in cognitive and neurotrophic research."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=Semax` ("Ask about Semax"), `/products/glp-1` ("01 · WELLNESS & LONGEVITY GLP 1 Metabolic signalin"), `/products/mots-c` ("02 · WELLNESS & LONGEVITY MOTS C Mitochondrial der"), `/products/semaglutide` ("03 · WELLNESS & LONGEVITY Semaglutide GLP 1 recept"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://pubmed.ncbi.nlm.nih.gov/18536906/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5577458/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png, /products/semax.webp

### `/products/pt-141`

- **Title:** PT 141: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="PT 141: Melanocortin receptor agonist"; og:title="PT 141: Socal Bioresearch"; og:description="A synthetic peptide discussed for melanocortin receptor activity in scientific models."; og:type="product"; og:url="https://socalbioresearch.org/products/pt-141"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="PT 141: Socal Bioresearch"; twitter:description="A synthetic peptide discussed for melanocortin receptor activity in scientific models."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=PT+141` ("Ask about PT 141"), `/products/glp-1` ("01 · WELLNESS & LONGEVITY GLP 1 Metabolic signalin"), `/products/mots-c` ("02 · WELLNESS & LONGEVITY MOTS C Mitochondrial der"), `/products/semaglutide` ("03 · WELLNESS & LONGEVITY Semaglutide GLP 1 recept"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://pubmed.ncbi.nlm.nih.gov/31090670/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8221404/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/melanotan-ii`

- **Title:** Melanotan II: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="Melanotan II: Melanocortin analog"; og:title="Melanotan II: Socal Bioresearch"; og:description="A synthetic alpha MSH analog discussed in pigmentation pathway research."; og:type="product"; og:url="https://socalbioresearch.org/products/melanotan-ii"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="Melanotan II: Socal Bioresearch"; twitter:description="A synthetic alpha MSH analog discussed in pigmentation pathway research."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=Melanotan+II` ("Ask about Melanotan II"), `/products/glp-1` ("01 · WELLNESS & LONGEVITY GLP 1 Metabolic signalin"), `/products/mots-c` ("02 · WELLNESS & LONGEVITY MOTS C Mitochondrial der"), `/products/semaglutide` ("03 · WELLNESS & LONGEVITY Semaglutide GLP 1 recept"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://pubmed.ncbi.nlm.nih.gov/20546514/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7589027/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/cjc-1295`

- **Title:** CJC 1295: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="CJC 1295: GHRH analog"; og:title="CJC 1295: Socal Bioresearch"; og:description="A synthetic growth hormone releasing hormone analog discussed in endocrine research."; og:type="product"; og:url="https://socalbioresearch.org/products/cjc-1295"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="CJC 1295: Socal Bioresearch"; twitter:description="A synthetic growth hormone releasing hormone analog discussed in endocrine research."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=CJC+1295` ("Ask about CJC 1295"), `/products/bpc-157` ("01 · PERFORMANCE & RECOVERY BPC 157 Body protectio"), `/products/tb-500` ("02 · PERFORMANCE & RECOVERY TB 500 Thymosin beta 4"), `/products/bpc-157-tb-500-blend` ("03 · PERFORMANCE & RECOVERY BPC 157 / TB 500 Blend"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://pubmed.ncbi.nlm.nih.gov/16352683/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5985817/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/ipamorelin`

- **Title:** Ipamorelin: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="Ipamorelin: Selective GHS R agonist"; og:title="Ipamorelin: Socal Bioresearch"; og:description="A pentapeptide discussed for selective ghrelin receptor activity in available literature."; og:type="product"; og:url="https://socalbioresearch.org/products/ipamorelin"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="Ipamorelin: Socal Bioresearch"; twitter:description="A pentapeptide discussed for selective ghrelin receptor activity in available literature."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (18):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/coa/ipamorelin.webp` ("Ipamorelin 10 mg PURITY 99.836%"), `/contact?type=catalog&product=Ipamorelin` ("Ask about Ipamorelin"), `/products/bpc-157` ("01 · PERFORMANCE & RECOVERY BPC 157 Body protectio"), `/products/tb-500` ("02 · PERFORMANCE & RECOVERY TB 500 Thymosin beta 4"), `/products/bpc-157-tb-500-blend` ("03 · PERFORMANCE & RECOVERY BPC 157 / TB 500 Blend"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://pubmed.ncbi.nlm.nih.gov/9849822/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4012909/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png, /coa/ipamorelin.webp, /products/ipamorelin.webp

### `/products/sermorelin`

- **Title:** Sermorelin: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="Sermorelin: GHRH 1 to 29 fragment"; og:title="Sermorelin: Socal Bioresearch"; og:description="A truncated GHRH analog discussed in pituitary signaling research."; og:type="product"; og:url="https://socalbioresearch.org/products/sermorelin"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="Sermorelin: Socal Bioresearch"; twitter:description="A truncated GHRH analog discussed in pituitary signaling research."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=Sermorelin` ("Ask about Sermorelin"), `/products/bpc-157` ("01 · PERFORMANCE & RECOVERY BPC 157 Body protectio"), `/products/tb-500` ("02 · PERFORMANCE & RECOVERY TB 500 Thymosin beta 4"), `/products/bpc-157-tb-500-blend` ("03 · PERFORMANCE & RECOVERY BPC 157 / TB 500 Blend"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://pubmed.ncbi.nlm.nih.gov/18000087/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7290572/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png, /products/sermorelin.webp

### `/products/tesamorelin`

- **Title:** Tesamorelin: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="Tesamorelin: Stabilized GHRH analog"; og:title="Tesamorelin: Socal Bioresearch"; og:description="A stabilized GHRH analog discussed for prolonged receptor activity in metabolic research."; og:type="product"; og:url="https://socalbioresearch.org/products/tesamorelin"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="Tesamorelin: Socal Bioresearch"; twitter:description="A stabilized GHRH analog discussed for prolonged receptor activity in metabolic research."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=Tesamorelin` ("Ask about Tesamorelin"), `/products/bpc-157` ("01 · PERFORMANCE & RECOVERY BPC 157 Body protectio"), `/products/tb-500` ("02 · PERFORMANCE & RECOVERY TB 500 Thymosin beta 4"), `/products/bpc-157-tb-500-blend` ("03 · PERFORMANCE & RECOVERY BPC 157 / TB 500 Blend"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://www.nejm.org/doi/full/10.1056/NEJMoa072375, https://pubmed.ncbi.nlm.nih.gov/25182100/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/ghk-cu`

- **Title:** GHK Cu: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="GHK Cu: Copper binding tripeptide"; og:title="GHK Cu: Socal Bioresearch"; og:description="A naturally occurring copper binding peptide discussed in skin biology and tissue remodeling research."; og:type="product"; og:url="https://socalbioresearch.org/products/ghk-cu"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="GHK Cu: Socal Bioresearch"; twitter:description="A naturally occurring copper binding peptide discussed in skin biology and tissue remodeling research."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=GHK+Cu` ("Ask about GHK Cu"), `/products/bpc-157` ("01 · PERFORMANCE & RECOVERY BPC 157 Body protectio"), `/products/tb-500` ("02 · PERFORMANCE & RECOVERY TB 500 Thymosin beta 4"), `/products/bpc-157-tb-500-blend` ("03 · PERFORMANCE & RECOVERY BPC 157 / TB 500 Blend"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4429173/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6164334/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

### `/products/aod-9604`

- **Title:** AOD 9604: Socal Bioresearch
- **Meta:** twitter:card="summary_large_image"; description="AOD 9604: hGH C terminal fragment"; og:title="AOD 9604: Socal Bioresearch"; og:description="A modified fragment of human growth hormone discussed in lipid metabolism research."; og:type="product"; og:url="https://socalbioresearch.org/products/aod-9604"; og:image="https://socalbioresearch.org/og/og-products.jpg"; og:image:width="1200"; og:image:height="630"; twitter:image="https://socalbioresearch.org/og/og-products.jpg"; twitter:title="AOD 9604: Socal Bioresearch"; twitter:description="A modified fragment of human growth hormone discussed in lipid metabolism research."
- **JSON-LD:** 4 block(s): Organization, WebSite, Product, BreadcrumbList
- **Internal links (17):** `/` ("Socal Bioresearch"), `/products` ("Catalog"), `/research` ("Learn"), `/about` ("About"), `/new-customer` ("New Customer"), `/contact` ("Contact"), `/` ("HOME"), `/products` ("CATALOG"), `/contact?type=catalog&product=AOD+9604` ("Ask about AOD 9604"), `/products/bpc-157` ("01 · PERFORMANCE & RECOVERY BPC 157 Body protectio"), `/products/tb-500` ("02 · PERFORMANCE & RECOVERY TB 500 Thymosin beta 4"), `/products/bpc-157-tb-500-blend` ("03 · PERFORMANCE & RECOVERY BPC 157 / TB 500 Blend"), `/research` ("Common Questions"), `/legal` ("Legal & policies"), `/legal/privacy` ("Privacy"), `/legal/disclaimer` ("Disclaimer"), `/` ("Back to home")
- **External links (2):** https://pubmed.ncbi.nlm.nih.gov/15208835/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3069661/
- **Form fields (SSR):** <textarea placeholder="Ask about a pepti
- **Media:** /logo.png

