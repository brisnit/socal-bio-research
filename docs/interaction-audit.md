# Interaction Audit: socalbioresearch.org

This audit records every interactive behavior on the live site: what each control does, the state behind it, animation timings, form validation, storage keys and network calls.

It was reverse-engineered from the shipped JavaScript bundles (TanStack Start route chunks) and cross-checked against the rendered pages in Playwright. "L123" references point to the prettified bundles kept in the recon workspace.

The settled hero state and the stat values (99%+ / 23 / 1 / 24h) were confirmed in a live browser on 2026-10-27.

## Global behaviors at a glance

| Behavior | Trigger | Storage / endpoint |
|---|---|---|
| Age gate modal | First visit | localStorage `scbr:age-verified = "1"` |
| Dr. Peptide teaser bubble | 1800ms after load, if not dismissed | localStorage `drp:teaserDismissed` |
| Dr. Peptide chat | Floating button, header pill, "Ask Dr. Peptide" cards (window event `drp:open`) | `POST /api/dr-peptide` (OpenAI-style SSE), `drp:session` (localStorage), `drp:history` (sessionStorage) |
| Chat → human handoff | "Connect me to a real person" | sessionStorage `drp:handoff`, navigates to `/contact?type=other` |
| Header shrink | `scrollY > 24` | none |
| Back-to-home pill | `scrollY > 280`, hidden on `/` and `/legal/*` | none |
| Contact form | submit | Supabase `inquiries` insert |
| New-customer form | submit | Supabase `customer_registrations` insert |
| Form spam guards | honeypot `website`, minimum fill time (2s/3s), 30s resubmit throttle | sessionStorage `contact:lastSubmit`, `new-customer:lastSubmit` |

---


Source: prettified bundles in `scratchpad/recon/pretty/`. Line numbers (`L123`) are approximate, from those files.
Router: TanStack Router (`Ht("/path")({...})`, `validateSearch`, `loader`, `useSearch`, `useNavigate`). Icons are lucide (`h/y/te("name", ...)`).
`W`/`i`/`k` imported as `A` from SiteLayout = `arrow-up-right`; `e` from SiteLayout = `arrow-left`; `X` = `x`; `he` = `sparkles` (SiteLayout L100-142).

---

## 1. Shared components

### Reveal / useReveal (`Reveal-Can4YXQs.js`)
- `useReveal(opts = { threshold: 0, rootMargin: "0px 0px -10% 0px" })` (L3-34) returns `{ ref, revealed }`. One-shot; never un-reveals.
  - `prefers-reduced-motion: reduce` -> revealed immediately.
  - If `el.getBoundingClientRect().top < window.innerHeight` at mount (already in/above viewport) -> revealed immediately.
  - Otherwise IntersectionObserver; on first intersect sets revealed and disconnects.
  - **Fallback timer: `setTimeout(() => revealed = true, 1500)`** (L27). So every Reveal fires within 1.5 s of mount even if far below the fold. The scroll-in effect is therefore only seen for elements the user scrolls to within ~1.5 s; after that everything is already visible.
- `<Reveal delay=0 className as="div">` (L35-47): wrapper element (configurable tag, e.g. `as: "li"`), inline `transitionDelay: ${delay}ms`, classes
  `transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform` + `opacity-0 translate-y-6` (24px) -> `opacity-100 translate-y-0`.
- Global CSS (`styles.css` ~L5131-5150): under reduced motion all transitions/animations are forced to 0.01ms, and `.animate-marquee` etc. set to `animation: none`.

### PageHero (`PageHero-I2Penq6n.js`)
Props `eyebrow, title, titleMuted, description, meta, backTo, children` (L4-12). Section `-mt-20` (slides under the fixed header), `pt-32 md:pt-40`.
- Optional `backTo {to,label}` -> `<Link>` with arrow-left icon, `group-hover:-translate-x-0.5` on icon, `hover:text-foreground` (L19-31). Not used by any of my pages.
- Eyebrow row: eyebrow left, `meta` right (`hidden md:inline`) (L32-38).
- `<h1 class="hero-headline ... text-[clamp(2.75rem,8vw,7rem)] leading-[1.18] tracking-[-0.04em]">` wrapped in Reveal (no delay); `title` block, `titleMuted` block in `text-muted-foreground` (L39-52).
- Description + children grid wrapped in Reveal `delay 150` (L53-73).

