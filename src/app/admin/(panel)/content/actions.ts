"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/admin/audit";
import { adminDb } from "@/lib/admin/db";
import { check, parseJson, revalidateSite, run, zodMessage, type ActionState } from "@/lib/admin/action";
import { LEGAL_SLUGS, legalPolicySchema, type LegalSlug } from "@/lib/admin/schemas";
import { SITE_TEXT_DEFAULTS, type SiteTextKey } from "@/lib/content";

/** Saves site text overrides. Empty or equal-to-default values delete the override row. */
export async function saveSiteText(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("editor");
    const db = adminDb();
    const { data: rows } = await db.from("site_content").select("key,value");
    const current = new Map((rows ?? []).map((r) => [r.key as string, r.value as string]));
    let changed = 0;
    for (const key of Object.keys(SITE_TEXT_DEFAULTS) as SiteTextKey[]) {
      const raw = fd.get(key);
      if (typeof raw !== "string") continue;
      const value = raw.trim();
      if (value.length > 5000) return { error: `${key} is too long (max 5000 characters).` };
      const before = current.get(key) ?? null;
      const isDefault = value === "" || value === SITE_TEXT_DEFAULTS[key];
      if (isDefault) {
        if (before === null) continue;
        check(await db.from("site_content").delete().eq("key", key));
        await audit(admin, "site_content.revert", "site_content", key, { value: before }, null);
      } else {
        if (before === value) continue;
        check(await db.from("site_content").upsert({ key, value, updated_by: admin.userId }, { onConflict: "key" }));
        await audit(admin, "site_content.update", "site_content", key, before === null ? null : { value: before }, { value });
      }
      changed++;
    }
    revalidateSite("/admin/content");
    return { ok: true, message: changed ? `Saved ${changed} change${changed === 1 ? "" : "s"}.` : "No changes." };
  });
}

function assertSlug(slug: string): asserts slug is LegalSlug {
  if (!(LEGAL_SLUGS as readonly string[]).includes(slug)) throw new Error("Unknown legal document.");
}

export async function saveLegal(slug: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("editor");
    assertSlug(slug);
    const raw = fd.get("content");
    const json = parseJson(typeof raw === "string" ? raw : "", "Content");
    if (json === undefined) return { error: "Content is empty. Use “Revert to original” to remove the override." };
    const parsed = legalPolicySchema.safeParse(json);
    if (!parsed.success) return { error: `Invalid policy shape: ${zodMessage(parsed.error)}` };
    const db = adminDb();
    const { data: before } = await db.from("legal_documents").select("content").eq("slug", slug).maybeSingle();
    check(await db.from("legal_documents").upsert({ slug, content: parsed.data, updated_by: admin.userId }, { onConflict: "slug" }));
    await audit(admin, "legal.update", "legal_documents", slug, before?.content ?? null, parsed.data);
    revalidateSite("/admin/content", `/admin/content/legal/${slug}`);
    return { ok: true, message: "Saved. The public page now uses this version." };
  });
}

export async function revertLegal(slug: string, _prev: ActionState, _fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("editor");
    assertSlug(slug);
    const db = adminDb();
    const { data: before } = await db.from("legal_documents").select("content").eq("slug", slug).maybeSingle();
    if (!before) return { ok: true, message: "Already using the original." };
    check(await db.from("legal_documents").delete().eq("slug", slug));
    await audit(admin, "legal.revert", "legal_documents", slug, before.content, null);
    revalidateSite("/admin/content", `/admin/content/legal/${slug}`);
    return { ok: true, message: "Reverted to the original." };
  });
}
