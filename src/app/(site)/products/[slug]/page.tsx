import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORY_LABELS } from "@/content/products";
import { ProductDetail } from "@/components/products/product-detail";
import { JsonLd } from "@/components/site/json-ld";
import { getProduct, getProductSpecs, getProducts } from "@/lib/content";
import { SITE_URL, pageMeta } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const peptide = await getProduct(slug);
  if (!peptide) return { title: { absolute: "Product not found" } };
  const meta = pageMeta({
    title: `${peptide.name}: Socal Bioresearch`,
    description: `${peptide.name}: ${peptide.tagline}`.slice(0, 155),
    ogDescription: peptide.summary,
    ogImage: "og-products.jpg",
    path: `/products/${slug}`,
  });
  // Next's OpenGraph types have no "product"; og:type is emitted by the page instead.
  const { type: _type, ...openGraph } = (meta.openGraph ?? {}) as Record<string, unknown>;
  void _type;
  return { ...meta, openGraph: openGraph as Metadata["openGraph"] };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const peptide = await getProduct(slug);
  if (!peptide) notFound();
  const [spec, products] = await Promise.all([getProductSpecs(slug), getProducts()]);
  const related = products.filter((s) => s.category === peptide.category && s.slug !== peptide.slug).slice(0, 3);
  const url = `${SITE_URL}/products/${slug}`;

  return (
    <>
      <meta property="og:type" content="product" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: peptide.name,
          description: peptide.summary,
          category: CATEGORY_LABELS[peptide.category],
          url,
          brand: { "@type": "Brand", name: "Socal Bioresearch" },
          additionalProperty: [
            { "@type": "PropertyValue", name: "Purity", value: peptide.purity },
            ...(spec.cas ? [{ "@type": "PropertyValue", name: "CAS", value: spec.cas }] : []),
            ...(spec.molecularWeight
              ? [{ "@type": "PropertyValue", name: "Molecular Weight", value: spec.molecularWeight }]
              : []),
            ...(spec.molecularFormula
              ? [{ "@type": "PropertyValue", name: "Molecular Formula", value: spec.molecularFormula }]
              : []),
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Catalog", item: `${SITE_URL}/products` },
            { "@type": "ListItem", position: 3, name: peptide.name, item: url },
          ],
        }}
      />
      <ProductDetail peptide={peptide} spec={spec} related={related} categoryLabels={CATEGORY_LABELS} />
    </>
  );
}