### OrangeWord (`OrangeWord-C45UxrCv.js`)
Static (no animation). `<span data-pop-word="orange" class="pop-word italic font-light ...">` with gradient text `linear-gradient(100deg, oklch(0.68 0.22 38) 0%, oklch(0.78 0.20 50) 38%, oklch(0.84 0.17 70) 70%, oklch(0.70 0.22 40) 100%)`, `background-clip:text`, padding/margin tweaks, `box-decoration-break: clone`. `halo` (default true) adds `drop-shadow(0 0 18px oklch(0.78 0.20 50/0.35)) drop-shadow(0 0 42px oklch(0.82 0.18 60/0.22))`. `italic` default true. CSS `.pop-word` forces `overflow: visible` on itself and ancestors via `:has()` (styles.css ~L4799-4811).

### StickyBackButton + LegalSection (`StickyBackButton-CkFNgh5k.js`)
- `StickyBackButton({ to="/legal", label="Back to Legal" })` (L31-51): `useState(false)`; passive `scroll` listener, visible when `window.scrollY > 280` (checked on mount too).
  Fixed `bottom-6 left-6 z-40` pill, `bg-background/95 backdrop-blur shadow-lg`, `transition-all duration-300`; hidden state `pointer-events-none translate-y-2 opacity-0`, shown `translate-y-0 opacity-100`; hover `bg-muted opacity-90`. Arrow-left icon + label. `aria-label` is hard-coded `"Back to Legal hub"` regardless of `label`.
- `LegalSection({ n, title, summary, clause })` (L3-30): static; eyebrow `n · title`, summary paragraph, then a "Formal clause" box (`border-l-2 border-primary/60 bg-secondary/40`, mono 12-13px text).

### index-ChYZktU9.js
Not a page: Radix `Slot`/`SlotClone`, `composeRefs`/`useComposedRefs`, and `cva` (class-variance-authority). Used by the shadcn `Button` in the product not-found component.

### Ask Dr. Peptide card (SiteLayout `Oe`, used on catalog + product pages)
`variant: "card"` renders a full-width `<button>` with gradient `linear-gradient(125deg, oklch(0.16 0.05 250) 0%, oklch(0.22 0.07 248) 55%, oklch(0.72 0.19 50) 110%)`, sparkles icon in white circle, kicker "Free AI guide · Instant answers", the `label` prop, arrow-up-right icon (hover translate). Hover: `scale-[1.005]` + bigger orange shadow. Click -> `window.dispatchEvent(new CustomEvent("drp:open"))` (SiteLayout L1924-1926). The chat UI that listens for this event lives in SiteLayout and POSTs to `/api/dr-peptide` with an SSE-style `data:` stream reader (SiteLayout ~L1521-1570): outside my file set, documented elsewhere.

---

## 2. Home `/` (`index-BPEQ-qml.js`, route head app-routes.js ~L518-555)

Section order (component `ze`, L912-1250): Hero -> Marquee -> Video -> Stats -> "What we do" -> "What people ask about" -> CTA band. All inside `SiteLayout` (`S`).

### 2.1 Hero (L917-1038)
- `<section ref=heroRef class="relative isolate -mt-20 min-h-[100vh]">`; the ref is passed to the molecule as `parentRef` for its pointer listeners.
- Eyebrow row: "01: Curious about peptides?" / "Real humans · Real answers" (md+ only).
- `<h1>` in Reveal (delay 0): "Peptides,<br/>{MorphingWord} simply." Size `text-[clamp(3.25rem,11vw,9.5rem)]`, `leading-[1.02] tracking-[-0.045em]`.
- Reveal delay 150: intro paragraph + two links:
  - "Talk to a real person" -> `/contact`; `border-b border-foreground`, `hover:opacity-70`; arrow-up-right icon `group-hover:translate-x-0.5 -translate-y-0.5`.
  - "What are peptides?" -> `/about`; muted, `hover:text-foreground hover:border-foreground`.
- Reveal delay 300: molecule canvas (height `clamp(260px, 34vw, 480px)`) + caption row "A peptide · short chain of amino acids" / "Honest answers · No pressure · No hype".

