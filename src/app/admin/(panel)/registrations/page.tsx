import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { INQUIRY_STATUSES } from "@/lib/admin/schemas";
import { Badge, Empty, PageTitle, Pager, StatusBadge, Table, Td, formatDate } from "@/components/admin/ui";
import { StatusFilter } from "../inquiries/status-filter";

const PER = 50;

export default async function Registrations({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  await requireAdmin("viewer");
  const sp = await searchParams;
  const status = (INQUIRY_STATUSES as readonly string[]).includes(sp.status ?? "") ? sp.status : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  let q = adminDb()
    .from("customer_registrations")
    .select("id,created_at,legal_name,business_name,email,address_state,address_country,ruo_acknowledged,status")
    .order("created_at", { ascending: false })
    .range((page - 1) * PER, page * PER);
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  const rows = (data ?? []).slice(0, PER);
  return (
    <>
      <PageTitle title="Registrations" description="New customer registrations." />
      <StatusFilter basePath="/admin/registrations" current={status} />
      {error && <p className="mb-4 text-sm text-destructive">{error.message}</p>}
      {rows.length ? (
        <Table head={["Received", "Name", "Business", "Email", "Location", "RUO", "Status"]}>
          {rows.map((r: any) => (
            <tr key={r.id} className="hover:bg-secondary/40">
              <Td className="whitespace-nowrap"><Link className="underline" href={`/admin/registrations/${r.id}`}>{formatDate(r.created_at)}</Link></Td>
              <Td>{r.legal_name}</Td>
              <Td>{r.business_name}</Td>
              <Td>{r.email}</Td>
              <Td>{r.address_state}, {r.address_country}</Td>
              <Td>{r.ruo_acknowledged ? <Badge tone="good">yes</Badge> : <Badge tone="bad">no</Badge>}</Td>
              <Td><StatusBadge status={r.status} /></Td>
            </tr>
          ))}
        </Table>
      ) : (
        <Empty>No registrations{status ? ` with status "${status}"` : ""}.</Empty>
      )}
      <Pager basePath="/admin/registrations" page={page} hasNext={(data?.length ?? 0) > PER} params={{ status }} />
    </>
  );
}
