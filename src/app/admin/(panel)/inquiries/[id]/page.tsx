import { notFound } from "next/navigation";
import { requireAdmin, roleAtLeast } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { ButtonLink, Card, PageTitle, StatusBadge, formatDate } from "@/components/admin/ui";
import { updateSubmission } from "../actions";
import { SubmissionForm } from "../submission-form";

export default async function InquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin("viewer");
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: r } = await adminDb().from("inquiries").select("*").eq("id", id).maybeSingle();
  if (!r) notFound();
  return (
    <>
      <PageTitle title={`Inquiry from ${r.name}`} description={`Received ${formatDate(r.created_at)}`} actions={<ButtonLink href="/admin/inquiries">Back</ButtonLink>} />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <dl className="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Status</dt><dd><StatusBadge status={r.status} /></dd>
            <dt className="text-muted-foreground">Email</dt><dd><a className="underline" href={`mailto:${r.email}`}>{r.email}</a></dd>
            <dt className="text-muted-foreground">Organization</dt><dd>{r.organization ?? "—"}</dd>
            <dt className="text-muted-foreground">Type</dt><dd>{r.inquiry_type ?? "—"}</dd>
            <dt className="text-muted-foreground">Updated</dt><dd>{formatDate(r.updated_at)}</dd>
          </dl>
          <h2 className="mt-6 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Message</h2>
          <p className="whitespace-pre-wrap text-sm">{r.message}</p>
        </Card>
        <Card>
          <SubmissionForm action={updateSubmission.bind(null, "inquiries", id)} status={r.status} notes={r.admin_notes} canEdit={roleAtLeast(admin.role, "editor")} />
        </Card>
      </div>
    </>
  );
}
