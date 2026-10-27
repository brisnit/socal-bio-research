import "server-only";
import { PRODUCTS, PRODUCT_SPECS, type Product, type ProductSpecs } from "@/content/products";
import { FAQS, type Faq } from "@/content/faq";

/**
 * Content access layer. Public pages read content only through these
 * functions. They return the bundled seed content (identical to the
 * original site); when Supabase is configured, published database rows
 * override the seed (see src/lib/content-db.ts, wired in Phase 4).
 */

export async function getProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getProductSpecs(slug: string): Promise<ProductSpecs> {
  return PRODUCT_SPECS[slug] ?? {};
}

export async function getFaqs(): Promise<Faq[]> {
  return FAQS;
}
