import type { ReactNode } from "react";
import { AgeGate, BackToHome, SiteFooter, SiteHeader } from "./site-chrome";
import { DrPeptideWidget } from "./dr-peptide";
import { getSiteText } from "@/lib/content";

/** Public-site shell. Admin routes do not use this. */
export async function SiteLayout({ children }: { children: ReactNode }) {
  const text = await getSiteText();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="bg-primary/95 text-primary-foreground text-xs text-center py-2 px-4">
        {text["site.announcement"]}
      </div>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter blurb={text["footer.blurb"]} disclaimer={text["footer.disclaimer"]} />
      <DrPeptideWidget />
      <AgeGate />
      <BackToHome />
    </div>
  );
}
