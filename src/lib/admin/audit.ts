import "server-only";
import { getAdminClient } from "@/lib/supabase/admin";
import type { AdminSession } from "./auth";

/** Appends to the immutable audit log. Never throws: logging must not block the action. */
export async function audit(
  admin: AdminSession,
  action: string,
  entity: string,
  entityId: string | null,
  before: unknown = null,
  after: unknown = null,
) {
  const db = getAdminClient();
  if (!db) return;
  const { error } = await db.from("audit_log").insert({
    actor_id: admin.userId,
    actor_email: admin.email,
    action,
    entity,
    entity_id: entityId,
    before,
    after,
  });
  if (error) console.error("[audit]", error.message);
}
