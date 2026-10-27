# Design Audit: socalbioresearch.org

Every value in this document was read from the shipped CSS or measured in a browser. Nothing is estimated.

- **Stylesheet:** `/assets/styles-9bE31nz0.css`, the compiled Tailwind CSS v4 output from the live site.
- **Measurements:** computed styles sampled with Playwright at 1440px and 390px across 9 representative routes.

## 1. Design tokens (`:root`)

The site uses light mode only. The stylesheet includes a `.dark` token block from the shadcn template, but nothing ever activates it.

| Token | Hex (sRGB fallback) | Role |
|---|---|---|
| `--background` | `#fafafa` | Page background |
| `--foreground` | `#070e16` | Primary text, dark buttons |
| `--card` / `--popover` | `#ffffff` | Card surfaces |
| `--primary` | `#070e16` | Announcement bar (`bg-primary/95`), 404 button |
| `--primary-foreground` | `#fafafa` | Text on primary |
| `--primary-glow` | `#013658` | End color of `--gradient-primary` |
| `--secondary` / `--muted` | `#eff2f5` | Muted surfaces, assistant chat bubbles |
| `--muted-foreground` | `#3c434a` | Secondary text, inactive nav links |
| `--accent` | `#f37513` | Orange accent |
| `--accent-soft` | `#ffeedf` | Soft orange fill |
| `--destructive` | `#e40014` | Errors |
| `--border` / `--input` | `#e2e5e8` | All borders (`* { border-color: var(--color-border) }`) |
| `--ring` | `#070e16` | Focus rings |
| `--radius` | `0.5rem` | Base corner radius |
| `--color-orange-500` | `#fe6e00` | |

Browsers that support `lab()` get `lab()` versions of these colors. For example, `--accent` is `lab(64.0568% 46.0216 68.5908)`. The reconstruction copies both forms verbatim.

### Gradients and shadows

| Token | Value |
|---|---|
| `--gradient-hero` | `linear-gradient(180deg, #fafafa 0%, #eff2f5 100%)` |
| `--gradient-primary` | `linear-gradient(135deg, var(--primary), var(--primary-glow))` |
| `--gradient-sunset` | `linear-gradient(125deg, #031222 0%, #00355c 30%, #dc5500 70%, #ff973e 100%)` |
| `--gradient-cta` | `linear-gradient(120deg, #040e1a 0%, #002a4d 35%, #eb5b00 78%, #ffae64 100%)` |
| `--gradient-dark-hero` | `linear-gradient(135deg, #040a11 0%, #021322 100%)` |
| `--shadow-soft` | `0 1px 2px #070e160a, 0 4px 16px -8px #070e1614` |
| `--shadow-elegant` | `0 30px 80px -30px #070e1640` |
| `--shadow-glow` | `0 0 60px -10px #f3751359` |

### Brand colors hard-coded in components (oklch)

| Name | Value | Used for |
|---|---|---|
| Navy deep | `oklch(0.16 0.05 250)` | Dr. Peptide gradients, icon color |
| Brand blue | `oklch(0.22 0.07 248)` | Dr. Peptide gradients |
| Brand orange | `oklch(0.72 0.19 50)` | Dr. Peptide gradients, pulse dots, border of the nav pill |
| Orange word gradient | `linear-gradient(100deg, oklch(0.68 0.22 38) 0%, oklch(0.78 0.20 50) 38%, oklch(0.84 0.17 70) 70%, oklch(0.70 0.22 40) 100%)` | `<OrangeWord>` (see below) |
| Age-gate mark dot | `oklch(0.7 0.18 50)` | Dot in the age-gate logo mark |

`<OrangeWord>` renders text in italic Inter Tight Light. The gradient above is clipped to the text. Two drop-shadows create the halo: `drop-shadow(0 0 18px oklch(0.78 0.20 50 / 0.35)) drop-shadow(0 0 42px oklch(0.82 0.18 60 / 0.22))`.

## 2. Typography

| Role | Family | Source |
|---|---|---|
| Display: `h1`–`h4`, `.font-display` | **Inter Tight** 300/400/500/600/700. `h1`–`h4` default to `letter-spacing: -0.02em`. | Google Fonts |
| Body: `--font-sans` | **Inter** 400/500/600/700, with `-webkit-font-smoothing: antialiased` | Google Fonts |
| Mono: `--font-mono` | **JetBrains Mono** 400/500 | Google Fonts |

### Custom text classes

| Class | Definition |
|---|---|
| `.eyebrow-mono` | Mono, 0.75rem, weight 500, line-height 1.1, letter-spacing 0.18em, uppercase, `muted-foreground` |
| `.eyebrow` | Sans, 0.75rem, weight 600, line-height 1.1, letter-spacing 0.14em, uppercase, `foreground` |
| `.lead` | Sans, 1.125rem / 1.55; from 768px up, 1.25rem / 1.5; `foreground` |
| `.fine` | Sans, 0.875rem / 1.55, `muted-foreground` |
| `.hero-headline` | `padding-bottom: .12em; overflow: visible !important` |
| `.pop-word` | `isolation: isolate; z-index: 1; overflow: visible !important`, also applied to its children |

The type scale is the Tailwind v4 default, from `text-xs` (0.75rem) to `text-7xl` (4.5rem). Two line heights are customized: `--text-3xl--line-height: 1.2` and `--text-base--line-height: 1.5`.

### Computed text styles, desktop 1440px

Covers all sampled pages, largest text first.

