import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProduct({ params }: { params: { id: string } }) {
  const s = await getSession();
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { position: "asc" } }, variants: true, tiers: { orderBy: { position: "asc" } } },
  });
  if (!product) notFound();
  const vendors = s.role === "ADMIN" ? await prisma.vendor.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }) : [];
  return (
    <>
      <h1>Edit {product.name}</h1>
      <div style={{ marginTop: 24 }}>
        <ProductForm vendors={vendors} isAdmin={s.role === "ADMIN"} product={product} />
      </div>
    </>
  );
}
