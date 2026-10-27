// Builds compact side-by-side JPEGs (original | rebuild | diff) for docs/visual-report.
// usage: node tests/visual/report-images.mjs <origDir> <reconDir> <diffDir> <outDir> <widths comma list>
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [, , O, R, D, OUT, WIDTHS = "1440,390"] = process.argv;
const widths = WIDTHS.split(",");
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(O).filter((f) => widths.some((w) => f.endsWith(`@${w}.png`))).sort()) {
  const col = 300;
  const parts = await Promise.all([O, R, D].map((dir) => sharp(path.join(dir, f)).resize({ width: col }).toBuffer({ resolveWithObject: true })));
  const h = Math.max(...parts.map((p) => p.info.height));
  await sharp({ create: { width: col * 3 + 20, height: h, channels: 3, background: "#ffffff" } })
    .composite(parts.map((p, i) => ({ input: p.data, left: i * (col + 10), top: 0 })))
    .jpeg({ quality: 62, mozjpeg: true })
    .toFile(path.join(OUT, f.replace(".png", ".jpg")));
}
console.log("done");