| Family | Size | Weight | Line height | Letter spacing | Transform | Color | Uses | Example |
|---|---|---|---|---|---|---|---|---|
| Inter Tight | 152px | 500 | 155.04px | -6.84px | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `h1` "Peptides,complicatedhyped simply." |
| Inter Tight | 152px | 300 | 179.36px | -6.84px | none italic | `lab(3.66811 -0.860922 -5.02954)` | 1 | `span` "complicated" |
| Inter Tight | 152px | 300 | 179.36px | -6.84px | none italic | `oklch(0.55 0.02 250)` | 1 | `span` "hyped" |
| Inter Tight | 112px | 500 | 132.16px | -4.48px | none | `lab(3.66811 -0.860922 -5.02954)` | 7 | `span` "What people" |
| Inter Tight | 112px | 500 | 132.16px | -4.48px | none | `lab(28.0607 -1.50979 -5.29136)` | 7 | `span` "ask about." |
| Inter Tight | 112px | 300 | 132.16px | -4.48px | none italic | `rgba(0, 0, 0, 0)` | 5 | `span` "ask" |
| Inter Tight | 104px | 500 | 101.92px | -4.16px | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `h1` "Tirzepatide" |
| Inter Tight | 72px | 500 | 72px | -2.88px | none | `lab(3.66811 -0.860922 -5.02954)` | 4 | `div` "99%+" |
| Inter Tight | 60px | 500 | 61.2px | -2.4px | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `h2` "Two things people are curious about." |
| Inter Tight | 60px | 500 | 61.2px | -2.4px | none | `rgb(255, 255, 255)` | 1 | `h2` "Have a question? Ask a real person." |
| Inter Tight | 60px | 300 | 61.2px | -2.4px | none italic | `oklab(0.999994 0.0000455678 0.0000200868 / 0.95)` | 1 | `span` "Ask a real person." |
| Inter Tight | 48px | 500 | 50.4px | -0.96px | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `h2` "Peptides, in plain English." |
| Inter Tight | 48px | 500 | 50.4px | -1.68px | none | `lab(3.66811 -0.860922 -5.02954)` | 4 | `h2` "Research support, not personal advice." |
| Inter Tight | 48px | 500 | 50.4px | -1.68px | none | `lab(64.0568 46.0216 68.5908)` | 1 | `span` "not" |
| Inter Tight | 48px | 500 | 48px | -1.68px | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `h2` "Continue exploring." |
| Inter Tight | 36px | 500 | 40px | -1.08px | none | `lab(3.66811 -0.860922 -5.02954)` | 2 | `h3` "Wellness & Longevity" |
| Inter Tight | 30px | 500 | 34.5px | -0.75px | none | `lab(3.66811 -0.860922 -5.02954)` | 6 | `h2` "What is a peptide, in plain English?" |
| Inter Tight | 30px | 500 | 36px | -0.9px | none | `lab(3.66811 -0.860922 -5.02954)` | 5 | `h2` "Terms of Service" |
| Inter Tight | 28px | 500 | 30.8px | -0.7px | none | `lab(3.66811 -0.860922 -5.02954)` | 23 | `h3` "AOD 9604" |
| Inter Tight | 24px | 500 | 32px | -0.6px | none | `lab(3.66811 -0.860922 -5.02954)` | 3 | `h3` "GLP 1" |
| Inter | 20px | 400 | 32.5px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 2 | `p` "Dual GIP / GLP 1 agonist" |
| Inter | 20px | 400 | 28px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 6 | `span` "+" |
| Inter | 18px | 400 | 29.25px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 8 | `p` "You've heard the word everywhere. Here's" |
| Inter | 18px | 400 | 29.25px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 25 | `dd` "We help with research and help clients b" |
| Inter | 18px | 400 | 29.25px | normal | none | `oklab(0.999994 0.0000455678 0.0000200868 / 0.9)` | 1 | `p` "No pressure, no sales script. Tell us wh" |
| Inter Tight | 18px | 600 | 28px | -0.36px | none | `rgb(255, 255, 255)` | 9 | `h3` "Dr. Peptide" |
| Inter Tight | 18px | 600 | 28px | -0.45px | none | `rgb(255, 255, 255)` | 2 | `p` "Not sure where to start? Ask Dr. Peptide" |
| Inter | 16px | 400 | 24px | normal | none | `oklab(0.159999 -0.00684183 -0.0187894 / 0.7)` | 1 | `style` "@keyframes hp-active-ring {
            " |