#### MorphingWord `Se` (L834-911)
Props used: `words = ["complicated","confusing","hyped","explained"]`; defaults `holdMs 700`, `finalHoldMs 1200`, `transitionMs 380`, `loop false`, `startDelayMs 600`.
- State: `index` (0), `phase` ("in"/"out"), `started` (false).
- Reduced motion: jump straight to last word ("explained"), no timers.
- Otherwise: `started = true` after 600 ms. Then per word: after `holdMs` (700) set phase "out"; after `hold + 380` advance index and set phase "in". Stops on the last word (loop false), so `finalHoldMs` is never actually used. Total ~600 + 3 x 1080 = ~3.84 s to reach "explained".
- Rendering: an invisible span with the longest word reserves width (avoids layout shift); absolutely positioned visible span keyed by index. Out phase: `opacity 0`, `translateY(-0.18em)`, transitions `opacity/transform 380ms cubic-bezier(0.22, 1, 0.36, 1)`. Because the span is re-keyed and mounts with phase "in" already set, incoming words appear instantly (no fade-in); only the outgoing word animates.
- Non-final words: color `oklch(0.55 0.02 250)` (grey). Final word: same orange gradient + double drop-shadow halo as OrangeWord. Always `italic font-light`. `aria-live="polite"`, `data-pop-word="morphing"`.
- SSR captured text shows "confusing" (home.txt L13), i.e. the capture was taken mid-sequence.

#### Molecule visualization `$e` (L209-687)
Decorative SVG (`aria-hidden`, `pointer-events:none`). 15 "amino acid" nodes at normalized coords `z` (L209-225), index 7 (`bx .52, by .5`) is the active orange one.
- Size: ResizeObserver + window resize -> `{w,h}` (useLayoutEffect L238-254).
- Mount: `mounted` set true 80 ms after mount (L255-258); drives the intro:
  - Bond group: `opacity 0->1`, `transition: opacity 600ms ease-out 200ms`.
  - 14 bond paths: `strokeDasharray "400 400"`, `strokeDashoffset 400` -> `0`, `transition: stroke-dashoffset 900ms cubic-bezier(0.2,0.7,0.2,1) ${100 + i*55}ms`. Note: on mount dasharray is switched to `"none"` in the same render, which likely makes the draw-in not visibly animate (unclear without running it).
  - Node groups: `opacity 0->1`, `transition: opacity 500ms ease-out ${250 + i*55}ms`.
- Node radii: `r = clamp(18, w*0.022, 28)`; active `r*1.32`; halo circles `r*1.45` (inactive, blue, opacity .18) / `active*1.7` (orange, .28). Each node: halo, gradient orb (`#hp-orb-blue` / `#hp-orb-orange` radial gradients), white specular ellipse (opacity .78), thin white rim (stroke-opacity .18).
- Active node pulse ring: `animation: hp-active-ring 2.6s ease-out infinite`; keyframes (inline `<style>` L672-683) `0% scale(.6) opacity .55 -> 80% scale(2.2) opacity 0 -> 100% same`. A `[data-hp-ring]` reduced-motion rule exists but the ring has no such attribute; the global reduced-motion CSS still neutralizes it.
- Background: big blue glow circle (`#hp-glow-blue`, opacity .6) at center; orange glow at active node (`r*4.5`) whose opacity pulses `0.5 + sin(t*1.6)*0.15` each frame.
- Particles: `w < 640 ? 14 : 32` drifting dots (32 `<circle>` always rendered; unused stay opacity 0). Random pos, `vx +/-0.075`, `vy +/-0.05` px/frame plus `sin(t*0.4+i)*0.04` bob, radius 0.8-2.4, alpha .15-.5, wrap around edges with 4px margin. Fill `oklch(0.55 0.12 245)`.
- Idle motion (rAF loop L314-399): each node gets random `phase`, `ampX (3-6)*scale`, `ampY (5-10)*scale`, `speed .35-.6` (`scale = min(1, w/1200)`); target offset `x = cos(t*speed + phase*1.3)*ampX`, `y = sin(t*speed*1.4 + phase)*ampY`. Offsets follow targets via a spring: `v = (v + (target - pos)*0.14) * 0.78`.
- Bonds: Catmull-Rom style cubic Beziers through neighbouring node positions, recomputed every frame; stroke `url(#hp-bond-grad)` (blue -> orange -> blue), width 3, round caps.
- Pointer interaction (only if `(pointer: fine)` and not reduced motion; listeners on the hero section): `pointermove` sets pointer position and parallax target `tx = (nx-0.5)*8`, `ty = (ny-0.5)*4` px; whole molecule group lerps toward it at 0.06/frame. Nodes within **280 px** of pointer are pushed away by `26*(1 - d/280)^2` px. `pointerleave` clears the pointer and resets parallax to 0.
- Reduced motion: one frame rendered, no rAF loop, no pointer listeners.

