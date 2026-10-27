// End-to-end checks of the public site's interactive behavior.
// usage: node tests/functional.mjs [baseUrl]
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3100";
const results = [];
async function check(name, fn) {
  try {
    await fn();
    results.push(["PASS", name]);
  } catch (e) {
    results.push(["FAIL", name, String(e.message).split("\n")[0]]);
  }
}
const assert = (c, m) => { if (!c) throw new Error(m); };

const browser = await chromium.launch();
const fresh = (opts = {}) => browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
const verified = async (opts) => {
  const ctx = await fresh(opts);
  await ctx.addInitScript(() => { localStorage.setItem("scbr:age-verified", "1"); localStorage.setItem("drp:teaserDismissed", "1"); });
  return ctx;
};

await check("Age gate: shows on first visit, under-21 message, then dismiss persists", async () => {
  const ctx = await fresh();
  const p = await ctx.newPage();
  await p.goto(BASE + "/");
  await p.getByText("Are you 21 or older?").waitFor();
  await p.getByRole("button", { name: "I am under 21" }).click();
  await p.getByText("You must be 21 or older to view this site.").waitFor();
  await p.reload();
  await p.getByRole("button", { name: "I am 21 or older" }).click();
  await p.reload();
  await p.waitForTimeout(500);
  assert(!(await p.getByText("Are you 21 or older?").isVisible()), "gate reappeared after confirming");
  await ctx.close();
});

await check("Header shrinks after scrolling past 24px", async () => {
  const ctx = await verified();
  const p = await ctx.newPage();
  await p.goto(BASE + "/about");
  const h0 = await p.locator("header > div").first().evaluate((e) => e.getBoundingClientRect().height);
  await p.mouse.wheel(0, 400);
  await p.waitForTimeout(600);
  const h1 = await p.locator("header > div").first().evaluate((e) => e.getBoundingClientRect().height);
  assert(h0 === 80 && h1 === 56, `heights ${h0} -> ${h1}`);
  await ctx.close();
});

await check("Mobile menu opens and navigates", async () => {
  const ctx = await verified({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(BASE + "/");
  await p.getByRole("button", { name: "Toggle menu" }).click();
  await p.locator("header nav").last().getByRole("link", { name: "Catalog" }).click();
  await p.waitForURL("**/products");
  await ctx.close();
});

await check("Catalog search filters and writes ?q to the URL", async () => {
  const ctx = await verified();
  const p = await ctx.newPage();
  await p.goto(BASE + "/products");
  await p.getByPlaceholder("Search by name, CAS, formula, or area…").fill("tirzep");
  await p.waitForTimeout(400);
  assert(p.url().includes("q=tirzep"), `url ${p.url()}`);
  const text = await p.locator("main").innerText();
  assert(text.includes("Tirzepatide") && !text.includes("Semax"), "filter did not narrow results");
  await ctx.close();
});

await check("Product page 'Ask about' prefills the contact form", async () => {
  const ctx = await verified();
  const p = await ctx.newPage();
  await p.goto(BASE + "/products/bpc-157");
  await p.getByRole("link", { name: "Ask about BPC 157" }).first().click();
  await p.waitForURL(/\/contact\?/);
  await p.waitForTimeout(500);
  const msg = await p.locator("textarea[name=message]").inputValue();
  assert(msg.includes("BPC 157"), `message was: ${msg.slice(0, 80)}`);
  await ctx.close();
});

await check("Contact form: validation messages, then submit reaches API", async () => {
  const ctx = await verified();
  const p = await ctx.newPage();
  await p.goto(BASE + "/contact");
  await p.waitForTimeout(2200); // original's minimum time-on-form guard (2s)
  await p.locator("form button[type=submit]").click();
  await p.getByText("Name is required").waitFor();
  await p.fill("#name", "Test Person");
  await p.fill("#email", "test@example.com");
  await p.fill("textarea[name=message]", "Functional test message.");
  const resp = p.waitForResponse((r) => r.url().endsWith("/api/inquiries"));
  await p.locator("form button[type=submit]").click();
  const r = await resp;
  // Without Supabase configured the API answers 503 and the form shows the original error copy.
  if (r.status() === 503) await p.getByText("We couldn't send your message. Please try again in a moment.").waitFor();
  else assert(r.status() === 201, `status ${r.status()}`);
  await ctx.close();
});

await check("Dr. Peptide: opens from header pill, sends, handles response", async () => {
  const ctx = await verified();
  const p = await ctx.newPage();
  await p.goto(BASE + "/");
  await p.locator("header").getByRole("button", { name: "Ask Dr. Peptide" }).click();
  await p.getByRole("dialog", { name: "Dr. Peptide chat" }).getByText("Hey: I'm Dr. Peptide.").waitFor();
  await p.getByPlaceholder("Ask about a peptide…").fill("What is a peptide?");
  const resp = p.waitForResponse((r) => r.url().endsWith("/api/dr-peptide"));
  await p.getByRole("button", { name: "Send" }).click();
  const r = await resp;
  if (r.status() === 503) await p.getByText("Dr. Peptide is offline right now").waitFor();
  else {
    assert(r.ok(), `status ${r.status()}`);
    await p.waitForTimeout(8000);
  }
  await p.getByRole("button", { name: "Connect me to a real person" }).click();
  await p.waitForURL(/\/contact/);
  await p.waitForTimeout(500);
  const msg = await p.locator("textarea[name=message]").inputValue();
  assert(msg.includes("What is a peptide?"), "handoff summary missing from contact message");
  await ctx.close();
});

await check("FAQ accordions open (native details)", async () => {
  const ctx = await verified();
  const p = await ctx.newPage();
  await p.goto(BASE + "/research");
  const d = p.locator("details").first();
  await d.locator("summary").click();
  assert(await d.evaluate((e) => e.open), "details did not open");
  await ctx.close();
});

await check("Unknown routes return the 404 page", async () => {
  const ctx = await verified();
  const p = await ctx.newPage();
  const r = await p.goto(BASE + "/does-not-exist");
  assert(r.status() === 404, `status ${r.status()}`);
  await p.getByText("Page not found").waitFor();
  const r2 = await p.goto(BASE + "/products/not-a-peptide");
  assert(r2.status() === 404, `status ${r2.status()}`);
  await p.getByText("This catalog entry doesn't exist.").waitFor();
  await ctx.close();
});

await check("Admin is protected: /admin sends signed-out users to login", async () => {
  const ctx = await fresh();
  const p = await ctx.newPage();
  await p.goto(BASE + "/admin");
  await p.waitForURL("**/admin/login");
  const r = await p.request.get(BASE + "/admin/products", { maxRedirects: 0 });
  assert([302, 303, 307, 308].includes(r.status()) || (await r.text()).includes("Sign in"), `admin/products status ${r.status()}`);
  await ctx.close();
});

await browser.close();
for (const r of results) console.log(r.join("  "));
process.exit(results.some((r) => r[0] === "FAIL") ? 1 : 0);
