"use client";

import { useEffect, useState, type CSSProperties } from "react";

export function MorphingWord({
  words,
  holdMs = 700,
  finalHoldMs = 1200,
  transitionMs = 380,
  loop = false,
  startDelayMs = 600,
}: {
  words: string[];
  holdMs?: number;
  finalHoldMs?: number;
  transitionMs?: number;
  loop?: boolean;
  startDelayMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [started, setStarted] = useState(false);
  const longest = words.reduce((acc, w) => (w.length > acc.length ? w : acc), "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIndex(words.length - 1);
      return;
    }
    const t = window.setTimeout(() => setStarted(true), startDelayMs);
    return () => window.clearTimeout(t);
  }, [startDelayMs, words.length]);

  useEffect(() => {
    if (!started) return;
    const isLast = index === words.length - 1;
    if (isLast && !loop) return;
    const hold = isLast ? finalHoldMs : holdMs;
    const outTimer = window.setTimeout(() => setPhase("out"), hold);
    const nextTimer = window.setTimeout(() => {
      setIndex((i) => (i + 1) % words.length);
      setPhase("in");
    }, hold + transitionMs);
    return () => {
      window.clearTimeout(outTimer);
      window.clearTimeout(nextTimer);
    };
  }, [started, index, words.length, holdMs, finalHoldMs, transitionMs, loop]);

  const isFinal = index === words.length - 1;
  const padding: CSSProperties = { paddingInline: "0.18em 0.34em", paddingBlock: "0.05em 0.18em" };

  return (
    <span
      data-pop-word="morphing"
      className="pop-word relative z-[1] inline-block align-baseline leading-[1.18]"
      style={{ marginInline: "-0.18em 0" }}
      aria-live="polite"
    >
      <span aria-hidden={true} className="invisible italic font-light whitespace-nowrap" style={padding}>
        {longest}
      </span>
      <span
        key={index}
        className="absolute inset-0 italic font-light whitespace-nowrap"
        style={{
          ...padding,
          ...(isFinal
            ? {
                backgroundImage:
                  "linear-gradient(100deg, oklch(0.68 0.22 38) 0%, oklch(0.78 0.20 50) 38%, oklch(0.84 0.17 70) 70%, oklch(0.70 0.22 40) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                filter:
                  "drop-shadow(0 0 18px oklch(0.78 0.20 50 / 0.35)) drop-shadow(0 0 42px oklch(0.82 0.18 60 / 0.22))",
              }
            : { color: "oklch(0.55 0.02 250)" }),
          opacity: phase === "in" ? 1 : 0,
          transform: phase === "in" ? "translateY(0)" : "translateY(-0.18em)",
          transition: `opacity ${transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        {words[index]}
      </span>
    </span>
  );
}
