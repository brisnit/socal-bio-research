import { PolicyPage } from "@/components/legal/policy-page";
import { SHIPPING } from "@/content/legal/shipping";
import { pageMeta } from "@/lib/seo";
import { getLegalOverride } from "@/lib/content";
import type { LegalPolicy } from "@/content/legal/types";


export const metadata = pageMeta({
  title: "Shipping & Returns: Socal Bioresearch",
  description: "How orders are handled, what to expect on delivery, and our return policy.",
  ogTitle: "Shipping & Returns: Socal Bioresearch",
  ogDescription: "Clear, plain language shipping and return expectations.",
  ogImage: "og-compliance.jpg",
  path: "/legal/shipping",
});

export default async function Page() {
  const policy = ((await getLegalOverride("shipping")) as LegalPolicy | null) ?? SHIPPING;
  return <PolicyPage policy={policy} />;
}
