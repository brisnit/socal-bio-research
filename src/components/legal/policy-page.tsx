import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { LegalSection, StickyBackButton } from "@/components/site/legal-parts";
import type { LegalPolicy } from "@/content/legal/types";

/** Shared body of the five /legal/* policy routes (identical structure in the original bundles). */
export function PolicyPage({ policy }: { policy: LegalPolicy }) {
  const { hero, notice, sections, footer } = policy;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        meta={hero.meta}
        title={hero.title}
        titleMuted={hero.titleMuted}
        description={hero.description}
        backTo={{ to: "/legal", label: "All policies" }}
      />
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-16 md:py-20">
          {notice && (
            <div className="mb-12 rounded-lg border-2 border-primary/70 bg-primary/5 p-6 md:p-8">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary mb-3">
                {notice.label}
              </p>
              <p className="text-base md:text-lg text-foreground leading-relaxed">{notice.body}</p>
            </div>
          )}
          <dl className="divide-y divide-border border-y border-border">
            {sections.map((s) => (
              <LegalSection key={s.n} n={s.n} title={s.title} summary={s.summary} clause={s.clause} />
            ))}
          </dl>
          <p className="mt-12 text-sm text-muted-foreground">
            {footer.lead}{" "}
            <Link
              href="/contact"
              className="text-foreground border-b border-foreground hover:opacity-70 transition-opacity"
            >
              {footer.link}
            </Link>{" "}
            {footer.trail}
          </p>
        </div>
      </section>
      <StickyBackButton />
    </>
  );
}