### 2.2 Product-name marquee `Ae` (L49-72)
- All 23 product names (data order) rendered twice (`[...names, ...names]`), each followed by a `/` separator (`ml-10 text-border`), `eyebrow-mono` style, `gap-10`, `whitespace-nowrap`.
- `.animate-marquee` = `animation: 45s linear infinite marquee`; keyframes `translate(0) -> translate(-50%)` (styles.css ~L4730-4740). Moves leftward, seamless due to duplication. No pause-on-hover. Disabled under reduced motion. Container `overflow-hidden border-y py-4`.

### 2.3 Video section `Fe` (L688-833), used at L1040-1047
Props: `src "/hero-video.mp4"`, `poster "/hero-video-poster.jpg"` (also `<link rel=preload as=image>` in route head), eyebrow "02: Watch · 50 seconds", title "Peptides, in plain English.", description override.
- `<video playsInline preload="metadata" controls={started} controlsList="nodownload" class="h-full w-full object-cover">` in an `aspect-video` box (`rounded-2xl`, bg `oklch(0.18 0.05 250)`). **No autoplay, no loop, no `muted` attribute.**
- State: `playing` (false; synced from `play`/`pause` events), `muted` (false; synced from `volumechange`), `started` (false; true after first successful `play()`).
- Click handler (play/pause toggle): if paused -> set `muted=false`, `play()`; on success `started=true`; if rejected (autoplay policy) -> retry muted, then `started=true`. If playing -> `pause()`.
- Overlays:
  - Before start: full-cover button `aria-label="Play video"`, dim overlay `bg-[oklch(0.14_0.05_250/0.35)]` -> hover `/0.25`; centered 80px white circle with `play` icon, `group-hover:scale-105`.
  - After start & paused: bottom-right 40px round button `aria-label="Resume"`; it shows the **`pause` icon** (not play), as in the bundle (L795-804).
  - After start & muted: top-right pill `aria-label="Unmute"` with `volume-x` icon + "Tap to unmute"; toggles `video.muted`.
  - After start & unmuted: top-right 40px round button `aria-label="Mute"` with `volume-2` icon.
  - Once started, native controls are also shown.

### 2.4 Stats with count-up `_e` / `Ee` / `Re` (L73-129)
- Data `Me`: `99 "%+" "Purity, every peptide"`, `23 "" "Peptides we cover"` (hard-coded, not derived from data), `1 "" "Real human, every call"`, `24 "h" "Reply window"`.
- `useReveal` on the section; when revealed, each number counts **0 -> value over 1600 ms**, easing ease-out cubic `1 - (1-t)^3`, `Math.round` each rAF frame. Runs once (ref guard). Reduced motion -> jumps to final value. SSR snapshot shows intermediate values ("32%+", "7", "0", "8h"; home.txt L76-82).
- Layout `grid-cols-2 md:grid-cols-4`, numbers `font-display text-5xl md:text-7xl tabular-nums`.

