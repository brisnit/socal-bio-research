import type { CSSProperties, ReactNode } from "react";

export function OrangeWord({
  children,
  halo = true,
  italic = true,
}: {
  children: ReactNode;
  halo?: boolean;
  italic?: boolean;
}) {
  const style: CSSProperties = {
    backgroundImage:
      "linear-gradient(100deg, oklch(0.68 0.22 38) 0%, oklch(0.78 0.20 50) 38%, oklch(0.84 0.17 70) 70%, oklch(0.70 0.22 40) 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
    paddingInline: "0.18em 0.34em",
    marginInline: "-0.18em 0",
    paddingBlock: "0.05em 0.18em",
    WebkitBoxDecorationBreak: "clone",
    boxDecorationBreak: "clone",
  };
  if (halo)
    style.filter =
      "drop-shadow(0 0 18px oklch(0.78 0.20 50 / 0.35)) drop-shadow(0 0 42px oklch(0.82 0.18 60 / 0.22))";
  return (
    <span
      data-pop-word="orange"
      className={(italic ? "italic font-light " : "") + "pop-word relative z-[1] inline-block align-baseline whitespace-nowrap"}
      style={style}
    >
      {children}
    </span>
  );
}
