"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function LegalSection({
  n,
  title,
  summary,
  clause,
}: {
  n: ReactNode;
  title: ReactNode;
  summary: ReactNode;
  clause: ReactNode;
}) {
  return (
    <div className="py-10 md:py-12">
      <p className="eyebrow-mono">
        {n} · {title}
      </p>
      <p className="mt-5 text-base md:text-lg text-foreground leading-relaxed">{summary}</p>
      <div className="mt-5 border-l-2 border-primary/60 bg-secondary/40 pl-5 py-4 pr-4 rounded-r">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary mb-2">Formal clause</p>
        <p className="font-mono text-[12px] md:text-[13px] leading-relaxed text-muted-foreground">{clause}</p>
      </div>
    </div>
  );
}

export function StickyBackButton({ to = "/legal", label = "Back to Legal" }: { to?: string; label?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <Link
      href={to}
      aria-label="Back to Legal hub"
      className={`fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2.5 text-sm font-medium text-foreground shadow-lg backdrop-blur transition-all duration-300 hover:bg-muted hover:opacity-90 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
