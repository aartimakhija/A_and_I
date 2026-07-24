import { prisma } from "@/lib/prisma";
import MaterialOrderForm from "@/components/admin/MaterialOrderForm";

export default async function NewMaterialOrder() {
  const [vendors, materials] = await Promise.all([
    prisma.vendor.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.material.findMany({ select: { id: true, name: true, unit: true, costPerUnit: true }, orderBy: { name: "asc" } }),
  ]);
  if (materials.length === 0) {
    return (
      <>
        <h1>New material order</h1>
        <p style={{ color: "#999", marginTop: 16 }}>Add at least one material under <a href="/admin/materials">Materials</a> first.</p>
      </>
    );
  }
  return (
    <>
      <h1>New material order</h1>
      <div style={{ marginTop: 24 }}>
        <MaterialOrderForm vendors={vendors} materials={materials} />
      </div>
    </>
  );
}
