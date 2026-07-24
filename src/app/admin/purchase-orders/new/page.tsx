import { prisma } from "@/lib/prisma";
import POForm from "@/components/admin/POForm";

export default async function NewPO({ searchParams }: { searchParams: { vendorId?: string } }) {
  const [vendors, products] = await Promise.all([
    prisma.vendor.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.product.findMany({ select: { id: true, name: true, basePrice: true }, orderBy: { name: "asc" } }),
  ]);
  return (
    <>
      <h1>New purchase order</h1>
      <div style={{ marginTop: 24 }}>
        <POForm vendors={vendors} products={products} initialVendorId={searchParams.vendorId} />
      </div>
    </>
  );
}
