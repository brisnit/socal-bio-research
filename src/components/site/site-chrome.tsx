"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./nav-link";
import { AskDrPeptideButton } from "./dr-peptide";

const NAV = [
  { to: "/products", label: "Catalog" },
  { to: "/research", label: "Learn" },
  { to: "/about", label: "About" },
  { to: "/new-customer", label: "New Customer" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "border-b border-border bg-background/85 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 transition-all duration-300",
          scrolled ? "h-14" : "h-20",
        )}
      >
        <Link href="/" className="flex items-center gap-2.5 group text-foreground" aria-label="Socal Bioresearch: home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Logo2.png"
            alt=""
            className="h-9 w-9 object-contain transition-transform group-hover:rotate-[-4deg]"
          />
          <span className="font-display text-[15px] font-semibold tracking-[-0.02em] whitespace-nowrap">
            Socal<span className="text-muted-foreground"> Bioresearch</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              href={n.to}
              className="relative text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeClassName="text-foreground after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-px after:bg-foreground"
            >
              {n.label}
            </NavLink>
          ))}
          <AskDrPeptideButton variant="nav" className="ml-2" />
        </nav>
        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-muted"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl transition-all",
          menuOpen ? "max-h-80" : "max-h-0",
        )}
      >
        <nav className="flex flex-col px-4 py-3">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              href={n.to}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              activeClassName="text-foreground"
            >
              {n.label}
            </NavLink>
          ))}
          <div className="pt-3">
            <AskDrPeptideButton variant="nav" className="w-full justify-center" />
          </div>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ blurb, disclaimer }: { blurb: string; disclaimer: string }) {
  return (
    <footer className="mt-32 border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 text-foreground">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Logo2.png" alt="Socal Bioresearch" className="h-9 w-9 object-contain" />
            </div>
            <p className="mt-6 max-w-md text-sm text-muted-foreground leading-relaxed">{blurb}</p>
          </div>
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="eyebrow-mono mb-5">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products" className="text-foreground hover:text-muted-foreground transition-colors">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-foreground hover:text-muted-foreground transition-colors">
                  Common Questions
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-foreground hover:text-muted-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground hover:text-muted-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="eyebrow-mono mb-5">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/legal" className="text-foreground hover:text-muted-foreground transition-colors">
                  Legal &amp; policies
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/disclaimer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/new-customer" className="text-foreground hover:text-muted-foreground transition-colors">
                  New Customer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-border text-xs text-muted-foreground leading-relaxed">
          <p className="font-mono uppercase tracking-[0.22em] text-foreground mb-3">Plain language peptide support</p>
          <p className="max-w-3xl">{disclaimer}</p>
          <p className="mt-8">© {new Date().getFullYear()} Socal Bioresearch.</p>
        </div>
      </div>
    </footer>
  );
}

function WaveMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={cn("h-7 w-7", className)}>
      <path
        d="M4 26 L11 14 L18 26 L25 14 L32 26 L36 20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="26" r="2.25" fill="oklch(0.7 0.18 50)" />
    </svg>
  );
}

const AGE_KEY = "scbr:age-verified";

export function AgeGate() {
  const [show, setShow] = useState(false);
  const [underage, setUnderage] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(AGE_KEY) !== "1") setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  if (!show) return null;

  const confirm = () => {
    try {
      window.localStorage.setItem(AGE_KEY, "1");
    } catch {}
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl px-4"
    >
      <div className="w-full max-w-md border border-border bg-background p-8 md:p-10 shadow-xl">
        <div className="flex items-center gap-2.5 text-foreground">
          <WaveMark className="h-7 w-7" />
          <span className="font-display text-[15px] font-semibold tracking-[-0.02em]">
            Socal Bio<span className="text-muted-foreground"> Research</span>
          </span>
        </div>
        <p className="mt-8 eyebrow-mono">Age verification</p>
        <h2
          id="age-gate-title"
          className="mt-3 font-display text-3xl md:text-4xl font-medium tracking-[-0.035em] text-foreground"
        >
          Are you 21 or older?
        </h2>
        <p className="mt-5 text-sm md:text-base text-foreground leading-relaxed">
          This site contains educational content intended for adults. Please confirm your age to continue.
        </p>
        {underage ? (
          <div className="mt-8 border-l-2 border-destructive pl-4 py-2 text-sm text-destructive">
            You must be 21 or older to view this site.
          </div>
        ) : (
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={confirm}
              className="group inline-flex flex-1 items-center justify-center gap-2 bg-foreground text-background h-12 px-6 text-[14px] font-medium hover:opacity-85 transition-opacity"
            >
              I am 21 or older
            </button>
            <button
              type="button"
              onClick={() => setUnderage(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 border border-border h-12 px-6 text-[14px] font-medium text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              I am under 21
            </button>
          </div>
        )}
        <p className="mt-8 text-xs text-muted-foreground leading-relaxed">
          By entering, you agree to our terms and acknowledge the educational nature of the content.
        </p>
      </div>
    </div>
  );
}

export function BackToHome() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/" || pathname.startsWith("/legal/")) return null;

  return (
    <Link
      href="/"
      aria-label="Back to home"
      className={`fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2.5 text-sm font-medium text-foreground shadow-lg backdrop-blur transition-all duration-300 hover:bg-muted ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      <span>Back to home</span>
    </Link>
  );
}
