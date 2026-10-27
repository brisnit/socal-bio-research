import "server-only";
import { cache } from "react";
import { PRODUCTS, PRODUCT_SPECS, type Product, type ProductSpecs } from "@/content/products";
import { FAQS, type Faq } from "@/content/faq";
import { getAdminClient } from "@/lib/supabase/admin";

/**
 * Content access layer. Public pages read content only through these
 * functions.
 *
 * - Without Supabase configured, they return the bundled seed content, which
 *   is a verbatim copy of the original site.
 * - With Supabase configured, rows managed in /admin take over. If the
 *   database is empty or unreachable we fall back to the seed, so the public
 *   site never breaks or changes appearance because of a backend problem.
 *
 * Pages using these set `revalidate`; admin mutations call revalidatePath().
 */

type ProductRow = {
  slug: string;
  name: string;
  category: Product["category"];
  tagline: string;
  summary: string;
  mechanism: string;
  research_areas: string[];
  purity: string;
  references: Product["references"];
  specs: Omit<ProductSpecs, "productImage" | "coas">;
  product_image: string | null;
  coas: NonNullable<ProductSpecs["coas"]>;
  sort_order: number;
};

const loadProductRows = cache(async (): Promise<ProductRow[] | null> => {
  const db = getAdminClient();
  if (!db) return null;
  const { data, error } = await db
    .from("products")
    .select("slug,name,category,tagline,summary,mechanism,research_areas,purity,references,specs,product_image,coas,sort_order")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[content] products query failed; using seed", error.message);
    return null;
  }
  if (data && data.length) return data as ProductRow[];
  // No published rows: use the seed only if the table was never populated,
  // so unpublishing everything in /admin really empties the catalog.
  return (await tableHasRows("products")) ? [] : null;
});

async function tableHasRows(table: "products" | "faqs"): Promise<boolean> {
  const db = getAdminClient();
  if (!db) return false;
  const { count, error } = await db.from(table).select("id", { count: "exact", head: true });
  return !error && (count ?? 0) > 0;
}

function rowToProduct(r: ProductRow): Product {
  return {
    slug: r.slug,
    name: r.name,
    category: r.category,
    tagline: r.tagline,
    summary: r.summary,
    mechanism: r.mechanism,
    researchAreas: r.research_areas ?? [],
    purity: r.purity,
    references: r.references ?? [],
  };
}

function rowToSpecs(r: ProductRow): ProductSpecs {
  const specs: ProductSpecs = { ...(r.specs ?? {}) };
  if (r.product_image) specs.productImage = r.product_image;
  if (r.coas?.length) specs.coas = r.coas;
  return specs;
}

export async function getProducts(): Promise<Product[]> {
  const rows = await loadProductRows();
  return rows ? rows.map(rowToProduct) : PRODUCTS;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getProductSpecs(slug: string): Promise<ProductSpecs> {
  const rows = await loadProductRows();
  if (rows) {
    const row = rows.find((r) => r.slug === slug);
    return row ? rowToSpecs(row) : {};
  }
  return PRODUCT_SPECS[slug] ?? {};
}

export async function getAllProductSpecs(): Promise<Record<string, ProductSpecs>> {
  const rows = await loadProductRows();
  return rows ? Object.fromEntries(rows.map((r) => [r.slug, rowToSpecs(r)])) : PRODUCT_SPECS;
}

export const getFaqs = cache(async (): Promise<Faq[]> => {
  const db = getAdminClient();
  if (!db) return FAQS;
  const { data, error } = await db
    .from("faqs")
    .select("question,answer")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) return FAQS;
  if (!data?.length) return (await tableHasRows("faqs")) ? [] : FAQS;
  return data.map((r) => ({ q: r.question as string, a: r.answer as string }));
});

/** Editable site copy. Keys and their defaults are listed in SITE_TEXT_DEFAULTS. */
export const SITE_TEXT_DEFAULTS = {
  "site.announcement": "Clear peptide education · Real support · No pressure",
  "footer.blurb":
    "Socal Bioresearch helps people understand peptides in plain English: what they are, how they work, and what questions to ask next.",
  "footer.disclaimer":
    "Information on this site is educational and should not replace guidance from a qualified professional. If you have a specific question, contact our team and a real person will respond.",
} as const;
export type SiteTextKey = keyof typeof SITE_TEXT_DEFAULTS;

export const getSiteText = cache(async (): Promise<Record<SiteTextKey, string>> => {
  const out: Record<SiteTextKey, string> = { ...SITE_TEXT_DEFAULTS };
  const db = getAdminClient();
  if (!db) return out;
  const { data, error } = await db.from("site_content").select("key,value");
  if (error || !data) return out;
  for (const row of data) if (row.key in out) out[row.key as SiteTextKey] = row.value as string;
  return out;
});

/** Legal policy content override (same JSON shape as src/content/legal/<slug>.ts). */
export const getLegalOverride = cache(async (slug: string): Promise<unknown | null> => {
  const db = getAdminClient();
  if (!db) return null;
  const { data, error } = await db.from("legal_documents").select("content").eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return data.content;
});
