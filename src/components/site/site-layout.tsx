import type { ReactNode } from "react";
import { AgeGate, BackToHome, SiteFooter, SiteHeader } from "./site-chrome";
import { DrPeptideWidget } from "./dr-peptide";

/** Public-site shell. Admin routes do not use this. */
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="bg-primary/95 text-primary-foreground text-xs text-center py-2 px-4">
        Clear peptide education · Real support · No pressure
      </div>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <DrPeptideWidget />
      <AgeGate />
      <BackToHome />
    </div>
  );
}
