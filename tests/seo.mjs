// Compares SEO metadata (title, description, canonical, og/twitter tags, JSON-LD types)
// between the original site and the reconstruction for every route.
// usage: node tests/seo.mjs [originalUrl] [reconUrl]
import { ROUTES } from "./visual/routes.mjs";

const [A = "https://socalbioresearch.org", B = "http://localhost:3100"] = process.argv.slice(2);
const KEYS = ["description", "og:title", "og:description", "og:image", "og:url", "og:type", "twitter:card", "twitter:image", "robots"];
async function meta(base, r) {
  const html = await (await fetch(base + r)).text();
  const out = { title: html.match(/<title>([^<]*)<\/title>/)?.[1] };
  for (const m of html.matchAll(/<meta\s+([^>]+?)\/?>/g)) {
    const k = m[1].match(/(?:name|property)="([^"]+)"/)?.[1];
    const v = m[1].match(/content="([^"]*)"/)?.[1];
    if (k && KEYS.includes(k)) out[k] = v;
  }
  out.canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  out.jsonld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => { try { return JSON.parse(m[1])["@type"]; } catch { return "?"; } }).sort().join(",");
  return out;
}
const dec = (s) => s?.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
let diffs = 0;
for (const r of ROUTES) {
  const [a, b] = await Promise.all([meta(A, r), meta(B, r)]);
  for (const k of Object.keys({ ...a, ...b })) {
    const va = dec(a[k]), vb = dec(b[k])?.replace(B, "https://socalbioresearch.org");
    if (va !== vb) { diffs++; console.log(`${r}  ${k}\n   original: ${va}\n   rebuild:  ${vb}`); }
  }
}
console.log(diffs ? `${diffs} differences` : "All SEO metadata identical.");
