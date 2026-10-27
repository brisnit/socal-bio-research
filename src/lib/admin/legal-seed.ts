import "server-only";
import { TERMS } from "@/content/legal/terms";
import { PRIVACY } from "@/content/legal/privacy";
import { DISCLAIMER } from "@/content/legal/disclaimer";
import { ACCEPTABLE_USE } from "@/content/legal/acceptable-use";
import { SHIPPING } from "@/content/legal/shipping";
import type { LegalPolicy } from "@/content/legal/types";
import type { LegalSlug } from "./schemas";

export const LEGAL_SEED: Record<LegalSlug, { title: string; policy: LegalPolicy }> = {
  terms: { title: "Terms of service", policy: TERMS },
  privacy: { title: "Privacy policy", policy: PRIVACY },
  disclaimer: { title: "Disclaimer", policy: DISCLAIMER },
  "acceptable-use": { title: "Acceptable use", policy: ACCEPTABLE_USE },
  shipping: { title: "Shipping", policy: SHIPPING },
};
