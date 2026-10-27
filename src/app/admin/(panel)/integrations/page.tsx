import { requireAdmin } from "@/lib/admin/auth";
import { adminDb } from "@/lib/admin/db";
import { ActionForm, JsonTextArea } from "@/components/admin/forms";
import { Badge, Card, Checkbox, Empty, Field, Notice, PageTitle, Table, Td, formatDate } from "@/components/admin/ui";
import { saveIntegration } from "./actions";

const ENV_SECRETS = ["ANTHROPIC_API_KEY", "RESEND_API_KEY", "NOTIFY_FROM_EMAIL", "SUPABASE_SERVICE_ROLE_KEY"] as const;

type Integration = { key: string; enabled: boolean; config: unknown; updated_at: string };

export default async function Integrations() {
  await requireAdmin("admin");
  const { data, error } = await adminDb().from("integrations").select("key,enabled,config,updated_at").order("key");
  const rows = (data ?? []) as Integration[];
  // Booleans only: values never leave the server.
  const env = ENV_SECRETS.map((k) => [k, Boolean(process.env[k])] as const);
  return (
    <>
      <PageTitle title="Integrations" description="Non-secret settings only. API keys and other secrets live in environment variables on the host." />
      <Card className="mb-8">
        <h2 className="mb-3 font-display font-semibold">Environment secrets</h2>
        <Table head={["Variable", "Status"]}>
          {env.map(([k, present]) => (
            <tr key={k}><Td className="font-mono text-xs">{k}</Td><Td>{present ? <Badge tone="good">set</Badge> : <Badge tone="bad">missing</Badge>}</Td></tr>
          ))}
        </Table>
        <p className="mt-2 text-xs text-muted-foreground">Only presence is shown; values are never sent to the browser.</p>
      </Card>
      <Notice>The payments integration only stores settings. No processor is connected and enabling it does not turn on checkout.</Notice>
      {error && <p className="mb-4 text-sm text-destructive">{error.message}</p>}
      {!rows.length && <Empty>No integration rows. They are created by the initial migration.</Empty>}
      <div className="space-y-6">
        {rows.map((r) => (
          <Card key={r.key}>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="font-mono font-semibold">{r.key}</h2>
              {r.enabled ? <Badge tone="good">enabled</Badge> : <Badge>disabled</Badge>}
              <span className="text-xs text-muted-foreground">updated {formatDate(r.updated_at)}</span>
            </div>
            <ActionForm action={saveIntegration.bind(null, r.key)} submitLabel="Save">
              <Checkbox name="enabled" label="Enabled" defaultChecked={r.enabled} />
              <Field label="Config (JSON object, no secrets)">
                <JsonTextArea key={r.updated_at} name="config" rows={6} defaultValue={JSON.stringify(r.config ?? {}, null, 2)} />
              </Field>
            </ActionForm>
          </Card>
        ))}
      </div>
    </>
  );
}