| Inter | 16px | 400 | 26px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 7 | `p` "What a peptide actually is, why cells al" |
| Inter Tight | 16px | 400 | 24px | -0.32px | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `h2` "Peptide catalog" |
| JetBrains Mono | 16px | 400 | 26px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `code` "YAibEGTFTSDYSIYLDKIAQK(γE-C20 diacid)AFV" |
| Inter | 16px | 500 | 22px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 2 | `span` "Tirzepatide Once Weekly for research of " |
| Inter | 16px | 400 | 24px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 7 | `p` "Veronica Hollis" |
| Inter Tight | 15px | 600 | 22.5px | -0.3px | none | `lab(3.66811 -0.860922 -5.02954)` | 9 | `span` "Socal Bioresearch" |
| Inter Tight | 15px | 600 | 22.5px | -0.3px | none | `lab(28.0607 -1.50979 -5.29136)` | 9 | `span` "Bioresearch" |
| Inter | 15px | 500 | 22.5px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 13 | `span` "Talk to a real person" |
| Inter | 15px | 500 | 22.5px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 2 | `span` "What are peptides?" |
| Inter | 15px | 500 | 22.5px | normal | none | `rgb(1, 27, 53)` | 1 | `a` "Reach out" |
| Inter | 15px | 500 | 22.5px | normal | none | `rgb(255, 255, 255)` | 1 | `a` "I'm new to peptides" |
| Inter | 15px | 600 | 22.5px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `span` "Send your message" |
| Inter | 15px | 500 | 22.5px | normal | none | `lab(98.26 0 0)` | 1 | `span` "Send my details" |
| Inter | 14px | 500 | 20px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 45 | `a` "Catalog" |
| Inter | 14px | 500 | 20px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 29 | `a` "Ask us anything" |
| Inter | 14px | 400 | 22.75px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 44 | `p` "The peptides people are asking about for" |
| Inter | 14px | 400 | 20px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 56 | `a` "Catalog" |
| Inter | 14px | 400 | 20px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 25 | `a` "Privacy" |
| Inter | 14px | 600 | 17.5px | -0.35px | none | `rgb(255, 255, 255)` | 9 | `span` "Ask Dr. Peptide" |
| Inter | 14px | 400 | 22.75px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 10 | `div` "Hey: I'm Dr. Peptide. Ask me anything ab" |
| JetBrains Mono | 14px | 400 | 20px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 3 | `dd` "2023788 19 2" |
| Inter | 14px | 500 | 20px | normal | none | `lab(64.0568 46.0216 68.5908)` | 10 | `span` "*" |
| Inter | 13px | 500 | 19.5px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 71 | `a` "Catalog" |
| Inter | 13px | 500 | 19.5px | -0.325px | none | `lab(98.26 0 0)` | 1 | `button` "All peptides" |
| Inter | 13px | 500 | 19.5px | -0.325px | none | `lab(28.0607 -1.50979 -5.29136)` | 2 | `button` "Wellness & Longevity" |
| JetBrains Mono | 13px | 400 | 21.125px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 8 | `p` "By accessing or using the website, servi" |
| Inter | 12px | 400 | 16px | normal | none | `lab(98.26 0 0)` | 9 | `div` "Clear peptide education · Real support ·" |
| Inter | 12px | 500 | 18px | normal | none | `oklch(0.16 0.05 250)` | 18 | `button` "Ask Dr. Peptide" |
| JetBrains Mono | 12px | 500 | 13.2px | 2.16px | uppercase | `lab(28.0607 -1.50979 -5.29136)` | 184 | `span` "01: Curious about peptides?" |
| JetBrains Mono | 12px | 500 | 13.2px | 2.16px | uppercase | `lab(90.7162 -0.552952 -1.78909)` | 46 | `span` "/" |
| Inter | 12px | 500 | 16px | 2.64px | uppercase | `lab(64.0568 46.0216 68.5908)` | 1 | `p` "02: Watch · 50 seconds" |
| JetBrains Mono | 12px | 400 | 16px | 2.4px | uppercase | `lab(28.0607 -1.50979 -5.29136)` | 4 | `dt` "What we do" |
| JetBrains Mono | 12px | 500 | 16px | 2.16px | uppercase | `oklab(0.999994 0.0000455678 0.0000200868 / 0.85)` | 3 | `p` "05: Get in touch" |
| JetBrains Mono | 12px | 400 | 19.5px | 2.64px | uppercase | `lab(3.66811 -0.860922 -5.02954)` | 9 | `p` "Plain language peptide support" |
| Inter | 12px | 400 | 19.5px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 18 | `p` "Information on this site is educational " |
| JetBrains Mono | 12px | 500 | 16px | 2.16px | uppercase | `rgb(255, 255, 255)` | 9 | `p` "Free AI guide · Plain English" |
| JetBrains Mono | 12px | 500 | 13.2px | 2.16px | uppercase | `oklab(0.379998 -0.00513382 -0.0140859 / 0.5)` | 1 | `span` "/ 23" |
| JetBrains Mono | 12px | 500 | 13.2px | 2.16px | uppercase | `lab(3.66811 -0.860922 -5.02954)` | 1 | `span` "Tirzepatide" |
| Inter | 12px | 400 | 16px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 4 | `span` "NEJM · 2022" |
| JetBrains Mono | 12px | 500 | 13.2px | 2.16px | uppercase | `lab(64.0568 46.0216 68.5908)` | 6 | `span` "*" |
| Inter | 12px | 500 | 16px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 5 | `button` "I'm just curious" |
| Inter | 12px | 500 | 16px | normal | none | `lab(64.0568 46.0216 68.5908)` | 10 | `span` "Required" |
| JetBrains Mono | 12px | 500 | 16px | 2.16px | uppercase | `lab(3.66811 -0.860922 -5.02954)` | 8 | `p` "Formal clause" |
| Inter | 11px | 500 | 16.5px | normal | none | `rgb(255, 255, 255)` | 9 | `button` "Reset" |
| Inter | 10px | 400 | 12.5px | 1.6px | uppercase | `oklab(0.999994 0.0000455677 0.0000200868 / 0.8)` | 9 | `span` "Free · Plain English" |
| Inter | 10px | 400 | 15px | 1.8px | uppercase | `lab(28.0607 -1.50979 -5.29136)` | 9 | `p` "Educational only · Not personal advice" |
| Inter | 10px | 500 | 15px | 1.2px | uppercase | `lab(3.66811 -0.860922 -5.02954)` | 5 | `p` "COA · 99.29%" |
### Computed text styles, mobile 390px

