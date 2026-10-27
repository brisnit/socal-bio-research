import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { LEGAL_HUB } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Legal & Policies: Socal Bioresearch",
  description:
    "Plain language, formally documented policies: Terms, Privacy, Disclaimer, Acceptable Use, and Shipping & Returns.",
  ogTitle: "Legal & Policies: Socal Bioresearch",
  ogDescription:
    "Every policy in plain English, with the formal clause underneath. Reviewed and updated regularly.",
  ogImage: "og-compliance.jpg",
  path: "/legal",
});

export default function LegalIndexPage() {
  const { hero, cards, contact } = LEGAL_HUB;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        meta={hero.meta}
        title={hero.title}
        titleMuted={hero.titleMuted}
        description={hero.description}
        backTo={{ to: "/", label: "Back to home" }}
      />
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
          <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {cards.map((a, s) => (
              <Reveal key={a.n} delay={s * 80}>
                <Link
                  href={a.to}
                  className="group block h-full bg-background p-8 md:p-10 transition-colors hover:bg-secondary"
                >
                  <p className="eyebrow-mono">
                    {a.n}
                    {" / 05"}
                  </p>
                  <div className="mt-6 flex items-start justify-between gap-4">
                    <h2 className="font-display text-2xl md:text-3xl font-medium tracking-[-0.03em]">{a.title}</h2>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{a.summary}</p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={500}>
            <div className="mt-16 border-t border-border pt-10 max-w-3xl">
              <p className="eyebrow-mono">{contact.eyebrow}</p>
              <p className="mt-4 text-base md:text-lg text-foreground leading-relaxed">
                {contact.lead}{" "}
                <Link href="/contact" className="border-b border-foreground hover:opacity-70 transition-opacity">
                  {contact.link}
                </Link>{" "}
                {contact.trail}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
