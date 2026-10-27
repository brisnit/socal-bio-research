# Interactions B: forms, chat widget, chrome, legal, SEO

Source: prettified bundles in `scratchpad/recon/pretty/`. Line numbers are approximate. "C:" = contact-5JXi_vG4.js, "NC:" = new-customer-B5ALd_R6.js, "SL:" = SiteLayout-Cy5lZ35s.js, "AR:" = app-routes.js, "SB:" = StickyBackButton-CkFNgh5k.js.
Stack: TanStack Router/Start (SSR + hydrate), React, zod v3 (default messages such as `String must contain at least 3 character(s)`), Supabase JS client (`s`/`ue`/`Y` exported from client-C7eoClty.js), lucide icons, Radix Checkbox (inlined in NC).

---

## 1. Contact form (`/contact`), C:1-442

### Search params (AR:~410-422)
`validateSearch` = zod object, each key `z.unknown().pipe(schema.catch(default))`, so invalid values silently fall back:
- `type`: enum `catalog | coa | procurement | collaboration | other | ""`, default `""`.
- `product`: string max 120, default `""` (longer -> `""`).

### Prefill (C:~55-90)
- Inquiry type chip state is initialized from `type`.
- Message textarea initial value, only when `product` is non-empty:
  - `type=coa`: `Could you send documentation for ${product}?\n\n`
  - `type=procurement`: `I'd like to order ${product}.\n\nQuantity: \nTimeline: \n`
  - any other type: `I have a question about ${product}:\n\n`
- On mount (useEffect): read `sessionStorage["drp:handoff"]`. If present it is **prepended** to the current message (`handoff + prefill`), then the key is removed. Router state `drPeptideSummary` (set by Dr. Peptide) is **not read** by the contact page; only sessionStorage is used.

### Fields (render order)
| name | label | element / type | required | constraints | notes |
|---|---|---|---|---|---|
| `website` | "Leave this field empty" | text input, honeypot | n/a | tabIndex -1, autocomplete off | wrapper off-screen (`left-[-9999px]`), aria-hidden |
| `name` | "Name" `*` | input text | yes | maxLength 200, autocomplete `name` | no placeholder |
| `email` | "Email" `*` | input `email` | yes | maxLength 320, autocomplete `email` | no placeholder |
| `organization` | "Organization (optional)" | input text | no | maxLength 200, autocomplete `organization` | |
| `inquiry_type` | "What's this about?" | hidden input + toggle button group (`role=group`, aria-label "Inquiry type") | no | single select | chips listed below |
| `message` | "Your message" `*` | textarea (rows 6, `min-h-40`, resize-y) | yes | maxLength 5000 | controlled |

Inquiry chips (C:~48, order as rendered; value -> label):
`other` "I'm just curious"; `catalog` "Question about a specific peptide"; `procurement` "I'd like to order"; `coa` "Documentation request"; `collaboration` "Partnership or collaboration". Selected chip: `border-accent bg-accent text-accent-foreground`; clicking another replaces; no deselect. `noValidate` on form, so no native validation.
Labels use eyebrow-mono style; required shows accent `*`. Field error renders `<p id="{field}-error" class="text-xs text-destructive">` under field; inputs get `aria-invalid`.

### Validation schema (C:~17-45, duplicated at AR:~456-480)
- name: trim, min1 "Name is required", max200 "Name must be under 200 characters"
- email: trim, min3 "Email is required", max320 "Email must be under 320 characters", email "Enter a valid email address"
- organization: trim, max200 "Organization must be under 200 characters", optional or `""`
- inquiry_type: enum above, optional
- message: trim, min1 "Message is required", max5000 "Message must be under 5000 characters"
Only the first issue per field is shown.

