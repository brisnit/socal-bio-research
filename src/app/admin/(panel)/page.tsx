import Link from "next/link";
import { requireAdmin, roleAtLeast } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { Card, Notice, PageTitle, Stat, Table, Td, formatDate } from "@/components/admin/ui";

export default async function Overview() {
  const admin = await requireAdmin("viewer");
  if (!isSupabaseConfigured()) {
    return (
      <>
        <PageTitle title="Overview" />
        <Notice>Supabase is not configured. The public site is serving the built-in original content.</Notice>
      </>
    );
  }
  const db = adminDb();
  const count = (table: string, f?: (q: any) => any) => {
    let q = db.from(table).select("*", { count: "exact", head: true });
    if (f) q = f(q);
    return q.then((r: { count: number | null }) => r.count ?? 0);
  };
  const canAudit = roleAtLeast(admin.role, "admin");
  const [newInq, newReg, published, total, faqs, audit] = await Promise.all([
    count("inquiries", (q) => q.eq("status", "new")),
    count("customer_registrations", (q) => q.eq("status", "new")),
    count("products", (q) => q.eq("is_published", true)),
    count("products"),
    count("faqs"),
    canAudit
      ? db.from("audit_log").select("id,created_at,actor_email,action,entity,entity_id").order("created_at", { ascending: false }).limit(10).then((r) => r.data ?? [])
      : Promise.resolve([]),
  ]);

  return (
    <>
      <PageTitle title="Overview" description={`Signed in as ${admin.email} (${admin.role}).`} />
      {total === 0 && (
        <Notice>
          The products table is empty, so the public site is serving the built-in original content.{" "}
          <Link href="/admin/products" className="underline">Import the original catalog</Link> to start editing it.
        </Notice>
      )}
      {faqs === 0 && total > 0 && (
        <Notice tone="info">No FAQs in the database; /research shows the built-in original FAQs.</Notice>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="New inquiries" value={newInq} href="/admin/inquiries?status=new" />
        <Stat label="New registrations" value={newReg} href="/admin/registrations?status=new" />
        <Stat label="Products published" value={`${published} / ${total}`} href="/admin/products" />
        <Stat label="FAQs" value={faqs} href="/admin/faqs" />
      </div>
      {canAudit && (
        <div className="mt-10">
          <h2 className="mb-3 font-display text-lg font-semibold">Recent activity</h2>
          {audit.length ? (
            <Table head={["When", "Who", "Action", "Entity"]}>
              {audit.map((a: any) => (
                <tr key={a.id}>
                  <Td className="whitespace-nowrap">{formatDate(a.created_at)}</Td>
                  <Td>{a.actor_email ?? "—"}</Td>
                  <Td className="font-mono text-xs">{a.action}</Td>
                  <Td className="font-mono text-xs">{a.entity}{a.entity_id ? ` · ${a.entity_id}` : ""}</Td>
                </tr>
              ))}
            </Table>
          ) : (
            <Card><p className="text-sm text-muted-foreground">No activity yet.</p></Card>
          )}
          <p className="mt-2 text-sm"><Link href="/admin/audit" className="underline">Full audit log</Link></p>
        </div>
      )}
    </>
  );
}
