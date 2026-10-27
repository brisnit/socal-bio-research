import { notFound } from "next/navigation";
import { requireAdmin, roleAtLeast } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { ActionForm } from "@/components/admin/forms";
import { ButtonLink, Card, Notice, PageTitle } from "@/components/admin/ui";
import { deleteArticle, saveArticle } from "../actions";
import { ArticleForm, type Article } from "../article-form";

export default async function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin("viewer");
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data } = await adminDb().from("articles").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const a = data as Article;
  return (
    <>
      <PageTitle title={a.title} actions={<ButtonLink href="/admin/articles">Back</ButtonLink>} />
      <Notice tone="info">The original site has no public articles route, so articles are stored but not yet displayed publicly.</Notice>
      {roleAtLeast(admin.role, "editor") ? (
        <ArticleForm article={a} action={saveArticle.bind(null, id)} />
      ) : (
        <Card><h2 className="font-semibold">{a.title}</h2><p className="mt-2 whitespace-pre-wrap text-sm">{a.body}</p></Card>
      )}
      {roleAtLeast(admin.role, "admin") && (
        <Card className="mt-10">
          <h2 className="mb-3 font-display font-semibold">Delete article</h2>
          <ActionForm action={deleteArticle.bind(null, id)} submitLabel="Delete article" submitVariant="danger" confirm={`Delete "${a.title}" permanently?`} />
        </Card>
      )}
    </>
  );
}
