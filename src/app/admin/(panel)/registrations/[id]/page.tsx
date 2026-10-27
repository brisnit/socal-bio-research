import { notFound } from "next/navigation";
import { requireAdmin, roleAtLeast } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { ButtonLink, Card, PageTitle, StatusBadge, formatDate } from "@/components/admin/ui";
import { updateSubmission } from "../../inquiries/actions";
import { SubmissionForm } from "../../inquiries/submission-form";

export default async function RegistrationDetail({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin("viewer");
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: r } = await adminDb().from("customer_registrations").select("*").eq("id", id).maybeSingle();
  if (!r) notFound();
  const rows: [string, React.ReactNode][] = [
    ["Status", <StatusBadge key="s" status={r.status} />],
    ["Legal name", r.legal_name],
    ["Business", r.business_name],
    ["Role / title", r.role_title ?? "—"],
    ["Email", <a key="e" className="underline" href={`mailto:${r.email}`}>{r.email}</a>],
    ["Phone", r.phone],
    ["Address", `${r.address_street}, ${r.address_city}, ${r.address_state} ${r.address_postal_code}, ${r.address_country}`],
    ["Referral", r.referral_source ?? "—"],
    ["RUO acknowledged", r.ruo_acknowledged ? "Yes" : "No"],
    ["Updated", formatDate(r.updated_at)],
  ];
  return (
    <>
      <PageTitle title={`Registration: ${r.business_name}`} description={`Received ${formatDate(r.created_at)}`} actions={<ButtonLink href="/admin/registrations">Back</ButtonLink>} />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <dl className="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-2 text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="contents"><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <h2 className="mt-6 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Intended use</h2>
          <p className="whitespace-pre-wrap text-sm">{r.intended_use}</p>
        </Card>
        <Card>
          <SubmissionForm action={updateSubmission.bind(null, "customer_registrations", id)} status={r.status} notes={r.admin_notes} canEdit={roleAtLeast(admin.role, "editor")} />
        </Card>
      </div>
    </>
  );
}
