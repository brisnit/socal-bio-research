import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "./reveal";

export function PageHero({
  eyebrow,
  title,
  titleMuted,
  description,
  meta,
  backTo,
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  titleMuted?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  backTo?: { to: string; label: string };
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate -mt-20 overflow-visible bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 md:px-6 pt-32 md:pt-40 pb-20 md:pb-28">
        {backTo && (
          <Link
            href={backTo.to}
            className="group mb-10 inline-flex items-center gap-2 eyebrow-mono hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>{backTo.label}</span>
          </Link>
        )}
        <div className="flex items-start justify-between gap-8 eyebrow-mono">
          <span>{eyebrow}</span>
          {meta && <span className="hidden md:inline">{meta}</span>}
        </div>
        <Reveal>
          <h1 className="hero-headline mt-16 md:mt-20 font-display font-medium leading-[1.18] tracking-[-0.04em] text-[clamp(2.75rem,8vw,7rem)]">
            <span className="block pb-[0.06em]">{title}</span>
            {titleMuted && <span className="block text-muted-foreground pb-[0.22em]">{titleMuted}</span>}
          </h1>
        </Reveal>
        {(description || children) && (
          <Reveal delay={150}>
            <div className="mt-10 md:mt-14 grid gap-10 md:grid-cols-12 md:gap-16 md:items-end">
              {description && (
                <p className="md:col-span-6 text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl">
                  {description}
                </p>
              )}
              {children && <div className="md:col-span-5 md:col-start-8">{children}</div>}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
