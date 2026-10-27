// Every public route of the original site (from its sitemap.xml).
import fs from "node:fs";
const xml = fs.readFileSync(new URL("../../public/sitemap.xml", import.meta.url), "utf8");
export const ROUTES = [...xml.matchAll(/<loc>https:\/\/socalbioresearch\.org([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
export const VIEWPORTS = [
  [1440, 900],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [375, 812],
];
export const slugFor = (r) => (r === "/" ? "home" : r.slice(1).replace(/\//g, "__"));
