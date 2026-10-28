# Client-requested changes after reconstruction

These changes were made on purpose, at the client's request, after the faithful rebuild. They are the only places where the rebuild differs from the original site.

| Date | Change | Files |
|---|---|---|
| 2026-10-27 | **Logo:** the client-supplied `Logo2.png` replaces `logo.png` in the header, footer and admin. | `public/Logo2.png`, `src/components/site/site-chrome.tsx`, `src/app/layout.tsx`, admin layout and login |
| 2026-10-27 | **Contact page:** the personal name and email were removed from the "Direct" block, which now shows only an **"Email us"** link to the company inbox. The address is assembled in the browser after load, so it never appears in the HTML that bots scrape. Without JavaScript, the link points to `/contact`. | `src/app/(site)/contact/page.tsx` |
| 2026-10-27 | **Contact page CTA:** the "Email us" link is now a **"Copy email"** button in the site's dark button style. Clicking it copies the address to the clipboard and shows "Copied" for 2 seconds. If the clipboard is unavailable, it opens the visitor's mail app instead. The address still never appears on the page or in its HTML. | `src/components/site/copy-email-button.tsx`, `src/app/(site)/contact/page.tsx` |
| 2026-10-27 | **Catalog:** Retatrutide was removed. Its product page, sitemap entry, product image and COA image are deleted. `/products/retatrutide` now permanently redirects (308) to `/products`. | `src/content/products.ts`, `public/sitemap.xml`, `next.config.ts` |
| 2026-10-27 | **Home page "Peptides we cover" stat** now reads 22, up from 23, so it matches the catalog. | `src/components/home/stats.tsx` |

## Notes for the database

If the catalog has already been imported into Supabase, delete the Retatrutide row in **/admin/products**. Otherwise the database copy will keep showing it. A fresh "Import original catalog" no longer includes it.
