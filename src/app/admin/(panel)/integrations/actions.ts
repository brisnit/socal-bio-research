"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/admin/audit";
import { adminDb, formString } from "@/lib/admin/db";
import { check, parseJson, revalidateSite, run, zodMessage, type ActionState } from "@/lib/admin/action";
import { jsonObjectSchema } from "@/lib/admin/schemas";

const SECRETISH = /(secret|password|passwd|token|api[_-]?key|private[_-]?key|service[_-]?role)/i;

function findSecretKey(v: unknown, path = ""): string | null {
  if (v && typeof v === "object") {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (SECRETISH.test(k)) return path ? `${path}.${k}` : k;
      const inner = findSecretKey(val, path ? `${path}.${k}` : k);
      if (inner) return inner;
    }
  }
  return null;
}

export async function saveIntegration(key: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("admin");
    const parsed = jsonObjectSchema.safeParse(parseJson(formString(fd, "config"), "Config") ?? {});
    if (!parsed.success) return { error: `Config must be a JSON object. ${zodMessage(parsed.error)}` };
    const secret = findSecretKey(parsed.data);
    if (secret) return { error: `"${secret}" looks like a secret. Secrets belong in environment variables, not here.` };
    const db = adminDb();
    const { data: before } = await db.from("integrations").select("*").eq("key", key).maybeSingle();
    if (!before) return { error: "Integration not found." };
    const after = { enabled: fd.get("enabled") === "on", config: parsed.data, updated_by: admin.userId };
    const { data } = check(await db.from("integrations").update(after).eq("key", key).select("*").single());
    await audit(admin, "integration.update", "integrations", key, before, data);
    // Integrations can affect public features (e.g. Dr. Peptide).
    revalidateSite("/admin/integrations");
    return { ok: true, message: "Saved." };
  });
}
