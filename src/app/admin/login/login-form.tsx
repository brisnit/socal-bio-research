"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</span>
        <input name="email" type="email" required autoComplete="username" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" />
      </label>
      {state.error && <p className="text-sm text-destructive" role="alert">{state.error}</p>}
      <button disabled={pending} className="h-10 w-full rounded-md bg-foreground text-sm font-medium text-background disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
