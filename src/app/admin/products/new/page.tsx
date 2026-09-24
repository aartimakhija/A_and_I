import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import { getCategories } from "@/lib/categories";
import ProductForm from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/ui";

export default async function NewProduct() {
  const s = await getSession();
  const [vendors, categories, materials] = await Promise.all([
    s.role === "ADMIN" ? prisma.vendor.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }) : [],
    getCategories(),
    prisma.material.findMany({ select: { id: true, name: true, unit: true }, orderBy: { name: "asc" } }),
  ]);
  return (
    <>
      <PageHeader title="New product" backHref="/admin/products" backLabel="Catalogue" />
      <ProductForm vendors={vendors} categories={categories} materials={materials} isAdmin={s.role === "ADMIN"} />
    </>
  );
}
