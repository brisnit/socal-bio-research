import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin, roleAtLeast } from "@/lib/admin/auth";
import { signOut } from "../login/actions";

const NAV: { href: string; label: string; min?: "viewer" | "editor" | "admin" | "owner" }[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/chats", label: "Dr. Peptide logs" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/content", label: "Site text & legal" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/commerce", label: "Commerce" },
  { href: "/admin/integrations", label: "Integrations", min: "admin" },
  { href: "/admin/users", label: "Users & roles", min: "owner" },
  { href: "/admin/audit", label: "Audit log", min: "admin" },
];

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin("viewer");
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-background md:block">
        <div className="px-5 py-5">
          <Link href="/admin" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Logo2.png" alt="" className="h-7 w-7 object-contain" />
            <span className="font-display text-sm font-semibold">Socal Admin</span>
          </Link>
        </div>
        <nav className="flex flex-col px-3 pb-6 text-sm">
          {NAV.filter((n) => !n.min || roleAtLeast(admin.role, n.min)).map((n) => (
            <Link key={n.href} href={n.href} className="rounded-md px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border bg-background px-6 py-3 text-sm">
          <details className="md:hidden">
            <summary className="cursor-pointer font-medium">Menu</summary>
            <nav className="absolute z-10 mt-2 flex flex-col rounded-md border border-border bg-background p-2 shadow-lg">
              {NAV.filter((n) => !n.min || roleAtLeast(admin.role, n.min)).map((n) => (
                <Link key={n.href} href={n.href} className="rounded px-3 py-1.5 hover:bg-secondary">{n.label}</Link>
              ))}
            </nav>
          </details>
          <span className="hidden md:inline text-muted-foreground">
            <Link href="/" className="hover:text-foreground">View site ↗</Link>
          </span>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{admin.email} · {admin.role}</span>
            <form action={signOut}>
              <button className="rounded-md border border-border px-3 py-1 hover:bg-secondary">Sign out</button>
            </form>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
