"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/admin/audit";
import { adminDb, formString } from "@/lib/admin/db";
import { check, revalidateSite, run, zodMessage, type ActionState } from "@/lib/admin/action";
import { MEDIA_MAX_BYTES, isAllowedMime } from "@/lib/admin/schemas";

const BUCKET = "media";
const PATH_RE = /^uploads\/\d{4}\/\d{2}\/[0-9a-f-]{36}-[a-z0-9._-]{1,100}$/;

const uploadReq = z.object({
  name: z.string().min(1).max(300),
  type: z.string().refine(isAllowedMime, "Only images, PDFs and videos are allowed."),
  size: z.number().int().positive().max(MEDIA_MAX_BYTES, "Files must be 25 MB or smaller."),
});

/**
 * Step 1: validate the file metadata and issue a one-time signed upload URL
 * (service client). The browser then uploads straight to Storage, which avoids
 * the server action request-body limit.
 */
export async function createUpload(input: { name: string; type: string; size: number }): Promise<{ path?: string; token?: string; error?: string }> {
  try {
    await requireAdmin("editor");
    const parsed = uploadReq.safeParse(input);
    if (!parsed.success) return { error: zodMessage(parsed.error) };
    const now = new Date();
    const safe = parsed.data.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(-100) || "file";
    const path = `uploads/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}-${safe}`;
    const { data, error } = await adminDb().storage.from(BUCKET).createSignedUploadUrl(path);
    if (error || !data) return { error: `Storage error: ${error?.message ?? "no upload URL"}` };
    return { path: data.path, token: data.token };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload failed." };
  }
}

/** Step 2: verify the stored object (type + size) and record it in media_assets. */
export async function finalizeUpload(input: { path: string; alt: string }): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("editor");
    if (!PATH_RE.test(input.path)) return { error: "Invalid upload path." };
    const db = adminDb();
    const store = db.storage.from(BUCKET);
    const { data: info, error } = await store.info(input.path);
    if (error || !info) return { error: `Uploaded file not found: ${error?.message ?? ""}` };
    const mime = info.contentType ?? (info.metadata as { mimetype?: string } | undefined)?.mimetype ?? "";
    const size = info.size ?? Number((info.metadata as { size?: number } | undefined)?.size ?? 0);
    if (!isAllowedMime(mime) || size > MEDIA_MAX_BYTES) {
      await store.remove([input.path]);
      return { error: "File rejected: only images, PDFs and videos up to 25 MB are allowed." };
    }
    const publicUrl = store.getPublicUrl(input.path).data.publicUrl;
    const row = { path: input.path, public_url: publicUrl, alt_text: input.alt.trim().slice(0, 500), mime_type: mime, size_bytes: size, created_by: admin.userId };
    const { data } = check(await db.from("media_assets").insert(row).select("*").single());
    await audit(admin, "media.upload", "media_assets", data.id, null, data);
    revalidatePath("/admin/media");
    return { ok: true, message: "Uploaded." };
  });
}

export async function updateAlt(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("editor");
    const alt = formString(fd, "alt_text");
    if (alt.length > 500) return { error: "Alt text is too long (max 500)." };
    const db = adminDb();
    const { data: before } = await db.from("media_assets").select("alt_text").eq("id", id).maybeSingle();
    if (!before) return { error: "Asset not found." };
    check(await db.from("media_assets").update({ alt_text: alt }).eq("id", id));
    await audit(admin, "media.update", "media_assets", id, before, { alt_text: alt });
    revalidatePath("/admin/media");
    return { ok: true, message: "Saved." };
  });
}

export async function deleteMedia(id: string, _prev: ActionState, _fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("admin");
    const db = adminDb();
    const { data: before } = await db.from("media_assets").select("*").eq("id", id).maybeSingle();
    if (!before) return { error: "Asset not found." };
    const { error } = await db.storage.from(BUCKET).remove([before.path as string]);
    if (error) return { error: `Storage error: ${error.message}` };
    check(await db.from("media_assets").delete().eq("id", id));
    await audit(admin, "media.delete", "media_assets", id, before, null);
    // The URL may be referenced by product images/COAs on the public site.
    revalidateSite("/admin/media");
    return { ok: true, message: "Deleted." };
  });
}
