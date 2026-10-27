import { ActionForm, type ActionState } from "@/components/admin/forms";
import { Field, Select, TextArea } from "@/components/admin/ui";
import { INQUIRY_STATUSES } from "@/lib/admin/schemas";

export function SubmissionForm({
  action,
  status,
  notes,
  canEdit,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  status: string;
  notes: string | null;
  canEdit: boolean;
}) {
  if (!canEdit) return <p className="text-sm text-muted-foreground">Viewers cannot change status or notes.</p>;
  return (
    <ActionForm action={action} submitLabel="Save">
      <Field label="Status">
        <Select name="status" defaultValue={status}>
          {INQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </Select>
      </Field>
      <Field label="Admin notes" hint="Internal only; never shown publicly.">
        <TextArea name="admin_notes" defaultValue={notes ?? ""} rows={5} />
      </Field>
    </ActionForm>
  );
}
