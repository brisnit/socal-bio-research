import { requireAdmin, roleAtLeast } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { ActionForm, CopyButton } from "@/components/admin/forms";
import { Card, Empty, Notice, PageTitle, TextInput, formatDate } from "@/components/admin/ui";
import { deleteMedia, updateAlt } from "./actions";
import { Uploader } from "./uploader";

type Asset = { id: string; path: string; public_url: string; alt_text: string; mime_type: string | null; size_bytes: number | null; created_at: string };

function size(n: number | null) {
  if (!n) return "—";
  return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(n / 1024)} KB`;
}

export default async function Media() {
  const admin = await requireAdmin("viewer");
  const canEdit = roleAtLeast(admin.role, "editor");
  const isAdmin = roleAtLeast(admin.role, "admin");
  const { data, error } = await adminDb().from("media_assets").select("*").order("created_at", { ascending: false }).limit(500);
  const rows = (data ?? []) as Asset[];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    <>
      <PageTitle title="Media" description="Files in the Supabase Storage bucket “media”. Copy a URL to use it as a product image or COA image." />
      {canEdit && (
        <Card className="mb-8">
          {url && anon ? <Uploader supabaseUrl={url} anonKey={anon} /> : <Notice>NEXT_PUBLIC_SUPABASE_ANON_KEY is not set; uploads are unavailable.</Notice>}
        </Card>
      )}
      {error && <p className="mb-4 text-sm text-destructive">{error.message}</p>}
      {!rows.length && <Empty>No media uploaded yet.</Empty>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((m) => (
          <Card key={m.id} className="space-y-3">
            <div className="flex h-40 items-center justify-center overflow-hidden rounded border border-border bg-secondary/40">
              {m.mime_type?.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.public_url} alt={m.alt_text} className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-xs text-muted-foreground">{m.mime_type ?? "file"}</span>
              )}
            </div>
            <div className="break-all font-mono text-[11px] text-muted-foreground">{m.path}</div>
            <div className="text-xs text-muted-foreground">{size(m.size_bytes)} · {formatDate(m.created_at)}</div>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={m.public_url} />
              <a href={m.public_url} target="_blank" rel="noreferrer" className="rounded border border-border px-2 py-1 text-xs hover:bg-secondary">Open</a>
            </div>
            {canEdit ? (
              <ActionForm action={updateAlt.bind(null, m.id)} inline submitVariant="secondary" submitLabel="Save alt">
                <TextInput name="alt_text" defaultValue={m.alt_text} placeholder="Alt text" className="flex-1" />
              </ActionForm>
            ) : (
              <p className="text-sm">{m.alt_text || <span className="text-muted-foreground">No alt text</span>}</p>
            )}
            {isAdmin && <ActionForm action={deleteMedia.bind(null, m.id)} inline submitVariant="danger" submitLabel="Delete" confirm="Delete this file? Pages using its URL will show a broken image." />}
          </Card>
        ))}
      </div>
    </>
  );
}
