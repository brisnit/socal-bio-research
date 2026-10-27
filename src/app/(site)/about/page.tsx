import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { OrangeWord } from "@/components/site/orange-word";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About: Socal Bioresearch",
  description:
    "Socal Bioresearch is a small team helping curious people get honest, plain language answers about peptides: no hype, no pressure.",
  ogTitle: "About Socal Bioresearch",
  ogDescription: "Honest, plain language answers about peptides. Talk to a real person.",
  ogImage: "og-about.jpg",
  path: "/about",
});

const PRINCIPLES = [
  {
    n: "01",
    title: "Why we exist",
    body: "There's a lot of noise around peptides right now: transformation promises, miracle claims, before and after marketing. We started Socal Bioresearch because curious people deserve a place to get straight answers, not a sales pitch.",
  },
  {
    n: "02",
    title: "Who we are",
    body: "A small team that actually picks up the phone. We keep up with what's new, and we're happy to talk through what we know: and just as happy to tell you when the answer is not clear yet.",
  },
  {
    n: "03",
    title: "What we won't do",
    body: "We won't promise transformations. We won't give personal advice. We won't push you to buy. If you're not sure peptides are right for you, we'd rather you walk away informed than walk away with the wrong thing.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="01: About"
        meta="Honest answers · No pressure"
        title="A real team."
        titleMuted={
          <>
            Real <OrangeWord>answers</OrangeWord>.
          </>
        }
        description="Socal Bioresearch exists for one reason: to make peptides easier to understand. We translate the science into plain English, point you to what's known and what isn't, and let you decide for yourself."
      />
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-32 grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <Reveal>
              <p className="eyebrow-mono">02: How we think</p>
              <h2 className="mt-6 font-display text-4xl md:text-5xl font-medium leading-[1.05] tracking-[-0.035em]">
                Three things you should know about us.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-8 md:pt-2">
            <dl className="divide-y divide-border border-y border-border">
              {PRINCIPLES.map((s, a) => (
                <Reveal key={s.n} delay={a * 80}>
                  <div className="grid grid-cols-12 gap-4 py-8 md:py-10">
                    <dt className="col-span-12 md:col-span-3 eyebrow-mono">
                      {s.n}
                      {" · "}
                      {s.title}
                    </dt>
                    <dd className="col-span-12 md:col-span-9 text-base md:text-lg leading-relaxed text-foreground">
                      {s.body}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28 grid gap-10 md:grid-cols-12 md:gap-16 items-end">
          <div className="md:col-span-7">
            <Reveal>
              <p className="eyebrow-mono">03: Talk to us</p>
              <h2 className="mt-6 font-display text-3xl md:text-5xl font-medium leading-[1.05] tracking-[-0.035em]">
                Have a question? Just ask.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4 md:col-start-9 flex flex-col gap-3 text-[15px] font-medium">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-between border-b border-foreground pb-3 hover:opacity-70 transition-opacity"
            >
              <span>Reach out</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/research"
              className="group inline-flex items-center justify-between border-b border-border pb-3 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <span>Common questions</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
