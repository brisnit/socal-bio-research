import Link from "next/link";
import { requireAdmin, roleAtLeast } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { ActionForm } from "@/components/admin/forms";
import { Badge, ButtonLink, Card, Empty, Notice, PageTitle, Table, Td } from "@/components/admin/ui";
import { CATEGORY_LABELS, PRODUCTS, type CategoryKey } from "@/content/products";
import { importCatalog, setPublished } from "./actions";

export default async function Products() {
  const admin = await requireAdmin("viewer");
  const canEdit = roleAtLeast(admin.role, "editor");
  const isAdmin = roleAtLeast(admin.role, "admin");
  const { data, error } = await adminDb().from("products").select("slug,name,category,is_published,sort_order").order("sort_order").order("name");
  const rows = data ?? [];
  return (
    <>
      <PageTitle
        title="Products"
        description="Catalog shown on /products and /products/[slug]."
        actions={canEdit ? <ButtonLink href="/admin/products/new" variant="primary">New product</ButtonLink> : undefined}
      />
      {error && <p className="mb-4 text-sm text-destructive">{error.message}</p>}
      {!rows.length && (
        <Notice>
          The products table is empty, so the public site is serving the built-in original catalog ({PRODUCTS.length} products).
          Once any product row exists, only published database rows are shown publicly.
        </Notice>
      )}
      {isAdmin && (
        <Card className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground max-w-xl">
              Import original catalog: upserts the {PRODUCTS.length} original products (by slug) with their specs, images and COAs,
              so the database matches the live site. Existing products with the same slug are overwritten.
            </p>
            <ActionForm action={importCatalog} submitLabel="Import original catalog" submitVariant="secondary" inline
              confirm={`Upsert ${PRODUCTS.length} original products? Edits to products with matching slugs will be overwritten.`} />
          </div>
        </Card>
      )}
      {rows.length ? (
        <Table head={["#", "Name", "Category", "Status", ""]}>
          {rows.map((p: any) => (
            <tr key={p.slug} className="hover:bg-secondary/40">
              <Td className="text-muted-foreground">{p.sort_order}</Td>
              <Td><Link className="font-medium underline" href={`/admin/products/${p.slug}`}>{p.name}</Link><div className="text-xs text-muted-foreground font-mono">{p.slug}</div></Td>
              <Td>{CATEGORY_LABELS[p.category as CategoryKey] ?? p.category}</Td>
              <Td>{p.is_published ? <Badge tone="good">published</Badge> : <Badge>draft</Badge>}</Td>
              <Td className="text-right">
                {canEdit && (
                  <ActionForm action={setPublished.bind(null, p.slug, !p.is_published)} inline submitVariant="secondary" submitLabel={p.is_published ? "Unpublish" : "Publish"} />
                )}
              </Td>
            </tr>
          ))}
        </Table>
      ) : (
        <Empty>No products in the database yet.</Empty>
      )}
    </>
  );
}
