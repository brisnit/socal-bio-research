// Applies supabase/migrations to an in-memory Postgres (PGlite) with minimal
// Supabase auth/storage stubs, then checks the RLS policies by role.
// usage: node tests/db-policies.mjs
import { PGlite } from "@electric-sql/pglite";
import fs from "fs";
const M = decodeURIComponent(new URL("../supabase/migrations/", import.meta.url).pathname);
const db = new PGlite();
// Minimal Supabase stubs: roles, auth.users, auth.uid() from a GUC, storage tables.
await db.exec(`
create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
create schema auth; create table auth.users (id uuid primary key, email text);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create schema storage;
create table storage.buckets (id text primary key, name text, public boolean);
create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
alter table storage.objects enable row level security;
`);
for (const f of fs.readdirSync(M).sort()) { await db.exec(fs.readFileSync(M + f, "utf8")); console.log("applied", f); }
await db.exec(`grant usage on schema public to anon, authenticated; grant all on all tables in schema public to anon, authenticated, service_role; grant all on all sequences in schema public to anon, authenticated, service_role;`);

const owner = "11111111-1111-1111-1111-111111111111", editor = "22222222-2222-2222-2222-222222222222", rando = "33333333-3333-3333-3333-333333333333";
await db.exec(`insert into auth.users values ('${owner}','o@x.com'),('${editor}','e@x.com'),('${rando}','r@x.com');
insert into public.admin_users (user_id,email,role) values ('${owner}','o@x.com','owner'),('${editor}','e@x.com','editor');
insert into public.products (slug,name,category,is_published) values ('pub','Pub','wellness-longevity',true),('hidden','Hidden','wellness-longevity',false);
insert into public.inquiries (name,email,message) values ('A','a@x.com','hi');`);

async function as(role, sub, sql) {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${sub ?? ""}', false); set role ${role};`);
  try { const r = await db.query(sql); return r.rows; } catch (e) { return "ERR: " + e.message.split("\n")[0]; } finally { await db.exec("reset role"); }
}
const t = [];
const expect = (name, got, want) => t.push([JSON.stringify(got) === JSON.stringify(want) ? "PASS" : "FAIL", name, JSON.stringify(got)]);
expect("anon sees only published products", await as("anon", null, "select slug from public.products order by slug"), [{ slug: "pub" }]);
expect("anon cannot read inquiries", await as("anon", null, "select count(*)::int c from public.inquiries"), [{ c: 0 }]);
expect("anon cannot insert inquiries", typeof (await as("anon", null, "insert into public.inquiries (name,email,message) values ('x','x@x.com','m')")), "string");
expect("signed-in non-admin reads no inquiries", await as("authenticated", rando, "select count(*)::int c from public.inquiries"), [{ c: 0 }]);
expect("editor reads inquiries", await as("authenticated", editor, "select count(*)::int c from public.inquiries"), [{ c: 1 }]);
expect("editor sees unpublished products", await as("authenticated", editor, "select count(*)::int c from public.products"), [{ c: 2 }]);
expect("editor cannot change integrations", await as("authenticated", editor, "update public.integrations set enabled=true where key='payments' returning key"), []);
expect("editor cannot manage admin users", await as("authenticated", editor, "update public.admin_users set role='owner' where user_id='" + editor + "' returning role"), []);
expect("owner can manage admin users", await as("authenticated", owner, "update public.admin_users set role='admin' where user_id='" + editor + "' returning role"), [{ role: "admin" }]);
await db.exec(`insert into public.audit_log (action, entity) values ('x','y')`);
expect("audit log is append-only", typeof (await as("service_role", null, "delete from public.audit_log")), "string");
expect("anon cannot read commerce", await as("anon", null, "select count(*)::int c from public.orders"), [{ c: 0 }]);
expect("payments integration disabled by default", (await db.query("select enabled from public.integrations where key='payments'")).rows, [{ enabled: false }]);
for (const r of t) console.log(r.join("  "));
process.exit(t.some((r) => r[0] === "FAIL") ? 1 : 0);
