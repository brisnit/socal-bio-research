"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { MorphingWord } from "./morphing-word";
import { Molecule } from "./molecule";

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  return (
    <section
      ref={heroRef}
      className="relative isolate -mt-20 min-h-[100vh] overflow-visible bg-background text-foreground"
    >
      <div className="mx-auto flex min-h-[100vh] max-w-7xl flex-col justify-between px-4 pt-32 pb-12 md:px-6 lg:pt-40">
        <div className="flex items-start justify-between gap-8 eyebrow-mono">
          <span>01: Curious about peptides?</span>
          <span className="hidden md:inline">Real humans · Real answers</span>
        </div>
        <div className="mt-16 md:mt-24">
          <Reveal>
            <h1 className="font-display font-medium text-foreground leading-[1.02] tracking-[-0.045em] text-[clamp(3.25rem,11vw,9.5rem)]">
              Peptides,
              <br />
              <MorphingWord words={["complicated", "confusing", "hyped", "explained"]} /> simply.
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-16 md:items-end">
              <p className="md:col-span-5 text-base md:text-lg leading-relaxed text-muted-foreground max-w-md">
                You&apos;ve heard the word everywhere. Here&apos;s what peptides actually are, why people are paying
                attention, and how to think about them clearly: without the hype.
              </p>
              <div className="md:col-span-4 md:col-start-9 flex flex-col gap-4 text-[15px] font-medium">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-between border-b border-foreground pb-3 hover:opacity-70 transition-opacity"
                >
                  <span>Talk to a real person</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="/about"
                  className="group inline-flex items-center justify-between border-b border-border pb-3 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  <span>What are peptides?</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={300}>
          <div className="mt-16 text-foreground/70">
            <div className="w-full" style={{ height: "clamp(260px, 34vw, 480px)" }}>
              <Molecule parentRef={heroRef} className="w-full h-full" />
            </div>
            <div className="mt-4 flex items-center justify-between eyebrow-mono">
              <span>A peptide · short chain of amino acids</span>
              <span>Honest answers · No pressure · No hype</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
