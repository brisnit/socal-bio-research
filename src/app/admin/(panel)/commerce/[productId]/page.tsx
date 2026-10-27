import { notFound } from "next/navigation";
import { requireAdmin, roleAtLeast } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { ActionForm } from "@/components/admin/forms";
import { Badge, ButtonLink, Card, Checkbox, Empty, Field, PageTitle, TextInput, formatDate } from "@/components/admin/ui";
import { createVariant, deleteVariant, setInventory, setPrice, updateVariant } from "../actions";
import { PaymentsDisabled, money } from "../notice";

type Variant = { id: string; sku: string; label: string; is_active: boolean; is_purchasable: boolean; sort_order: number };
type Price = { id: string; variant_id: string; currency: string; unit_amount_cents: number; is_active: boolean; provider_price_id: string | null; created_at: string };
type Inv = { variant_id: string; quantity_on_hand: number; quantity_reserved: number; low_stock_threshold: number; updated_at: string };

function VariantFields({ v }: { v?: Variant }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_7rem]">
      <Field label="SKU"><TextInput name="sku" required defaultValue={v?.sku ?? ""} /></Field>
      <Field label="Label" hint="e.g. 10 mg vial"><TextInput name="label" required defaultValue={v?.label ?? ""} /></Field>
      <Field label="Sort"><TextInput name="sort_order" type="number" step={1} defaultValue={v?.sort_order ?? 0} /></Field>
      <div className="flex flex-wrap gap-6 sm:col-span-3">
        <Checkbox name="is_active" label="Active" defaultChecked={v?.is_active ?? false} />
        <Checkbox name="is_purchasable" label="Purchasable (no public effect yet)" defaultChecked={v?.is_purchasable ?? false} />
      </div>
    </div>
  );
}

export default async function ProductCommerce({ params }: { params: Promise<{ productId: string }> }) {
  const admin = await requireAdmin("viewer");
  const { productId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(productId)) notFound();
  const db = adminDb();
  const { data: product } = await db.from("products").select("id,name,slug").eq("id", productId).maybeSingle();
  if (!product) notFound();
  const { data: vdata } = await db.from("product_variants").select("*").eq("product_id", productId).order("sort_order").order("created_at");
  const variants = (vdata ?? []) as Variant[];
  const ids = variants.map((v) => v.id);
  const [{ data: pdata }, { data: idata }] = ids.length
    ? await Promise.all([
        db.from("prices").select("*").in("variant_id", ids).order("created_at", { ascending: false }),
        db.from("inventory").select("*").in("variant_id", ids),
      ])
    : [{ data: [] }, { data: [] }];
  const prices = (pdata ?? []) as Price[];
  const inv = new Map(((idata ?? []) as Inv[]).map((i) => [i.variant_id, i]));
  const canEdit = roleAtLeast(admin.role, "editor");
  const isAdmin = roleAtLeast(admin.role, "admin");

  return (
    <>
      <PageTitle title={`${product.name}: variants`} description="Variants, prices (in cents) and inventory." actions={<ButtonLink href="/admin/commerce">Back</ButtonLink>} />
      <PaymentsDisabled />
      {!variants.length && <Empty>No variants yet.</Empty>}
      <div className="space-y-6">
        {variants.map((v) => {
          const vp = prices.filter((p) => p.variant_id === v.id);
          const active = vp.filter((p) => p.is_active);
          const i = inv.get(v.id);
          return (
            <Card key={v.id} className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display font-semibold">{v.label}</span>
                <span className="font-mono text-xs text-muted-foreground">{v.sku}</span>
                {v.is_active ? <Badge tone="good">active</Badge> : <Badge>inactive</Badge>}
                {v.is_purchasable && <Badge tone="warn">purchasable flag on</Badge>}
              </div>
              {canEdit && (
                <ActionForm action={updateVariant.bind(null, productId, v.id)} submitLabel="Save variant" submitVariant="secondary">
                  <VariantFields v={v} />
                </ActionForm>
              )}

              <div className="border-t border-border pt-4">
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Price</h3>
                <p className="mb-2 text-sm">
                  Active: {active.length ? active.map((p) => `${money(p.unit_amount_cents, p.currency)} (${p.unit_amount_cents}¢ ${p.currency})`).join(", ") : "none"}
                </p>
                {isAdmin ? (
                  <ActionForm action={setPrice.bind(null, productId, v.id)} inline submitVariant="secondary" submitLabel="Set price">
                    <TextInput name="unit_amount_cents" type="number" min={0} step={1} placeholder="Amount in cents" className="w-40" />
                    <TextInput name="currency" defaultValue="USD" maxLength={3} className="w-20" />
                    <TextInput name="provider_price_id" placeholder="Provider price ID (optional)" className="w-56" />
                  </ActionForm>
                ) : (
                  <p className="text-xs text-muted-foreground">Prices can be changed by admins.</p>
                )}
                {vp.length > active.length && (
                  <details className="mt-2 text-xs text-muted-foreground">
                    <summary className="cursor-pointer">Price history</summary>
                    <ul className="mt-1 space-y-0.5">
                      {vp.filter((p) => !p.is_active).map((p) => <li key={p.id}>{money(p.unit_amount_cents, p.currency)} · {formatDate(p.created_at)}</li>)}
                    </ul>
                  </details>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Inventory {i && <span className="normal-case">· updated {formatDate(i.updated_at)}</span>}</h3>
                {canEdit ? (
                  <ActionForm action={setInventory.bind(null, productId, v.id)} inline submitVariant="secondary" submitLabel="Save inventory">
                    <label className="text-xs">On hand <TextInput name="quantity_on_hand" type="number" min={0} step={1} className="w-24" defaultValue={i?.quantity_on_hand ?? 0} /></label>
                    <label className="text-xs">Reserved <TextInput name="quantity_reserved" type="number" min={0} step={1} className="w-24" defaultValue={i?.quantity_reserved ?? 0} /></label>
                    <label className="text-xs">Low-stock at <TextInput name="low_stock_threshold" type="number" min={0} step={1} className="w-24" defaultValue={i?.low_stock_threshold ?? 0} /></label>
                  </ActionForm>
                ) : (
                  <p className="text-sm">{i ? `${i.quantity_on_hand} on hand, ${i.quantity_reserved} reserved` : "Not tracked"}</p>
                )}
              </div>

              {isAdmin && (
                <div className="border-t border-border pt-4">
                  <ActionForm action={deleteVariant.bind(null, productId, v.id)} inline submitVariant="danger" submitLabel="Delete variant" confirm={`Delete variant ${v.sku} with its prices and inventory?`} />
                </div>
              )}
            </Card>
          );
        })}
      </div>
      {canEdit && (
        <Card className="mt-8">
          <h2 className="mb-4 font-display font-semibold">Add variant</h2>
          <ActionForm action={createVariant.bind(null, productId)} submitLabel="Add variant">
            <VariantFields />
          </ActionForm>
        </Card>
      )}
    </>
  );
}
