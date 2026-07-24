// CMS — catalogue management
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BulkSelectTable from "@/components/admin/BulkSelectTable";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    include: { vendor: true, variants: true, images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });
  const rows = products.map((p) => ({
    id: p.id, name: p.name, category: p.category, vendorName: p.vendor.name,
    price: p.basePrice, stock: p.variants.reduce((s, v) => s + v.stock, 0), status: p.status,
    thumbnail: p.images[0]?.url ?? null, preOrder: p.preOrder,
  }));
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Catalogue (CMS)</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin/products/bulk" style={{ padding: "10px 20px", background: "#fff", border: "1px solid #ccc", textDecoration: "none", fontSize: 13, color: "#0a0a0a" }}>
            Bulk import
          </Link>
          <Link href="/admin/products/new" style={{ padding: "10px 20px", background: "#0a0a0a", color: "#fff", textDecoration: "none", fontSize: 13 }}>
            + New product
          </Link>
        </div>
      </div>
      <BulkSelectTable products={rows} />
    </>
  );
}
