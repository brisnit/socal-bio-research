// Crawls the local build from every sitemap route and checks that every
// same-origin link, image, video and stylesheet resolves (2xx/3xx).
// usage: node tests/links.mjs [baseUrl]
import { chromium } from "playwright";
import { ROUTES } from "./visual/routes.mjs";

const BASE = process.argv[2] ?? "http://localhost:3100";
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
const consoleErrors = [];
page.on("console", (m) => m.type() === "error" && consoleErrors.push(`${page.url()} :: ${m.text()}`));
page.on("response", (r) => r.status() >= 400 && r.url().startsWith(BASE) && errors.push(`${r.status()} ${r.url()} (on ${page.url()})`));
const targets = new Set();
for (const r of ROUTES) {
  await page.goto(BASE + r, { waitUntil: "networkidle" });
  const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
  for (const h of hrefs) if (h && (h.startsWith("/") || h.startsWith(BASE))) targets.add(new URL(h, BASE).href);
  const broken = await page.$$eval("img", (imgs) => imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
  broken.forEach((b) => errors.push(`broken image ${b} on ${r}`));
}
for (const t of targets) {
  const res = await page.request.get(t, { maxRedirects: 5 });
  if (res.status() >= 400) errors.push(`${res.status()} link ${t}`);
}
await browser.close();
console.log(`Checked ${ROUTES.length} pages and ${targets.size} unique internal links.`);
console.log(errors.length ? `FAIL\n${errors.join("\n")}` : "No broken links, images or assets.");
console.log(consoleErrors.length ? `Console errors:\n${[...new Set(consoleErrors)].join("\n")}` : "No console errors.");
process.exit(errors.length ? 1 : 0);
