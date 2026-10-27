import "server-only";
import { getAdminClient } from "@/lib/supabase/admin";

/** Service-role client for admin server code; only call after requireAdmin(). */
export function adminDb() {
  const db = getAdminClient();
  if (!db) throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  return db;
}

export function formString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}
