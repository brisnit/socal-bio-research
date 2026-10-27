"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, LoaderCircle, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SESSION_KEY = "drp:session";
const HISTORY_KEY = "drp:history";
const TEASER_KEY = "drp:teaserDismissed";

export const NAVY = "oklch(0.16 0.05 250)";
export const BLUE = "oklch(0.22 0.07 248)";
export const ORANGE = "oklch(0.72 0.19 50)";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content:
    "Hey: I'm Dr. Peptide. Ask me anything about peptides: what they are, how they work, what people use them for. I'll keep it plain English. For anything specific to you or your order, I'll connect you to a real person on our team.",
};

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `s_${crypto.randomUUID().replace(/-/g, "")}`;
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/** Opens the chat from anywhere (header pill, cards, hero buttons). */
export function openDrPeptide() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("drp:open"));
}

export function DrPeptideWidget() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [teaser, setTeaser] = useState(false);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef("");

  useEffect(() => {
    setMounted(true);
    sessionRef.current = getSessionId();
    try {
      const saved = window.sessionStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {}
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!window.localStorage.getItem(TEASER_KEY)) timer = setTimeout(() => setTeaser(true), 1800);
    } catch {}
    const onOpen = () => {
      setOpen(true);
      setTeaser(false);
      try {
        window.localStorage.setItem(TEASER_KEY, "1");
      } catch {}
    };
    window.addEventListener("drp:open", onOpen);
    return () => {
      window.removeEventListener("drp:open", onOpen);
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, loading]);

  const dismissTeaser = useCallback(() => {
    setTeaser(false);
    try {
      window.localStorage.setItem(TEASER_KEY, "1");
    } catch {}
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (text.length > 4000) {
      setError("That's a long one: please trim to 4000 characters or fewer.");
      return;
    }
    setError("");
    setInput("");
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    let acc = "";
    let started = false;
    try {
      const res = await fetch("/api/dr-peptide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionRef.current,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) {
        let msg = "Dr. Peptide ran into a hiccup. Please try again.";
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {}
        setError(msg);
        setLoading(false);
        return;
      }
      if (!res.body) {
        setError("No response from Dr. Peptide.");
        setLoading(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { done: end, value } = await reader.read();
        if (end) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "" || !line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") {
            done = true;
            break;
          }
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              if (started) {
                setMessages((prev) => {
                  const copy = [...prev];
                  copy[copy.length - 1] = { role: "assistant", content: acc };
                  return copy;
                });
              } else {
                started = true;
                setMessages((prev) => [...prev, { role: "assistant", content: acc }]);
              }
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError("Couldn't reach Dr. Peptide. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handoff = useCallback(() => {
    const recent = messages
      .filter((m) => m.role === "user")
      .slice(-2)
      .map((m) => m.content)
      .join("\n\n");
    const summary = recent
      ? `I was chatting with Dr. Peptide and would like to talk to a real person.\n\nMy questions so far:\n\n${recent}\n\n`
      : `I'd like to talk to a real person about peptides.\n\n`;
    setOpen(false);
    try {
      window.sessionStorage.setItem("drp:handoff", summary);
    } catch {}
    router.push("/contact?type=other&product=");
  }, [messages, router]);

  const reset = useCallback(() => {
    setMessages([GREETING]);
    setError("");
    try {
      window.sessionStorage.removeItem(HISTORY_KEY);
    } catch {}
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const openChat = useCallback(() => {
    setOpen(true);
    dismissTeaser();
  }, [dismissTeaser]);

  if (!mounted) return null;

  return (
    <>
      {!open && teaser && (
        <div
          role="status"
          className="fixed bottom-[6.5rem] right-6 z-50 max-w-[260px] animate-[drp-bubble-in_0.45s_ease-out_both]"
        >
          <div
            className="relative rounded-2xl border border-white/10 px-4 py-3 pr-9 text-[13px] leading-snug text-white shadow-[0_18px_50px_-15px_oklch(0.16_0.05_250/0.55)]"
            style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 60%, ${ORANGE} 100%)` }}
          >
            <p className="font-medium">
              <span aria-hidden className="mr-1.5">
                👋
              </span>
              Hi! I&apos;m <span className="font-semibold">Dr. Peptide</span>. Ask me anything about peptides: free.
            </p>
            <button
              type="button"
              onClick={dismissTeaser}
              aria-label="Dismiss Dr. Peptide intro"
              className="absolute top-1.5 right-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <span aria-hidden className="absolute -bottom-1.5 right-8 h-3 w-3 rotate-45" style={{ background: ORANGE }} />
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label={open ? "Close Dr. Peptide chat" : "Open Dr. Peptide: free AI guide to peptides"}
        onClick={() => (open ? setOpen(false) : openChat())}
        className={cn(
          "fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full pl-2 pr-5 py-2 text-white shadow-[0_20px_60px_-15px_oklch(0.72_0.19_50/0.55)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "hover:scale-[1.03] hover:shadow-[0_28px_80px_-15px_oklch(0.72_0.19_50/0.7)] active:scale-100",
          open && "opacity-0 pointer-events-none translate-y-2",
        )}
        style={
          {
            background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 55%, ${ORANGE} 100%)`,
            boxShadow: open ? undefined : `0 20px 60px -15px oklch(0.72 0.19 50 / 0.55), 0 0 0 1px ${ORANGE} inset`,
            "--tw-ring-color": "oklch(0.78 0.18 55)",
          } as React.CSSProperties
        }
      >
        <span
          className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[color:var(--brand-blue,oklch(0.22_0.07_248))]"
          style={{ color: NAVY }}
        >
          <Sparkles className="h-5 w-5" />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full animate-[drp-ring-pulse_2.6s_ease-out_infinite]"
            style={{ boxShadow: `0 0 0 0 ${ORANGE}` }}
          />
          <span
            aria-hidden
            className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white animate-pulse-soft"
            style={{ background: ORANGE }}
          />
        </span>
        <span className="flex flex-col items-start leading-tight text-left">
          <span className="text-[14px] font-semibold tracking-tight">Ask Dr. Peptide</span>
          <span className="text-[10px] uppercase tracking-[0.16em] text-white/80">Free · Plain English</span>
        </span>
      </button>

      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-[420px] origin-bottom-right transition-all duration-300",
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none translate-y-2",
        )}
        role="dialog"
        aria-label="Dr. Peptide chat"
        aria-hidden={!open}
      >
        <div className="flex h-[min(640px,calc(100vh-3rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div
            className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 text-white"
            style={{ background: `linear-gradient(120deg, ${NAVY} 0%, ${BLUE} 55%, ${ORANGE} 110%)` }}
          >
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
                style={{ color: NAVY }}
              >
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] opacity-90">
                  Free AI guide · Plain English
                </p>
                <h3 className="font-display text-lg font-semibold tracking-[-0.02em]">Dr. Peptide</h3>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={reset}
                className="rounded-md px-2 py-1 text-[11px] font-medium hover:bg-white/15 transition-colors"
                aria-label="Start over"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/15 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-background">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap",
                  m.role === "user" ? "ml-auto bg-foreground text-background" : "mr-auto bg-secondary text-foreground",
                )}
              >
                {m.content}
                {m.role === "assistant" && i === messages.length - 1 && loading && (
                  <span className="inline-block w-1 h-4 ml-0.5 bg-foreground/60 animate-pulse align-middle" />
                )}
              </div>
            ))}
            {error && (
              <div className="mx-auto max-w-[90%] rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}
            {messages.length > 1 && !loading && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handoff}
                  className="group w-full inline-flex items-center justify-between gap-3 rounded-md border border-border px-4 py-2.5 text-[13px] font-medium hover:bg-secondary transition-colors"
                >
                  <span>Connect me to a real person</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-border bg-background p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about a peptide…"
                rows={1}
                maxLength={4000}
                disabled={loading}
                className="flex-1 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 max-h-32"
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                style={{ background: `linear-gradient(135deg, ${BLUE}, ${ORANGE})` }}
              >
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Educational only · Not personal advice
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/** The three inline "Ask Dr. Peptide" trigger styles used across pages. */
export function AskDrPeptideButton({
  variant = "nav",
  label = "Ask Dr. Peptide",
  className,
}: {
  variant?: "nav" | "card" | "hero";
  label?: string;
  className?: string;
}) {
  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={openDrPeptide}
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl border border-white/10 p-5 md:p-6 text-left text-white shadow-[0_18px_50px_-25px_oklch(0.16_0.05_250/0.55)] transition-all hover:scale-[1.005] hover:shadow-[0_28px_70px_-25px_oklch(0.72_0.19_50/0.5)]",
          className,
        )}
        style={{ background: `linear-gradient(125deg, ${NAVY} 0%, ${BLUE} 55%, ${ORANGE} 110%)` }}
      >
        <div className="flex items-center gap-4">
          <span
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-md"
            style={{ color: NAVY }}
          >
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-white/85">
              Free AI guide · Instant answers
            </p>
            <p className="mt-1 font-display text-base md:text-lg font-semibold tracking-tight">{label}</p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-white/90 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </button>
    );
  }
  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={openDrPeptide}
        className={cn(
          "group relative inline-flex items-center gap-3 overflow-hidden rounded-full pl-2 pr-5 py-2 text-white shadow-[0_18px_50px_-15px_oklch(0.72_0.19_50/0.5)] transition-all hover:scale-[1.02] hover:shadow-[0_24px_60px_-15px_oklch(0.72_0.19_50/0.65)] active:scale-100",
          className,
        )}
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 55%, ${ORANGE} 100%)` }}
      >
        <span
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-md"
          style={{ color: NAVY }}
        >
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="flex flex-col items-start leading-tight text-left">
          <span className="text-[14px] font-semibold tracking-tight">{label}</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/80">Free · Instant answers</span>
        </span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={openDrPeptide}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all hover:shadow-[0_8px_22px_-12px_oklch(0.72_0.19_50/0.6)]",
        className,
      )}
      style={{ borderColor: ORANGE, color: NAVY, background: "white" }}
    >
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full animate-pulse-soft" style={{ background: ORANGE }} />
      {label}
    </button>
  );
}