| Family | Size | Weight | Line height | Letter spacing | Transform | Color | Uses | Example |
|---|---|---|---|---|---|---|---|---|
| Inter Tight | 52px | 500 | 53.04px | -2.34px | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `h1` "Peptides,complicatedhyped simply." |
| Inter Tight | 52px | 300 | 61.36px | -2.34px | none italic | `lab(3.66811 -0.860922 -5.02954)` | 1 | `span` "complicated" |
| Inter Tight | 52px | 300 | 61.36px | -2.34px | none italic | `oklch(0.55 0.02 250)` | 1 | `span` "hyped" |
| Inter Tight | 48px | 500 | 48px | -1.92px | none | `lab(3.66811 -0.860922 -5.02954)` | 4 | `div` "99%+" |
| Inter Tight | 44px | 500 | 51.92px | -1.76px | none | `lab(3.66811 -0.860922 -5.02954)` | 7 | `span` "What people" |
| Inter Tight | 44px | 500 | 51.92px | -1.76px | none | `lab(28.0607 -1.50979 -5.29136)` | 7 | `span` "ask about." |
| Inter Tight | 44px | 300 | 51.92px | -1.76px | none italic | `rgba(0, 0, 0, 0)` | 5 | `span` "ask" |
| Inter Tight | 44px | 500 | 43.12px | -1.76px | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `h1` "Tirzepatide" |
| Inter Tight | 36px | 500 | 37.8px | -1.26px | none | `lab(3.66811 -0.860922 -5.02954)` | 2 | `h2` "Research support, not personal advice." |
| Inter Tight | 36px | 500 | 37.8px | -1.26px | none | `lab(64.0568 46.0216 68.5908)` | 1 | `span` "not" |
| Inter Tight | 36px | 500 | 36.72px | -1.44px | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `h2` "Two things people are curious about." |
| Inter Tight | 36px | 500 | 36.72px | -1.44px | none | `rgb(255, 255, 255)` | 1 | `h2` "Have a question? Ask a real person." |
| Inter Tight | 36px | 300 | 36.72px | -1.44px | none italic | `oklab(0.999994 0.0000455678 0.0000200868 / 0.95)` | 1 | `span` "Ask a real person." |
| Inter Tight | 30px | 500 | 31.5px | -0.6px | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `h2` "Peptides, in plain English." |
| Inter Tight | 30px | 500 | 36px | -0.9px | none | `lab(3.66811 -0.860922 -5.02954)` | 2 | `h3` "Wellness & Longevity" |
| Inter Tight | 30px | 500 | 36px | -1.05px | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `h2` "Continue exploring." |
| Inter Tight | 30px | 500 | 31.5px | -1.05px | none | `lab(3.66811 -0.860922 -5.02954)` | 2 | `h2` "Didn't find your question?" |
| Inter Tight | 24px | 500 | 26.4px | -0.6px | none | `lab(3.66811 -0.860922 -5.02954)` | 23 | `h3` "AOD 9604" |
| Inter Tight | 24px | 500 | 32px | -0.6px | none | `lab(3.66811 -0.860922 -5.02954)` | 3 | `h3` "GLP 1" |
| Inter Tight | 24px | 500 | 27.6px | -0.6px | none | `lab(3.66811 -0.860922 -5.02954)` | 6 | `h2` "What is a peptide, in plain English?" |
| Inter Tight | 24px | 500 | 32px | -0.72px | none | `lab(3.66811 -0.860922 -5.02954)` | 5 | `h2` "Terms of Service" |
| Inter | 20px | 400 | 28px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 6 | `span` "+" |
| Inter Tight | 18px | 600 | 28px | -0.36px | none | `rgb(255, 255, 255)` | 9 | `h3` "Dr. Peptide" |
| Inter | 18px | 400 | 29.25px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 2 | `p` "Dual GIP / GLP 1 agonist" |
| Inter | 16px | 400 | 26px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 8 | `p` "You've heard the word everywhere. Here's" |
| Inter | 16px | 400 | 24px | normal | none | `oklab(0.159999 -0.00684183 -0.0187894 / 0.7)` | 1 | `style` "@keyframes hp-active-ring {
            " |
