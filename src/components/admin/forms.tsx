"use client";

import { startTransition, useActionState, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ActionState = { ok?: boolean; error?: string; message?: string };
type Action = (prev: ActionState, fd: FormData) => Promise<ActionState>;

/**
 * Form bound to a server action via useActionState. Submits manually so React
 * does not reset the fields after the action (keeps edits when validation fails).
 */
export function ActionForm({
  action,
  children,
  className,
  confirm: confirmText,
  submitLabel,
  submitVariant = "primary",
  inline,
}: {
  action: Action;
  children?: ReactNode;
  className?: string;
  confirm?: string;
  submitLabel?: string;
  submitVariant?: "primary" | "secondary" | "danger";
  inline?: boolean;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});
  return (
    <form
      className={cn(inline ? "inline-flex flex-wrap items-center gap-2" : "space-y-4", className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (confirmText && !window.confirm(confirmText)) return;
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}
    >
      {children}
      {submitLabel && (
        <div className={cn(inline ? "inline-flex" : "flex items-center gap-3")}>
          <SubmitButton pending={pending} variant={submitVariant}>{submitLabel}</SubmitButton>
          {!inline && <Status state={state} pending={pending} />}
        </div>
      )}
      {inline && <Status state={state} pending={pending} />}
    </form>
  );
}

function Status({ state, pending }: { state: ActionState; pending: boolean }) {
  if (pending) return null;
  if (state.error) return <span role="alert" className="text-sm text-destructive">{state.error}</span>;
  if (state.ok && state.message) return <span className="text-sm text-emerald-700">{state.message}</span>;
  return null;
}

export function SubmitButton({ pending, variant = "primary", children }: { pending: boolean; variant?: "primary" | "secondary" | "danger"; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:opacity-50",
        variant === "primary" && "bg-foreground text-background hover:opacity-90",
        variant === "secondary" && "border border-border bg-background hover:bg-secondary",
        variant === "danger" && "bg-destructive text-white hover:opacity-90",
      )}
    >
      {pending ? "Working…" : children}
    </button>
  );
}

/** Textarea for JSON with a client-side Format button and parse indicator. Server validates again. */
export function JsonTextArea({ name, defaultValue, rows = 10 }: { name: string; defaultValue: string; rows?: number }) {
  const [value, setValue] = useState(defaultValue);
  let parseError: string | null = null;
  if (value.trim()) {
    try {
      JSON.parse(value);
    } catch (e) {
      parseError = e instanceof Error ? e.message : "Invalid JSON";
    }
  }
  return (
    <div>
      <textarea
        name={name}
        value={value}
        rows={rows}
        spellCheck={false}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      <div className="mt-1 flex items-center gap-3 text-xs">
        {parseError ? <span className="text-destructive">JSON error: {parseError}</span> : <span className="text-muted-foreground">Valid JSON</span>}
        <button
          type="button"
          disabled={!!parseError || !value.trim()}
          onClick={() => setValue(JSON.stringify(JSON.parse(value), null, 2))}
          className="rounded border border-border px-2 py-0.5 hover:bg-secondary disabled:opacity-50"
        >
          Format
        </button>
      </div>
    </div>
  );
}

export function CopyButton({ text, label = "Copy URL" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          window.prompt("Copy this URL", text);
        }
      }}
      className="rounded border border-border px-2 py-1 text-xs hover:bg-secondary"
    >
      {done ? "Copied" : label}
    </button>
  );
}
