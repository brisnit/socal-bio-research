import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-background p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Logo2.png" alt="" className="h-8 w-8 object-contain" />
          <h1 className="font-display text-lg font-semibold">Socal Bioresearch admin</h1>
        </div>
        {!isSupabaseConfigured() && (
          <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Supabase environment variables are not set, so sign-in is unavailable. See docs/deployment.md.
          </p>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