| Inter | 16px | 400 | 26px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 32 | `p` "What a peptide actually is, why cells al" |
| Inter | 16px | 400 | 26px | normal | none | `oklab(0.999994 0.0000455678 0.0000200868 / 0.9)` | 1 | `p` "No pressure, no sales script. Tell us wh" |
| Inter Tight | 16px | 600 | 24px | -0.4px | none | `rgb(255, 255, 255)` | 2 | `p` "Not sure where to start? Ask Dr. Peptide" |
| Inter Tight | 16px | 400 | 24px | -0.32px | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `h2` "Peptide catalog" |
| Inter | 16px | 400 | 24px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 7 | `p` "Veronica Hollis" |
| Inter Tight | 15px | 600 | 22.5px | -0.3px | none | `lab(3.66811 -0.860922 -5.02954)` | 9 | `span` "Socal Bioresearch" |
| Inter Tight | 15px | 600 | 22.5px | -0.3px | none | `lab(28.0607 -1.50979 -5.29136)` | 9 | `span` "Bioresearch" |
| Inter | 15px | 500 | 22.5px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 13 | `span` "Talk to a real person" |
| Inter | 15px | 500 | 22.5px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 2 | `span` "What are peptides?" |
| Inter | 15px | 500 | 22.5px | normal | none | `rgb(1, 27, 53)` | 1 | `a` "Reach out" |
| Inter | 15px | 500 | 22.5px | normal | none | `rgb(255, 255, 255)` | 1 | `a` "I'm new to peptides" |
| Inter | 15px | 600 | 22.5px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `span` "Send your message" |
| Inter | 15px | 500 | 22.5px | normal | none | `lab(98.26 0 0)` | 1 | `span` "Send my details" |
| Inter | 14px | 500 | 20px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 45 | `a` "Catalog" |
| Inter | 14px | 500 | 20px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 29 | `a` "Ask us anything" |
| Inter | 14px | 400 | 22.75px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 44 | `p` "The peptides people are asking about for" |
| Inter | 14px | 400 | 20px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 56 | `a` "Catalog" |
| Inter | 14px | 400 | 20px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 25 | `a` "Privacy" |
| Inter | 14px | 600 | 17.5px | -0.35px | none | `rgb(255, 255, 255)` | 9 | `span` "Ask Dr. Peptide" |
| Inter | 14px | 400 | 22.75px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 10 | `div` "Hey: I'm Dr. Peptide. Ask me anything ab" |
| JetBrains Mono | 14px | 400 | 22.75px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 1 | `code` "YAibEGTFTSDYSIYLDKIAQK(γE-C20 diacid)AFV" |
| Inter | 14px | 500 | 19.25px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 2 | `span` "Tirzepatide Once Weekly for research of " |
| JetBrains Mono | 14px | 400 | 20px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 3 | `dd` "2023788 19 2" |
| Inter | 14px | 500 | 20px | normal | none | `lab(64.0568 46.0216 68.5908)` | 10 | `span` "*" |
| Inter | 13px | 500 | 19.5px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 71 | `a` "Catalog" |
| Inter | 13px | 500 | 19.5px | -0.325px | none | `lab(98.26 0 0)` | 1 | `button` "All peptides" |
| Inter | 13px | 500 | 19.5px | -0.325px | none | `lab(28.0607 -1.50979 -5.29136)` | 2 | `button` "Wellness & Longevity" |
| Inter | 12px | 400 | 16px | normal | none | `lab(98.26 0 0)` | 9 | `div` "Clear peptide education · Real support ·" |
| Inter | 12px | 500 | 18px | normal | none | `oklch(0.16 0.05 250)` | 18 | `button` "Ask Dr. Peptide" |
| JetBrains Mono | 12px | 500 | 13.2px | 2.16px | uppercase | `lab(28.0607 -1.50979 -5.29136)` | 184 | `span` "01: Curious about peptides?" |
| JetBrains Mono | 12px | 500 | 13.2px | 2.16px | uppercase | `lab(90.7162 -0.552952 -1.78909)` | 46 | `span` "/" |
| Inter | 12px | 500 | 16px | 2.64px | uppercase | `lab(64.0568 46.0216 68.5908)` | 1 | `p` "02: Watch · 50 seconds" |
| JetBrains Mono | 12px | 400 | 16px | 2.4px | uppercase | `lab(28.0607 -1.50979 -5.29136)` | 4 | `dt` "What we do" |
| JetBrains Mono | 12px | 500 | 16px | 2.16px | uppercase | `oklab(0.999994 0.0000455678 0.0000200868 / 0.85)` | 3 | `p` "05: Get in touch" |
| JetBrains Mono | 12px | 400 | 19.5px | 2.64px | uppercase | `lab(3.66811 -0.860922 -5.02954)` | 9 | `p` "Plain language peptide support" |
| Inter | 12px | 400 | 19.5px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 18 | `p` "Information on this site is educational " |
| JetBrains Mono | 12px | 500 | 16px | 2.16px | uppercase | `rgb(255, 255, 255)` | 9 | `p` "Free AI guide · Plain English" |
| JetBrains Mono | 12px | 500 | 13.2px | 2.16px | uppercase | `oklab(0.379998 -0.00513382 -0.0140859 / 0.5)` | 1 | `span` "/ 23" |
| JetBrains Mono | 12px | 500 | 13.2px | 2.16px | uppercase | `lab(3.66811 -0.860922 -5.02954)` | 1 | `span` "Tirzepatide" |
| Inter | 12px | 400 | 16px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 4 | `span` "NEJM · 2022" |
| JetBrains Mono | 12px | 500 | 13.2px | 2.16px | uppercase | `lab(64.0568 46.0216 68.5908)` | 6 | `span` "*" |
| Inter | 12px | 500 | 16px | normal | none | `lab(3.66811 -0.860922 -5.02954)` | 5 | `button` "I'm just curious" |
| Inter | 12px | 500 | 16px | normal | none | `lab(64.0568 46.0216 68.5908)` | 10 | `span` "Required" |
| JetBrains Mono | 12px | 500 | 16px | 2.16px | uppercase | `lab(3.66811 -0.860922 -5.02954)` | 8 | `p` "Formal clause" |
| JetBrains Mono | 12px | 400 | 19.5px | normal | none | `lab(28.0607 -1.50979 -5.29136)` | 8 | `p` "By accessing or using the website, servi" |
| Inter | 11px | 500 | 16.5px | normal | none | `rgb(255, 255, 255)` | 9 | `button` "Reset" |
| Inter | 10px | 400 | 12.5px | 1.6px | uppercase | `oklab(0.999994 0.0000455677 0.0000200868 / 0.8)` | 9 | `span` "Free · Plain English" |
| Inter | 10px | 400 | 15px | 1.8px | uppercase | `lab(28.0607 -1.50979 -5.29136)` | 9 | `p` "Educational only · Not personal advice" |
| Inter | 10px | 500 | 15px | 1.2px | uppercase | `lab(3.66811 -0.860922 -5.02954)` | 5 | `p` "COA · 99.29%" |
## 3. Layout and spacing

