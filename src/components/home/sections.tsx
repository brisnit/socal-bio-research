import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { CATEGORY_LABELS, type CategoryKey, type Product } from "@/content/products";

const WHAT_WE_DO = [
  {
    k: "What we do",
    v: "We help with research and help clients better understand peptides: what they are, what the literature says, and what questions to ask.",
  },
  {
    k: "What we don't do",
    v: "No personal advice. No personal recommendations. No measurement guidance, laboratory procedure, or instructions for use. If you need personal guidance, talk to a licensed healthcare provider.",
  },
  {
    k: "Quality you can verify",
    v: "Every peptide we carry is 99%+ purity and independently tested: so you know exactly what's in the vial.",
  },
  {
    k: "Not a pharmacy",
    v: "We are not a compounding pharmacy and we don't prescribe. We're a small team focused on clear, honest information.",
  },
];

export function WhatWeDo() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:grid-cols-12 md:gap-16 md:px-6 md:py-32">
        <div className="md:col-span-5">
          <Reveal>
            <p className="eyebrow-mono">03: What we do</p>
            <h2 className="mt-6 font-display text-4xl md:text-5xl font-medium leading-[1.05] tracking-[-0.035em]">
              Research support, <span className="text-accent">not</span> personal advice.
            </h2>
          </Reveal>
        </div>
        <div className="md:col-span-7 md:pt-2">
          <dl className="divide-y divide-border">
            {WHAT_WE_DO.map((item, i) => (
              <Reveal key={item.k} delay={i * 80}>
                <div className="grid grid-cols-12 gap-4 py-6">
                  <dt className="col-span-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground pt-1">
                    {item.k}
                  </dt>
                  <dd className="col-span-8 text-base md:text-lg leading-relaxed text-foreground">{item.v}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

const ARROW = "h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5";

export function WhatPeopleAsk({ wellness, performance }: { wellness: Product[]; performance: Product[] }) {
  const categories: CategoryKey[] = ["wellness-longevity", "performance-recovery"];
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-32">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <Reveal>
            <p className="eyebrow-mono">04: What people ask about</p>
            <h2 className="mt-6 font-display text-4xl md:text-6xl font-medium leading-[1.02] tracking-[-0.04em]">
              Two things people are curious about.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-sm font-medium border-b border-border pb-1 hover:border-foreground transition-colors"
            >
              Ask us anything
              <ArrowUpRight className={ARROW} />
            </Link>
          </Reveal>
        </div>
        <div className="grid gap-px bg-border md:grid-cols-2">
          {categories.map((cat, idx) => {
            const list = cat === "wellness-longevity" ? wellness : performance;
            return (
              <Reveal key={cat} delay={idx * 120}>
                <article className="group h-full bg-background p-8 md:p-12 transition-colors hover:bg-secondary">
                  <p className="eyebrow-mono">
                    {"0"}
                    {idx + 1}
                    {" / 02"}
                  </p>
                  <h3 className="mt-6 font-display text-3xl md:text-4xl font-medium tracking-[-0.03em]">
                    {CATEGORY_LABELS[cat]}
                  </h3>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-md">
                    {cat === "wellness-longevity"
                      ? "The peptides people are asking about for energy, sleep, metabolic health and aging related research."
                      : "The peptides people are asking about for recovery, joint health and tissue repair."}
                  </p>
                  <ul className="mt-10 divide-y divide-border">
                    {list.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/products/${p.slug}`}
                          className="group/row flex items-center justify-between py-4 text-[15px] transition-colors hover:text-foreground"
                        >
                          <span className="font-medium">{p.name}</span>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-foreground" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="px-4 md:px-6 pb-24">
      <div
        className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl p-10 md:p-20 text-white shadow-[0_30px_80px_-30px_oklch(0.55_0.20_45/0.55)]"
        style={{ background: "var(--gradient-cta)" }}
      >
        <div
          aria-hidden={true}
          className="pointer-events-none absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.20 55 / 0.65), transparent 65%)" }}
        />
        <div
          aria-hidden={true}
          className="pointer-events-none absolute -bottom-40 -left-20 h-[26rem] w-[26rem] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.21 45 / 0.55), transparent 70%)" }}
        />
        <div className="relative">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-white/85">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white align-middle mr-2" />
            05: Get in touch
          </p>
          <h2 className="mt-6 font-display text-4xl md:text-6xl font-medium leading-[1.02] tracking-[-0.04em] max-w-3xl text-white">
            Have a question? <span className="italic font-light text-white/95">Ask a real person.</span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-white/90 max-w-xl leading-relaxed">
            No pressure, no sales script. Tell us what you&apos;re curious about and we&apos;ll point you to a clear,
            honest answer.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-3 sm:gap-5 text-[15px] font-medium">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 text-[oklch(0.22_0.06_250)] shadow-lg hover:bg-white/95 hover:scale-[1.02] active:scale-100 transition-all"
            >
              Reach out
              <ArrowUpRight className={ARROW} />
            </Link>
            <Link
              href="/new-customer"
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/60 px-7 py-3.5 text-white hover:bg-white/10 hover:border-white transition-colors"
            >
              I&apos;m new to peptides
              <ArrowUpRight className={ARROW} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
