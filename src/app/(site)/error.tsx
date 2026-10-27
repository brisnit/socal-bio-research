"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-40 text-center">
      <h1 className="font-display text-4xl md:text-5xl font-medium tracking-[-0.035em]">Something went wrong.</h1>
      <p className="mt-4 text-muted-foreground">{error.message}</p>
    </div>
  );
}
