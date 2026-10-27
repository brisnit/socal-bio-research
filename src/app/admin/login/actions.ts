"use server";

import { redirect } from "next/navigation";
import { getSessionClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export type LoginState = { error?: string };

export async function signIn(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const supabase = await getSessionClient();
  const db = getAdminClient();
  if (!supabase || !db) return { error: "Supabase is not configured yet. See docs/deployment.md." };

  const h = await headers();
  const ip = clientIp(new Request("http://x", { headers: h }));
  if (!rateLimit(`login:${ip}`, 10, 15 * 60_000)) return { error: "Too many attempts. Try again in 15 minutes." };

  const email = String(fd.get("email") ?? "").trim();
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are required." };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Invalid email or password." };

  const { data: role } = await db.from("admin_users").select("role").eq("user_id", data.user.id).maybeSingle();
  if (!role) {
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await getSessionClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
