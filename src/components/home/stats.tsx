"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/components/site/reveal";

function useCountUp(target: number, duration = 1600, start = false) {
  const [value, setValue] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!start || done.current) return;
    done.current = true;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

const STATS = [
  { value: 99, suffix: "%+", label: "Purity, every peptide" },
  { value: 23, suffix: "", label: "Peptides we cover" },
  { value: 1, suffix: "", label: "Real human, every call" },
  { value: 24, suffix: "h", label: "Reply window" },
];

function Stat({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const n = useCountUp(value, 1600, start);
  return (
    <div>
      <div className="font-display text-5xl md:text-7xl font-medium tracking-[-0.04em] text-foreground tabular-nums">
        {n}
        {suffix}
      </div>
      <div className="mt-3 eyebrow-mono">{label}</div>
    </div>
  );
}

export function Stats() {
  const { ref, revealed } = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 px-4 py-20 md:grid-cols-4 md:px-6 md:py-28">
        {STATS.map((s) => (
          <Stat key={s.label} {...s} start={revealed} />
        ))}
      </div>
    </section>
  );
}