- **Breakpoints:** Tailwind v4 defaults: `sm` 40rem (640px), `md` 48rem (768px), `lg` 64rem (1024px), `xl` 80rem, `2xl` 96rem. One raw `@media (min-width:768px)` exists, used only by `.lead`.
- **Main container:** `mx-auto max-w-7xl px-4 md:px-6`. Content is at most 1280px wide, with 16px gutters on mobile and 24px from 768px up. The header, the footer and every section use it.
- **Header:**
  - Sticky. 80px tall (`h-20`) at the top of the page.
  - Once `scrollY > 24`, it shrinks to 56px (`h-14`) and gains `border-b bg-background/85 backdrop-blur-xl`.
  - Logo is 36×36 (`h-9 w-9`), next to the "Socal **Bioresearch**" wordmark (15px, weight 600, `-0.02em`).
  - Desktop nav uses `gap-9` and 13px, weight-500 text. The active link gets a 1px underline 6px below it.
- **Announcement bar:** `bg-primary/95 text-primary-foreground text-xs text-center py-2 px-4`.
- **Footer:**
  - `mt-32 border-t`, inner padding `py-20`.
  - 12-column grid: brand `md:col-span-5`, Explore `md:col-start-7 md:col-span-3`, Legal `md:col-span-3`.
  - Bottom block below the grid: `mt-20 pt-8 border-t`.
- **Spacing unit:** `--spacing: 0.25rem`.
- **Corners:**
  - Square (radius 0): most marketing surfaces, cards, primary buttons and the age-gate card.
  - Rounded: the Dr. Peptide widget (`rounded-2xl` / `rounded-full`), pills, and form inputs (`rounded-md`).

### Section metrics @1440 (measured)

**/@1440**

| Element | Size | Padding | Background |
|---|---|---|---|
| `header.sticky.top-0.z-40.w-full.transition-all.duration-300` | 1440×80 | 0px | rgba(0, 0, 0, 0) |
| `section.relative.isolate.-mt-20.min-h-[100vh].overflow-visible.bg-background` | 1440×1545 | 0px | lab(98.26 0 0) |
| `div.relative.overflow-hidden.border-y.border-border.bg-background.py-4` | 1440×47 | 16px 0px | lab(98.26 0 0) |
| `section.mx-auto.max-w-7xl.px-4.md:px-6.py-20.md:py-28` | 1280×616 | 112px 24px | rgba(0, 0, 0, 0) |
| `section.border-t.border-border.bg-background` | 1440×322 | 0px | lab(98.26 0 0) |
| `section.border-t.border-border` | 1440×840 | 0px | rgba(0, 0, 0, 0) |
| `section.border-t.border-border.bg-background` | 1440×915 | 0px | lab(98.26 0 0) |
| `section.px-4.md:px-6.pb-24` | 1440×601 | 0px 24px 96px | rgba(0, 0, 0, 0) |
| `footer.mt-32.border-t.border-border.bg-background.text-foreground` | 1440×545 | 0px | lab(98.26 0 0) |

**/products@1440**

| Element | Size | Padding | Background |
|---|---|---|---|
| `header.sticky.top-0.z-40.w-full.transition-all.duration-300` | 1440×80 | 0px | rgba(0, 0, 0, 0) |
| `section.relative.isolate.-mt-20.overflow-visible.bg-background.text-foreground` | 1440×844 | 0px | lab(98.26 0 0) |
| `section.border-t.border-border` | 1440×2858 | 0px | rgba(0, 0, 0, 0) |
| `footer.mt-32.border-t.border-border.bg-background.text-foreground` | 1440×545 | 0px | lab(98.26 0 0) |

**/products/tirzepatide@1440**

| Element | Size | Padding | Background |
|---|---|---|---|
| `header.sticky.top-0.z-40.w-full.transition-all.duration-300` | 1440×80 | 0px | rgba(0, 0, 0, 0) |
| `section.relative.-mt-20.bg-background.text-foreground` | 1440×631 | 0px | lab(98.26 0 0) |
| `section.border-t.border-border` | 1440×2555 | 0px | rgba(0, 0, 0, 0) |
| `section.` | 795×102 | 0px | rgba(0, 0, 0, 0) |
| `section.border-t.border-border.pt-12` | 795×145 | 48px 0px 0px | rgba(0, 0, 0, 0) |
| `section.border-t.border-border.pt-12` | 795×112 | 48px 0px 0px | rgba(0, 0, 0, 0) |
| `section.border-t.border-border.pt-12` | 795×140 | 48px 0px 0px | rgba(0, 0, 0, 0) |
| `section.border-t.border-border.pt-12` | 795×297 | 48px 0px 0px | rgba(0, 0, 0, 0) |
| `section.border-t.border-border.pt-12` | 795×686 | 48px 0px 0px | rgba(0, 0, 0, 0) |
| `section.mt-28.pt-16.border-t.border-border` | 1232×416 | 64px 0px 0px | rgba(0, 0, 0, 0) |
| `footer.mt-32.border-t.border-border.bg-background.text-foreground` | 1440×545 | 0px | lab(98.26 0 0) |

**/research@1440**

| Element | Size | Padding | Background |
|---|---|---|---|
| `header.sticky.top-0.z-40.w-full.transition-all.duration-300` | 1440×80 | 0px | rgba(0, 0, 0, 0) |
| `section.relative.isolate.-mt-20.overflow-visible.bg-background.text-foreground` | 1440×844 | 0px | lab(98.26 0 0) |
| `section.border-t.border-border` | 1440×919 | 0px | rgba(0, 0, 0, 0) |
| `section.border-t.border-border` | 1440×395 | 0px | rgba(0, 0, 0, 0) |
| `footer.mt-32.border-t.border-border.bg-background.text-foreground` | 1440×545 | 0px | lab(98.26 0 0) |

**/about@1440**

