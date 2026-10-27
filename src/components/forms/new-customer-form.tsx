"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, CircleAlert, CircleCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { firstIssueByField, registrationSchema } from "@/lib/validation";

const RESUBMIT_MS = 30_000;
const MIN_FILL_MS = 3_000;
const LAST_SUBMIT_KEY = "new-customer:lastSubmit";

type Status = "idle" | "submitting" | "success" | "error";

function SectionHeader({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="space-y-2 border-t border-border pt-8 relative pl-4 -ml-4">
      <span aria-hidden className="absolute left-0 top-8 h-6 w-[2px] bg-accent" />
      <h2 className="eyebrow-mono">
        <span className="text-accent">{step}</span>
        {": "}
        {title}
      </h2>
      <p className="text-base text-foreground">{description}</p>
    </div>
  );
}

function TextField({
  id,
  label,
  type = "text",
  autoComplete,
  maxLength,
  required,
  defaultValue,
  placeholder,
  helper,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  maxLength?: number;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
}) {
  const describedBy = error ? `${id}-error` : helper ? `${id}-helper` : undefined;
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
          {required && (
            <span aria-hidden className="ml-1 text-accent">
              *
            </span>
          )}
        </Label>
        <span className={`text-xs ${required ? "text-accent font-medium" : "text-muted-foreground"}`}>
          {required ? "Required" : "Optional"}
        </span>
      </div>
      <Input
        id={id}
        name={id}
        type={type}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className="rounded-md border border-input bg-background/50 h-12 px-4 text-base shadow-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:border-accent transition-colors"
      />
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm text-destructive">
          <CircleAlert className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : helper ? (
        <p id={`${id}-helper`} className="text-sm text-muted-foreground">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export function NewCustomerForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [acknowledged, setAcknowledged] = useState(false);
  const mountedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
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
      setAcknowledged(false);
      return;
    }
    const elapsedMs = Date.now() - mountedAt.current;
    if (elapsedMs < MIN_FILL_MS) {
      setErrorText("Please take a moment to review your details before submitting.");
      setStatus("error");
      return;
    }
    try {
      const last = Number(window.sessionStorage.getItem(LAST_SUBMIT_KEY) ?? "0");
      if (last && Date.now() - last < RESUBMIT_MS) {
        const seconds = Math.ceil((RESUBMIT_MS - (Date.now() - last)) / 1000);
        setErrorText(`Please wait ${seconds}s before submitting again.`);
        setStatus("error");
        return;
      }
    } catch {}

    const field = (name: string) => String(data.get(name) ?? "");
    const parsed = registrationSchema.safeParse({
      legal_name: field("legal_name"),
      business_name: field("business_name"),
      role_title: field("role_title"),
      email: field("email"),
      phone: field("phone"),
      address_street: field("address_street"),
      address_city: field("address_city"),
      address_state: field("address_state"),
      address_postal_code: field("address_postal_code"),
      address_country: field("address_country"),
      intended_use: field("intended_use"),
      referral_source: field("referral_source"),
      ruo_acknowledged: acknowledged,
    });
    if (!parsed.success) {
      setFieldErrors(firstIssueByField(parsed.error.issues));
      setErrorText("Please correct the highlighted fields.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    const d = parsed.data;
    const payload = {
      legal_name: d.legal_name,
      business_name: d.business_name,
      role_title: d.role_title?.trim() || null,
      email: d.email,
      phone: d.phone,
      address_street: d.address_street,
      address_city: d.address_city,
      address_state: d.address_state,
      address_postal_code: d.address_postal_code,
      address_country: d.address_country,
      intended_use: d.intended_use,
      referral_source: d.referral_source?.trim() || null,
      ruo_acknowledged: true,
      website,
      elapsedMs,
    };
    let ok = false;
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      ok = res.ok;
    } catch {
      ok = false;
    }
    if (!ok) {
      setErrorText("We couldn't submit your details. Please try again in a moment.");
      setStatus("error");
      return;
    }
    try {
      window.sessionStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()));
    } catch {}
    setStatus("success");
    formRef.current?.reset();
    setAcknowledged(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const errorCount = Object.keys(fieldErrors).length;

  return (
    <div>
      {status === "success" ? (
        <div role="status" className="border-l-2 border-foreground pl-6 py-2">
          <p className="eyebrow-mono">Received</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-medium tracking-[-0.035em] flex items-center gap-3">
            <CircleCheck className="h-6 w-6 shrink-0" />
            Thanks: we got it.
          </h2>
          <p className="mt-5 text-base md:text-lg text-foreground leading-relaxed max-w-xl">
            A real person will review what you sent and write back within one business day with what to do next.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="group mt-8 inline-flex items-center gap-3 border-b border-foreground pb-2 text-[15px] font-medium hover:opacity-70 transition-opacity"
          >
            Submit another
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-12">
          <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="website">Leave this field empty</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>
          <SectionHeader step="01" title="About you" description="So a real person can write back." />
          <fieldset className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                id="legal_name"
                label="Full name"
                placeholder="Jane Doe"
                autoComplete="name"
                maxLength={200}
                error={fieldErrors.legal_name}
                required
              />
              <TextField
                id="business_name"
                label="Organization"
                placeholder="Personal, or company name"
                autoComplete="organization"
                maxLength={200}
                error={fieldErrors.business_name}
                required
              />
              <TextField
                id="role_title"
                label="Role / title"
                placeholder="e.g. Researcher, Founder"
                autoComplete="organization-title"
                maxLength={200}
                error={fieldErrors.role_title}
              />
              <TextField
                id="email"
                label="Email"
                type="email"
                placeholder="jane@email.com"
                autoComplete="email"
                maxLength={320}
                error={fieldErrors.email}
                required
              />
              <TextField
                id="phone"
                label="Phone"
                type="tel"
                placeholder="(615) 555 0123"
                autoComplete="tel"
                maxLength={50}
                error={fieldErrors.phone}
                required
              />
            </div>
          </fieldset>
          <SectionHeader step="02" title="Where to ship" description="Used only to fulfill orders. Never shared." />
          <fieldset className="space-y-6">
            <TextField
              id="address_street"
              label="Street address"
              placeholder="123 Main St"
              autoComplete="street-address"
              maxLength={300}
              error={fieldErrors.address_street}
              required
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                id="address_city"
                label="City"
                placeholder="Nashville"
                autoComplete="address-level2"
                maxLength={120}
                error={fieldErrors.address_city}
                required
              />
              <TextField
                id="address_state"
                label="State / region"
                placeholder="TN"
                autoComplete="address-level1"
                maxLength={120}
                error={fieldErrors.address_state}
                required
              />
              <TextField
                id="address_postal_code"
                label="Postal code"
                placeholder="37203"
                autoComplete="postal-code"
                maxLength={30}
                error={fieldErrors.address_postal_code}
                required
              />
              <TextField
                id="address_country"
                label="Country"
                autoComplete="country-name"
                maxLength={120}
                error={fieldErrors.address_country}
                defaultValue="United States"
                helper="Pre filled: change if shipping elsewhere."
                required
              />
            </div>
          </fieldset>
          <SectionHeader
            step="03"
            title="Tell us a little"
            description="A sentence or two is plenty: this helps us point you in the right direction."
          />
          <fieldset className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <Label htmlFor="intended_use" className="text-sm font-medium text-foreground">
                  What are you curious about?
                  <span aria-hidden className="ml-1 text-accent">
                    *
                  </span>
                </Label>
                <span className="text-xs text-accent font-medium">Required</span>
              </div>
              <Textarea
                id="intended_use"
                name="intended_use"
                required
                maxLength={5000}
                rows={5}
                placeholder="What brought you here? What would you like to learn or try?"
                className="rounded-md border border-input bg-background/50 px-4 py-3 text-base shadow-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:border-accent transition-colors resize-y"
                aria-invalid={!!fieldErrors.intended_use}
                aria-describedby={fieldErrors.intended_use ? "intended_use-error" : "intended_use-helper"}
              />
              {fieldErrors.intended_use ? (
                <p id="intended_use-error" className="flex items-center gap-1.5 text-sm text-destructive">
                  <CircleAlert className="h-3.5 w-3.5 shrink-0" />
                  {fieldErrors.intended_use}
                </p>
              ) : (
                <p id="intended_use-helper" className="text-sm text-muted-foreground">
                  No jargon needed. Plain English is best.
                </p>
              )}
            </div>
            <TextField
              id="referral_source"
              label="How did you hear about us?"
              placeholder="A friend, search, a podcast…"
              maxLength={200}
              error={fieldErrors.referral_source}
            />
          </fieldset>
          <div className="rounded-md border border-border border-l-2 border-l-accent bg-muted/40 p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={acknowledged}
                onCheckedChange={(checked) => setAcknowledged(checked === true)}
                aria-invalid={!!fieldErrors.ruo_acknowledged}
                className="mt-0.5 h-5 w-5 data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-accent-foreground"
              />
              <span className="text-sm leading-relaxed text-foreground">
                I understand the information here is educational, and I&apos;ll ask Socal Bioresearch if anything is
                unclear. <span className="text-muted-foreground">(Required)</span>
              </span>
            </label>
            {fieldErrors.ruo_acknowledged && (
              <p className="flex items-center gap-1.5 text-sm text-destructive mt-2 ml-8">
                <CircleAlert className="h-3.5 w-3.5 shrink-0" />
                {fieldErrors.ruo_acknowledged}
              </p>
            )}
          </div>
          <div aria-live="polite">
            {status === "error" && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                <CircleAlert className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  {errorCount > 0
                    ? `Please fix ${errorCount} ${errorCount === 1 ? "field" : "fields"} below.`
                    : errorText || "Something went wrong. Please try again."}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-md bg-foreground px-8 h-12 text-[15px] font-medium text-background ring-2 ring-transparent hover:ring-accent/40 hover:bg-foreground/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{status === "submitting" ? "Submitting…" : "Send my details"}</span>
              <ArrowUpRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <p className="text-sm text-muted-foreground">We reply within one business day: from a real person.</p>
          </div>
        </form>
      )}
    </div>
  );
}