### Submit sequence (C:~92-140)
1. preventDefault, clear error text and field errors.
2. Honeypot non-empty: show success state, `form.reset()`, clear chip. Nothing is sent. (The controlled message text is not cleared in this branch.)
3. Less than 2000 ms since mount: error "Please take a moment to review your message before sending."
4. Rate limit: `sessionStorage["contact:lastSubmit"]` timestamp; if less than 30 000 ms ago: error `Please wait ${N}s before sending another message.` (N = ceil of remaining seconds).
5. zod safeParse. On failure: field errors plus banner "Please correct the highlighted fields."
6. State `submitting`: button disabled (`opacity-50`), label "Sending…" (idle label "Send your message" + arrow-up-right icon).
7. `supabase.from("inquiries").insert({...})`, with columns:
   - `name` <- name (trimmed)
   - `email` <- email (trimmed)
   - `organization` <- organization trimmed, or `null` if empty
   - `inquiry_type` <- selected chip value, or `null` if empty
   - `message` <- message (trimmed)
   No `.select()`; only `error` checked.
8. Insert error: banner "We couldn't send your message. Please try again in a moment."
9. Success: set `contact:lastSubmit` = now; state `success`; form reset, chip cleared, message cleared.

### States (C:~370-400, inside `aria-live="polite"`)
- error: `role=alert`, left destructive border, alert-circle icon, text = specific message or fallback "Something went wrong. Please try again."
- success: `role=status`, accent left border, check-circle icon, "Thanks: your message is in. A real person will reply within one business day." The form stays visible (it is not replaced).

### Page copy
PageHero eyebrow "05: Contact", meta "Real humans · Real answers", title "Talk to" / muted "a **real** person." (OrangeWord on "real"), description "No script. No pressure. Tell us what you're curious about and we'll get back: usually within one business day." Aside: "Direct" -> "Veronica Hollis", mailto `vchollis05@gmail.com`; "Response window" -> "Within one business day."; "No commitment" -> "You don't need a lab, a credential, or a reason. If you're curious, ask." Form column is wrapped in Reveal with delay 150. The card has a 1px accent bar on its left edge.

---

## 2. New customer registration (`/new-customer`), NC:580-1224

**Not a multi-step wizard.** It is one form with three numbered section headers (`01`, `02`, `03`) drawn by component `A` (NC:~610): eyebrow `<accent>{step}</accent>: {title}` plus a description, with a 2px accent tick. There is no step progression, no per-step gating and no progress check marks. The only "check" icon is the Radix checkbox indicator (lucide `check`, NC:~25) and the success heading's check-circle. No search params, no sessionStorage prefill, no validateSearch.

### Field component `w` (NC:~630-690)
Label (`text-sm font-medium`), a required `*`, and on the right "Required" (accent) or "Optional" (muted). Input gets `aria-describedby` = error id or helper id. Error: `<p id="{id}-error">` with alert-circle icon, `text-sm text-destructive`. Otherwise it shows the helper text if one is given.

### Fields
| Section | id/name | label | type | placeholder | req | maxLength | autocomplete |
|---|---|---|---|---|---|---|---|
| (honeypot) | `website` | "Leave this field empty" | text | | | | off |
| 01 About you: "So a real person can write back." | `legal_name` | Full name | text | Jane Doe | Y | 200 | name |
| | `business_name` | Organization | text | Personal, or company name | Y | 200 | organization |
| | `role_title` | Role / title | text | e.g. Researcher, Founder | N | 200 | organization-title |
| | `email` | Email | email | jane@email.com | Y | 320 | email |
| | `phone` | Phone | tel | (615) 555 0123 | Y | 50 | tel |
| 02 Where to ship: "Used only to fulfill orders. Never shared." | `address_street` | Street address | text | 123 Main St | Y | 300 | street-address |
| | `address_city` | City | text | Nashville | Y | 120 | address-level2 |
| | `address_state` | State / region | text | TN | Y | 120 | address-level1 |
| | `address_postal_code` | Postal code | text | 37203 | Y | 30 | postal-code |
| | `address_country` | Country | text | (none); defaultValue "United States"; helper "Pre filled: change if shipping elsewhere." | Y | 120 | country-name |
| 03 Tell us a little: "A sentence or two is plenty: this helps us point you in the right direction." | `intended_use` | What are you curious about? | textarea rows 5 | What brought you here? What would you like to learn or try? | Y | 5000 | helper "No jargon needed. Plain English is best." |
| | `referral_source` | How did you hear about us? | text | A friend, search, a podcast… | N | 200 | |
| | (checkbox, no name) | "I understand the information here is educational, and I'll ask Socal Bioresearch if anything is unclear. (Required)" | Radix checkbox, controlled state | | Y | | |

