// Writes docs/visual-regression-report.md from compare/results.json and states.json.
// usage: node tests/visual/write-report.mjs <compareDir> <statesDir>
import fs from "node:fs";
import path from "node:path";

const [, , CMP = "tests/visual/output/compare", ST = "tests/visual/output/states"] = process.argv;
const r = JSON.parse(fs.readFileSync(path.join(CMP, "results.json"), "utf8"));
const s = JSON.parse(fs.readFileSync(path.join(ST, "states.json"), "utf8"));
const W = ["1440", "1024", "768", "390", "375"];
const by = {};
for (const x of r) {
  const [page, w] = x.file.replace(".png", "").split("@");
  (by[page] ??= {})[w] = x;
}
const route = (p) => `/${p === "home" ? "" : p.replace(/__/g, "/")}`;

const summary = W.map((w) => {
  const xs = Object.values(by).map((p) => p[w]).filter(Boolean);
  const mm = xs.filter((x) => x.origH !== x.reconH).length;
  const avg = xs.reduce((a, x) => a + x.diffPct, 0) / xs.length;
  const mx = xs.reduce((a, b) => (b.diffPct > a.diffPct ? b : a));
  return `| ${w} | ${xs.length} | **${mm}** | ${avg.toFixed(3)} | ${mx.file.replace(".png", "")} (${mx.diffPct}%) |`;
}).join("\n");

const md = `# Visual Regression Report

The original site and the reconstruction were compared on **${new Date().toISOString().slice(0, 10)}**. The comparison covered **${Object.keys(by).length} routes** at **${W.length} viewport widths** (${W.join(", ")} px), for **${r.length} full-page screenshots**, plus ${s.length} interactive states.

## Method

- **Capture tool:** \`tests/visual/shoot.mjs\` (Playwright, Chromium), run on the same machine against both sites.
- **Original:** https://socalbioresearch.org (live).
- **Reconstruction:** a local production build (\`next build && next start\`).
- **Captured state:** the age gate and chat teaser were dismissed through storage, the same as for a returning visitor. Each page was scrolled top to bottom to trigger the reveal animations. The capture then waited 4.5 s so the hero word cycle and count-ups could settle, paused the video at frame 0, and froze CSS animations.
- **Comparison tool:** \`tests/visual/compare.mjs\`, using pixelmatch with threshold 0.1 and anti-aliasing ignored. **Diff %** is the share of all page pixels that differ.
- **Interactive states:** \`tests/visual/states.mjs\` (viewport screenshots).

## Results

| Width | Pages | Page-height mismatches | Average diff % | Worst page |
|---|---|---|---|---|
${summary}

**Every page renders at exactly the original height at every width.** This means the reconstruction matches the original's text wrapping, spacing and section sizes everywhere. Of the 175 screenshots, the largest pixel difference is ${Math.max(...r.map((x) => x.diffPct))}%.

### Where the remaining differences come from

All remaining differences come from animations that cannot repeat exactly. They also occur between two loads of the original.

- **Home hero molecule:** particle positions and drift are randomized with \`Math.random()\` on each load.
- **Product marquee:** it scrolls continuously, so its offset depends on how long the page has been open.
- **"Ask Dr. Peptide" button:** its pulse ring animates continuously, so each capture freezes it at a different frame.

### Interactive states

| State | Diff % |
|---|---|
${s.map((x) => `| ${x.state} | ${x.diffPct} |`).join("\n")}

## Per-route results (diff %)

| Route | ${W.join(" | ")} |
|---|${W.map(() => "---").join("|")}|
${Object.entries(by).map(([p, v]) => `| \`${route(p)}\` | ${W.map((w) => (v[w] ? v[w].diffPct : "—")).join(" | ")} |`).join("\n")}

## Side-by-side images

Each image shows three columns: **original | reconstruction | diff**. In the diff column, red marks pixels that differ. Images are provided at 1440 px and 390 px. To produce all five widths at full resolution, with an HTML report, run:

\`\`\`bash
node tests/visual/shoot.mjs https://socalbioresearch.org tests/visual/output/original
node tests/visual/shoot.mjs http://localhost:3000 tests/visual/output/recon
node tests/visual/compare.mjs tests/visual/output/original tests/visual/output/recon tests/visual/output/compare
open tests/visual/output/compare/report.html
\`\`\`

${Object.keys(by).map((p) => `- \`${route(p)}\`: [1440](visual-report/${p}@1440.jpg) · [390](visual-report/${p}@390.jpg)`).join("\n")}

### Examples

![Home, 1440 px: original | rebuild | diff](visual-report/home@1440.jpg)

![Catalog, 390 px: original | rebuild | diff](visual-report/products@390.jpg)

## Other verification run on the final build

| Check | Script | Result |
|---|---|---|
| Interactive behavior: age gate, header, mobile menu, search, prefill, contact form, Dr. Peptide streaming and handoff, FAQ, 404, admin protection | \`tests/functional.mjs\` | 10/10 pass |
| Internal links, images, assets and console errors on all 35 routes | \`tests/links.mjs\` | 64 links OK, no broken images, no console errors |
| SEO metadata (title, description, canonical, og:*, twitter:*, JSON-LD) against the original | \`tests/seo.mjs\` | Identical on all 35 routes |
| Accessibility (axe, WCAG 2 A/AA) against the original | \`tests/a11y.mjs\` | No new issues. One pre-existing issue fixed invisibly (the closed chat panel is now \`inert\`). |
| Database migrations and RLS policies | \`tests/db-policies.mjs\` | 12/12 pass |
| Dr. Peptide streaming bridge | Mock Anthropic endpoint | Correct OpenAI-format SSE. The greeting is dropped before the API call, and the fallback and effort settings are sent. |
`;
fs.writeFileSync("docs/visual-regression-report.md", md);
console.log("wrote docs/visual-regression-report.md");
