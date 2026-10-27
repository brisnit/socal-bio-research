import { handleFormSubmission } from "@/lib/form-submit";
import { registrationSchema } from "@/lib/validation";

export const runtime = "nodejs";

/** POST /api/registrations: the /new-customer form (replaces the original insert into `customer_registrations`). */
export function POST(req: Request) {
  return handleFormSubmission(req, {
    table: "customer_registrations",
    schema: registrationSchema,
    minElapsedMs: 3000,
    nullableFields: ["role_title", "referral_source"],
    toRow: (d) => ({
      legal_name: d.legal_name,
      business_name: d.business_name,
      role_title: d.role_title || null,
      email: d.email,
      phone: d.phone,
      address_street: d.address_street,
      address_city: d.address_city,
      address_state: d.address_state,
      address_postal_code: d.address_postal_code,
      address_country: d.address_country,
      intended_use: d.intended_use,
      referral_source: d.referral_source || null,
      ruo_acknowledged: true,
    }),
  });
}
