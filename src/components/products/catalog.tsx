"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { CategoryKey, Product, ProductSpecs } from "@/content/products";
import { AskDrPeptideButton } from "@/components/site/dr-peptide";
import { Reveal } from "@/components/site/reveal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type CatalogCategory = "all" | CategoryKey;
export type CatalogSort = "name" | "category";
export type CatalogSearch = { q: string; cat: CatalogCategory; sort: CatalogSort };

export const DEFAULT_SEARCH: CatalogSearch = { q: "", cat: "all", sort: "name" };

const CATEGORIES = ["all", "wellness-longevity", "performance-recovery"] as const;
const SORTS = ["name", "category"] as const;

/* ---- TanStack Router default search (de)serialization (main bundle Qg / d_ / p_ / g_) ---- */

function parseScalar(value: string): unknown {
  return value
    ? value === "false"
      ? false
      : value === "true"
        ? true
        : +value * 0 === 0 && +value + "" === value
          ? +value
          : value
    : "";
}

function parseSearch(params: URLSearchParams): Record<string, unknown> {
  const out: Record<string, unknown> = Object.create(null);
  for (const [key, raw] of params.entries()) {
    const prev = out[key];
    if (prev == null) out[key] = parseScalar(raw);
    else if (Array.isArray(prev)) prev.push(parseScalar(raw));
    else out[key] = [prev, parseScalar(raw)];
  }
  for (const key in out) {
    const value = out[key];
    if (typeof value === "string")
      try {
        out[key] = JSON.parse(value);
      } catch {}
  }
  return out;
}

function stringifyValue(value: unknown): string {
  if (typeof value === "object" && value !== null)
    try {
      return JSON.stringify(value);
    } catch {}
  else if (typeof value === "string")
    try {
      JSON.parse(value);
      return JSON.stringify(value);
    } catch {}
  return String(value);
}

function stringifySearch(search: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const key in search) {
    const value = search[key];
    if (value !== undefined) params.set(key, stringifyValue(value));
  }
  const str = params.toString();
  return str ? `?${str}` : "";
}

/** zod schema with `.catch` fallbacks (app-routes validateSearch). */
function validateSearch(raw: Record<string, unknown>): CatalogSearch {
  const { q, cat, sort } = raw;
  return {
    q: typeof q === "string" ? q : "",
    cat: CATEGORIES.includes(cat as CatalogCategory) ? (cat as CatalogCategory) : "all",
    sort: SORTS.includes(sort as CatalogSort) ? (sort as CatalogSort) : "name",
  };
}

/* ---- Catalog ---- */

type CatalogProps = {
  products: Product[];
  specs: Record<string, ProductSpecs>;
  categoryLabels: Record<CategoryKey, string>;
};

/** URL-driven catalog (q / cat / sort search params). */
export function Catalog(props: CatalogProps) {
  const searchParams = useSearchParams();
  const urlKey = searchParams.toString();
  const [search, setSearch] = useState<CatalogSearch>(() =>
    validateSearch(parseSearch(new URLSearchParams(urlKey))),
  );

  // Keep in sync with history navigation (back/forward).
  useEffect(() => {
    setSearch(validateSearch(parseSearch(new URLSearchParams(urlKey))));
  }, [urlKey]);

  const searchRef = useRef(search);
  searchRef.current = search;

  // navigate({ search: prev => ({ ...prev, ...patch }) }) without `replace`: one
  // history entry per update. Native pushState keeps the controlled input
  // synchronous (Next syncs useSearchParams from it) and does not scroll.
  const update = useCallback((patch: Partial<CatalogSearch>) => {
    const next = { ...searchRef.current, ...patch };
    searchRef.current = next;
    setSearch(next);
    window.history.pushState(null, "", `${window.location.pathname}${stringifySearch(next)}`);
  }, []);

  return <CatalogView {...props} search={search} onUpdate={update} />;
}