Layout: 01 is a 2-column grid; 02 has street full width, then a 2-column grid for city/state/postal/country.

### Validation (NC:580-600, duplicated at AR:~378-396)
legal_name min1 "Your name is required"; business_name min1 "Organization name is required"; role_title optional; email min3 (**no custom message**, so zod default "String must contain at least 3 character(s)" appears for an empty or short email, because the min issue comes before the email issue) / email "Enter a valid email address"; phone min5 "Phone number is required"; address_street "Street address is required"; city "City is required"; state "State / region is required"; postal "Postal code is required"; country "Country is required"; intended_use "Tell us a bit about your intended use"; referral_source optional; `ruo_acknowledged: z.literal(true)` errorMap "You must acknowledge the terms". Max errors use zod defaults, but the maxLength attributes prevent them in practice.

### Submit (NC:~700-780)
1. Honeypot filled: show success panel, reset, uncheck. Nothing is sent.
2. Less than **3000 ms** since mount: "Please take a moment to review your details before submitting."
3. `sessionStorage["new-customer:lastSubmit"]` less than 30 s ago: `Please wait ${N}s before submitting again.`
4. zod fail: field errors set. The banner text is computed at render as `Please fix ${n} field(s) below.` ("field" when n = 1, otherwise "fields"). That replaces the stored message "Please correct the highlighted fields.", which never displays.
5. Submitting: button disabled, "Submitting…" (idle "Send my details" + arrow icon). Under the button: "We reply within one business day: from a real person."
6. `supabase.from("customer_registrations").insert({...})`, with columns: `legal_name, business_name, role_title (trim or null), email, phone, address_street, address_city, address_state, address_postal_code, address_country, intended_use, referral_source (trim or null), ruo_acknowledged: true` (hard-coded true). All values come from the same-named form fields and are trimmed.
7. Error: "We couldn't submit your details. Please try again in a moment." (`role=alert` banner; fallback "Something went wrong. Please try again.")
8. Success: set the lastSubmit key, reset, uncheck, `window.scrollTo({top:0, behavior:"smooth"})`. The form is **replaced** by a success panel (`role=status`): eyebrow "Received", h2 with check-circle "Thanks: we got it.", p "A real person will review what you sent and write back within one business day with what to do next.", button "Submit another" + arrow. That button sets state to idle and remounts an empty form.

### Page copy
Hero eyebrow "06: New here?", meta "Plain language · No pressure", title "New to" / muted "**peptides**?" (OrangeWord), description "Share a few details so we know who we're talking to. We'll get back personally: no automated drip, no sales script." Hero child link to `/contact`: "Just have a question? Ask instead" + arrow. Aside: "What we ask for": "Your name, contact, and where to ship. Used only to fulfill orders and stay in touch."; "Before you order": "Tell us what you need and ask questions first. We will respond clearly before anything moves forward."; "Response window": "Within one business day."

input-B6AZrhuC.js: shadcn `Input` (forwardRef; `h-9 rounded-md border-input ... md:text-sm`, merged via `cn`). Contact overrides it with `h-11 rounded-none ... focus-visible:border-accent ring-accent/30`.

---

## 3. Dr. Peptide chat widget, SL:1445-1923 (component `fr`)

Mounted globally inside SiteLayout. It renders `null` until mounted on the client.

**Storage keys**
- `localStorage["drp:session"]`: session id `s_` + `crypto.randomUUID()` with dashes removed, created once (SL:1448).
- `sessionStorage["drp:history"]`: JSON array of `{role, content}`, rewritten on every message change. It is restored on mount if it is a non-empty array.
- `localStorage["drp:teaserDismissed"]` = `"1"`.
- `sessionStorage["drp:handoff"]`: handoff text for the contact page.

**Greeting** (initial assistant message): "Hey: I'm Dr. Peptide. Ask me anything about peptides: what they are, how they work, what people use them for. I'll keep it plain English. For anything specific to you or your order, I'll connect you to a real person on our team."

