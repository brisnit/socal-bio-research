import { requireAdmin } from "@/lib/admin/auth";
import { ButtonLink, Notice, PageTitle } from "@/components/admin/ui";
import { saveArticle } from "../actions";
import { ArticleForm } from "../article-form";

export default async function NewArticle() {
  await requireAdmin("editor");
  return (
    <>
      <PageTitle title="New article" actions={<ButtonLink href="/admin/articles">Back</ButtonLink>} />
      <Notice tone="info">The original site has no public articles route, so articles are stored but not yet displayed publicly.</Notice>
      <ArticleForm action={saveArticle.bind(null, null)} />
    </>
  );
}
