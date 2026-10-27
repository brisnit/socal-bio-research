import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { OrangeWord } from "@/components/site/orange-word";
import { JsonLd } from "@/components/site/json-ld";
import { getFaqs } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Common questions about peptides: Socal Bioresearch",
  description:
    "Plain language answers to the most common questions about peptides: what they are, why people talk about them, and how to think about them clearly.",
  ogTitle: "Common questions about peptides",
  ogDescription: "Honest, plain language answers: no hype, no pressure.",
  ogImage: "og-research.jpg",
  path: "/research",
});

export default async function ResearchPage() {
  const faqs = await getFaqs();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((a) => ({
            "@type": "Question",
            name: a.q,
            acceptedAnswer: { "@type": "Answer", text: a.a },
          })),
        }}
      />
      <PageHero
        eyebrow="02: Common questions"
        meta="Plain English · No hype"
        title="The questions"
        titleMuted={
          <>
            people <OrangeWord>actually</OrangeWord> ask.
          </>
        }
        description="Before you buy anything, before you commit to anything: here's what most people want to know first. Honest answers, written for humans."
      />
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
          <ul className="divide-y divide-border border-y border-border">
            {faqs.map((s, r) => (
              <Reveal key={s.q} delay={(r % 4) * 60} as="li">
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="grid grid-cols-12 gap-4 cursor-pointer list-none py-8 md:py-10">
                    <span className="col-span-2 md:col-span-1 eyebrow-mono pt-1.5 tabular-nums">
                      {String(r + 1).padStart(2, "0")}
                    </span>
                    <h2 className="col-span-9 md:col-span-10 font-display text-2xl md:text-3xl font-medium tracking-[-0.025em] leading-[1.15]">
                      {s.q}
                    </h2>
                    <span
                      aria-hidden="true"
                      className="col-span-1 justify-self-end inline-flex h-7 w-7 shrink-0 items-center justify-center text-xl text-muted-foreground transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="grid grid-cols-12 gap-4 pb-10 -mt-2">
                    <div className="col-span-12 md:col-span-10 md:col-start-2">
                      <p className="text-base md:text-lg text-foreground leading-relaxed max-w-3xl">{s.a}</p>
                    </div>
                  </div>
                </details>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28 grid gap-10 md:grid-cols-12 md:gap-16 items-end">
          <div className="md:col-span-7">
            <Reveal>
              <p className="eyebrow-mono">03: Still curious</p>
              <h2 className="mt-6 font-display text-3xl md:text-5xl font-medium leading-[1.05] tracking-[-0.035em]">
                Didn&apos;t find your question?
              </h2>
              <p className="mt-6 text-base md:text-lg text-foreground max-w-md leading-relaxed">
                Send it over. A real person will write back: usually within a day.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-4 md:col-start-9 flex flex-col gap-3 text-[15px] font-medium">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-between border-b border-foreground pb-3 hover:opacity-70 transition-opacity"
            >
              <span>Ask your question</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
