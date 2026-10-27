import { handleFormSubmission } from "@/lib/form-submit";
import { inquirySchema } from "@/lib/validation";

export const runtime = "nodejs";

/** POST /api/inquiries: the /contact form (replaces the original anon-key insert into `inquiries`). */
export function POST(req: Request) {
  return handleFormSubmission(req, {
    table: "inquiries",
    schema: inquirySchema,
    minElapsedMs: 2000,
    nullableFields: ["organization", "inquiry_type"],
    toRow: (d) => ({
      name: d.name,
      email: d.email,
      organization: d.organization || null,
      inquiry_type: d.inquiry_type || null,
      message: d.message,
    }),
  });
}
