import "server-only";
import type { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getAdminClient } from "@/lib/supabase/admin";
import { notifyNewSubmission } from "@/lib/notify";

/**
 * Shared handler for the public forms. Mirrors the original client-side
 * guards on the server (honeypot, minimum fill time, rate limit), validates
 * with the same zod schema the browser uses, then inserts with the service
 * role. Bots that trip the honeypot get a fake success, like the original.
 */
export async function handleFormSubmission<S extends z.ZodTypeAny>(
  req: Request,
  opts: {
    table: "inquiries" | "customer_registrations";
    schema: S;
    minElapsedMs: number;
    nullableFields: string[];
    toRow: (data: z.infer<S>) => Record<string, unknown>;
  },
) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof body.website === "string" && body.website.trim() !== "") return Response.json({ ok: true });
  if (typeof body.elapsedMs !== "number" || body.elapsedMs < opts.minElapsedMs) {
    return Response.json({ error: "Please take a moment to complete the form." }, { status: 400 });
  }
  const ip = clientIp(req);
  if (!rateLimit(`${opts.table}:${ip}`, 5, 10 * 60_000)) {
    return Response.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const input: Record<string, unknown> = { ...body };
  delete input.website;
  delete input.elapsedMs;
  for (const f of opts.nullableFields) if (input[f] == null) input[f] = "";

  const parsed = opts.schema.safeParse(input);
  if (!parsed.success) return Response.json({ error: "Please check the form and try again." }, { status: 422 });

  const db = getAdminClient();
  if (!db) {
    console.error(`[forms] Supabase not configured; ${opts.table} submission dropped`);
    return Response.json({ error: "Submissions are temporarily unavailable." }, { status: 503 });
  }
  const row = {
    ...opts.toRow(parsed.data),
    ip_hash: await hash(ip),
    user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
  };
  const { error } = await db.from(opts.table).insert(row);
  if (error) {
    console.error(`[forms] ${opts.table} insert failed`, error.message);
    return Response.json({ error: "Could not save your submission." }, { status: 500 });
  }
  void notifyNewSubmission(opts.table, row);
  return Response.json({ ok: true }, { status: 201 });
}

async function hash(ip: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode((process.env.IP_HASH_SALT ?? "") + ip));
  return Buffer.from(buf).toString("hex").slice(0, 32);
}
