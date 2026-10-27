import { Notice } from "@/components/admin/ui";

export function PaymentsDisabled() {
  return (
    <Notice>
      <strong>Payments are disabled. No processor is connected.</strong> Purchasable flags have no public effect until the client approves a provider.
    </Notice>
  );
}

export function money(cents: number | null | undefined, currency = "USD") {
  if (cents == null) return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
}
