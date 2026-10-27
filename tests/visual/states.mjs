// Screenshots of interactive states (age gate, chat teaser, chat open, mobile menu,
// form validation) on both sites, then pixel-diffs them.
// usage: node tests/visual/states.mjs <originalUrl> <reconUrl> <outDir>
import { chromium } from "playwright";
import fs from "node:fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const [, , A, B, OUT] = process.argv;
fs.mkdirSync(OUT, { recursive: true });
const FREEZE = `*,*::before,*::after{animation-play-state:paused!important;animation-delay:-0.0001s!important;transition:none!important;caret-color:transparent!important}`;
const STATES = [
  { name: "age-gate", w: 1440, h: 900, verified: false, run: async (p) => p.goto("/about") },
  { name: "age-gate", w: 390, h: 844, verified: false, run: async (p) => p.goto("/about") },
  { name: "age-gate-under21", w: 1440, h: 900, verified: false, run: async (p) => { await p.goto("/about"); await p.getByRole("button", { name: "I am under 21" }).click(); } },
  { name: "chat-teaser", w: 1440, h: 900, verified: true, teaser: true, run: async (p) => { await p.goto("/about"); await p.waitForTimeout(2600); } },
  { name: "chat-open", w: 1440, h: 900, verified: true, run: async (p) => { await p.goto("/about"); await p.locator("header").getByRole("button", { name: "Ask Dr. Peptide" }).click(); } },
  { name: "chat-open", w: 390, h: 844, verified: true, run: async (p) => { await p.goto("/about"); await p.getByRole("button", { name: /Open Dr. Peptide/ }).click(); } },
  { name: "mobile-menu", w: 390, h: 844, verified: true, run: async (p) => { await p.goto("/about"); await p.getByRole("button", { name: "Toggle menu" }).click(); } },
  { name: "contact-errors", w: 1440, h: 900, verified: true, run: async (p) => { await p.goto("/contact"); await p.waitForTimeout(2300); await p.locator("form button[type=submit]").click(); await p.waitForTimeout(400); await p.locator("form").scrollIntoViewIfNeeded(); } },
  { name: "scrolled-header", w: 1440, h: 900, verified: true, run: async (p) => { await p.goto("/legal"); await p.mouse.wheel(0, 600); await p.waitForTimeout(700); } },
];
const browser = await chromium.launch();
const rows = [];
for (const s of STATES) {
  const files = [];
  for (const [label, base] of [["original", A], ["rebuild", B]]) {
    const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, baseURL: base });
    await ctx.addInitScript(([v, t]) => { if (v) localStorage.setItem("scbr:age-verified", "1"); if (!t) localStorage.setItem("drp:teaserDismissed", "1"); }, [s.verified, s.teaser]);
    const p = await ctx.newPage();
    await s.run(p);
    await p.waitForLoadState("networkidle");
    await p.waitForTimeout(900);
    await p.addStyleTag({ content: FREEZE });
    await p.waitForTimeout(200);
    const f = `${OUT}/${s.name}@${s.w}.${label}.png`;
    await p.screenshot({ path: f });
    files.push(f);
    await ctx.close();
  }
  const [a, b] = files.map((f) => PNG.sync.read(fs.readFileSync(f)));
  const d = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, d.data, a.width, a.height, { threshold: 0.1 });
  fs.writeFileSync(`${OUT}/${s.name}@${s.w}.diff.png`, PNG.sync.write(d));
  rows.push({ state: `${s.name}@${s.w}`, diffPct: +((n / (a.width * a.height)) * 100).toFixed(3) });
}
await browser.close();
console.table(rows);
fs.writeFileSync(`${OUT}/states.json`, JSON.stringify(rows, null, 2));
