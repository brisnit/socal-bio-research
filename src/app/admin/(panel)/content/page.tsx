import Link from "next/link";
import { requireAdmin, roleAtLeast } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { ActionForm } from "@/components/admin/forms";
import { Badge, Card, Field, PageTitle, Table, Td, TextArea, formatDate } from "@/components/admin/ui";
import { SITE_TEXT_DEFAULTS, type SiteTextKey } from "@/lib/content";
import { LEGAL_SLUGS } from "@/lib/admin/schemas";
import { LEGAL_SEED } from "@/lib/admin/legal-seed";
import { saveSiteText } from "./actions";

const LABELS: Record<SiteTextKey, string> = {
  "site.announcement": "Announcement bar",
  "footer.blurb": "Footer blurb",
  "footer.disclaimer": "Footer disclaimer",
};

export default async function Content() {
  const admin = await requireAdmin("viewer");
  const canEdit = roleAtLeast(admin.role, "editor");
  const db = adminDb();
  const [{ data: texts }, { data: legal }] = await Promise.all([
    db.from("site_content").select("key,value,updated_at"),
    db.from("legal_documents").select("slug,updated_at"),
  ]);
  const overrides = new Map((texts ?? []).map((r) => [r.key as string, r.value as string]));
  const legalRows = new Map((legal ?? []).map((r) => [r.slug as string, r.updated_at as string]));
  const keys = Object.keys(SITE_TEXT_DEFAULTS) as SiteTextKey[];

  return (
    <>
      <PageTitle title="Site text & legal" description="Overrides for site copy and legal pages. Anything not overridden shows the original text." />
      <Card className="mb-10">
        <h2 className="mb-1 font-display font-semibold">Site text</h2>
        <p className="mb-4 text-sm text-muted-foreground">Leave a field empty, or set it back to the default, to remove the override.</p>
        <ActionForm action={saveSiteText} submitLabel={canEdit ? "Save site text" : undefined}>
          {keys.map((k) => (
            <div key={k}>
              <Field label={`${LABELS[k]} (${k})`} hint={`Default: ${SITE_TEXT_DEFAULTS[k]}`}>
                <TextArea name={k} rows={2} disabled={!canEdit} defaultValue={overrides.get(k) ?? SITE_TEXT_DEFAULTS[k]} />
              </Field>
              <div className="mt-1">{overrides.has(k) ? <Badge tone="warn">overridden</Badge> : <Badge>default</Badge>}</div>
            </div>
          ))}
        </ActionForm>
      </Card>

      <h2 className="mb-3 font-display text-lg font-semibold">Legal documents</h2>
      <Table head={["Document", "Public page", "Source", "Updated"]}>
        {LEGAL_SLUGS.map((s) => (
          <tr key={s} className="hover:bg-secondary/40">
            <Td><Link className="font-medium underline" href={`/admin/content/legal/${s}`}>{LEGAL_SEED[s].title}</Link></Td>
            <Td className="font-mono text-xs">/legal/{s}</Td>
            <Td>{legalRows.has(s) ? <Badge tone="warn">override</Badge> : <Badge>original</Badge>}</Td>
            <Td>{formatDate(legalRows.get(s))}</Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