| Element | Size | Padding | Background |
|---|---|---|---|
| `header.sticky.top-0.z-40.w-full.transition-all.duration-300` | 1440×80 | 0px | rgba(0, 0, 0, 0) |
| `section.relative.isolate.-mt-20.overflow-visible.bg-background.text-foreground` | 1440×844 | 0px | lab(98.26 0 0) |
| `section.border-t.border-border` | 1440×831 | 0px | rgba(0, 0, 0, 0) |
| `section.border-t.border-border` | 1440×313 | 0px | rgba(0, 0, 0, 0) |
| `footer.mt-32.border-t.border-border.bg-background.text-foreground` | 1440×545 | 0px | lab(98.26 0 0) |

**/contact@1440**

| Element | Size | Padding | Background |
|---|---|---|---|
| `header.sticky.top-0.z-40.w-full.transition-all.duration-300` | 1440×80 | 0px | rgba(0, 0, 0, 0) |
| `section.relative.isolate.-mt-20.overflow-visible.bg-background.text-foreground` | 1440×815 | 0px | lab(98.26 0 0) |
| `section.border-t.border-border` | 1440×915 | 0px | rgba(0, 0, 0, 0) |
| `footer.mt-32.border-t.border-border.bg-background.text-foreground` | 1440×545 | 0px | lab(98.26 0 0) |

**/new-customer@1440**

| Element | Size | Padding | Background |
|---|---|---|---|
| `header.sticky.top-0.z-40.w-full.transition-all.duration-300` | 1440×80 | 0px | rgba(0, 0, 0, 0) |
| `section.relative.isolate.-mt-20.overflow-visible.bg-background.text-foreground` | 1440×815 | 0px | lab(98.26 0 0) |
| `section.border-t.border-border` | 1440×1825 | 0px | rgba(0, 0, 0, 0) |
| `footer.mt-32.border-t.border-border.bg-background.text-foreground` | 1440×545 | 0px | lab(98.26 0 0) |

**/legal@1440**

| Element | Size | Padding | Background |
|---|---|---|---|
| `header.sticky.top-0.z-40.w-full.transition-all.duration-300` | 1440×80 | 0px | rgba(0, 0, 0, 0) |
| `section.relative.isolate.-mt-20.overflow-visible.bg-background.text-foreground` | 1440×876 | 0px | lab(98.26 0 0) |
| `section.border-t.border-border.bg-background` | 1440×848 | 0px | lab(98.26 0 0) |
| `footer.mt-32.border-t.border-border.bg-background.text-foreground` | 1440×545 | 0px | lab(98.26 0 0) |

**/legal/terms@1440**

| Element | Size | Padding | Background |
|---|---|---|---|
| `header.sticky.top-0.z-40.w-full.transition-all.duration-300` | 1440×80 | 0px | rgba(0, 0, 0, 0) |
| `section.relative.isolate.-mt-20.overflow-visible.bg-background.text-foreground` | 1440×847 | 0px | lab(98.26 0 0) |
| `section.border-t.border-border` | 1440×3194 | 0px | rgba(0, 0, 0, 0) |
| `a.fixed.bottom-6.left-6.z-40.inline-flex.items-center` | 148×42 | 10px 16px | oklab(0.984998 -0.00000956655 0.0000230074 / 0.95) |
| `footer.mt-32.border-t.border-border.bg-background.text-foreground` | 1440×545 | 0px | lab(98.26 0 0) |

## 4. Buttons and interactive surfaces (measured @1440)

