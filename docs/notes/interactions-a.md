# Interactions A: Home, Catalog, Product Detail, Research, About, shared hero/reveal

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
