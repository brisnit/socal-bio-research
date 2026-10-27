import { Suspense } from "react";
import type { Metadata } from "next";
import { CATEGORY_LABELS, type ProductSpecs } from "@/content/products";
import { Catalog, CatalogView, DEFAULT_SEARCH } from "@/components/products/catalog";
import { JsonLd } from "@/components/site/json-ld";
import { OrangeWord } from "@/components/site/orange-word";
import { PageHero } from "@/components/site/page-hero";
import { getProductSpecs, getProducts } from "@/lib/content";
import { SITE_URL, pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const products = await getProducts();
  return pageMeta({
    title: `Peptide Catalog (${products.length}): Socal Bioresearch`,
    description: `Browse ${products.length} research peptides explained in plain English: what they are and what to ask before deciding.`,
    ogTitle: "Peptide Catalog: Socal Bioresearch",
    ogDescription: `${products.length} peptides explained in plain English.`,
    ogImage: "og-products.jpg",
    path: "/products",
  });
}

export default async function ProductsPage() {
  const products = await getProducts();
  const specs: Record<string, ProductSpecs> = Object.fromEntries(
    await Promise.all(products.map(async (p) => [p.slug, await getProductSpecs(p.slug)] as const)),
  );
  const catalogProps = { products, specs, categoryLabels: CATEGORY_LABELS };

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Socal Bioresearch Peptide Catalog",
          numberOfItems: products.length,
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/products/${p.slug}`,
            name: p.name,
          })),
        }}
      />
      <PageHero
        eyebrow="04: Catalog"
        meta={`${products.length} peptides · Plain language`}
        title="What people"
        titleMuted={
          <>
            <OrangeWord>ask</OrangeWord> about.
          </>
        }
        description="Each entry has a short, honest summary of what the peptide is, how people talk about it, and what questions to ask next. Browse, search, or just ask us."
      />
      <Suspense fallback={<CatalogView {...catalogProps} search={DEFAULT_SEARCH} />}>
        <Catalog {...catalogProps} />
      </Suspense>
    </>
  );
}
