import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/categories";
import ProductForm from "@/components/admin/ProductForm";
import { Badge, Button, PageHeader, productStatusTone } from "@/components/admin/ui";

export default async function EditProduct({ params }: { params: { id: string } }) {
  const s = await getSession();
  const [product, vendors, categories, materials] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { position: "asc" } }, variants: true, tiers: { orderBy: { position: "asc" } }, bom: true },
    }),
    s.role === "ADMIN" ? prisma.vendor.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }) : [],
    getCategories(true), // include inactive so an existing product keeps showing its (now-deactivated) category correctly
    prisma.material.findMany({ select: { id: true, name: true, unit: true }, orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();
  return (
    <>
      <PageHeader
        title={product.name}
        subtitle={`/${product.slug}`}
        backHref="/admin/products"
        backLabel="Catalogue"
        actions={
          <>
            <Badge tone={productStatusTone(product.status)}>{product.status.replace("_", " ")}</Badge>
            {product.status === "ACTIVE" && (
              <Button href={`/products/${product.slug}`} target="_blank" variant="ghost">
                View live ↗
              </Button>
            )}
          </>
        }
      />
      <ProductForm vendors={vendors} categories={categories} materials={materials} isAdmin={s.role === "ADMIN"} product={product} />
    </>
  );
}