**Teaser bubble**: shown **1800 ms** after mount if `drp:teaserDismissed` is not set, and only while the panel is closed. It is fixed at bottom 6.5rem / right 6, max-w 260px, has `role=status`, animates with `drp-bubble-in 0.45s`, and uses a navy-to-orange gradient. Text: "👋 Hi! I'm **Dr. Peptide**. Ask me anything about peptides: free." It has an X button (aria "Dismiss Dr. Peptide intro"). The bubble is dismissed and the localStorage flag set by the X, by opening via the launcher, or by the `drp:open` window event.

**Launcher**: fixed bottom-6 right-6, z-50, pill. It holds a white circle with a sparkles icon, a `drp-ring-pulse 2.6s` ring and an orange status dot, followed by the text "Ask Dr. Peptide" / "Free · Plain English". aria-label: "Open Dr. Peptide: free AI guide to peptides" when closed, "Close Dr. Peptide chat" when open. While the panel is open the launcher becomes invisible (opacity-0, pointer-events none).
Colors: navy `oklch(0.16 0.05 250)`, blue `oklch(0.22 0.07 248)`, orange `oklch(0.72 0.19 50)`.

**External openers**: `ke()` dispatches `CustomEvent("drp:open")`. Component `Oe` (exported as `b`) is a CTA in three variants: `nav` (small white pill with an orange border and pulsing dot; label default "Ask Dr. Peptide"), `hero` (gradient pill; sublabel "Free · Instant answers"), and `card` (gradient card; eyebrow "Free AI guide · Instant answers" + arrow).

**Panel**: always in the DOM. It is `role=dialog`, aria-label "Dr. Peptide chat", with `aria-hidden` set while closed. It toggles by opacity/scale (origin bottom-right, 300 ms). Size: w `calc(100vw-3rem)` max 420px, h `min(640px, 100vh-3rem)`. Header: eyebrow "Free AI guide · Plain English", h3 "Dr. Peptide", a "Reset" button (aria "Start over") and an X (aria "Close chat"). Messages: user messages align right (`bg-foreground`), assistant messages left (`bg-secondary`), `whitespace-pre-wrap`, rendered as plain text (no markdown). A blinking caret appears on the last assistant message while streaming. The list auto-scrolls to the bottom. There is no ESC or outside-click close and no focus trap.
Input: textarea with placeholder "Ask about a peptide…", rows 1, maxLength 4000, disabled while loading. Enter sends; Shift+Enter inserts a newline. The Send button (aria "Send") is disabled when loading or empty and shows a spinner while loading. Footer: "Educational only · Not personal advice".

**Send** (SL:1514-1605): trim. Ignored if empty or already loading. Over 4000 chars: "That's a long one: please trim to 4000 characters or fewer." Otherwise the user message is appended and the request below is sent:
```
POST /api/dr-peptide   Content-Type: application/json
{ "sessionId": "s_<hex>", "messages": [{role, content}, ...] }   // full history incl. greeting
```
- `!res.ok`: if the JSON body has `.error`, that text is shown; otherwise "Dr. Peptide ran into a hiccup. Please try again."
- no body: "No response from Dr. Peptide."
- Stream: reads the body as text and splits on `\n`, stripping `\r`. It skips lines that start with `:`, blank lines, and anything that does not start with `data: `. `data: [DONE]` ends the stream. Each other line is JSON-parsed and `choices[0].delta.content` is appended (OpenAI chat-completions SSE format). The first delta creates the assistant message; later deltas update it in place. If JSON parsing fails, the line is put back into the buffer to wait for more bytes.
- fetch throws: "Couldn't reach Dr. Peptide. Check your connection and try again."
- Errors render as a centered small destructive box in the message list.

**Reset**: messages go back to the greeting only, the error clears, and `drp:history` is removed. The session id is kept.

