"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/admin/audit";
import { adminDb, formString } from "@/lib/admin/db";
import { check, run, zodMessage, type ActionState } from "@/lib/admin/action";
import { ADMIN_ROLES } from "@/lib/admin/schemas";

const inviteSchema = z.object({ email: z.string().trim().toLowerCase().email("Enter a valid email"), role: z.enum(ADMIN_ROLES) });

async function ownerCount() {
  const { count } = await adminDb().from("admin_users").select("*", { count: "exact", head: true }).eq("role", "owner");
  return count ?? 0;
}

async function findAuthUserId(email: string): Promise<string | null> {
  const db = adminDb();
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(`Auth error: ${error.message}`);
    const hit = data.users.find((u) => u.email?.toLowerCase() === email);
    if (hit) return hit.id;
    if (data.users.length < 200) break;
  }
  return null;
}

export async function inviteUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("owner");
    const parsed = inviteSchema.safeParse({ email: formString(fd, "email"), role: formString(fd, "role") });
    if (!parsed.success) return { error: zodMessage(parsed.error) };
    const { email, role } = parsed.data;
    const db = adminDb();
    const { data: existing } = await db.from("admin_users").select("user_id").eq("email", email).maybeSingle();
    if (existing) return { error: "That email already has admin access." };

    const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
    if (!site) return { error: "NEXT_PUBLIC_SITE_URL is not set, so the invite link cannot be built." };
    const { data, error } = await db.auth.admin.inviteUserByEmail(email, { redirectTo: `${site}/admin/login` });
    let userId = data?.user?.id ?? null;
    let invited = true;
    if (error) {
      // Existing Supabase Auth account: grant the role without a new invite.
      if (!/already|registered|exists/i.test(error.message)) return { error: `Invite failed: ${error.message}` };
      userId = await findAuthUserId(email);
      invited = false;
      if (!userId) return { error: `Invite failed: ${error.message}` };
    }
    const row = { user_id: userId, email, role, created_by: admin.userId };
    check(await db.from("admin_users").insert(row));
    await audit(admin, "admin_user.invite", "admin_users", userId, null, row);
    revalidatePath("/admin/users");
    return { ok: true, message: invited ? `Invitation sent to ${email}.` : `${email} already had an account; access granted as ${role}.` };
  });
}

export async function changeRole(userId: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("owner");
    const role = z.enum(ADMIN_ROLES).safeParse(formString(fd, "role"));
    if (!role.success) return { error: "Choose a valid role." };
    if (userId === admin.userId) return { error: "You cannot change your own role." };
    const db = adminDb();
    const { data: before } = await db.from("admin_users").select("*").eq("user_id", userId).maybeSingle();
    if (!before) return { error: "User not found." };
    if (before.role === role.data) return { ok: true, message: "No change." };
    if (before.role === "owner" && (await ownerCount()) <= 1) return { error: "Cannot demote the last owner." };
    check(await db.from("admin_users").update({ role: role.data }).eq("user_id", userId));
    await audit(admin, "admin_user.role", "admin_users", userId, before, { ...before, role: role.data });
    revalidatePath("/admin/users");
    return { ok: true, message: "Role updated." };
  });
}

/** Removes admin access (deletes the admin_users row). The Supabase Auth account itself is kept. */
export async function removeUser(userId: string, _prev: ActionState, _fd: FormData): Promise<ActionState> {
  return run(async () => {
    const admin = await requireAdmin("owner");
    if (userId === admin.userId) return { error: "You cannot remove yourself." };
    const db = adminDb();
    const { data: before } = await db.from("admin_users").select("*").eq("user_id", userId).maybeSingle();
    if (!before) return { error: "User not found." };
    if (before.role === "owner" && (await ownerCount()) <= 1) return { error: "Cannot remove the last owner." };
    check(await db.from("admin_users").delete().eq("user_id", userId));
    await audit(admin, "admin_user.remove", "admin_users", userId, before, null);
    revalidatePath("/admin/users");
    return { ok: true, message: "Access removed." };
  });
}
