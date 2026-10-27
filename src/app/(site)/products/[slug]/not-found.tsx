import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-40 text-center">
      <h1 className="font-display text-4xl md:text-5xl font-medium tracking-[-0.035em]">Not found.</h1>
      <p className="mt-4 text-muted-foreground">This catalog entry doesn&apos;t exist.</p>
      <Button asChild className="mt-8">
        <Link href="/products">Back to catalog</Link>
      </Button>
    </div>
  );
}
