import { PolicyPage } from "@/components/legal/policy-page";
import { ACCEPTABLE_USE } from "@/content/legal/acceptable-use";
import { pageMeta } from "@/lib/seo";
import { getLegalOverride } from "@/lib/content";
import type { LegalPolicy } from "@/content/legal/types";


export const metadata = pageMeta({
  title: "Acceptable Use: Socal Bioresearch",
  description: "How the site, the catalog, and Dr. Peptide may and may not be used.",
  ogTitle: "Acceptable Use: Socal Bioresearch",
  ogDescription: "Clear, plain English rules for using the site responsibly.",
  ogImage: "og-compliance.jpg",
  path: "/legal/acceptable-use",
});

export default async function Page() {
  const policy = ((await getLegalOverride("acceptable-use")) as LegalPolicy | null) ?? ACCEPTABLE_USE;
  return <PolicyPage policy={policy} />;
}
