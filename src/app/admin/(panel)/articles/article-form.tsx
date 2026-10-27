import { ActionForm, type ActionState } from "@/components/admin/forms";
import { Card, Checkbox, Field, TextArea, TextInput } from "@/components/admin/ui";

export type Article = { id: string; slug: string; title: string; excerpt: string; body: string; is_published: boolean; published_at: string | null };

/** datetime-local wants local time without zone: YYYY-MM-DDTHH:mm */
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

export function ArticleForm({ article, action }: { article?: Article; action: (p: ActionState, fd: FormData) => Promise<ActionState> }) {
  return (
    <ActionForm action={action} submitLabel="Save article">
      <Card className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title"><TextInput name="title" required defaultValue={article?.title ?? ""} /></Field>
          <Field label="Slug"><TextInput name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={article?.slug ?? ""} /></Field>
        </div>
        <Field label="Excerpt"><TextArea name="excerpt" rows={3} defaultValue={article?.excerpt ?? ""} /></Field>
        <Field label="Body" hint="Plain text or Markdown."><TextArea name="body" rows={18} defaultValue={article?.body ?? ""} /></Field>
        <div className="flex flex-wrap items-end gap-6">
          <Field label="Published at" hint="Server time zone; defaults to now when publishing.">
            <TextInput name="published_at" type="datetime-local" defaultValue={toLocalInput(article?.published_at ?? null)} />
          </Field>
          <div className="pb-2"><Checkbox name="is_published" label="Published" defaultChecked={article?.is_published ?? false} /></div>
        </div>
      </Card>
    </ActionForm>
  );
}