**Handoff** (SL:1606-1633): the "Connect me to a real person" button (arrow-up-right) shows when there is more than one message and nothing is loading. It joins the last 2 user messages with `\n\n` and builds this text:
- if there are user messages: `I was chatting with Dr. Peptide and would like to talk to a real person.\n\nMy questions so far:\n\n${msgs}\n\n`
- otherwise: `I'd like to talk to a real person about peptides.\n\n`
It then closes the panel, calls `navigate({to:"/contact", search:{type:"other", product:""}, state:{drPeptideSummary}})`, and **after** that sets `sessionStorage["drp:handoff"]`. Unclear: if the user is already on `/contact`, the contact component does not remount, so the handoff stays in storage until the next mount. The chip shows "I'm just curious" only on a fresh mount, because `useState` initializes from the search params only once.

---

## 4. Header, footer, chrome (SL:2030-2479)

**SiteLayout `vr`** (SL:2462): announcement bar (`bg-primary/95`, xs, centered) "Clear peptide education · Real support · No pressure", then Header, `<main flex-1>`, Footer, DrPeptide, AgeGate, BackToHome.

**Header `br`** (SL:2037): `sticky top-0 z-40`. It counts as scrolled when `window.scrollY > 24` (passive listener, also checked on mount). When scrolled it gets `border-b bg-background/85 backdrop-blur-xl` and its height goes from h-20 to h-14; otherwise it is transparent (300 ms transition). Logo link `/` (aria "Socal Bioresearch: home"): `/logo.png` 36px (rotates -4deg on hover) + "Socal" with muted " Bioresearch". Desktop nav (md+): Catalog `/products`, Learn `/research`, About `/about`, New Customer `/new-customer`, Contact `/contact`, followed by the `Oe nav` Dr. Peptide pill. Links are 13px muted, and hover turns them to foreground. **Active**: `text-foreground` plus a 1px underline (`after:` bar, -bottom-1.5). This uses TanStack `activeProps`, which by default also matches child paths.
**Mobile** (<md): toggle button (aria "Toggle menu", Menu/X icon). The panel slides by `max-h-0` to `max-h-80`, with `bg-background/95 backdrop-blur-xl`. It holds the same links in a column (active = text-foreground) and a full-width Dr. Peptide pill. Clicking a link closes the menu. Clicking the Dr. Peptide pill does **not** close it, and the menu has no outside-click or ESC close.

**Footer `gr`** (SL:2156): mt-32, border-top. Column 1: logo (alt "Socal Bioresearch") + "Socal Bioresearch helps people understand peptides in plain English: what they are, how they work, and what questions to ask next." "Explore": Catalog, Common Questions (`/research`), About, Contact. "Legal": Legal & policies (`/legal`), Privacy, Disclaimer, New Customer (`/new-customer`). The footer does not link Terms, Acceptable Use or Shipping. Bottom: "Plain language peptide support" (mono, uppercase), the disclaimer "Information on this site is educational and should not replace guidance from a qualified professional. If you have a specific question, contact our team and a real person will respond.", and "© {current year} Socal Bioresearch."

**Age gate `wr`** (SL:2329): `localStorage["scbr:age-verified"] === "1"` skips it. If storage throws, the gate shows. It is client-only, mounted after an effect, so SSR HTML does not include it. It is a full-screen `fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl` dialog (`aria-modal`, labelledby `age-gate-title`) and locks `body.style.overflow = hidden` while shown. Contents: an SVG zigzag mark + "Socal Bio" with muted " Research" (note: different spelling from the header), eyebrow "Age verification", h2 "Are you 21 or older?", p "This site contains educational content intended for adults. Please confirm your age to continue." Buttons: "I am 21 or older" (sets the key and closes) and "I am under 21". The second replaces the buttons with "You must be 21 or older to view this site." with no redirect and no way back except a reload. Fine print: "By entering, you agree to our terms and acknowledge the educational nature of the content." (not a link).

**Back to home `yr`** (SL:2437): fixed bottom-6 **left**-6, z-40, pill, arrow-left + "Back to home" (aria the same). It is visible when `scrollY > 280`; otherwise opacity-0, translate-y-2, pointer-events none. It is **not rendered** on `/` or on paths starting with `/legal/`. It is still rendered on `/legal`, because only the trailing-slash prefix is excluded.

