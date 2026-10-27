import { requireAdmin, roleAtLeast } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { ActionForm } from "@/components/admin/forms";
import { Badge, Card, Checkbox, Field, Notice, PageTitle, TextArea, TextInput } from "@/components/admin/ui";
import { FAQS } from "@/content/faq";
import { createFaq, deleteFaq, importFaqs, updateFaq } from "./actions";

type Faq = { id: string; question: string; answer: string; sort_order: number; is_published: boolean };

function FaqFields({ faq }: { faq?: Faq }) {
  return (
    <>
      <Field label="Question"><TextInput name="question" required defaultValue={faq?.question ?? ""} /></Field>
      <Field label="Answer"><TextArea name="answer" required rows={4} defaultValue={faq?.answer ?? ""} /></Field>
      <div className="flex flex-wrap items-center gap-6">
        <Field label="Sort order"><TextInput name="sort_order" type="number" step={1} className="w-28" defaultValue={faq?.sort_order ?? 0} /></Field>
        <Checkbox name="is_published" label="Published" defaultChecked={faq?.is_published ?? true} />
      </div>
    </>
  );
}

export default async function Faqs() {
  const admin = await requireAdmin("viewer");
  const canEdit = roleAtLeast(admin.role, "editor");
  const isAdmin = roleAtLeast(admin.role, "admin");
  const { data, error } = await adminDb().from("faqs").select("*").order("sort_order").order("created_at");
  const rows = (data ?? []) as Faq[];
  return (
    <>
      <PageTitle title="FAQs" description="Common questions shown on /research. Order by sort order (lowest first)." />
      {error && <p className="mb-4 text-sm text-destructive">{error.message}</p>}
      {!rows.length && <Notice>No FAQs in the database, so /research shows the {FAQS.length} built-in original FAQs. Once a published FAQ exists, only database FAQs are shown.</Notice>}
      {isAdmin && (
        <Card className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Import the {FAQS.length} original FAQs (questions already present are skipped).</p>
            <ActionForm action={importFaqs} inline submitVariant="secondary" submitLabel="Import original FAQs" />
          </div>
        </Card>
      )}
      <div className="space-y-4">
        {rows.map((f) => (
          <Card key={f.id}>
            {canEdit ? (
              <>
                <ActionForm action={updateFaq.bind(null, f.id)} submitLabel="Save">
                  <FaqFields faq={f} />
                </ActionForm>
                {isAdmin && (
                  <div className="mt-3 border-t border-border pt-3">
                    <ActionForm action={deleteFaq.bind(null, f.id)} inline submitVariant="danger" submitLabel="Delete" confirm="Delete this FAQ?" />
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm">
                <div className="mb-1 flex items-center gap-2"><span className="text-muted-foreground">#{f.sort_order}</span>{f.is_published ? <Badge tone="good">published</Badge> : <Badge>draft</Badge>}</div>
                <p className="font-medium">{f.question}</p>
                <p className="mt-1 text-muted-foreground">{f.answer}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
      {canEdit && (
        <Card className="mt-8">
          <h2 className="mb-4 font-display font-semibold">Add FAQ</h2>
          <ActionForm action={createFaq} submitLabel="Add FAQ">
            <FaqFields />
          </ActionForm>
        </Card>
      )}
    </>
  );
}
