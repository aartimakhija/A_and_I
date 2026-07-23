import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProduct() {
  const s = await getSession();
  const vendors = s.role === "ADMIN" ? await prisma.vendor.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }) : [];
  return (
    <>
      <h1>New product</h1>
      <div style={{ marginTop: 24 }}>
        <ProductForm vendors={vendors} isAdmin={s.role === "ADMIN"} />
      </div>
    </>
  );
}