**Legal sticky back `SB:x`**: same style and position and the same >280 threshold. Defaults: `to="/legal"`, label "Back to Legal", aria "Back to Legal hub". All 5 policy pages use it with defaults, so it replaces the home button on those pages.

---

## 5. Legal pages

Routing (AR:1830-1870): `/legal` is a layout route whose component (legal-9yUeRhkU.js) is just an `<Outlet/>` with no head. Children: `/legal/` (index), `/terms`, `/privacy`, `/disclaimer`, `/acceptable-use`, `/shipping`.

**Index** (legal.index-Dm45m235.js): PageHero eyebrow "06: Legal", meta "Reviewed regularly", title "Legal &" / "policies.", description "Plain English summaries on top, formal clauses underneath. Every policy is short, honest, and easy to read: and a real attorney has reviewed the language.", backTo `/` "Back to home". The page is a grid of 5 cards (`gap-px bg-border`, 1/2/3 columns), each a Link with "{n} / 05", an h2 title, an arrow-up-right and a summary. The cards are wrapped in Reveal with delay index×80.
Cards: 01 Terms of Service, "The agreement between you and Socal Bioresearch when you use this site."; 02 Privacy Policy, "What information we collect from contact forms and Dr. Peptide chats: and what we don't."; 03 Disclaimer, "Educational only. Not personal advice. Research use peptide language explained simply."; 04 Acceptable Use, "How the site, the catalog, and Dr. Peptide may and may not be used."; 05 Shipping & Returns, "How orders are handled, what to expect on delivery, and our return policy."
Footer block (Reveal delay 500): eyebrow "Have a question?", then "If anything in these policies is unclear, [contact us] : a real person responds within one business day." (sic: there is a space before the colon).

**Policy pages, shared structure**: SiteLayout > PageHero (eyebrow `06.0N: Legal`, meta "Last updated · April 2026", backTo `/legal` "All policies") > section `max-w-3xl` > `<dl divide-y border-y>` of `LegalSection` (SB:`m`). Each section shows an eyebrow "{n} · {title}", a plain-language summary (base/lg), and a box (left border `primary/60`, `bg-secondary/40`) labelled "Formal clause" in mono over the clause text in mono 12-13px. A `delay` prop is passed but ignored. After the list comes one closing line with a Contact link, then the StickyBackButton. **No TOC** and no anchors or ids on sections.

| Page | eyebrow | Title / muted | Hero description | Sections | Closing line |
|---|---|---|---|---|---|
| terms | 06.01 | "Terms of" / "service." | The agreement between you and Socal Bioresearch when you use this site, the catalog, or Dr. Peptide. | 8: Acceptance of terms; Eligibility; Educational content; Products & research use only; Limitation of liability; Indemnification; Changes to these terms; Governing law (Tennessee) | "Questions about these terms? Contact us and a real person responds within one business day." |
| privacy | 06.02 | "Privacy" / "policy." | We collect only what we need to answer you. No advertising, no tracking, no surprises. | 8: What we collect; How we use it; Cookies; Dr. Peptide chat; Who we share with; How long we keep it; Security; Contact us about your data | "Questions about your data? Contact us and we'll get back to you within one business day." |
| disclaimer | 06.03 | "Disclaimer." (no muted) | What this site is for: and what it isn't. Read this before acting on anything you see here. | callout box first: "Important" / "This website is for education only. Nothing here is personal advice. Materials in our catalog are sold strictly for laboratory research, not for use in humans or animals. If you have a health question, talk to a qualified professional." Then 6: Educational content only; No doctor patient relationship; Research use only products; No informational claims; AI generated responses; Your responsibility | "Still unsure about something? Contact us before you make a decision. We would rather answer honestly than let you guess." |
| acceptable-use | 06.04 | "Acceptable" / "use." | How the site, the catalog, and Dr. Peptide may and may not be used. Short version: be honest, don't try to break things, respect everyone. | 5: Use the site honestly; Don't try to break things; Don't misuse Dr. Peptide; Respect intellectual property; We may suspend or terminate access | "See something being misused? Contact us and we'll look into it." |
| shipping | 06.05 | "Shipping &" / "returns." | How orders are handled, what to expect on delivery, and how we handle damaged or incorrect orders. | 6: Order processing; Where we ship; Shipping costs & timing; Damaged or incorrect orders; Returns; Refunds | "Question about your order? Contact us with your order number: we respond within one business day." |

