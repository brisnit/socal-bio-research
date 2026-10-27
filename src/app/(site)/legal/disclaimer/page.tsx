import { PolicyPage } from "@/components/legal/policy-page";
import { DISCLAIMER } from "@/content/legal/disclaimer";
import { pageMeta } from "@/lib/seo";
import { getLegalOverride } from "@/lib/content";
import type { LegalPolicy } from "@/content/legal/types";


export const metadata = pageMeta({
  title: "Disclaimer: Socal Bioresearch",
  description: "Educational content only. Not personal advice. Research use peptide language explained simply.",
  ogTitle: "Disclaimer: Socal Bioresearch",
  ogDescription: "Plain English statement of what this site is for: and what it isn't.",
  ogImage: "og-compliance.jpg",
  path: "/legal/disclaimer",
});

export default async function Page() {
  const policy = ((await getLegalOverride("disclaimer")) as LegalPolicy | null) ?? DISCLAIMER;
  return <PolicyPage policy={policy} />;
}
