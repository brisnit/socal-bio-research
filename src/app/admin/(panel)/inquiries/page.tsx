import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { INQUIRY_STATUSES } from "@/lib/admin/schemas";
import { Empty, PageTitle, Pager, StatusBadge, Table, Td, formatDate } from "@/components/admin/ui";
import { StatusFilter } from "./status-filter";

const PER = 50;

export default async function Inquiries({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  await requireAdmin("viewer");
  const sp = await searchParams;
  const status = (INQUIRY_STATUSES as readonly string[]).includes(sp.status ?? "") ? sp.status : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  let q = adminDb()
    .from("inquiries")
    .select("id,created_at,name,email,organization,inquiry_type,status")
    .order("created_at", { ascending: false })
    .range((page - 1) * PER, page * PER);
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  const rows = (data ?? []).slice(0, PER);
  return (
    <>
      <PageTitle title="Inquiries" description="Messages from the contact form." />
      <StatusFilter basePath="/admin/inquiries" current={status} />
      {error && <p className="mb-4 text-sm text-destructive">{error.message}</p>}
      {rows.length ? (
        <Table head={["Received", "Name", "Email", "Organization", "Type", "Status"]}>
          {rows.map((r: any) => (
            <tr key={r.id} className="hover:bg-secondary/40">
              <Td className="whitespace-nowrap"><Link className="underline" href={`/admin/inquiries/${r.id}`}>{formatDate(r.created_at)}</Link></Td>
              <Td>{r.name}</Td>
              <Td>{r.email}</Td>
              <Td>{r.organization ?? "—"}</Td>
              <Td>{r.inquiry_type ?? "—"}</Td>
              <Td><StatusBadge status={r.status} /></Td>
            </tr>
          ))}
        </Table>
      ) : (
        <Empty>No inquiries{status ? ` with status "${status}"` : ""}.</Empty>
      )}
      <Pager basePath="/admin/inquiries" page={page} hasNext={(data?.length ?? 0) > PER} params={{ status }} />
    </>
  );
}
