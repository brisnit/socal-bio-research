"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/admin/audit";
import { adminDb, formString } from "@/lib/admin/db";
import { check, run, zodMessage, type ActionState } from "@/lib/admin/action";

// Commerce tables are not read by the public site; only admin paths are revalidated.
// No checkout or payment processing exists. Purchasable flags have no public effect.

const int = (v: string) => (v === "" ? 0 : Number(v));

const variantSchema = z.object({
  sku: z.string().trim().min(1, "SKU is required").max(100).regex(/^[A-Za-z0-9._-]+$/, "SKU: letters, numbers, . _ - only"),
  label: z.string().trim().min(1, "Label is required").max(200),
  is_active: z.boolean(),
  is_purchasable: z.boolean(),
  sort_order: z.number().int(),
});

function parseVariant(fd: FormData) {
  return variantSchema.safeParse({
    sku: formString(fd, "sku"),
    label: formString(fd, "label"),
    is_active: fd.get("is_active") === "on",
    is_purchasable: fd.get("is_purchasable") === "on",
    sort_order: int(formString(fd, "sort_order")),
  });
}

function done(productId: string) {
  revalidatePath("/admin/commerce");
  revalidatePath(`/admin/commerce/${productId}`);
}

export async function createVariant(productId: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("editor");
    const parsed = parseVariant(fd);
    if (!parsed.success) return { error: zodMessage(parsed.error) };
    const db = adminDb();
    const { data: product } = await db.from("products").select("id").eq("id", productId).maybeSingle();
    if (!product) return { error: "Product not found." };
    const res = await db.from("product_variants").insert({ ...parsed.data, product_id: productId }).select("*").single();
    if (res.error?.code === "23505") return { error: "That SKU is already in use." };
    const { data } = check(res);
    await audit(admin, "variant.create", "product_variants", data.id, null, data);
    done(productId);
    return { ok: true, message: "Variant added." };
  });
}

export async function updateVariant(productId: string, variantId: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("editor");
    const parsed = parseVariant(fd);
    if (!parsed.success) return { error: zodMessage(parsed.error) };
    const db = adminDb();
    const { data: before } = await db.from("product_variants").select("*").eq("id", variantId).eq("product_id", productId).maybeSingle();
    if (!before) return { error: "Variant not found." };
    const res = await db.from("product_variants").update(parsed.data).eq("id", variantId).select("*").single();
    if (res.error?.code === "23505") return { error: "That SKU is already in use." };
    const { data } = check(res);
    await audit(admin, "variant.update", "product_variants", variantId, before, data);
    done(productId);
    return { ok: true, message: "Saved." };
  });
}

export async function deleteVariant(productId: string, variantId: string, _prev: ActionState, _fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("admin");
    const db = adminDb();
    const { data: before } = await db.from("product_variants").select("*").eq("id", variantId).eq("product_id", productId).maybeSingle();
    if (!before) return { error: "Variant not found." };
    check(await db.from("product_variants").delete().eq("id", variantId));
    await audit(admin, "variant.delete", "product_variants", variantId, before, null);
    done(productId);
    return { ok: true, message: "Deleted." };
  });
}

const priceSchema = z.object({
  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/, "Currency must be a 3-letter code"),
  unit_amount_cents: z.number().int("Amount must be whole cents").min(0).max(100_000_000),
  provider_price_id: z.string().trim().max(200).transform((v) => v || null),
});

/** Sets the active price for a variant/currency: deactivates the old one and inserts a new row (keeps history). */
export async function setPrice(productId: string, variantId: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("admin");
    const raw = formString(fd, "unit_amount_cents");
    if (raw === "") return { error: "Enter an amount in cents." };
    const parsed = priceSchema.safeParse({ currency: formString(fd, "currency") || "USD", unit_amount_cents: Number(raw), provider_price_id: formString(fd, "provider_price_id") });
    if (!parsed.success) return { error: zodMessage(parsed.error) };
    const db = adminDb();
    const { data: variant } = await db.from("product_variants").select("id").eq("id", variantId).eq("product_id", productId).maybeSingle();
    if (!variant) return { error: "Variant not found." };
    const { data: before } = await db.from("prices").select("*").eq("variant_id", variantId).eq("currency", parsed.data.currency).eq("is_active", true).maybeSingle();
    if (before) check(await db.from("prices").update({ is_active: false }).eq("id", before.id));
    const { data } = check(await db.from("prices").insert({ variant_id: variantId, ...parsed.data, is_active: true }).select("*").single());
    await audit(admin, "price.set", "prices", data.id, before, data);
    done(productId);
    return { ok: true, message: "Price saved." };
  });
}

const inventorySchema = z.object({
  quantity_on_hand: z.number().int().min(0),
  quantity_reserved: z.number().int().min(0),
  low_stock_threshold: z.number().int().min(0),
});

export async function setInventory(productId: string, variantId: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("editor");
    const parsed = inventorySchema.safeParse({
      quantity_on_hand: int(formString(fd, "quantity_on_hand")),
      quantity_reserved: int(formString(fd, "quantity_reserved")),
      low_stock_threshold: int(formString(fd, "low_stock_threshold")),
    });
    if (!parsed.success) return { error: zodMessage(parsed.error) };
    const db = adminDb();
    const { data: variant } = await db.from("product_variants").select("id").eq("id", variantId).eq("product_id", productId).maybeSingle();
    if (!variant) return { error: "Variant not found." };
    const { data: before } = await db.from("inventory").select("*").eq("variant_id", variantId).maybeSingle();
    const { data } = check(await db.from("inventory").upsert({ variant_id: variantId, ...parsed.data }, { onConflict: "variant_id" }).select("*").single());
    await audit(admin, "inventory.set", "inventory", variantId, before, data);
    done(productId);
    return { ok: true, message: "Inventory saved." };
  });
}
