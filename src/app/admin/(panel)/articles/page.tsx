import Link from "next/link";
import { requireAdmin, roleAtLeast } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { Badge, ButtonLink, Empty, Notice, PageTitle, Table, Td, formatDate } from "@/components/admin/ui";


export default async function Articles() {
  const admin = await requireAdmin("viewer");
  const { data, error } = await adminDb().from("articles").select("id,slug,title,is_published,published_at,updated_at").order("updated_at", { ascending: false });
  const rows = data ?? [];
  return (
    <>
      <PageTitle title="Articles" actions={roleAtLeast(admin.role, "editor") ? <ButtonLink href="/admin/articles/new" variant="primary">New article</ButtonLink> : undefined} />
      <Notice tone="info">The original site has no public articles route, so articles are stored but not yet displayed publicly.</Notice>
      {error && <p className="mb-4 text-sm text-destructive">{error.message}</p>}
      {rows.length ? (
        <Table head={["Title", "Slug", "Status", "Published", "Updated"]}>
          {rows.map((a: any) => (
            <tr key={a.id} className="hover:bg-secondary/40">
              <Td><Link className="font-medium underline" href={`/admin/articles/${a.id}`}>{a.title}</Link></Td>
              <Td className="font-mono text-xs">{a.slug}</Td>
              <Td>{a.is_published ? <Badge tone="good">published</Badge> : <Badge>draft</Badge>}</Td>
              <Td>{formatDate(a.published_at)}</Td>
              <Td>{formatDate(a.updated_at)}</Td>
            </tr>
          ))}
        </Table>
      ) : (
        <Empty>No articles yet.</Empty>
      )}
    </>
  );
}
