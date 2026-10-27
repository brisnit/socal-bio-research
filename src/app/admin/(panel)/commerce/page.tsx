import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { Badge, Empty, PageTitle, StatusBadge, Table, Td, formatDate } from "@/components/admin/ui";
import { PaymentsDisabled, money } from "./notice";

export default async function Commerce() {
  await requireAdmin("viewer");
  const db = adminDb();
  const [{ data: products }, { data: variants }, { data: orders, error: ordersError }] = await Promise.all([
    db.from("products").select("id,slug,name,is_published").order("sort_order"),
    db.from("product_variants").select("product_id,is_active,is_purchasable"),
    db.from("orders").select("id,order_number,status,currency,total_cents,placed_at,created_at,customers(email)").order("created_at", { ascending: false }).limit(50),
  ]);
  const stats = new Map<string, { n: number; active: number }>();
  for (const v of variants ?? []) {
    const s = stats.get(v.product_id as string) ?? { n: 0, active: 0 };
    s.n++;
    if (v.is_active) s.active++;
    stats.set(v.product_id as string, s);
  }
  return (
    <>
      <PageTitle title="Commerce" description="Variants, prices and inventory. Data model only: there is no checkout." />
      <PaymentsDisabled />
      <h2 className="mb-3 font-display text-lg font-semibold">Products</h2>
      {products?.length ? (
        <Table head={["Product", "Catalog", "Variants", ""]}>
          {products.map((p: any) => {
            const s = stats.get(p.id);
            return (
              <tr key={p.id} className="hover:bg-secondary/40">
                <Td className="font-medium">{p.name}</Td>
                <Td>{p.is_published ? <Badge tone="good">published</Badge> : <Badge>draft</Badge>}</Td>
                <Td>{s ? `${s.n} (${s.active} active)` : "—"}</Td>
                <Td className="text-right"><Link className="underline" href={`/admin/commerce/${p.id}`}>Manage variants</Link></Td>
              </tr>
            );
          })}
        </Table>
      ) : (
        <Empty>No products in the database. Import the original catalog on the Products page first.</Empty>
      )}

      <h2 className="mt-10 mb-3 font-display text-lg font-semibold">Orders (read-only)</h2>
      {ordersError && <p className="mb-4 text-sm text-destructive">{ordersError.message}</p>}
      {orders?.length ? (
        <Table head={["Order", "Customer", "Status", "Total", "Placed", "Created"]}>
          {orders.map((o: any) => (
            <tr key={o.id}>
              <Td className="font-mono">#{o.order_number}</Td>
              <Td>{o.customers?.email ?? "—"}</Td>
              <Td><StatusBadge status={o.status} /></Td>
              <Td>{money(o.total_cents, o.currency)}</Td>
              <Td>{formatDate(o.placed_at)}</Td>
              <Td>{formatDate(o.created_at)}</Td>
            </tr>
          ))}
        </Table>
      ) : (
        <Empty>No orders. Orders cannot be placed until a payment provider is approved and connected.</Empty>
      )}
    </>
  );
}