The full summary and clause text lives in each legal.*.js data array (lines ~6-70).

---

## 6. Per-route SEO (AR)

Root (AR:~125-185) applies to every page: charset utf-8; viewport `width=device-width, initial-scale=1`; default title "Socal Bioresearch: Peptides in Plain English"; default description "Plain language peptide education for wellness, longevity, performance, and recovery questions."; `og:type=website`; `twitter:card=summary_large_image`; `robots=index, follow`; `google-site-verification=7X0zbleRlpNVseC4YyubjXW8s1bz2RdFmubiXtKh1zI`. Links: stylesheet `/assets/styles-9bE31nz0.css`, icons `/favicon.svg`, `/favicon-32.png` (32), `/favicon-16.png` (16), shortcut `/favicon.ico`, apple-touch `/apple-touch-icon.png` (180), preconnect to the Google Fonts hosts, and Google Fonts Inter Tight 300-700, Inter 400-700, JetBrains Mono 400/500. JSON-LD: **Organization** (name, url `https://socalbioresearch.org`, the same description, areaServed US, knowsAbout ["Peptide education","GLP 1 receptor agonists","Mitochondrial peptides","Recovery peptides","Longevity science"]) and **WebSite** (name, url).
Every route below also sets `og:image:width=1200`, `og:image:height=630`, and `twitter:image` equal to og:image. None set `og:site_name` or `twitter:title`/`twitter:description`. Base URL is `https://socalbioresearch.org`, and canonical equals og:url for every route.

| Route | title | description | og:title | og:description | og:image (/og/…) | canonical / og:url | JSON-LD / extra |
|---|---|---|---|---|---|---|---|
| `/` | Socal Bioresearch: Curious about peptides? Start here. | Plain language answers about peptides: what they are, how they work, and how to explore them responsibly. Talk to a real person. | = title | Plain language answers about peptides. Talk to a real person before you order. | og-home.jpg | `/` | preload image `/hero-video-poster.jpg` fetchpriority high |
| `/research` | Common questions about peptides: Socal Bioresearch | Plain language answers to the most common questions about peptides: what they are, why people talk about them, and how to think about them clearly. | Common questions about peptides | Honest, plain language answers: no hype, no pressure. | og-research.jpg | `/research` | FAQPage from the 6 Q&A in `$2` (AR:~240) |
| `/products/` | Peptide Catalog (23): Socal Bioresearch | Browse 23 research peptides explained in plain English: what they are and what to ask before deciding. | Peptide Catalog: Socal Bioresearch | 23 peptides explained in plain English. | og-products.jpg | `/products` | ItemList (name "Socal Bioresearch Peptide Catalog", numberOfItems, ListItem position/url/name). The count is computed from the `$i` array length. validateSearch: `q` string default ""; `cat` all/wellness-longevity/performance-recovery default all; `sort` name/category default name |
| `/products/$slug` | `${name}: Socal Bioresearch` | `${name}: ${tagline}` sliced to 155 chars | = title | `summary` | og-products.jpg | `/products/${slug}` | `og:type=product`; Product (name, description=summary, category label, url, brand Socal Bioresearch, additionalProperty Purity + CAS/Molecular Weight/Molecular Formula when present) + BreadcrumbList Home > Catalog > name. Unknown slug: loader throws notFound and the head title is "Product not found" |
| `/about` | About: Socal Bioresearch | Socal Bioresearch is a small team helping curious people get honest, plain language answers about peptides: no hype, no pressure. | About Socal Bioresearch | Honest, plain language answers about peptides. Talk to a real person. | og-about.jpg | `/about` | none |
| `/contact` | Talk to a real person: Socal Bioresearch | Send a question about peptides: what they are, what they do, or whether they're right for you. A real person responds within a day. | = title | Honest answers, no pressure, no script. | og-contact.jpg | `/contact` | validateSearch type/product |
| `/new-customer` | New here?: Socal Bioresearch | New to peptides? Tell us a bit about yourself and we'll help you get started: honestly, with no pressure. | = title | Plain language intro for people new to peptides. | og-new-customer.jpg | `/new-customer` | none |
| `/legal/` | Legal & Policies: Socal Bioresearch | Plain language, formally documented policies: Terms, Privacy, Disclaimer, Acceptable Use, and Shipping & Returns. | = title | Every policy in plain English, with the formal clause underneath. Reviewed and updated regularly. | og-compliance.jpg | `/legal` | none |
| `/legal/terms` | Terms of Service: Socal Bioresearch | The agreement between you and Socal Bioresearch when you use this site, the catalog, or Dr. Peptide. | = title | Plain English summary of our Terms, with the formal clause underneath. | og-compliance.jpg | `/legal/terms` | none |
| `/legal/privacy` | Privacy Policy: Socal Bioresearch | What information Socal Bioresearch collects from contact forms and Dr. Peptide, how we use it, and what we don't do with it. | = title | We only collect what we need to respond to you. Plain English summary, formal clause underneath. | og-compliance.jpg | `/legal/privacy` | none |
| `/legal/disclaimer` | Disclaimer: Socal Bioresearch | Educational content only. Not personal advice. Research use peptide language explained simply. | = title | Plain English statement of what this site is for: and what it isn't. | og-compliance.jpg | `/legal/disclaimer` | none |
| `/legal/acceptable-use` | Acceptable Use: Socal Bioresearch | How the site, the catalog, and Dr. Peptide may and may not be used. | = title | Clear, plain English rules for using the site responsibly. | og-compliance.jpg | `/legal/acceptable-use` | none |
| `/legal/shipping` | Shipping & Returns: Socal Bioresearch | How orders are handled, what to expect on delivery, and our return policy. | = title | Clear, plain language shipping and return expectations. | og-compliance.jpg | `/legal/shipping` | none |

