// CMS — catalogue management
import { prisma } from "@/lib/prisma";
import BulkSelectTable from "@/components/admin/BulkSelectTable";
import { Button, PageHeader } from "@/components/admin/ui";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    include: { vendor: true, variants: true, images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });
  const rows = products.map((p) => ({
    id: p.id, name: p.name, category: p.category, vendorName: p.vendor?.name ?? "—",
    price: p.basePrice, stock: p.variants.reduce((s, v) => s + v.stock, 0), status: p.status,
    thumbnail: p.images[0]?.url ?? null, preOrder: p.preOrder,
  }));
  return (
    <>
      <PageHeader
        title="Catalogue"
        subtitle={`${products.length} product${products.length === 1 ? "" : "s"}`}
        actions={
          <>
            <Button href="/admin/products/bulk" variant="secondary">Bulk import</Button>
            <Button href="/admin/products/new" variant="primary">+ New product</Button>
          </>
        }
      />
      <BulkSelectTable products={rows} />
    </>
  );
}
