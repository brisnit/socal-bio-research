// Pixel-diff original vs reconstruction screenshots and write an HTML report.
// usage: node tests/visual/compare.mjs <originalDir> <reconDir> <outDir>
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const [, , A, B, OUT] = process.argv;
if (!A || !B || !OUT) throw new Error("usage: compare.mjs <originalDir> <reconDir> <outDir>");
fs.mkdirSync(path.join(OUT, "diff"), { recursive: true });

const pad = (png, w, h) => {
  if (png.width === w && png.height === h) return png;
  const out = new PNG({ width: w, height: h });
  out.data.fill(255);
  PNG.bitblt(png, out, 0, 0, Math.min(png.width, w), Math.min(png.height, h), 0, 0);
  return out;
};

const rows = [];
for (const file of fs.readdirSync(A).filter((f) => f.endsWith(".png")).sort()) {
  const bPath = path.join(B, file);
  if (!fs.existsSync(bPath)) { rows.push({ file, missing: true }); continue; }
  const a = PNG.sync.read(fs.readFileSync(path.join(A, file)));
  const b = PNG.sync.read(fs.readFileSync(bPath));
  const w = Math.max(a.width, b.width), h = Math.max(a.height, b.height);
  const diff = new PNG({ width: w, height: h });
  const n = pixelmatch(pad(a, w, h).data, pad(b, w, h).data, diff.data, w, h, { threshold: 0.1, includeAA: false });
  fs.writeFileSync(path.join(OUT, "diff", file), PNG.sync.write(diff));
  rows.push({ file, origH: a.height, reconH: b.height, diffPct: +((n / (w * h)) * 100).toFixed(3) });
}
fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(rows, null, 2));

const rel = (p) => path.relative(OUT, p);
const html = `<!doctype html><meta charset="utf-8"><title>Visual regression report</title>
<style>body{font:14px system-ui;margin:24px;background:#fafafa;color:#070e16}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #e2e5e8;padding:6px 8px;text-align:left}
.bad{color:#e40014;font-weight:600}.ok{color:#0a7a3a}details img{max-width:32%;vertical-align:top;border:1px solid #e2e5e8;margin-right:1%}</style>
<h1>Original vs reconstruction</h1><p>${rows.length} screenshots. Diff % = share of pixels that differ (pixelmatch, threshold 0.1, anti-aliasing ignored).</p>
<table><tr><th>Screenshot</th><th>Original height</th><th>Reconstruction height</th><th>Diff %</th></tr>
${rows.map((r) => r.missing ? `<tr><td>${r.file}</td><td colspan=3 class=bad>missing in reconstruction</td></tr>` :
  `<tr><td><details><summary>${r.file}</summary><img src="${rel(path.join(A, r.file))}"><img src="${rel(path.join(B, r.file))}"><img src="diff/${r.file}"></details></td><td>${r.origH}</td><td>${r.reconH}</td><td class="${r.diffPct > 1 || r.origH !== r.reconH ? "bad" : "ok"}">${r.diffPct}</td></tr>`).join("\n")}
</table>`;
fs.writeFileSync(path.join(OUT, "report.html"), html);
const worst = rows.filter((r) => !r.missing).sort((x, y) => y.diffPct - x.diffPct).slice(0, 15);
console.table(worst);
