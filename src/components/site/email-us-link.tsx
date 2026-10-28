"use client";

import { useEffect, useState } from "react";

// The address is stored in pieces and only assembled in the browser after
// hydration, so it never appears in the server-rendered HTML that scrapers read.
const USER = ["scbr", "info26"];
const DOMAIN = ["gmail", "com"];

export function EmailUsLink({ className, children = "Email us" }: { className?: string; children?: React.ReactNode }) {
  const [href, setHref] = useState<string | undefined>(undefined);
  useEffect(() => {
    setHref(`mailto:${USER.join("")}@${DOMAIN.join(".")}`);
  }, []);
  return (
    <a href={href ?? "/contact"} className={className}>
      {children}
    </a>
  );
}
