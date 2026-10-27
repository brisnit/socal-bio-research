import "server-only";
import { redirect } from "next/navigation";
import { getSessionClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

export type AdminRole = "owner" | "admin" | "editor" | "viewer";
const RANK: Record<AdminRole, number> = { viewer: 1, editor: 2, admin: 3, owner: 4 };

export type AdminSession = { userId: string; email: string; role: AdminRole };

export function roleAtLeast(role: AdminRole, min: AdminRole) {
  return RANK[role] >= RANK[min];
}

/** Current admin or null. Verifies the JWT with Supabase (getUser), then the role table. */
export async function getAdmin(): Promise<AdminSession | null> {
  const session = await getSessionClient();
  const db = getAdminClient();
  if (!session || !db) return null;
  const { data } = await session.auth.getUser();
  if (!data.user) return null;
  const { data: row } = await db.from("admin_users").select("role,email").eq("user_id", data.user.id).maybeSingle();
  if (!row) return null;
  return { userId: data.user.id, email: (row.email as string) ?? data.user.email ?? "", role: row.role as AdminRole };
}

/**
 * Guard for every admin page and server action. Redirects to login when
 * signed out, and throws when signed in without the required role.
 */
export async function requireAdmin(min: AdminRole = "viewer"): Promise<AdminSession> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  if (!roleAtLeast(admin.role, min)) throw new Error(`This action requires the ${min} role.`);
  return admin;
}
