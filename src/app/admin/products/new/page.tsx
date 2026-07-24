import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import { getCategories } from "@/lib/categories";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProduct() {
  const s = await getSession();
  const [vendors, categories] = await Promise.all([
    s.role === "ADMIN" ? prisma.vendor.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }) : [],
    getCategories(),
  ]);
  return (
    <>
      <h1>New product</h1>
      <div style={{ marginTop: 24 }}>
        <ProductForm vendors={vendors} categories={categories} isAdmin={s.role === "ADMIN"} />
      </div>
    </>
  );
}
