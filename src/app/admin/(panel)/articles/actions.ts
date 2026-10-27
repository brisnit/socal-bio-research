"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/admin/audit";
import { adminDb, formString } from "@/lib/admin/db";
import { check, revalidateSite, run, zodMessage, type ActionState } from "@/lib/admin/action";
import { articleSchema } from "@/lib/admin/schemas";

function parse(fd: FormData) {
  const pub = formString(fd, "published_at");
  const isPublished = fd.get("is_published") === "on";
  let publishedAt: string | null = pub ? new Date(pub).toISOString() : null;
  if (isPublished && !publishedAt) publishedAt = new Date().toISOString();
  return articleSchema.safeParse({
    slug: formString(fd, "slug"),
    title: formString(fd, "title"),
    excerpt: formString(fd, "excerpt"),
    body: formString(fd, "body"),
    is_published: isPublished,
    published_at: publishedAt,
  });
}

export async function saveArticle(id: string | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  let dest: string | null = null;
  const res = await run(async () => {
    const admin = await requireAdmin("editor");
    const pub = formString(fd, "published_at");
    if (pub && Number.isNaN(new Date(pub).getTime())) return { error: "Published date is invalid." };
    const parsed = parse(fd);
    if (!parsed.success) return { error: zodMessage(parsed.error) };
    const db = adminDb();
    const { data: clash } = await db.from("articles").select("id").eq("slug", parsed.data.slug).maybeSingle();
    if (clash && clash.id !== id) return { error: `Another article already uses the slug "${parsed.data.slug}".` };
    if (id === null) {
      const { data } = check(await db.from("articles").insert(parsed.data).select("*").single());
      await audit(admin, "article.create", "articles", data.id, null, data);
      dest = `/admin/articles/${data.id}`;
    } else {
      const { data: before } = await db.from("articles").select("*").eq("id", id).maybeSingle();
      if (!before) return { error: "Article not found." };
      const { data } = check(await db.from("articles").update(parsed.data).eq("id", id).select("*").single());
      await audit(admin, "article.update", "articles", id, before, data);
    }
    revalidateSite("/admin/articles");
    return { ok: true, message: "Saved." };
  });
  if (dest && res.ok) redirect(dest);
  return res;
}

export async function deleteArticle(id: string, _prev: ActionState, _fd: FormData): Promise<ActionState> {
  const res = await run(async () => {
    const admin = await requireAdmin("admin");
    const db = adminDb();
    const { data: before } = await db.from("articles").select("*").eq("id", id).maybeSingle();
    if (!before) return { error: "Article not found." };
    check(await db.from("articles").delete().eq("id", id));
    await audit(admin, "article.delete", "articles", id, before, null);
    revalidateSite("/admin/articles");
    return { ok: true };
  });
  if (res.ok) redirect("/admin/articles");
  return res;
}
