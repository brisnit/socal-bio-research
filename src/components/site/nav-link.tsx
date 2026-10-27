"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

/**
 * Mirrors TanStack Router's <Link activeProps>: active classes are appended
 * (not merged) when the current path equals or is nested under `href`.
 */
export function NavLink({
  href,
  className = "",
  activeClassName = "",
  ...rest
}: ComponentProps<typeof Link> & { href: string; activeClassName?: string }) {
  const pathname = usePathname() ?? "/";
  const active =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={active ? `${className} ${activeClassName}` : className}
      data-status={active ? "active" : undefined}
      aria-current={active ? "page" : undefined}
      {...rest}
    />
  );
}
