"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/admin/audit";
import { adminDb, formString } from "@/lib/admin/db";
import { check, parseJson, revalidateSite, run, zodMessage, type ActionState } from "@/lib/admin/action";
import { productSchema } from "@/lib/admin/schemas";
import { PRODUCTS, PRODUCT_SPECS } from "@/content/products";

const COLS = "id,slug,name,category,tagline,summary,mechanism,research_areas,purity,references,specs,product_image,coas,sort_order,is_published";

function parseProductForm(fd: FormData) {
  const sort = formString(fd, "sort_order");
  return productSchema.safeParse({
    name: formString(fd, "name"),
    slug: formString(fd, "slug"),
    category: formString(fd, "category"),
    tagline: formString(fd, "tagline"),
    summary: formString(fd, "summary"),
    mechanism: formString(fd, "mechanism"),
    research_areas: formString(fd, "research_areas").split("\n").map((s) => s.trim()).filter(Boolean),
    purity: formString(fd, "purity"),
    references: parseJson(formString(fd, "references"), "References") ?? [],
    specs: {
      cas: formString(fd, "spec_cas"),
      molecularWeight: formString(fd, "spec_molecularWeight"),
      molecularFormula: formString(fd, "spec_molecularFormula"),
      sequence: formString(fd, "spec_sequence"),
      form: formString(fd, "spec_form"),
      storage: formString(fd, "spec_storage"),
    },
    product_image: formString(fd, "product_image") || null,
    coas: parseJson(formString(fd, "coas"), "COAs") ?? [],
    sort_order: sort === "" ? 0 : Number(sort),
    is_published: fd.get("is_published") === "on",
  });
}

/** Create (originalSlug = null) or update a product. */
export async function saveProduct(originalSlug: string | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  let dest: string | null = null;
  const res = await run(async () => {
    const admin = await requireAdmin("editor");
    const parsed = parseProductForm(fd);
    if (!parsed.success) return { error: zodMessage(parsed.error) };
    const input = parsed.data;
    const db = adminDb();

    if (input.slug !== originalSlug) {
      const { data: clash } = await db.from("products").select("id").eq("slug", input.slug).maybeSingle();
      if (clash) return { error: `Another product already uses the slug "${input.slug}".` };
    }

    if (originalSlug === null) {
      const { data } = check(await db.from("products").insert(input).select(COLS).single());
      await audit(admin, "product.create", "products", data.id, null, data);
    } else {
      const { data: before } = await db.from("products").select(COLS).eq("slug", originalSlug).maybeSingle();
      if (!before) return { error: "Product not found (it may have been deleted)." };
      const { data } = check(await db.from("products").update(input).eq("id", before.id).select(COLS).single());
      await audit(admin, "product.update", "products", before.id, before, data);
    }
    revalidateSite("/admin/products");
    if (originalSlug === null || input.slug !== originalSlug) dest = `/admin/products/${input.slug}?saved=1`;
    return { ok: true, message: "Saved." };
  });
  if (dest && res.ok) redirect(dest);
  return res;
}

export async function setPublished(slug: string, published: boolean, _prev: ActionState, _fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("editor");
    const db = adminDb();
    const { data: before } = await db.from("products").select("id,is_published").eq("slug", slug).maybeSingle();
    if (!before) return { error: "Product not found." };
    check(await db.from("products").update({ is_published: published }).eq("id", before.id));
    await audit(admin, published ? "product.publish" : "product.unpublish", "products", before.id, before, { is_published: published });
    revalidateSite("/admin/products", `/admin/products/${slug}`);
    return { ok: true, message: published ? "Published." : "Unpublished." };
  });
}

export async function deleteProduct(slug: string, _prev: ActionState, _fd: FormData): Promise<ActionState> {
  const res = await run(async () => {
    const admin = await requireAdmin("admin");
    const db = adminDb();
    const { data: before } = await db.from("products").select(COLS).eq("slug", slug).maybeSingle();
    if (!before) return { error: "Product not found." };
    check(await db.from("products").delete().eq("id", before.id));
    await audit(admin, "product.delete", "products", before.id, before, null);
    revalidateSite("/admin/products");
    return { ok: true };
  });
  if (res.ok) redirect("/admin/products");
  return res;
}

/** Upserts the 23 original products so the DB starts identical to the live site. */
export async function importCatalog(_prev: ActionState, _fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("admin");
    const db = adminDb();
    const rows = PRODUCTS.map((p, i) => {
      const { productImage, coas, ...specs } = PRODUCT_SPECS[p.slug] ?? {};
      return {
        slug: p.slug,
        name: p.name,
        category: p.category,
        tagline: p.tagline,
        summary: p.summary,
        mechanism: p.mechanism,
        research_areas: p.researchAreas,
        purity: p.purity,
        references: p.references,
        specs,
        product_image: productImage ?? null,
        coas: coas ?? [],
        sort_order: i,
        is_published: true,
      };
    });
    const { data: before } = await db.from("products").select(COLS).in("slug", rows.map((r) => r.slug));
    check(await db.from("products").upsert(rows, { onConflict: "slug" }));
    await audit(admin, "product.import_original", "products", null, before ?? [], { count: rows.length, slugs: rows.map((r) => r.slug) });
    revalidateSite("/admin/products", "/admin");
    return { ok: true, message: `Imported ${rows.length} original products.` };
  });
}
