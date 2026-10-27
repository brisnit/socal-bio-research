import { z } from "zod";

/*
 * Ported from the original bundles, which used zod v3. Where the original relied on a
 * zod v3 default message (no custom message given), the v3 default text is spelled out
 * so the rendered/returned messages are identical under zod v4. The email check uses
 * zod v3's exact email regex.
 */

const V3_EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;

const v3Min = (n: number) => `String must contain at least ${n} character(s)`;
const v3Max = (n: number) => `String must contain at most ${n} character(s)`;

export const INQUIRY_TYPES = ["catalog", "coa", "procurement", "collaboration", "other", ""] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

/** `/contact` inquiry form (original: contact-5JXi_vG4.js `Q`). */
export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200, "Name must be under 200 characters"),
  email: z
    .string()
    .trim()
    .min(3, "Email is required")
    .max(320, "Email must be under 320 characters")
    .regex(V3_EMAIL_REGEX, "Enter a valid email address"),
  organization: z
    .string()
    .trim()
    .max(200, "Organization must be under 200 characters")
    .optional()
    .or(z.literal("")),
  inquiry_type: z.enum(INQUIRY_TYPES).optional(),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message must be under 5000 characters"),
});

/** `/new-customer` registration form (original: new-customer-B5ALd_R6.js `qe`). */
export const registrationSchema = z.object({
  legal_name: z.string().trim().min(1, "Your name is required").max(200, v3Max(200)),
  business_name: z.string().trim().min(1, "Organization name is required").max(200, v3Max(200)),
  role_title: z.string().trim().max(200, v3Max(200)).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .min(3, v3Min(3))
    .max(320, v3Max(320))
    .regex(V3_EMAIL_REGEX, "Enter a valid email address"),
  phone: z.string().trim().min(5, "Phone number is required").max(50, v3Max(50)),
  address_street: z.string().trim().min(1, "Street address is required").max(300, v3Max(300)),
  address_city: z.string().trim().min(1, "City is required").max(120, v3Max(120)),
  address_state: z.string().trim().min(1, "State / region is required").max(120, v3Max(120)),
  address_postal_code: z.string().trim().min(1, "Postal code is required").max(30, v3Max(30)),
  address_country: z.string().trim().min(1, "Country is required").max(120, v3Max(120)),
  intended_use: z
    .string()
    .trim()
    .min(1, "Tell us a bit about your intended use")
    .max(5000, v3Max(5000)),
  referral_source: z.string().trim().max(200, v3Max(200)).optional().or(z.literal("")),
  ruo_acknowledged: z.literal(true, { error: "You must acknowledge the terms" }),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type RegistrationInput = z.input<typeof registrationSchema>;

/** Collects the first issue message per top-level field, as the original forms did. */
export function firstIssueByField(issues: readonly z.core.$ZodIssue[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (key && !out[key as string]) out[key as string] = issue.message;
  }
  return out;
}
