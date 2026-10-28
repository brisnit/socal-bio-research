"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

// The address is stored in pieces and only assembled in the browser when
// needed, so it never appears in the server-rendered HTML that scrapers read.
const USER = ["scbr", "info26"];
const DOMAIN = ["gmail", "com"];
const address = () => `${USER.join("")}@${DOMAIN.join(".")}`;

/** "Copy email" CTA: copies the contact address without displaying it. */
export function CopyEmailButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address());
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (old browser or insecure context): open the mail app instead.
      window.location.href = `mailto:${address()}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={
        "group inline-flex h-11 items-center gap-2 bg-foreground px-5 text-[14px] font-medium text-background hover:opacity-85 transition-opacity " +
        (className ?? "")
      }
    >
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
