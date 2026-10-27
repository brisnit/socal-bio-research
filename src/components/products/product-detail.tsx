import Link from "next/link";
import { ArrowUpRight, ChevronRight, ExternalLink } from "lucide-react";
import type { CategoryKey, Product, ProductSpecs } from "@/content/products";
import { AskDrPeptideButton } from "@/components/site/dr-peptide";
import { Reveal } from "@/components/site/reveal";

type SpecRow = { label: string; value: string; mono?: boolean };

export function ProductDetail({
  peptide,
  spec,
  related,
  categoryLabels,
}: {
  peptide: Product;
  spec: ProductSpecs;
  related: Product[];
  categoryLabels: Record<CategoryKey, string>;
}) {
  const rows: SpecRow[] = [];
  rows.push({ label: "Purity", value: peptide.purity });
  if (spec.cas) rows.push({ label: "CAS Number", value: spec.cas, mono: true });
  if (spec.molecularWeight) rows.push({ label: "Molecular Weight", value: spec.molecularWeight, mono: true });
  if (spec.molecularFormula) rows.push({ label: "Molecular Formula", value: spec.molecularFormula, mono: true });
  rows.push({ label: "Form", value: spec.form ?? "Lyophilized" });
  rows.push({ label: "Storage", value: spec.storage ?? "−20°C, desiccated" });
  rows.push({ label: "Category", value: categoryLabels[peptide.category] });

  const contactHref = `/contact?${new URLSearchParams({ type: "catalog", product: peptide.name }).toString()}`;

  return (
    <>
      <section className="relative -mt-20 bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 md:px-6 pt-32 md:pt-40 pb-16 md:pb-20">
          <Reveal>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 eyebrow-mono">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <Link href="/products" className="hover:text-foreground transition-colors">
                Catalog
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <span className="text-foreground">{peptide.name}</span>
            </nav>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-12 eyebrow-mono">{categoryLabels[peptide.category]}</p>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="mt-5 font-display font-medium leading-[0.98] tracking-[-0.04em] text-[clamp(2.75rem,8vw,6.5rem)]">
              {peptide.name}
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-6 text-lg md:text-xl text-foreground max-w-2xl leading-relaxed">{peptide.tagline}</p>
          </Reveal>
          <Reveal delay={380}>
            <div className="mt-10 max-w-xl">
              <AskDrPeptideButton variant="card" label={`Have a question about ${peptide.name}? Ask Dr. Peptide.`} />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
          <div className="grid gap-16 md:grid-cols-12 md:gap-20">
            <div className="md:col-span-8 space-y-16">
              <Reveal>
                <section>
                  <h2 className="eyebrow-mono">01: Overview</h2>
                  <p className="mt-6 text-lg md:text-xl text-foreground leading-relaxed">{peptide.summary}</p>
                </section>
              </Reveal>
              <Reveal delay={100}>
                <section className="border-t border-border pt-12">
                  <h2 className="eyebrow-mono">02: How it works</h2>
                  <p className="mt-6 text-base md:text-lg text-foreground leading-relaxed">{peptide.mechanism}</p>
                </section>
              </Reveal>
              {spec.sequence && (
                <Reveal delay={150}>
                  <section className="border-t border-border pt-12">
                    <h2 className="eyebrow-mono">03: Sequence</h2>
                    <code className="mt-6 block font-mono text-sm md:text-base leading-relaxed break-all text-foreground">
                      {spec.sequence}
                    </code>
                  </section>
                </Reveal>
              )}
              <Reveal delay={200}>
                <section className="border-t border-border pt-12">
                  <h2 className="eyebrow-mono">04: Common areas</h2>
                  <ul className="mt-6 grid gap-px bg-border border border-border sm:grid-cols-2">
                    {peptide.researchAreas.map((area) => (
                      <li key={area} className="bg-background px-5 py-4 text-sm font-medium text-foreground">
                        {area}
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
              {peptide.references.length > 0 && (
                <Reveal delay={280}>
                  <section className="border-t border-border pt-12">
                    <h2 className="eyebrow-mono">05: References</h2>
                    <p className="mt-4 text-sm text-muted-foreground max-w-2xl">
                      References provided for context. Not personal guidance.
                    </p>
                    <ul className="mt-8 divide-y divide-border border-y border-border">
                      {peptide.references.map((ref, i) => (
                        <li key={ref.url}>
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start justify-between gap-6 py-5 transition-colors hover:bg-secondary -mx-2 px-2"
                          >
                            <div className="flex items-start gap-5 min-w-0">
                              <span className="eyebrow-mono tabular-nums pt-1">
                                R{String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm md:text-base font-medium leading-snug text-foreground">
                                  {ref.title}
                                </span>
                                <span className="mt-1 block text-xs text-muted-foreground">
                                  {ref.source}
                                  {" · "}
                                  {ref.year}
                                </span>
                              </span>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0 mt-1.5" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                </Reveal>
              )}
              {spec.coas && spec.coas.length > 0 && (
                <Reveal delay={320}>
                  <section className="border-t border-border pt-12">
                    <h2 className="eyebrow-mono">06: Certificates of Analysis</h2>
                    <p className="mt-4 text-sm text-muted-foreground max-w-2xl">
                      Independent third party HPLC / LC MS purity testing by Freedom Diagnostics.
                    </p>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                      {spec.coas.map((coa) => (
                        <a
                          key={coa.image}
                          href={coa.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block border border-border bg-background p-4 transition-colors hover:bg-secondary"
                        >
                          <div className="aspect-[3/4] overflow-hidden bg-secondary/40">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={coa.image}
                              alt={`${coa.label} certificate of analysis`}
                              className="h-full w-full object-contain"
                              loading="lazy"
                            />
                          </div>
                          <div className="mt-4 flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-foreground">{coa.label}</p>
                              <p className="mt-1 eyebrow-mono">Purity {coa.purity}</p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0 mt-1" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>
                </Reveal>
              )}
            </div>
            <Reveal delay={150} className="md:col-span-4">
              <aside className="space-y-12">
                {spec.productImage && (
                  <div className="bg-secondary/40 border border-border p-6 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={spec.productImage}
                      alt={`${peptide.name} vial`}
                      className="max-h-72 w-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                )}
                <div>
                  <p className="eyebrow-mono">Specifications</p>
                  <dl className="mt-6 divide-y divide-border border-y border-border">
                    {rows.map((row) => (
                      <div key={row.label} className="grid grid-cols-12 gap-3 py-3.5">
                        <dt className="col-span-5 eyebrow-mono pt-1">{row.label}</dt>
                        <dd
                          className={
                            row.mono
                              ? "col-span-7 font-mono text-sm text-foreground tabular-nums break-all"
                              : "col-span-7 text-sm font-medium text-foreground"
                          }
                        >
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <p className="eyebrow-mono">Have a question?</p>
                  <p className="mt-4 text-base text-foreground leading-relaxed">
                    Talk to a real person about {peptide.name}. We&apos;ll answer honestly and won&apos;t push you to buy.
                  </p>
                  <Link
                    href={contactHref}
                    className="group mt-6 inline-flex items-center justify-between border-b border-foreground pb-2 text-[15px] font-medium hover:opacity-70 transition-opacity w-full"
                  >
                    <span>Ask about {peptide.name}</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
                <div>
                  <p className="eyebrow-mono">Need clarity?</p>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    If you are unsure what this peptide is or whether it fits your goals, ask our team before ordering.
                  </p>
                </div>
              </aside>
            </Reveal>
          </div>
          {related.length > 0 && (
            <section className="mt-28 pt-16 border-t border-border">
              <Reveal>
                <h2 className="eyebrow-mono">07: Related</h2>
                <h2 className="mt-6 font-display text-3xl md:text-5xl font-medium tracking-[-0.035em]">
                  Continue exploring.
                </h2>
              </Reveal>
              <div className="mt-12 grid gap-px bg-border border border-border sm:grid-cols-3">
                {related.map((s, i) => (
                  <Reveal key={s.slug} delay={i * 80}>
                    <Link
                      href={`/products/${s.slug}`}
                      className="group block h-full bg-background p-7 md:p-8 transition-colors hover:bg-secondary"
                    >
                      <article className="flex h-full flex-col">
                        <p className="eyebrow-mono">
                          {String(i + 1).padStart(2, "0")}
                          {" · "}
                          {categoryLabels[s.category]}
                        </p>
                        <h3 className="mt-5 font-display text-2xl font-medium tracking-[-0.025em]">{s.name}</h3>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.tagline}</p>
                        <div className="mt-auto pt-8 inline-flex items-center justify-between text-[13px] font-medium">
                          <span className="text-muted-foreground">View</span>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </article>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
