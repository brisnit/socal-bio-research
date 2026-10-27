import { z } from "zod";

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const CATEGORIES = ["wellness-longevity", "performance-recovery"] as const;
export const INQUIRY_STATUSES = ["new", "in_progress", "closed", "spam"] as const;
export const ADMIN_ROLES = ["owner", "admin", "editor", "viewer"] as const;
export const LEGAL_SLUGS = ["terms", "privacy", "disclaimer", "acceptable-use", "shipping"] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export const referenceSchema = z.object({
  title: z.string().min(1),
  source: z.string(),
  year: z.number().int().min(1800).max(2200),
  url: z.string().url(),
});

export const coaSchema = z.object({
  label: z.string().min(1),
  purity: z.string(),
  image: z.string().min(1),
});

const optText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

export const specsSchema = z.object({
  cas: optText,
  molecularWeight: optText,
  molecularFormula: optText,
  sequence: optText,
  form: optText,
  storage: optText,
});

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  slug: z.string().trim().regex(SLUG_RE, "Slug must be lowercase letters, numbers and single hyphens"),
  category: z.enum(CATEGORIES),
  tagline: z.string(),
  summary: z.string(),
  mechanism: z.string(),
  research_areas: z.array(z.string().min(1)),
  purity: z.string(),
  references: z.array(referenceSchema),
  specs: specsSchema,
  product_image: z.string().trim().nullable(),
  coas: z.array(coaSchema),
  sort_order: z.number().int(),
  is_published: z.boolean(),
});
export type ProductInput = z.infer<typeof productSchema>;

export const legalPolicySchema = z.object({
  hero: z.object({
    eyebrow: z.string(),
    meta: z.string(),
    title: z.string(),
    titleMuted: z.string().optional(),
    description: z.string(),
  }),
  notice: z.object({ label: z.string(), body: z.string() }).optional(),
  sections: z.array(z.object({ n: z.string(), title: z.string(), summary: z.string(), clause: z.string() })).min(1),
  footer: z.object({ lead: z.string(), link: z.string(), trail: z.string() }),
});

export const faqSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
  sort_order: z.number().int(),
  is_published: z.boolean(),
});

export const articleSchema = z.object({
  slug: z.string().trim().regex(SLUG_RE, "Slug must be lowercase letters, numbers and single hyphens"),
  title: z.string().trim().min(1, "Title is required"),
  excerpt: z.string(),
  body: z.string(),
  is_published: z.boolean(),
  published_at: z.string().nullable(),
});

/** Plain JSON object (for integrations.config). */
export const jsonObjectSchema = z.record(z.string(), z.unknown());

export const MEDIA_MAX_BYTES = 25 * 1024 * 1024;
export function isAllowedMime(mime: string) {
  return mime.startsWith("image/") || mime.startsWith("video/") || mime === "application/pdf";
}
