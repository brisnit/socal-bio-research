# Asset Inventory

All publicly served assets observed while crawling every route. "Preserved" means the file was downloaded byte-for-byte from the live site into `public/` of the new repo.

> **Rights note:** These assets were commissioned for the client's site. The client should confirm they own (or are licensed for) the logo, hero video, product photography, Certificates of Analysis, and OG images. Fonts are Google Fonts (SIL Open Font License) and icons are Lucide (ISC), both free to reuse.

| Path | Type | Bytes | Dimensions | Used on | Status |
|---|---|---|---|---|---|
| `/apple-touch-icon.png` | png | 3,592 | 180×180 | Browser icon | Preserved |
| `/coa/bpc-157-tb-500-blend.webp` | webp | 28,012 | 500×647 | /products/bpc-157-tb-500-blend | Preserved |
| `/coa/glutathione.webp` | webp | 28,524 | 500×647 | /products/glutathione | Preserved |
| `/coa/ipamorelin.webp` | webp | 28,052 | 500×647 | /products/ipamorelin | Preserved |
| `/coa/retatrutide.webp` | webp | 28,832 | 500×647 | /products/retatrutide | Removed (client request) |
| `/coa/tirzepatide-20mg.webp` | webp | 62,390 | 791×1024 | /products/tirzepatide | Preserved |
| `/coa/tirzepatide-30mg.webp` | webp | 52,906 | 750×971 | /products/tirzepatide | Preserved |
| `/favicon-16.png` | png | 407 | 16×16 | Browser icon | Preserved |
| `/favicon-32.png` | png | 850 | 32×32 | Browser icon | Preserved |
| `/favicon.ico` | ico | 2,642 | — | Browser icon | Preserved |
| `/favicon.svg` | svg | 325 | — | Browser icon | Preserved |
| `/hero-video-poster.jpg` | jpg | 42,027 | 1920×1080 | — | Preserved |
| `/hero-video.mp4` | mp4 | 4,623,049 | see note | / | Preserved |
| `/logo.png` | png | 1,073,426 | 1024×1024 | /, /products, /research, /about +31 more | Preserved |
| `/og/og-about.jpg` | jpg | 103,280 | 1200×630 | OG/Twitter share image | Preserved |
| `/og/og-compliance.jpg` | jpg | 60,384 | 1200×630 | OG/Twitter share image | Preserved |
| `/og/og-contact.jpg` | jpg | 31,836 | 1200×630 | OG/Twitter share image | Preserved |
| `/og/og-home.jpg` | jpg | 92,265 | 1200×630 | OG/Twitter share image | Preserved |
| `/og/og-new-customer.jpg` | jpg | 128,196 | 1200×630 | OG/Twitter share image | Preserved |
| `/og/og-products.jpg` | jpg | 51,833 | 1200×630 | OG/Twitter share image | Preserved |
| `/og/og-research.jpg` | jpg | 71,127 | 1200×630 | OG/Twitter share image | Preserved |
| `/products/bpc-157-tb-500-blend.webp` | webp | 102,658 | 500×670 | /products, /products/bpc-157-tb-500-blend | Preserved |
| `/products/generic-vial.webp` | webp | 887,548 | 1024×1024 | /products | Preserved |
| `/products/glutathione.webp` | webp | 259,502 | 500×669 | /products, /products/glutathione | Preserved |
| `/products/ipamorelin.webp` | webp | 263,152 | 500×673 | /products, /products/ipamorelin | Preserved |
| `/products/retatrutide.webp` | webp | 265,592 | 500×701 | /products, /products/retatrutide | Removed (client request) |
| `/products/semax.webp` | webp | 9,468 | 100×133 | /products, /products/semax | Preserved |
| `/products/sermorelin.webp` | webp | 12,328 | 100×133 | /products, /products/sermorelin | Preserved |
| `/products/tirzepatide.webp` | webp | 250,058 | 500×663 | /products, /products/tirzepatide | Preserved |

## Logo update (client-supplied)

`/Logo2.png` (1261×1247, transparent background, supplied by the client) replaces `/logo.png` as the site logo in the header, the footer and the admin. `/logo.png` is still in `public/` but nothing references it. The favicons are unchanged.

## Fonts

| Family | Weights | Source | Role |
|---|---|---|---|
| Inter Tight | 300, 400, 500, 600, 700 | Google Fonts | `--font-display` (all h1–h4, `.font-display`) |
| Inter | 400, 500, 600, 700 | Google Fonts | `--font-sans` body text |
| JetBrains Mono | 400, 500 | Google Fonts | `--font-mono`, `.eyebrow-mono` labels |

## Icons

Lucide icons (inline SVG, `lucide-react`), identified from the bundles: arrow-left, arrow-up-right, loader-circle, menu, send, sparkles, x, pause, play, volume-2, volume-x, chevron-right, external-link, check, search. A custom inline SVG wave mark (`M4 26 L11 14 L18 26 L25 14 L32 26 L36 20` + orange dot) is used in the age gate.

## Product imagery coverage

Only 8 product images exist on the server: bpc-157-tb-500-blend, glutathione, ipamorelin, retatrutide, semax, sermorelin, tirzepatide, plus `generic-vial.webp` which is used as the fallback for every other product. Only 6 COA images exist (blend, glutathione, ipamorelin, retatrutide, tirzepatide 20 mg and 30 mg).
