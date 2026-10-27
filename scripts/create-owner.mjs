// One-time bootstrap: creates (or promotes) the first admin "owner" account.
// usage: node --env-file=.env.local scripts/create-owner.mjs owner@example.com 'a-strong-password'
// Further admins are invited from /admin/users.
import { createClient } from "@supabase/supabase-js";

const [, , email, password] = process.argv;
if (!email || !password) {
  console.error("usage: node --env-file=.env.local scripts/create-owner.mjs <email> <password>");
  process.exit(1);
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
const db = createClient(url, key, { auth: { persistSession: false } });

let userId;
const created = await db.auth.admin.createUser({ email, password, email_confirm: true });
if (created.error) {
  // Already exists: find it.
  const { data, error } = await db.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  userId = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
  if (!userId) throw created.error;
  console.log("User already existed; promoting to owner.");
} else {
  userId = created.data.user.id;
}
const { error } = await db.from("admin_users").upsert({ user_id: userId, email, role: "owner" });
if (error) throw error;
console.log(`Owner ready: ${email}. Sign in at /admin/login`);
