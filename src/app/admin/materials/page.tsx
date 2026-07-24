import { prisma } from "@/lib/prisma";
import MaterialsManager from "@/components/admin/MaterialsManager";

export default async function AdminMaterials() {
  const [materials, vendors] = await Promise.all([
    prisma.material.findMany({ orderBy: { name: "asc" } }),
    prisma.vendor.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  return (
    <>
      <h1>Materials</h1>
      <p style={{ color: "#666", marginTop: -8 }}>Raw materials — fabric, buttons, labels, packaging. Stock updates automatically when a Material Order is received.</p>
      <div style={{ marginTop: 24 }}>
        <MaterialsManager initial={materials} vendors={vendors} />
      </div>
    </>
  );
}
