import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { Card, Empty, PageTitle, Pager, TextInput, formatDate } from "@/components/admin/ui";

const PER = 100;

type Msg = { id: number; created_at: string; session_id: string | null; question: string; answer: string; model: string | null };

export default async function Chats({ searchParams }: { searchParams: Promise<{ session?: string; page?: string }> }) {
  await requireAdmin("viewer");
  const sp = await searchParams;
  const session = sp.session?.trim().slice(0, 200) || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  let q = adminDb()
    .from("chat_messages")
    .select("id,created_at,session_id,question,answer,model")
    .order("created_at", { ascending: false })
    .range((page - 1) * PER, page * PER);
  if (session) q = q.eq("session_id", session);
  const { data, error } = await q;
  const rows = ((data ?? []) as Msg[]).slice(0, PER);

  // Group by session, newest session first; messages within a session oldest first.
  const groups = new Map<string, Msg[]>();
  for (const m of rows) {
    const k = m.session_id ?? "(no session)";
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(m);
  }

  return (
    <>
      <PageTitle title="Dr. Peptide logs" description="Read-only log of assistant conversations, grouped by session." />
      <form className="mb-6 flex gap-2" action="/admin/chats">
        <TextInput name="session" placeholder="Filter by session ID" defaultValue={session ?? ""} className="max-w-sm" />
        <button className="h-9 rounded-md border border-border bg-background px-4 text-sm hover:bg-secondary">Filter</button>
        {session && <Link href="/admin/chats" className="self-center text-sm underline">Clear</Link>}
      </form>
      {error && <p className="mb-4 text-sm text-destructive">{error.message}</p>}
      {!rows.length && <Empty>No chat messages.</Empty>}
      <div className="space-y-6">
        {[...groups.entries()].map(([sid, msgs]) => (
          <Card key={sid}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              {sid === "(no session)" ? <span>{sid}</span> : <Link className="font-mono underline" href={`/admin/chats?session=${encodeURIComponent(sid)}`}>{sid}</Link>}
              <span>{msgs.length} message{msgs.length === 1 ? "" : "s"}</span>
            </div>
            <div className="space-y-4">
              {[...msgs].reverse().map((m) => (
                <div key={m.id} className="border-l-2 border-border pl-4 text-sm">
                  <div className="text-xs text-muted-foreground">{formatDate(m.created_at)}{m.model ? ` · ${m.model}` : ""}</div>
                  <p className="mt-1 font-medium whitespace-pre-wrap">Q: {m.question}</p>
                  <p className="mt-1 whitespace-pre-wrap text-muted-foreground">A: {m.answer}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <Pager basePath="/admin/chats" page={page} hasNext={(data?.length ?? 0) > PER} params={{ session }} />
    </>
  );
}
