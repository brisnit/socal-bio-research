import { requireAdmin } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { ActionForm } from "@/components/admin/forms";
import { Badge, Card, Field, PageTitle, Select, Table, Td, TextInput, formatDate } from "@/components/admin/ui";
import { ADMIN_ROLES } from "@/lib/admin/schemas";
import { changeRole, inviteUser, removeUser } from "./actions";

type Row = { user_id: string; email: string; role: string; created_at: string };

const ROLE_HELP = "Owner: everything incl. users · Admin: integrations, prices, deletes, imports, audit · Editor: content and submissions · Viewer: read-only";

function RoleSelect({ value }: { value: string }) {
  return (
    <Select name="role" defaultValue={value} className="w-32">
      {ADMIN_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
    </Select>
  );
}

export default async function Users() {
  const me = await requireAdmin("owner");
  const { data, error } = await adminDb().from("admin_users").select("user_id,email,role,created_at").order("created_at");
  const rows = (data ?? []) as Row[];
  return (
    <>
      <PageTitle title="Users & roles" description={ROLE_HELP} />
      <Card className="mb-8">
        <h2 className="mb-4 font-display font-semibold">Invite admin</h2>
        <ActionForm action={inviteUser} submitLabel="Send invite">
          <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
            <Field label="Email"><TextInput name="email" type="email" required /></Field>
            <Field label="Role"><RoleSelect value="editor" /></Field>
          </div>
        </ActionForm>
      </Card>
      {error && <p className="mb-4 text-sm text-destructive">{error.message}</p>}
      <Table head={["Email", "Role", "Added", ""]}>
        {rows.map((u) => {
          const self = u.user_id === me.userId;
          return (
            <tr key={u.user_id}>
              <Td>{u.email} {self && <Badge>you</Badge>}</Td>
              <Td>
                {self ? (
                  <Badge tone="good">{u.role}</Badge>
                ) : (
                  <ActionForm action={changeRole.bind(null, u.user_id)} inline submitVariant="secondary" submitLabel="Update">
                    <RoleSelect value={u.role} />
                  </ActionForm>
                )}
              </Td>
              <Td>{formatDate(u.created_at)}</Td>
              <Td className="text-right">
                {!self && <ActionForm action={removeUser.bind(null, u.user_id)} inline submitVariant="danger" submitLabel="Remove" confirm={`Remove admin access for ${u.email}?`} />}
              </Td>
            </tr>
          );
        })}
      </Table>
      <p className="mt-2 text-xs text-muted-foreground">Removing access deletes the admin role only; the sign-in account remains in Supabase Auth.</p>
    </>
  );
}
