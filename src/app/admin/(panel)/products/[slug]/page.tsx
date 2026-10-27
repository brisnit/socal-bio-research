import { notFound } from "next/navigation";
import { requireAdmin, roleAtLeast } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { ActionForm } from "@/components/admin/forms";
import { Badge, ButtonLink, Card, Notice, PageTitle } from "@/components/admin/ui";
import { deleteProduct, saveProduct, setPublished } from "../actions";
import { ProductForm, type ProductRow } from "../product-form";

export default async function EditProduct({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ saved?: string }> }) {
  const admin = await requireAdmin("viewer");
  const { slug } = await params;
  const { saved } = await searchParams;
  const { data } = await adminDb().from("products").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();
  const p = data as ProductRow;
  const canEdit = roleAtLeast(admin.role, "editor");
  return (
    <>
      <PageTitle
        title={p.name}
        description={`/products/${p.slug}`}
        actions={
          <>
            {p.is_published ? <Badge tone="good">published</Badge> : <Badge>draft</Badge>}
            <ButtonLink href={`/products/${p.slug}`}>View public page ↗</ButtonLink>
            <ButtonLink href="/admin/products">Back</ButtonLink>
          </>
        }
      />
      {saved && <Notice tone="info">Saved.</Notice>}
      {canEdit ? (
        <>
          <div className="mb-6 flex flex-wrap gap-3">
            <ActionForm action={setPublished.bind(null, p.slug, !p.is_published)} inline submitVariant="secondary" submitLabel={p.is_published ? "Unpublish" : "Publish"} />
          </div>
          <ProductForm product={p} action={saveProduct.bind(null, p.slug)} />
          {roleAtLeast(admin.role, "admin") && (
            <Card className="mt-10 border-destructive/40">
              <h2 className="font-display font-semibold">Delete product</h2>
              <p className="mt-1 mb-4 text-sm text-muted-foreground">Permanently removes this product and its commerce variants. Consider unpublishing instead.</p>
              <ActionForm action={deleteProduct.bind(null, p.slug)} submitLabel="Delete product" submitVariant="danger" confirm={`Delete "${p.name}" permanently?`} />
            </Card>
          )}
        </>
      ) : (
        <Card><pre className="overflow-x-auto text-xs">{JSON.stringify(p, null, 2)}</pre></Card>
      )}
    </>
  );
}
