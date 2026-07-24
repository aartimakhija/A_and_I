import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/categories";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProduct({ params }: { params: { id: string } }) {
  const s = await getSession();
  const [product, vendors, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { position: "asc" } }, variants: true, tiers: { orderBy: { position: "asc" } } },
    }),
    s.role === "ADMIN" ? prisma.vendor.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }) : [],
    getCategories(true), // include inactive so an existing product keeps showing its (now-deactivated) category correctly
  ]);
  if (!product) notFound();
  return (
    <>
      <h1>Edit {product.name}</h1>
      <div style={{ marginTop: 24 }}>
        <ProductForm vendors={vendors} categories={categories} isAdmin={s.role === "ADMIN"} product={product} />
      </div>
    </>
  );
}
