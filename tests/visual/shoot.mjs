// Full-page screenshots of every route at every viewport, in a settled state:
// age gate + chat teaser pre-dismissed, reveal/count-up animations completed,
// video paused at frame 0, CSS animations frozen.
// usage: node tests/visual/shoot.mjs <baseUrl> <outDir> [routeFilter] [widthFilter]
import { chromium } from "playwright";
import fs from "node:fs";
import { ROUTES, VIEWPORTS, slugFor } from "./routes.mjs";

const [, , BASE, OUT, FILTER, WIDTH] = process.argv;
if (!BASE || !OUT) throw new Error("usage: shoot.mjs <baseUrl> <outDir> [routeFilter] [width]");
const routes = ROUTES.filter((r) => !FILTER || r === FILTER || (FILTER.endsWith("*") && r.startsWith(FILTER.slice(0, -1))));
const vps = VIEWPORTS.filter(([w]) => !WIDTH || String(w) === WIDTH);
fs.mkdirSync(OUT, { recursive: true });

const FREEZE = `*,*::before,*::after{animation-play-state:paused!important;animation-delay:-0.0001s!important;transition:none!important;caret-color:transparent!important}`;
const browser = await chromium.launch();
for (const [w, h] of vps) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("scbr:age-verified", "1");
      localStorage.setItem("drp:teaserDismissed", "1");
    } catch {}
  });
  const page = await ctx.newPage();
  for (const r of routes) {
    try {
      await page.goto(BASE + r, { waitUntil: "networkidle", timeout: 60000 });
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 300) {
          window.scrollTo(0, y);
          await new Promise((res) => setTimeout(res, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(4500); // hero word cycle (~3.9s) + count-ups (1.6s) settle
      await page.evaluate(() => document.querySelectorAll("video").forEach((v) => { v.pause(); v.currentTime = 0; }));
      await page.addStyleTag({ content: FREEZE });
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${OUT}/${slugFor(r)}@${w}.png`, fullPage: true });
      console.log("ok", w, r);
    } catch (e) {
      console.log("ERR", w, r, String(e).slice(0, 200));
    }
  }
  await ctx.close();
}
await browser.close();
