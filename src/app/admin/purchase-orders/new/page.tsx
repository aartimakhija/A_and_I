import { prisma } from "@/lib/prisma";
import POForm from "@/components/admin/POForm";

export default async function NewPO({ searchParams }: { searchParams: { vendorId?: string; productId?: string; qty?: string } }) {
  const [vendors, products] = await Promise.all([
    prisma.vendor.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.product.findMany({ select: { id: true, name: true, basePrice: true }, orderBy: { name: "asc" } }),
  ]);

  let initialItems;
  if (searchParams.productId) {
    const p = products.find((x) => x.id === searchParams.productId);
    if (p) initialItems = [{ productId: p.id, description: p.name, qty: parseInt(searchParams.qty || "1", 10), unitCost: p.basePrice / 100 }];
  }

  return (
    <>
      <h1>New production order</h1>
      <div style={{ marginTop: 24 }}>
        <POForm vendors={vendors} products={products} initialVendorId={searchParams.vendorId} initialItems={initialItems} />
      </div>
    </>
  );
}
