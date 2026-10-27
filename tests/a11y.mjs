// Runs axe-core on key pages of the original and the reconstruction and
// compares violations, to confirm the rebuild introduces no new issues.
// usage: node tests/a11y.mjs [originalUrl] [reconUrl]
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const [A = "https://socalbioresearch.org", B = "http://localhost:3100"] = process.argv.slice(2);
const PAGES = ["/", "/products", "/products/tirzepatide", "/research", "/about", "/contact", "/new-customer", "/legal", "/legal/privacy"];
const browser = await chromium.launch();
async function scan(base, path) {
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => { localStorage.setItem("scbr:age-verified", "1"); localStorage.setItem("drp:teaserDismissed", "1"); });
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  await ctx.close();
  return Object.fromEntries(r.violations.map((v) => [v.id, v.nodes.length]));
}
let regressions = 0;
for (const p of PAGES) {
  const [a, b] = [await scan(A, p), await scan(B, p)];
  const ids = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  const rows = ids.map((id) => `${id}: original ${a[id] ?? 0}, rebuild ${b[id] ?? 0}${(b[id] ?? 0) > (a[id] ?? 0) ? "  <-- more in rebuild" : ""}`);
  regressions += ids.filter((id) => (b[id] ?? 0) > (a[id] ?? 0)).length;
  console.log(p, rows.length ? "\n  " + rows.join("\n  ") : " no violations");
}
await browser.close();
console.log(regressions ? `${regressions} rule(s) with more violations in the rebuild` : "No accessibility regressions versus the original.");
