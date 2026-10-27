import { requireAdmin } from "@/lib/admin/auth";
import { ButtonLink, PageTitle } from "@/components/admin/ui";
import { saveProduct } from "../actions";
import { EMPTY_PRODUCT, ProductForm } from "../product-form";

export default async function NewProduct() {
  await requireAdmin("editor");
  return (
    <>
      <PageTitle title="New product" actions={<ButtonLink href="/admin/products">Back</ButtonLink>} />
      <ProductForm product={EMPTY_PRODUCT} action={saveProduct.bind(null, null)} />
    </>
  );
}
