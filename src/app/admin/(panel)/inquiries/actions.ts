"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/admin/audit";
import { adminDb, formString } from "@/lib/admin/db";
import { check, run, zodMessage, type ActionState } from "@/lib/admin/action";
import { INQUIRY_STATUSES } from "@/lib/admin/schemas";

const schema = z.object({ status: z.enum(INQUIRY_STATUSES), admin_notes: z.string().max(10000) });

/** Shared by inquiries and registrations. */
export async function updateSubmission(
  table: "inquiries" | "customer_registrations",
  id: string,
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("editor");
    if (table !== "inquiries" && table !== "customer_registrations") throw new Error("Unknown table");
    const parsed = schema.safeParse({ status: formString(fd, "status"), admin_notes: formString(fd, "admin_notes") });
    if (!parsed.success) return { error: zodMessage(parsed.error) };
    const db = adminDb();
    const { data: before } = await db.from(table).select("status,admin_notes").eq("id", id).maybeSingle();
    if (!before) return { error: "Record not found." };
    const after = { status: parsed.data.status, admin_notes: parsed.data.admin_notes || null };
    check(await db.from(table).update(after).eq("id", id));
    await audit(admin, `${table === "inquiries" ? "inquiry" : "registration"}.update`, table, id, before, after);
    const base = table === "inquiries" ? "/admin/inquiries" : "/admin/registrations";
    revalidatePath(base);
    revalidatePath(`${base}/${id}`);
    revalidatePath("/admin");
    return { ok: true, message: "Saved." };
  });
}
