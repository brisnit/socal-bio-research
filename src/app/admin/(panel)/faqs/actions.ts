"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/admin/audit";
import { adminDb, formString } from "@/lib/admin/db";
import { check, revalidateSite, run, zodMessage, type ActionState } from "@/lib/admin/action";
import { faqSchema } from "@/lib/admin/schemas";
import { FAQS } from "@/content/faq";

function parse(fd: FormData) {
  const sort = formString(fd, "sort_order");
  return faqSchema.safeParse({
    question: formString(fd, "question"),
    answer: formString(fd, "answer"),
    sort_order: sort === "" ? 0 : Number(sort),
    is_published: fd.get("is_published") === "on",
  });
}

export async function createFaq(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("editor");
    const parsed = parse(fd);
    if (!parsed.success) return { error: zodMessage(parsed.error) };
    const { data } = check(await adminDb().from("faqs").insert(parsed.data).select("*").single());
    await audit(admin, "faq.create", "faqs", data.id, null, data);
    revalidateSite("/admin/faqs");
    return { ok: true, message: "FAQ added." };
  });
}

export async function updateFaq(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("editor");
    const parsed = parse(fd);
    if (!parsed.success) return { error: zodMessage(parsed.error) };
    const db = adminDb();
    const { data: before } = await db.from("faqs").select("*").eq("id", id).maybeSingle();
    if (!before) return { error: "FAQ not found." };
    const { data } = check(await db.from("faqs").update(parsed.data).eq("id", id).select("*").single());
    await audit(admin, "faq.update", "faqs", id, before, data);
    revalidateSite("/admin/faqs");
    return { ok: true, message: "Saved." };
  });
}

export async function deleteFaq(id: string, _prev: ActionState, _fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("admin");
    const db = adminDb();
    const { data: before } = await db.from("faqs").select("*").eq("id", id).maybeSingle();
    if (!before) return { error: "FAQ not found." };
    check(await db.from("faqs").delete().eq("id", id));
    await audit(admin, "faq.delete", "faqs", id, before, null);
    revalidateSite("/admin/faqs");
    return { ok: true, message: "Deleted." };
  });
}

/** Inserts the original FAQs (skipping questions that already exist). */
export async function importFaqs(_prev: ActionState, _fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("admin");
    const db = adminDb();
    const { data: existing } = await db.from("faqs").select("question");
    const have = new Set((existing ?? []).map((r) => r.question as string));
    const rows = FAQS.map((f, i) => ({ question: f.q, answer: f.a, sort_order: i, is_published: true })).filter((r) => !have.has(r.question));
    if (!rows.length) return { ok: true, message: "All original FAQs are already present." };
    const { data } = check(await db.from("faqs").insert(rows).select("id,question"));
    await audit(admin, "faq.import_original", "faqs", null, null, data);
    revalidateSite("/admin/faqs", "/admin");
    return { ok: true, message: `Imported ${rows.length} FAQ${rows.length === 1 ? "" : "s"}.` };
  });
}
