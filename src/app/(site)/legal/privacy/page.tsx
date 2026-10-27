import { PolicyPage } from "@/components/legal/policy-page";
import { PRIVACY } from "@/content/legal/privacy";
import { pageMeta } from "@/lib/seo";
import { getLegalOverride } from "@/lib/content";
import type { LegalPolicy } from "@/content/legal/types";


export const metadata = pageMeta({
  title: "Privacy Policy: Socal Bioresearch",
  description: "What information Socal Bioresearch collects from contact forms and Dr. Peptide, how we use it, and what we don't do with it.",
  ogTitle: "Privacy Policy: Socal Bioresearch",
  ogDescription: "We only collect what we need to respond to you. Plain English summary, formal clause underneath.",
  ogImage: "og-compliance.jpg",
  path: "/legal/privacy",
});

export default async function Page() {
  const policy = ((await getLegalOverride("privacy")) as LegalPolicy | null) ?? PRIVACY;
  return <PolicyPage policy={policy} />;
}
