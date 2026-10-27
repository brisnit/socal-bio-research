"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

type Bead = { bx: number; by: number; isActive: boolean };

const BEADS: Bead[] = [
  { bx: 0.04, by: 0.62, isActive: false },
  { bx: 0.1, by: 0.48, isActive: false },
  { bx: 0.17, by: 0.36, isActive: false },
  { bx: 0.24, by: 0.3, isActive: false },
  { bx: 0.31, by: 0.36, isActive: false },
  { bx: 0.38, by: 0.48, isActive: false },
  { bx: 0.45, by: 0.56, isActive: false },
  { bx: 0.52, by: 0.5, isActive: true },
  { bx: 0.59, by: 0.4, isActive: false },
  { bx: 0.66, by: 0.32, isActive: false },
  { bx: 0.73, by: 0.36, isActive: false },
  { bx: 0.8, by: 0.46, isActive: false },
  { bx: 0.87, by: 0.58, isActive: false },
  { bx: 0.93, by: 0.66, isActive: false },
  { bx: 0.98, by: 0.62, isActive: false },
];
const ACTIVE_INDEX = BEADS.findIndex((b) => b.isActive);

export function Molecule({
  className,
  parentRef,
}: {
  className?: string;
  parentRef?: RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tiltRef = useRef<SVGGElement>(null);
  const beadRefs = useRef<(SVGGElement | null)[]>([]);
  const orbRefs = useRef<(SVGCircleElement | null)[]>([]);
  const bondRefs = useRef<(SVGPathElement | null)[]>([]);
  const particleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const activeGlowRef = useRef<SVGCircleElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setShown(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (size.w === 0 || size.h === 0) return;
    const reduced =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const finePointer = typeof window !== "undefined" && window.matchMedia?.("(pointer: fine)").matches;
    const scale = Math.min(1, size.w / 1200);
    const beads = BEADS.map((b, i) => ({
      ...b,
      phase: i * 0.7 + Math.random() * 0.5,
      ampX: (3 + Math.random() * 3) * scale,
      ampY: (5 + Math.random() * 5) * scale,
      speed: 0.35 + Math.random() * 0.25,
    }));
    const particleCount = size.w < 640 ? 14 : 32;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * size.w,
      y: Math.random() * size.h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      r: 0.8 + Math.random() * 1.6,
      alpha: 0.15 + Math.random() * 0.35,
    }));
    for (let i = 0; i < particles.length; i++) {
      const el = particleRefs.current[i];
      if (el) {
        el.setAttribute("cx", String(particles[i].x));
        el.setAttribute("cy", String(particles[i].y));
        el.setAttribute("r", String(particles[i].r));
        el.setAttribute("opacity", String(particles[i].alpha));
      }
    }
    const offsets = beads.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
    let pointer: { x: number; y: number } | null = null;
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

    const onPointerMove = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
      const nx = (e.clientX - r.left) / Math.max(r.width, 1) - 0.5;
      const ny = (e.clientY - r.top) / Math.max(r.height, 1) - 0.5;
      tilt.tx = nx * 8;
      tilt.ty = ny * 4;
    };
    const onPointerLeave = () => {
      pointer = null;
      tilt.tx = 0;
      tilt.ty = 0;
    };
    const parent = parentRef?.current;
    if (finePointer && parent && !reduced) {
      parent.addEventListener("pointermove", onPointerMove);
      parent.addEventListener("pointerleave", onPointerLeave);
    }

    const t0 = performance.now();
    let raf = 0;
    const pos = (i: number) => {
      const b = beads[i];
      const o = offsets[i];
      return { x: b.bx * size.w + o.x, y: b.by * size.h + o.y };
    };

    const frame = (now: number) => {
      const t = (now - t0) / 1e3;
      tilt.x += (tilt.tx - tilt.x) * 0.06;
      tilt.y += (tilt.ty - tilt.y) * 0.06;
      const tiltEl = tiltRef.current;
      if (tiltEl) tiltEl.setAttribute("transform", `translate(${tilt.x.toFixed(2)} ${tilt.y.toFixed(2)})`);

      for (let i = 0; i < beads.length; i++) {
        const b = beads[i];
        const floatY = Math.sin(t * b.speed * 1.4 + b.phase) * b.ampY;
        const floatX = Math.cos(t * b.speed + b.phase * 1.3) * b.ampX;
        let pushX = 0;
        let pushY = 0;
        if (pointer && !reduced) {
          const baseX = b.bx * size.w;
          const baseY = b.by * size.h;
          const dx = pointer.x - baseX;
          const dy = pointer.y - baseY;
          const dist = Math.hypot(dx, dy);
          const radius = 280;
          if (dist < radius) {
            const force = 26 * (1 - dist / radius) ** 2;
            pushX = (dx / Math.max(dist, 1)) * force;
            pushY = (dy / Math.max(dist, 1)) * force;
          }
        }
        const targetX = floatX + pushX;
        const targetY = floatY + pushY;
        const o = offsets[i];
        const stiffness = 0.14;
        const damping = 0.78;
        o.vx = (o.vx + (targetX - o.x) * stiffness) * damping;
        o.vy = (o.vy + (targetY - o.y) * stiffness) * damping;
        o.x += o.vx;
        o.y += o.vy;
        const beadEl = beadRefs.current[i];
        if (beadEl) {
          const x = b.bx * size.w + o.x;
          const y = b.by * size.h + o.y;
          beadEl.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
        }
      }

      for (let i = 0; i < beads.length - 1; i++) {
        const path = bondRefs.current[i];
        if (!path) continue;
        const p0 = pos(Math.max(0, i - 1));
        const p1 = pos(i);
        const p2 = pos(i + 1);
        const p3 = pos(Math.min(beads.length - 1, i + 2));
        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;
        path.setAttribute(
          "d",
          `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
        );
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy + Math.sin(t * 0.4 + i) * 0.04;
        if (p.x < -4) p.x = size.w + 4;
        else if (p.x > size.w + 4) p.x = -4;
        if (p.y < -4) p.y = size.h + 4;
        else if (p.y > size.h + 4) p.y = -4;
        const el = particleRefs.current[i];
        if (el) {
          el.setAttribute("cx", p.x.toFixed(1));
          el.setAttribute("cy", p.y.toFixed(1));
        }
      }

      const glow = activeGlowRef.current;
      if (glow) {
        const op = 0.5 + Math.sin(t * 1.6) * 0.15;
        glow.setAttribute("opacity", op.toFixed(3));
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    };

    if (reduced) frame(performance.now());
    else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      if (finePointer && parent) {
        parent.removeEventListener("pointermove", onPointerMove);
        parent.removeEventListener("pointerleave", onPointerLeave);
      }
    };
  }, [size, parentRef]);

  const baseR = Math.max(18, Math.min(28, size.w * 0.022));
  const activeR = baseR * 1.32;
  const haloR = baseR * 1.45;
  const activeHaloR = activeR * 1.7;
  const activeX = BEADS[ACTIVE_INDEX].bx * size.w;
  const activeY = BEADS[ACTIVE_INDEX].by * size.h;

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg
        ref={svgRef}
        width={size.w || "100%"}
        height={size.h || 480}
        viewBox={`0 0 ${size.w || 1400} ${size.h || 480}`}
        aria-hidden="true"
        style={{ display: "block", pointerEvents: "none", overflow: "visible" }}
      >
        <defs>
          <radialGradient id="hp-orb-blue" cx="32%" cy="28%" r="78%">
            <stop offset="0%" stopColor="oklch(0.99 0.005 250)" stopOpacity="1" />
            <stop offset="38%" stopColor="oklch(0.78 0.07 245)" stopOpacity="1" />
            <stop offset="100%" stopColor="oklch(0.30 0.10 248)" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="hp-orb-orange" cx="32%" cy="28%" r="78%">
            <stop offset="0%" stopColor="oklch(0.99 0.03 80)" stopOpacity="1" />
            <stop offset="40%" stopColor="oklch(0.84 0.18 60)" stopOpacity="1" />
            <stop offset="100%" stopColor="oklch(0.52 0.20 45)" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="hp-glow-blue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.65 0.14 245)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="oklch(0.65 0.14 245)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hp-glow-orange" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.78 0.20 55)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(0.78 0.20 55)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hp-bond-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.55 0.10 245)" stopOpacity="0.55" />
            <stop offset="50%" stopColor="oklch(0.78 0.18 55)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="oklch(0.55 0.10 245)" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {size.w > 0 && (
          <>
            <circle
              cx={size.w * 0.5}
              cy={size.h * 0.55}
              r={Math.min(size.w, size.h) * 0.55}
              fill="url(#hp-glow-blue)"
              opacity={0.6}
            />
            <circle ref={activeGlowRef} cx={activeX} cy={activeY} r={activeR * 4.5} fill="url(#hp-glow-orange)" opacity={0.5} />
          </>
        )}
        <g>
          {Array.from({ length: 32 }).map((_, i) => (
            <circle
              key={i}
              ref={(el) => {
                particleRefs.current[i] = el;
              }}
              cx={0}
              cy={0}
              r={1}
              fill="oklch(0.55 0.12 245)"
              opacity={0}
            />
          ))}
        </g>
        <g ref={tiltRef}>
          <g style={{ opacity: shown ? 1 : 0, transition: "opacity 600ms ease-out 200ms" }}>
            {BEADS.slice(0, -1).map((_, i) => (
              <path
                key={i}
                ref={(el) => {
                  bondRefs.current[i] = el;
                }}
                d=""
                fill="none"
                stroke="url(#hp-bond-grad)"
                strokeWidth={3}
                strokeLinecap="round"
                style={{
                  strokeDasharray: shown ? "none" : "400 400",
                  strokeDashoffset: shown ? 0 : 400,
                  transition: `stroke-dashoffset 900ms cubic-bezier(0.2, 0.7, 0.2, 1) ${100 + i * 55}ms`,
                }}
              />
            ))}
          </g>
          <g>
            {BEADS.map((bead, i) => {
              const active = bead.isActive;
              const r = active ? activeR : baseR;
              const halo = active ? activeHaloR : haloR;
              return (
                <g
                  key={i}
                  ref={(el) => {
                    beadRefs.current[i] = el;
                  }}
                  transform={`translate(${bead.bx * (size.w || 0)} ${bead.by * (size.h || 0)})`}
                  opacity={shown ? 1 : 0}
                  style={{ transition: `opacity 500ms ease-out ${250 + i * 55}ms, transform 0ms` }}
                >
                  {active && (
                    <circle
                      r={r + 10}
                      fill="oklch(0.78 0.19 55)"
                      opacity={0.18}
                      style={{
                        transformOrigin: "center",
                        transformBox: "fill-box",
                        animation: "hp-active-ring 2.6s ease-out infinite",
                      }}
                    />
                  )}
                  <circle r={halo} fill={active ? "oklch(0.78 0.19 55)" : "oklch(0.55 0.12 245)"} opacity={active ? 0.28 : 0.18} />
                  <circle
                    ref={(el) => {
                      orbRefs.current[i] = el;
                    }}
                    r={r}
                    fill={active ? "url(#hp-orb-orange)" : "url(#hp-orb-blue)"}
                  />
                  <ellipse cx={-r * 0.32} cy={-r * 0.42} rx={r * 0.4} ry={r * 0.28} fill="oklch(1 0 0)" opacity={0.78} />
                  <circle r={r} fill="none" stroke="oklch(1 0 0)" strokeOpacity={0.18} strokeWidth={1} />
                </g>
              );
            })}
          </g>
        </g>
        <style>{`
          @keyframes hp-active-ring {
            0%   { transform: scale(0.6); opacity: 0.55; }
            80%  { transform: scale(2.2); opacity: 0; }
            100% { transform: scale(2.2); opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            [data-hp-ring] { animation: none !important; }
          }
        `}</style>
      </svg>
    </div>
  );
}
