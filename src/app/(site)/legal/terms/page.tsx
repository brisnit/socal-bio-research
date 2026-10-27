import { PolicyPage } from "@/components/legal/policy-page";
import { TERMS } from "@/content/legal/terms";
import { pageMeta } from "@/lib/seo";
import { getLegalOverride } from "@/lib/content";
import type { LegalPolicy } from "@/content/legal/types";


export const metadata = pageMeta({
  title: "Terms of Service: Socal Bioresearch",
  description: "The agreement between you and Socal Bioresearch when you use this site, the catalog, or Dr. Peptide.",
  ogTitle: "Terms of Service: Socal Bioresearch",
  ogDescription: "Plain English summary of our Terms, with the formal clause underneath.",
  ogImage: "og-compliance.jpg",
  path: "/legal/terms",
});

export default async function Page() {
  const policy = ((await getLegalOverride("terms")) as LegalPolicy | null) ?? TERMS;
  return <PolicyPage policy={policy} />;
}