| Page | Label | Size | Background | Color | Border | Radius | Font | Padding |
|---|---|---|---|---|---|---|---|---|
| / | Ask Dr. Peptide | 128×32 | rgb(255, 255, 255) | oklch(0.16 0.05 250) | 1px solid oklch(0.72 0.19 50) | 3.35544e+07px | 12px 500 | 6px 12px |
| / | Talk to a real person | 368×36 | rgba(0, 0, 0, 0) | lab(3.66811 -0.860922 -5.02954) |  | 0px | 15px 500 | 0px 0px 12px |
| / | Ask us anything | 131×25 | rgba(0, 0, 0, 0) | lab(3.66811 -0.860922 -5.02954) |  | 0px | 14px 500 | 0px 0px 4px |
| / | Reach out | 156×53 | rgb(255, 255, 255) | rgb(1, 27, 53) | 0px solid lab(90.7162 -0.552952 -1.78909) | 3.35544e+07px | 15px 500 | 14px 28px |
| / | I'm new to peptides | 227×53 | rgba(0, 0, 0, 0) | rgb(255, 255, 255) | 1px solid oklab(0.999994 0.0000455677 0.0000200868 / 0.6) | 3.35544e+07px | 15px 500 | 14px 28px |
| / | Ask Dr. Peptide FREE · PLAIN ENGLISH | 220×56 | linear-gradient(135deg, oklch(0.16 0.05 250) 0%, o… | rgb(255, 255, 255) | 0px solid lab(90.7162 -0.552952 -1.78909) | 3.35544e+07px | 16px 400 | 8px 20px 8px 8px |
| / | Reset | 43×23 | rgba(0, 0, 0, 0) | rgb(255, 255, 255) | 0px solid lab(90.7162 -0.552952 -1.78909) | 6px | 11px 500 | 4px 8px |
| /products | FREE AI GUIDE · INSTANT ANSWERS  Not sur | 1232×98 | linear-gradient(125deg, oklch(0.16 0.05 250) 0%, o… | rgb(255, 255, 255) | 1px solid oklab(0.999994 0.0000455678 0.0000200868 / 0.1) | 16px | 16px 400 | 24px |
| /products | Name (A to Z) | 116×43 | rgba(0, 0, 0, 0) | lab(3.66811 -0.860922 -5.02954) | 0px solid lab(90.7162 -0.552952 -1.78909) | 0px | 14px 400 | 0px 12px |
| /products | All peptides | 103×38 | lab(3.66811 -0.860922 -5.02954) | lab(98.26 0 0) | 1px solid lab(3.66811 -0.860922 -5.02954) | 0px | 13px 500 | 8px 16px |
| /products | Wellness & Longevity | 160×38 | lab(98.26 0 0) | lab(28.0607 -1.50979 -5.29136) | 1px solid lab(90.7162 -0.552952 -1.78909) | 0px | 13px 500 | 8px 16px |
| /products | Back to home | 149×42 | oklab(0.984998 -0.00000956655 0.0000230074 / 0.95) | lab(3.66811 -0.860922 -5.02954) | 1px solid lab(90.7162 -0.552952 -1.78909) | 3.35544e+07px | 14px 500 | 10px 16px |
| /contact | I'm just curious | 114×34 | lab(98.26 0 0) | lab(3.66811 -0.860922 -5.02954) | 1px solid lab(90.7162 -0.552952 -1.78909) | 0px | 12px 500 | 8px 12px |
| /contact | Send your message | 231×48 | lab(64.0568 46.0216 68.5908) | lab(3.66811 -0.860922 -5.02954) | 0px solid lab(90.7162 -0.552952 -1.78909) | 0px | 15px 600 | 12px 20px |
| /new-customer | Send my details | 206×48 | lab(3.66811 -0.860922 -5.02954) | lab(98.26 0 0) | 0px solid lab(90.7162 -0.552952 -1.78909) | 6px | 15px 500 | 0px 32px |
| /legal | BACK TO HOME | 134×14 | rgba(0, 0, 0, 0) | lab(28.0607 -1.50979 -5.29136) | 0px solid lab(90.7162 -0.552952 -1.78909) | 0px | 12px 500 | 0px |

## 5. Background treatments, effects and motion

- **Hero (home):** 16:9 video `/hero-video.mp4` (1920×1080, 50.4 s, poster `/hero-video-poster.jpg`).
  - No autoplay, no loop, and the video does not start muted.
  - It has custom play/pause and mute controls. Details are in `interaction-audit.md`.
- **Hero headline word cycle:**
  - The word runs through "complicated" → "confusing" → "hyped" → "explained" once, then stops.
  - Timing: 600ms start delay, 700ms hold per word, 380ms transition.
  - The final word renders with the orange gradient. Settled state: **"Peptides, explained simply."**
- **Hero molecule:** a 15-node SVG animated every frame.
  - Idle motion is springy.
  - Nodes push away from the pointer within 280px (fine pointer only), with a slight parallax.
- **Marquee:** product-name ticker.
  - Uses `.animate-marquee`: `45s linear infinite`, translateX 0 → -50%.
  - The list is rendered twice so the loop is seamless.
- **Stats count-up:**
  - Values: 99%+ / 23 / 1 / 24h.
  - Each counts from 0 over 1600ms with ease-out cubic, triggered when scrolled into view.
- **Keyframes shipped:**
  - `float-slow` (8s), `float-slower` (11s)
  - `orbit-spin` (28s), `orbit-spin-rev` (36s)
  - `pulse-soft` (4s; opacity .6→1, scale 1→1.06)
  - `draw-line` (3s stroke dash)
  - `hero-rise` (.8s; translateY 24px→0)
  - `drp-ring-pulse` (2.6s), `drp-bubble-in` (.45s)
  - `marquee` (45s)
  - From tw-animate-css: `enter`, `exit`, `accordion-*`
- **Reveal-on-scroll:** the `<Reveal>` wrapper.
  - Transition: `transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]`, from `opacity-0 translate-y-6` to `opacity-100 translate-y-0`.
  - Triggered by an IntersectionObserver with `rootMargin: 0px 0px -10% 0px`.
  - Reveals immediately if the block is already in the viewport at load.
  - A 1.5s fallback timer reveals everything regardless of scroll.
  - Its `delay` prop sets `transition-delay`.
- **Glass:** `.glass` is `backdrop-filter: blur(20px) saturate(140%)`, `background: #ffffff0f`, border `1px solid #ffffff1f`.
- **Gradient border:** `.gradient-border:before` is a 1px masked blue→orange gradient ring that fades in on hover (`opacity .4s`).
- **Reduced motion:** under `@media (prefers-reduced-motion: reduce)`:
  - All transitions and animations drop to 0.01ms.
  - Every custom animation class is set to `animation: none`.
  - `<Reveal>` shows content immediately.

## 6. Brand assets

- **Logo:** `/logo.png`, a 1 MB raster rendered at 36×36. A vector `favicon.svg` also exists.
- **Age gate:** uses a different, simpler inline SVG mark (a wave line with an orange dot) and the wordmark "Socal Bio **Research**". The header says "Socal **Bioresearch**". The reconstruction keeps both as they are.

## 7. Copy and visual quirks preserved deliberately

These may look like mistakes, but the brief forbids rewriting copy, so they are reproduced exactly:

- **Grammar:** "why cells already makes them" and "cells already produces thousands of them".
- **Spacing:** colons used as em-dash substitutes throughout ("Hey: I'm Dr. Peptide").
- **Hyphens:** product names drop them ("GLP 1", "BPC 157", "CJC 1295").
- **CAS numbers:** stored with spaces, not hyphens (for example `137525 51 0`), so a hyphenated CAS search finds nothing. The catalog search keeps this behavior.
- **Defaults on every product page:** "Lyophilized" and "−20°C, desiccated". The data never sets per-product values, so all pages show these.
