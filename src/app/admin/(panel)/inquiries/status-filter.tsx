import Link from "next/link";
import { cn } from "@/lib/utils";
import { INQUIRY_STATUSES } from "@/lib/admin/schemas";

export function StatusFilter({ basePath, current }: { basePath: string; current?: string }) {
  const opts: (string | undefined)[] = [undefined, ...INQUIRY_STATUSES];
  return (
    <div className="mb-4 flex flex-wrap gap-2 text-sm">
      {opts.map((s) => (
        <Link
          key={s ?? "all"}
          href={s ? `${basePath}?status=${s}` : basePath}
          className={cn("rounded-full border border-border px-3 py-1", current === s ? "bg-foreground text-background" : "bg-background hover:bg-secondary")}
        >
          {s ? s.replace("_", " ") : "all"}
        </Link>
      ))}
    </div>
  );
}
