import { requireAdmin } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { Empty, PageTitle, Pager, Table, Td, TextInput, formatDate } from "@/components/admin/ui";

const PER = 50;

type Entry = { id: number; created_at: string; actor_email: string | null; action: string; entity: string; entity_id: string | null; before: unknown; after: unknown };

function JsonBlock({ label, value }: { label: string; value: unknown }) {
  if (value == null) return <div className="text-xs text-muted-foreground">{label}: —</div>;
  return (
    <details className="text-xs">
      <summary className="cursor-pointer text-muted-foreground">{label}</summary>
      <pre className="mt-1 max-h-96 max-w-[40rem] overflow-auto rounded bg-secondary/60 p-2">{JSON.stringify(value, null, 2)}</pre>
    </details>
  );
}

export default async function Audit({ searchParams }: { searchParams: Promise<{ page?: string; entity?: string }> }) {
  await requireAdmin("admin");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const entity = sp.entity && /^[a-z_]{1,64}$/.test(sp.entity) ? sp.entity : undefined;
  let q = adminDb().from("audit_log").select("*").order("created_at", { ascending: false }).range((page - 1) * PER, page * PER);
  if (entity) q = q.eq("entity", entity);
  const { data, error } = await q;
  const rows = ((data ?? []) as Entry[]).slice(0, PER);
  return (
    <>
      <PageTitle title="Audit log" description="Append-only record of every admin change." />
      <form className="mb-4 flex gap-2" action="/admin/audit">
        <TextInput name="entity" placeholder="Filter by table, e.g. products" defaultValue={entity ?? ""} className="max-w-xs" />
        <button className="h-9 rounded-md border border-border bg-background px-4 text-sm hover:bg-secondary">Filter</button>
      </form>
      {error && <p className="mb-4 text-sm text-destructive">{error.message}</p>}
      {rows.length ? (
        <Table head={["When", "Who", "Action", "Entity", "Before / after"]}>
          {rows.map((a) => (
            <tr key={a.id}>
              <Td className="whitespace-nowrap">{formatDate(a.created_at)}</Td>
              <Td>{a.actor_email ?? "—"}</Td>
              <Td className="font-mono text-xs">{a.action}</Td>
              <Td className="font-mono text-xs break-all">{a.entity}{a.entity_id ? ` · ${a.entity_id}` : ""}</Td>
              <Td className="space-y-1"><JsonBlock label="before" value={a.before} /><JsonBlock label="after" value={a.after} /></Td>
            </tr>
          ))}
        </Table>
      ) : (
        <Empty>No audit entries.</Empty>
      )}
      <Pager basePath="/admin/audit" page={page} hasNext={(data?.length ?? 0) > PER} params={{ entity }} />
    </>
  );
}
