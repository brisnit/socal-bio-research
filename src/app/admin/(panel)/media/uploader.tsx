"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { createUpload, finalizeUpload } from "./actions";

const MAX = 25 * 1024 * 1024;
const ACCEPT = "image/*,application/pdf,video/*";

export function Uploader({ supabaseUrl, anonKey }: { supabaseUrl: string; anonKey: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return setMsg({ ok: false, text: "Choose a file first." });
    if (file.size > MAX) return setMsg({ ok: false, text: "Files must be 25 MB or smaller." });
    setBusy(true);
    setMsg(null);
    try {
      const req = await createUpload({ name: file.name, type: file.type, size: file.size });
      if (req.error || !req.path || !req.token) throw new Error(req.error ?? "Could not start upload.");
      const sb = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
      const { error } = await sb.storage.from("media").uploadToSignedUrl(req.path, req.token, file, { contentType: file.type });
      if (error) throw new Error(`Upload failed: ${error.message}`);
      const res = await finalizeUpload({ path: req.path, alt });
      if (res.error) throw new Error(res.error);
      setMsg({ ok: true, text: "Uploaded." });
      setAlt("");
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Upload failed." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">File (image, PDF or video, max 25 MB)</span>
        <input ref={fileRef} type="file" accept={ACCEPT} className="text-sm" />
      </label>
      <label className="block min-w-60 flex-1">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Alt text</span>
        <input value={alt} onChange={(e) => setAlt(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
      </label>
      <button type="button" disabled={busy} onClick={upload} className="h-9 rounded-md bg-foreground px-4 text-sm font-medium text-background disabled:opacity-50">
        {busy ? "Uploading…" : "Upload"}
      </button>
      {msg && <p role="status" className={msg.ok ? "w-full text-sm text-emerald-700" : "w-full text-sm text-destructive"}>{msg.text}</p>}
    </div>
  );
}