### 2.5 "03: What we do" `Le` (L130-208)
Heading in Reveal: "Research support, *not* personal advice." (`not` in `text-accent`). `<dl>` of 4 rows (`Ce`: What we do / What we don't do / Quality you can verify / Not a pharmacy), each Reveal `delay i*80`. No interactivity.

### 2.6 "04: What people ask about" (L1050-1155)
- Header Reveal + link "Ask us anything" -> `/contact` (Reveal delay 120; `hover:border-foreground`).
- Two cards (Reveal delay `i*120`): `wellness-longevity` and `performance-recovery`, eyebrow "01 / 02", "02 / 02", title = category label, blurb. Card `hover:bg-secondary`.
- Each lists the **first 4 products of that category in data order**: wellness = GLP 1, MOTS C, Semaglutide, Tirzepatide; performance = BPC 157, TB 500, BPC 157 / TB 500 Blend, CJC 1295. Each row is a `<Link to="/products/$slug">`, name + arrow-up-right; `group/row` hover: arrow nudges up-right and darkens.

### 2.7 CTA band (L1156-1247)
Rounded box, `background: var(--gradient-cta)`, two blurred radial glow blobs (decorative). Eyebrow "05: Get in touch", h2 "Have a question? *Ask a real person.*". Buttons:
- "Reach out" -> `/contact`: white pill, `hover:bg-white/95 hover:scale-[1.02] active:scale-100 transition-all`.
- "I'm new to peptides" -> `/new-customer`: outline pill, `hover:bg-white/10 hover:border-white`.
No Reveal wrappers on this band.

---

## 3. Catalog `/products/` (`products.index-BTYfMVMH.js`, route app-routes.js ~L1199-1262)

### URL search params (validateSearch, app-routes ~L1204-1211)
`q: string = ""`, `cat: "all" | "wellness-longevity" | "performance-recovery" = "all"`, `sort: "name" | "category" = "name"`. Invalid values fall back to defaults (`pl(..., default)` wrapper). All filter state lives in the URL; updates via `navigate({ search: prev => ({...prev, ...patch}) })` (L29-33). No `replace` flag is passed, so with TanStack defaults each keystroke likely pushes a history entry (not verified at runtime).

### Filtering / sorting (useMemo L34-62)
- Query normalized: `q.trim().toLowerCase()`. Case-insensitive **substring** match (`includes`) against one space-joined, lowercased string of: `name`, `tagline`, `summary`, `researchAreas.join(" ")`, `spec.cas`, `spec.molecularFormula`. NOT matched: slug, mechanism, sequence, molecular weight, category label, references.
- Because fields are joined with spaces, a query can match across field boundaries.
- CAS numbers in data use spaces instead of hyphens (e.g. `"137525 51 0"`), so searching a standard hyphenated CAS (`137525-51-0`) will **not** match.
- Category filter applied before search (`cat !== "all" && category !== cat` excluded).
- Sort `name`: `name.localeCompare`. Sort `category`: by category key string (so `performance-recovery` before `wellness-longevity`), then name. No direction toggle.

### UI elements
- PageHero: eyebrow "04: Catalog", meta `${23} peptides · Plain language`, title "What people" / muted "<OrangeWord>ask</OrangeWord> about.", description.
- Ask Dr. Peptide card (Reveal), label "Not sure where to start? Ask Dr. Peptide which peptide fits your goal." -> dispatches `drp:open`.
- Search input (`type="search"`, `aria-label="Search catalog"`, placeholder "Search by name, CAS, formula, or area…"): underline style `rounded-none border-x-0 border-t-0 border-b`, `focus-visible:border-foreground`, no ring. Left `search` icon. Updates `q` on every change (no debounce).
- Clear button (`x` icon, `aria-label="Clear search"`) shown only when `q` non-empty; sets `q=""`.
- Sort: label "Sort" + `role="group" aria-label="Sort catalog"` with two buttons "Name (A to Z)" / "Category", `aria-pressed`; active `text-foreground`, inactive `text-muted-foreground hover:text-foreground`. (The label's `htmlFor="sort"` points at the div.)
- Category chips: "All peptides", "Wellness & Longevity", "Performance & Recovery" (no `type` attr, no aria-pressed). Active `bg-foreground text-background border-foreground`; inactive `border-border text-muted-foreground hover:border-foreground hover:text-foreground`.
- Result counter `{filtered} / {23}`, `aria-live="polite"`, tabular-nums.
- Empty state: "No peptides match your filters." + hint + "Reset filters" button -> `{ q:"", cat:"all", sort:"name" }`.
- Grid (`md:grid-cols-2 lg:grid-cols-3`, 1px hairline gaps via `gap-px bg-border`): each card is a Reveal with `delay (index % 6) * 50` around a `<Link to="/products/$slug">`, `hover:bg-secondary`.
  - Eyebrow `NN · Category label` where NN is the 1-based position **in the filtered list** (renumbers after filtering).
  - 80px vial image `spec.productImage ?? "/products/generic-vial.webp"`, `loading="lazy"`, alt `"{name} vial"`; h3 name.
  - Tagline `line-clamp-3`.
  - COA badge if `spec.coas.length > 0`: orange dot + "COA · {coas[0].purity}".
  - Footer "Read more" + arrow-up-right (hover: darkens, nudges up-right).
- Hidden `<h2 class="sr-only">Peptide catalog</h2>`.

### Route head
Title `Peptide Catalog (23): Socal Bioresearch`, description/og with count, canonical `https://socalbioresearch.org/products`, og image `/og/og-products.jpg` 1200x630, JSON-LD `ItemList` of all products with URLs.

---

## 4. Product detail `/products/$slug`

### Route (app-routes.js ~L1455-1558)
- `loader`: `peptide = products.find(slug)`; if missing `throw notFound()`. Returns `{ peptide, spec: specs[slug] ?? {} }`.
- `head`: title `{name}: Socal Bioresearch`; description `"{name}: {tagline}".slice(0,155)`; og:description = summary; `og:type product`; og:url/canonical `https://socalbioresearch.org/products/{slug}`; og image `/og/og-products.jpg`; JSON-LD `Product` (brand "Socal Bioresearch", `additionalProperty` Purity + CAS/MW/Formula when present) and `BreadcrumbList` (Home / Catalog / name). Missing product -> title "Product not found".
- `notFoundComponent` (`products._slug-h3Hh6hlK.js`): "Not found." / "This catalog entry doesn't exist." + shadcn Button (`asChild`, default variant `bg-primary ... hover:bg-primary/90`) wrapping Link "Back to catalog" -> `/products`.
- `errorComponent` (`products._slug-CRNe-6WC.js`): "Something went wrong." + `error.message`.

### Component (`products._slug-BYY0A6vj.js`)
- Hero (L41-106, `-mt-20 pt-32 md:pt-40`): Reveals with delays 0 / 120 / 200 / 300 / 380:
  breadcrumb nav (`aria-label="Breadcrumb"`; Links "Home" -> `/`, "Catalog" -> `/products`, `chevron-right` separators, current name), category eyebrow, h1 name (`clamp(2.75rem,8vw,6.5rem)`), tagline, Ask Dr. Peptide card with label `Have a question about {name}? Ask Dr. Peptide.`.
- Main column (md:col-span-8), each section a Reveal:
  - "01: Overview" -> `summary` (delay 0).
  - "02: How it works" -> `mechanism` (delay 100).
  - "03: Sequence" -> `<code>` `spec.sequence`, `break-all` (delay 150; only if sequence exists).
  - "04: Common areas" -> `researchAreas` in a 1px-gap grid (`sm:grid-cols-2`) (delay 200).
  - "05: References" (delay 280; if any): note "References provided for context. Not personal guidance."; each row is `<a href target="_blank" rel="noopener noreferrer">` with `R01`, title, `source · year`, `external-link` icon; row `hover:bg-secondary`, icon `group-hover:text-foreground`.
  - "06: Certificates of Analysis" (delay 320; if `spec.coas`): note "Independent third party HPLC / LC MS purity testing by Freedom Diagnostics."; `sm:grid-cols-2` cards, each `<a href={coa.image} target="_blank">` (opens the raw .webp in a new tab, no lightbox), `aspect-[3/4]` lazy img `object-contain`, label, "Purity {purity}", external-link icon; `hover:bg-secondary`.
  - Section numbers are fixed strings, so numbering skips when a section is absent.
- Aside (Reveal delay 150, md:col-span-4):
  - Vial image if `spec.productImage` (`max-h-72`, lazy). No generic fallback here (unlike catalog).
  - "Specifications" `<dl>`: Purity (`peptide.purity`), CAS Number*, Molecular Weight*, Molecular Formula* (*only if present, mono font), Form (`spec.form ?? "Lyophilized"`), Storage (`spec.storage ?? "−20°C, desiccated"`), Category label. No spec defines form/storage, so all pages show the defaults.
  - "Have a question?" text + Link "Ask about {name}" -> `/contact?type=catalog&product={name}` (search params), `hover:opacity-70`, arrow hover nudge.
  - "Need clarity?" static text.
- "07: Related" (L455-529): up to 3 other products **in the same category, first in data order** (excluding self), Reveal delay `i*80`, Link cards with `NN · Category`, name, tagline, "View" + arrow; `hover:bg-secondary`. Heading block uses two `<h2>`s.

---

## 5. Research / Common questions `/research` (`research-BCFhuWQw.js`; data app-routes ~L255-280; head ~L286-300)
- PageHero: eyebrow "02: Common questions", meta "Plain English · No hype", title "The questions" / "people <OrangeWord>actually</OrangeWord> ask.".
- **Accordion = native `<details>/<summary>`** (L23-75), 6 items (`f` array of `{q,a}`): "What is a peptide, in plain English?", "Why are people talking about them now?", "Are peptides legal?", "What do scientists say about peptide research safety?", "What's the difference between wellness, longevity, and recovery peptides?", "I'm just curious. What should I do?".
  - All closed initially; multiple can be open at once (no state, no exclusivity).
  - Summary row: `NN` number, h2 question, "+" glyph that rotates 45deg when open (`transition-transform group-open:rotate-45`, Tailwind default 150ms). Default marker hidden. No height animation on the answer.
  - Each `<li>` is a Reveal (`as:"li"`) with delay `(i % 4) * 60`.
- "03: Still curious" block: "Didn't find your question?" + Link "Ask your question" -> `/contact`.
- Head: title "Common questions about peptides: Socal Bioresearch".

## 6. About `/about` (`about-DJCnDEjv.js`)
- PageHero: eyebrow "01: About", meta "Honest answers · No pressure", title "A real team." / "Real <OrangeWord>answers</OrangeWord>.".
- "02: How we think": heading Reveal + `<dl>` of 3 items (01 Why we exist / 02 Who we are / 03 What we won't do), Reveal delay `i*80`. Static.
- "03: Talk to us": Links "Reach out" -> `/contact` (`hover:opacity-70`) and "Common questions" -> `/research` (muted, `hover:text-foreground hover:border-foreground`), arrow-up-right with hover nudge.

---

## 7. Product data shape (app-routes.js)
- Category labels `kw` (~L561-564): `wellness-longevity` -> "Wellness & Longevity", `performance-recovery` -> "Performance & Recovery".
- Products `$i` (~L565-1197), 23 entries: `{ slug, name, category, tagline, summary, mechanism, researchAreas: string[3], purity: string, references: [{ title, source, year, url }] }`. Every product has exactly 2 references. Purity strings: "≥98% by HPLC" for all except BPC 157, NAD+, GHK Cu ("≥99% by HPLC"). Names use spaces, not hyphens ("GLP 1", "BPC 157").
- Specs `Zw` (~L1263-1454), keyed by slug, all optional: `{ cas, molecularWeight, molecularFormula, sequence, productImage, coas: [{ label, purity, image }] }` (`form`/`storage` supported by UI but never set).
- Slugs in data order (W = wellness, P = performance):
  glp-1 W, mots-c W, bpc-157 P, tb-500 P, bpc-157-tb-500-blend P, semaglutide W, tirzepatide W, retatrutide W, cagrilintide W, nad-plus W, glutathione W, epitalon W, thymosin-alpha-1 W, selank W, semax W, pt-141 W, melanotan-ii W, cjc-1295 P, ipamorelin P, sermorelin P, tesamorelin P, ghk-cu P, aod-9604 P. (14 W, 9 P.)
- Product images (7): bpc-157-tb-500-blend, tirzepatide, retatrutide, glutathione, semax, ipamorelin, sermorelin (`/products/{slug}.webp`). Others use `/products/generic-vial.webp` in the catalog and show no image on detail.
- COAs (5 products, 6 certificates, `/coa/*.webp`): blend "BPC 157 / TB 500 10/10 mg" 99.29%; tirzepatide 20 mg 99.972% + 30 mg 99.817%; retatrutide 10 mg 99.941%; glutathione 1500 mg 99.486%; ipamorelin 10 mg 99.836%.
- Spec gaps: blend has no CAS/formula (MW is the text "Blend (BPC 157 + TB 500)", sequence is a placeholder sentence); retatrutide, cagrilintide, tesamorelin have no formula (sequence is descriptive text); nad-plus has no sequence (so no "03: Sequence" section).

## 8. External services / dependencies
- Google Fonts stylesheet (Inter Tight 300-700, Inter 400-700, JetBrains Mono 400-500) + preconnects (root head, app-routes ~L163-171).
- `google-site-verification` meta; Organization + WebSite JSON-LD in root head (~L104-125).
- `/api/dr-peptide` (site-own backend, streaming) behind the Ask Dr. Peptide button via `drp:open` event (SiteLayout).
- Outbound reference links (new tab): ncbi.nlm.nih.gov/pmc, pubmed.ncbi.nlm.nih.gov, nejm.org, thelancet.com, nature.com, frontiersin.org (+ "Cell Metabolism" source on a PubMed URL).
- Static assets served from site root: `/hero-video.mp4`, `/hero-video-poster.jpg`, `/products/*.webp`, `/coa/*.webp`, `/og/og-home.jpg`, `/og/og-products.jpg`. "Freedom Diagnostics" is mentioned as text only (no link/integration).
- No analytics, cart, or search API in these files; catalog search is purely client-side.

---


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
