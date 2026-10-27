import type { ReactNode } from "react";
import { SiteLayout } from "@/components/site/site-layout";

// Public pages are statically rendered and refreshed every 5 minutes (ISR);
// admin edits also trigger an immediate revalidatePath().
export const revalidate = 300;

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
