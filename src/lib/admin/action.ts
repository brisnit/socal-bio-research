import "server-only";
import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import type { z } from "zod";

/** Result shape for every admin server action used with useActionState. */
export type ActionState = { ok?: boolean; error?: string; message?: string };

export function zodMessage(err: z.ZodError): string {
  return err.issues
    .slice(0, 5)
    .map((i) => (i.path.length ? `${i.path.join(".")}: ${i.message}` : i.message))
    .join(" · ");
}

/**
 * Runs an action body, turning thrown errors (role checks, DB errors) into a
 * friendly ActionState. redirect()/notFound() are rethrown so they still work.
 */
export async function run(fn: () => Promise<ActionState | void>): Promise<ActionState> {
  try {
    return (await fn()) ?? { ok: true, message: "Saved." };
  } catch (e) {
    unstable_rethrow(e);
    console.error("[admin action]", e);
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

/** Throws a readable error for Supabase responses. */
export function check<T extends { error: { message: string } | null; data?: unknown }>(
  res: T,
  what = "Database",
): Omit<T, "data"> & { data: NonNullable<T["data"]> } {
  if (res.error) throw new Error(`${what} error: ${res.error.message}`);
  return res as Omit<T, "data"> & { data: NonNullable<T["data"]> };
}

/** Revalidates the whole public site (layout-level) plus the given admin paths. */
export function revalidateSite(...adminPaths: string[]) {
  revalidatePath("/", "layout");
  for (const p of adminPaths) revalidatePath(p);
}

export function parseJson(text: string, label: string): unknown {
  if (!text.trim()) return undefined;
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`${label} is not valid JSON: ${e instanceof Error ? e.message : String(e)}`);
  }
}
