import { notFound } from "next/navigation";
import { requireAdmin, roleAtLeast } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { ActionForm, JsonTextArea } from "@/components/admin/forms";
import { Badge, ButtonLink, Card, Field, Notice, PageTitle, formatDate } from "@/components/admin/ui";
import { LEGAL_SLUGS, type LegalSlug } from "@/lib/admin/schemas";
import { LEGAL_SEED } from "@/lib/admin/legal-seed";
import { revertLegal, saveLegal } from "../../actions";

export default async function LegalEditor({ params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin("viewer");
  const { slug } = await params;
  if (!(LEGAL_SLUGS as readonly string[]).includes(slug)) notFound();
  const s = slug as LegalSlug;
  const { data } = await adminDb().from("legal_documents").select("content,updated_at").eq("slug", s).maybeSingle();
  const content = data?.content ?? LEGAL_SEED[s].policy;
  const canEdit = roleAtLeast(admin.role, "editor");
  return (
    <>
      <PageTitle
        title={LEGAL_SEED[s].title}
        description={`/legal/${s}`}
        actions={
          <>
            {data ? <Badge tone="warn">override · {formatDate(data.updated_at)}</Badge> : <Badge>original</Badge>}
            <ButtonLink href={`/legal/${s}`}>View public page ↗</ButtonLink>
            <ButtonLink href="/admin/content">Back</ButtonLink>
          </>
        }
      />
      <Notice tone="info">
        JSON shape: {"{ hero: { eyebrow, meta, title, titleMuted?, description }, notice?: { label, body }, sections: [{ n, title, summary, clause }], footer: { lead, link, trail } }"}.
        It is validated before saving.
      </Notice>
      {canEdit ? (
        <>
          <Card>
            <ActionForm action={saveLegal.bind(null, s)} submitLabel="Save override">
              <Field label="Policy JSON">
                <JsonTextArea key={data?.updated_at ?? "original"} name="content" rows={32} defaultValue={JSON.stringify(content, null, 2)} />
              </Field>
            </ActionForm>
          </Card>
          {data && (
            <Card className="mt-6">
              <h2 className="mb-1 font-display font-semibold">Revert to original</h2>
              <p className="mb-3 text-sm text-muted-foreground">Deletes the override so the page shows the original text again.</p>
              <ActionForm action={revertLegal.bind(null, s)} submitLabel="Revert to original" submitVariant="danger" confirm="Delete the override and restore the original text?" />
            </Card>
          )}
        </>
      ) : (
        <Card><pre className="overflow-x-auto text-xs">{JSON.stringify(content, null, 2)}</pre></Card>
      )}
    </>
  );
}