export function CatalogView({
  products,
  specs,
  categoryLabels,
  search,
  onUpdate,
}: CatalogProps & {
  search: CatalogSearch;
  onUpdate?: (patch: Partial<CatalogSearch>) => void;
}) {
  const { q, cat, sort } = search;
  const update = (patch: Partial<CatalogSearch>) => onUpdate?.(patch);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (!query) return true;
      const spec = specs[p.slug];
      return [
        p.name,
        p.tagline,
        p.summary,
        p.researchAreas.join(" "),
        spec?.cas ?? "",
        spec?.molecularFormula ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else
      list = [...list].sort(
        (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
      );
    return list;
  }, [products, specs, q, cat, sort]);

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-20">
        <Reveal>
          <AskDrPeptideButton
            variant="card"
            label="Not sure where to start? Ask Dr. Peptide which peptide fits your goal."
            className="mb-12"
          />
        </Reveal>
        <div className="space-y-6 mb-12">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] items-stretch">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search by name, CAS, formula, or area…"
                value={q}
                onChange={(e) => update({ q: e.target.value })}
                aria-label="Search catalog"
                className="pl-9 pr-9 h-11 rounded-none border-x-0 border-t-0 border-b shadow-none bg-transparent focus-visible:ring-0 focus-visible:border-foreground"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => update({ q: "" })}
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="eyebrow-mono whitespace-nowrap">
                Sort
              </label>
              <div id="sort" className="inline-flex h-11 border-b border-border" role="group" aria-label="Sort catalog">
                {(
                  [
                    ["name", "Name (A to Z)"],
                    ["category", "Category"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update({ sort: value })}
                    aria-pressed={sort === value}
                    className={cn(
                      "px-3 text-sm transition-colors",
                      sort === value ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((value) => (
                <button
                  key={value}
                  onClick={() => update({ cat: value })}
                  className={cn(
                    "px-4 py-2 text-[13px] font-medium tracking-tight transition-colors border",
                    cat === value
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground",
                  )}
                >
                  {value === "all" ? "All peptides" : categoryLabels[value]}
                </button>
              ))}
            </div>
            <div className="eyebrow-mono tabular-nums" aria-live="polite">
              {filtered.length} <span className="text-muted-foreground/50">/ {products.length}</span>
            </div>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="border-y border-border px-6 py-24 text-center">
            <p className="font-display text-2xl md:text-3xl font-medium tracking-[-0.025em]">
              No peptides match your filters.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Try a different search term or clear filters to see everything.
            </p>
            <button
              type="button"
              onClick={() => update({ q: "", cat: "all", sort: "name" })}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium border-b border-foreground pb-1 hover:opacity-70"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <h2 className="sr-only">Peptide catalog</h2>
            <div className="grid gap-px bg-border border border-border md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => {
                const spec = specs[p.slug];
                return (
                  <Reveal key={p.slug} delay={(i % 6) * 50}>
                    <Link
                      href={`/products/${p.slug}`}
                      className="group block h-full bg-background p-7 md:p-8 transition-colors hover:bg-secondary"
                    >
                      <article className="flex h-full flex-col">
                        <p className="eyebrow-mono">
                          {String(i + 1).padStart(2, "0")}
                          {" · "}
                          {categoryLabels[p.category]}
                        </p>
                        <div className="mt-6 flex items-start gap-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={spec?.productImage ?? "/products/generic-vial.webp"}
                            alt={`${p.name} vial`}
                            loading="lazy"
                            className="h-20 w-20 shrink-0 object-contain"
                          />
                          <h3 className="font-display text-2xl md:text-[28px] font-medium tracking-[-0.025em] leading-[1.1]">
                            {p.name}
                          </h3>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.tagline}</p>
                        {spec?.coas && spec.coas.length > 0 && (
                          <p className="mt-3 inline-flex items-center gap-1.5 self-start border border-foreground/20 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--brand-orange,24_95%_53%))] bg-orange-500" />
                            {"COA · "}
                            {spec.coas[0].purity}
                          </p>
                        )}
                        <div className="mt-auto pt-10 flex items-center justify-between text-[13px] font-medium">
                          <span className="text-muted-foreground">Read more</span>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </article>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
