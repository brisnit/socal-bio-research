"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { INQUIRY_TYPES, firstIssueByField, inquirySchema, type InquiryType } from "@/lib/validation";

const RESUBMIT_MS = 30_000;
const MIN_FILL_MS = 2_000;
const LAST_SUBMIT_KEY = "contact:lastSubmit";

const INQUIRY_OPTIONS: { value: InquiryType; label: string }[] = [
  { value: "other", label: "I'm just curious" },
  { value: "catalog", label: "Question about a specific peptide" },
  { value: "procurement", label: "I'd like to order" },
  { value: "coa", label: "Documentation request" },
  { value: "collaboration", label: "Partnership or collaboration" },
];

const INPUT_CLASS =
  "h-11 rounded-none border border-border bg-background px-3 text-base shadow-none transition-colors placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Mirrors TanStack Router's default search parsing (each value JSON.parse'd when possible,
 * repeated keys become arrays) followed by the route's `z.unknown().pipe(schema.catch(""))`.
 */
function readSearchValue(params: URLSearchParams, key: string): unknown {
  const all = params.getAll(key);
  if (all.length === 0) return undefined;
  const parse = (v: string): unknown => {
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  };
  return all.length > 1 ? all.map(parse) : parse(all[0]);
}

function parseContactSearch(params: URLSearchParams): { type: InquiryType; product: string } {
  const rawType = readSearchValue(params, "type");
  const rawProduct = readSearchValue(params, "product");
  const type =
    typeof rawType === "string" && (INQUIRY_TYPES as readonly string[]).includes(rawType)
      ? (rawType as InquiryType)
      : "";
  const product = typeof rawProduct === "string" && rawProduct.length <= 120 ? rawProduct : "";
  return { type, product };
}

function initialMessage(type: InquiryType, product: string) {
  if (!product) return "";
  if (type === "coa") return `Could you send documentation for ${product}?\n\n`;
  if (type === "procurement") return `I'd like to order ${product}.\n\nQuantity: \nTimeline: \n`;
  return `I have a question about ${product}:\n\n`;
}

/** Reads `?type=` / `?product=`; must be rendered inside <Suspense>. */
export function ContactFormWithSearch() {
  const params = useSearchParams();
  const { type, product } = parseContactSearch(new URLSearchParams(params.toString()));
  return <ContactForm type={type} product={product} />;
}

export function ContactForm({ type = "", product = "" }: { type?: InquiryType; product?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [inquiryType, setInquiryType] = useState<InquiryType>(type || "");
  const [message, setMessage] = useState(() => initialMessage(type, product));
  const mountedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
    try {
      const handoff = window.sessionStorage.getItem("drp:handoff");
      if (handoff) {
        setMessage((prev) => (prev ? `${handoff}${prev}` : handoff));
        window.sessionStorage.removeItem("drp:handoff");
      }
    } catch {}
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorText("");
    setFieldErrors({});
    const form = event.currentTarget;
    const data = new FormData(form);
    const website = String(data.get("website") ?? "");

    if (website.trim() !== "") {
      setStatus("success");
      form.reset();
      setInquiryType("");
      return;
    }
    const elapsedMs = Date.now() - mountedAt.current;
    if (elapsedMs < MIN_FILL_MS) {
      setErrorText("Please take a moment to review your message before sending.");
      setStatus("error");
      return;
    }
    try {
      const last = Number(window.sessionStorage.getItem(LAST_SUBMIT_KEY) ?? "0");
      if (last && Date.now() - last < RESUBMIT_MS) {
        const seconds = Math.ceil((RESUBMIT_MS - (Date.now() - last)) / 1000);
        setErrorText(`Please wait ${seconds}s before sending another message.`);
        setStatus("error");
        return;
      }
    } catch {}

    const parsed = inquirySchema.safeParse({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      organization: String(data.get("organization") ?? ""),
      inquiry_type: inquiryType,
      message: String(data.get("message") ?? ""),
    });
    if (!parsed.success) {
      setFieldErrors(firstIssueByField(parsed.error.issues));
      setErrorText("Please correct the highlighted fields.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    const payload = {
      name: parsed.data.name,
      email: parsed.data.email,
      organization: parsed.data.organization?.trim() || null,
      inquiry_type: parsed.data.inquiry_type?.trim() || null,
      message: parsed.data.message,
      website,
      elapsedMs,
    };
    let ok = false;
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      ok = res.ok;
    } catch {
      ok = false;
    }
    if (!ok) {
      setErrorText("We couldn't send your message. Please try again in a moment.");
      setStatus("error");
      return;
    }
    try {
      window.sessionStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()));
    } catch {}
    setStatus("success");
    formRef.current?.reset();
    setInquiryType("");
    setMessage("");
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="relative space-y-8 border border-border bg-card p-6 sm:p-10 shadow-sm"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-accent" aria-hidden="true" />
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Name" required htmlFor="name" error={fieldErrors.name}>
          <Input
            id="name"
            name="name"
            required
            maxLength={200}
            autoComplete="name"
            aria-invalid={!!fieldErrors.name}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Email" required htmlFor="email" error={fieldErrors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            required
            maxLength={320}
            autoComplete="email"
            aria-invalid={!!fieldErrors.email}
            className={INPUT_CLASS}
          />
        </Field>
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Organization (optional)" htmlFor="organization" error={fieldErrors.organization}>
          <Input
            id="organization"
            name="organization"
            maxLength={200}
            autoComplete="organization"
            aria-invalid={!!fieldErrors.organization}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="What's this about?" htmlFor="inquiry_type">
          <input type="hidden" name="inquiry_type" value={inquiryType} />
          <div id="inquiry_type" className="flex flex-wrap gap-2" role="group" aria-label="Inquiry type">
            {INQUIRY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setInquiryType(option.value)}
                className={cn(
                  "border px-3 py-2 text-xs font-medium transition-colors",
                  inquiryType === option.value
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-background text-foreground hover:border-accent hover:text-accent",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Field>
      </div>
      <Field label="Your message" required htmlFor="message" error={fieldErrors.message}>
        <Textarea
          id="message"
          name="message"
          required
          maxLength={5000}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={!!fieldErrors.message}
          className="min-h-40 rounded-none border border-border bg-background px-3 py-3 text-base shadow-none transition-colors placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30 resize-y"
        />
      </Field>
      <div aria-live="polite" className="space-y-3">
        {status === "error" && (
          <div
            role="alert"
            className="flex items-start gap-2 border-l-2 border-destructive pl-4 py-2 text-sm text-destructive"
          >
            <CircleAlert className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{errorText || "Something went wrong. Please try again."}</span>
          </div>
        )}
        {status === "success" && (
          <div
            role="status"
            className="flex items-start gap-2 border-l-4 border-accent bg-card px-4 py-3 text-sm text-foreground"
          >
            <CircleCheck className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Thanks: your message is in. A real person will reply within one business day.</span>
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex min-h-12 items-center justify-between gap-8 bg-accent px-5 py-3 text-[15px] font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        <span>{status === "submitting" ? "Sending…" : "Send your message"}</span>
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  htmlFor,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <Label htmlFor={htmlFor} className="eyebrow-mono inline-flex items-center text-foreground">
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-accent">
            *
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
