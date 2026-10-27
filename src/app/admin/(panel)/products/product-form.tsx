import { readdirSync } from "node:fs";
import path from "node:path";
import { ActionForm, JsonTextArea, type ActionState } from "@/components/admin/forms";
import { Card, Checkbox, Field, Select, TextArea, TextInput } from "@/components/admin/ui";
import { CATEGORY_LABELS } from "@/content/products";
import { CATEGORIES } from "@/lib/admin/schemas";
import { adminDb } from "@/lib/admin/db";

export type ProductRow = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  summary: string;
  mechanism: string;
  research_areas: string[];
  purity: string;
  references: unknown;
  specs: Record<string, string | undefined>;
  product_image: string | null;
  coas: unknown;
  sort_order: number;
  is_published: boolean;
};

export const EMPTY_PRODUCT: ProductRow = {
  slug: "", name: "", category: "wellness-longevity", tagline: "", summary: "", mechanism: "",
  research_areas: [], purity: "", references: [], specs: {}, product_image: null, coas: [], sort_order: 0, is_published: false,
};

const SPEC_FIELDS = [
  ["cas", "CAS"],
  ["molecularWeight", "Molecular weight"],
  ["molecularFormula", "Molecular formula"],
  ["sequence", "Sequence"],
  ["form", "Form"],
  ["storage", "Storage"],
] as const;

async function imageOptions(): Promise<string[]> {
  const out: string[] = [];
  try {
    for (const f of readdirSync(path.join(process.cwd(), "public", "products"))) if (!f.startsWith(".")) out.push(`/products/${f}`);
  } catch {}
  try {
    const { data } = await adminDb().from("media_assets").select("public_url,mime_type").order("created_at", { ascending: false }).limit(200);
    for (const m of data ?? []) if (!m.mime_type || String(m.mime_type).startsWith("image/")) out.push(m.public_url as string);
  } catch {}
  return out;
}

export async function ProductForm({ product, action }: { product: ProductRow; action: (p: ActionState, fd: FormData) => Promise<ActionState> }) {
  const images = await imageOptions();
  return (
    <ActionForm action={action} submitLabel="Save product">
      <Card className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name"><TextInput name="name" required defaultValue={product.name} /></Field>
          <Field label="Slug" hint="URL: /products/<slug>. Lowercase, hyphens."><TextInput name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={product.slug} /></Field>
          <Field label="Category">
            <Select name="category" defaultValue={product.category}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </Select>
          </Field>
          <Field label="Purity"><TextInput name="purity" defaultValue={product.purity} /></Field>
          <Field label="Sort order" hint="Lower numbers show first."><TextInput name="sort_order" type="number" step={1} defaultValue={product.sort_order} /></Field>
          <div className="flex items-end pb-2"><Checkbox name="is_published" label="Published (visible on the public site)" defaultChecked={product.is_published} /></div>
        </div>
        <Field label="Tagline"><TextInput name="tagline" defaultValue={product.tagline} /></Field>
        <Field label="Summary"><TextArea name="summary" rows={3} defaultValue={product.summary} /></Field>
        <Field label="Mechanism"><TextArea name="mechanism" rows={4} defaultValue={product.mechanism} /></Field>
        <Field label="Research areas" hint="One per line."><TextArea name="research_areas" rows={4} defaultValue={(product.research_areas ?? []).join("\n")} /></Field>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display font-semibold">Specifications</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {SPEC_FIELDS.map(([k, label]) => (
            <Field key={k} label={label}><TextInput name={`spec_${k}`} defaultValue={product.specs?.[k] ?? ""} /></Field>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display font-semibold">Image and certificates</h2>
        <Field label="Product image" hint="Public path (e.g. /products/semax.webp) or a Media library URL. Leave empty for the generic vial.">
          <TextInput name="product_image" list="product-image-options" defaultValue={product.product_image ?? ""} />
        </Field>
        <datalist id="product-image-options">{images.map((u) => <option key={u} value={u} />)}</datalist>
        {product.product_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.product_image} alt="" className="h-32 w-32 rounded border border-border object-contain" />
        )}
        <Field label="COAs (JSON)" hint='Array of {"label", "purity", "image"}.'>
          <JsonTextArea name="coas" rows={8} defaultValue={JSON.stringify(product.coas ?? [], null, 2)} />
        </Field>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display font-semibold">References</h2>
        <Field label="References (JSON)" hint='Array of {"title", "source", "year" (number), "url"}.'>
          <JsonTextArea name="references" rows={12} defaultValue={JSON.stringify(product.references ?? [], null, 2)} />
        </Field>
      </Card>
    </ActionForm>
  );
}