(The legal description vs og:description pairing was read from the order of the AR:1600-1820 blocks. The rendered `out/*.html` confirms titles for /contact, /legal and /products.)

---

## 7. 404 and error handling

- **Root notFoundComponent `Y2`** (AR:~70-100). It renders **without SiteLayout**: a full-screen centered layout with h1 "404" (text-7xl bold), h2 "Page not found", p "The page you're looking for doesn't exist or has been moved.", and a Link "Go home" to `/` (primary button, rounded-md). No head override, so the root default title applies.
- **Router defaultErrorComponent `RE`** (AR:~1890-1950): no SiteLayout. It shows a destructive circle with a warning-triangle SVG, h1 "Something went wrong", p "An unexpected error occurred. Please try again." (an error-details slot is compiled out to `!1`), a button "Try again" (`router.invalidate()` then `reset()`), and a plain `<a href="/">` "Go home". Router options: `scrollRestoration: true`, `defaultPreloadStaleTime: 0`.
- **/products/$slug** overrides both: notFound (products._slug-h3Hh6hlK.js) shows "Not found." / "This catalog entry doesn't exist." / Link "Back to catalog" to `/products`. The error component (products._slug-CRNe-6WC.js) is inside SiteLayout: h1 "Something went wrong." + `error.message`.

---

## Flags / unclear
- The new-customer page has no wizard, steps or check marks; those are only visual section numbers. A rebuild should not invent progression.
- The contact page ignores router state `drPeptideSummary`; the handoff works only through sessionStorage, and only if `/contact` mounts after `setItem`.
- New-customer email uses the zod default message for an empty value ("String must contain at least 3 character(s)").
- The age gate brand text "Socal Bio Research" differs from "Socal Bioresearch" everywhere else.
- `/api/dr-peptide` server behavior (model, system prompt, rate limits, error JSON shape beyond `{error}`) is not visible in these bundles.
- Supabase URL/key and RLS live in client-C7eoClty.js (not reviewed here). Inserts do not `.select()`, which is consistent with insert-only anon RLS.
