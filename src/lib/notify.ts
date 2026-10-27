import "server-only";
import { getAdminClient } from "@/lib/supabase/admin";

/**
 * Optional email notification for new submissions via Resend's HTTP API.
 * Active only when RESEND_API_KEY and NOTIFY_FROM_EMAIL are set and the
 * 'email_notifications' integration is enabled with recipients in /admin.
 */
export async function notifyNewSubmission(table: string, row: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_FROM_EMAIL;
  const db = getAdminClient();
  if (!key || !from || !db) return;
  const { data } = await db.from("integrations").select("enabled,config").eq("key", "email_notifications").maybeSingle();
  const to = (data?.config as { notify_to?: string[] } | undefined)?.notify_to ?? [];
  if (!data?.enabled || !to.length) return;
  const label = table === "inquiries" ? "New inquiry" : "New customer registration";
  const lines = Object.entries(row)
    .filter(([k]) => !["ip_hash", "user_agent"].includes(k))
    .map(([k, v]) => `${k}: ${v ?? ""}`)
    .join("\n");
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject: `${label}: Socal Bioresearch`, text: `${label}\n\n${lines}\n\nReview it in /admin.` }),
    });
  } catch (err) {
    console.error("[notify]", err);
  }
}
