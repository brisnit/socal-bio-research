export function ProductMarquee({ names }: { names: string[] }) {
  const items = [...names, ...names];
  return (
    <div className="relative overflow-hidden border-y border-border bg-background py-4">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {items.map((name, i) => (
          <span key={`${name}-${i}`} className="eyebrow-mono">
            {name}
            <span className="ml-10 text-border">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
