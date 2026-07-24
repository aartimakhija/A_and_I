import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/categories";
import CategoriesManager from "@/components/admin/CategoriesManager";

export default async function AdminCategories() {
  const categories = await getCategories(true);
  const counts = await prisma.product.groupBy({ by: ["category"], _count: { category: true } });
  const productCounts = Object.fromEntries(counts.map((c) => [c.category, c._count.category]));

  return (
    <>
      <h1>Categories</h1>
      <div style={{ marginTop: 24 }}>
        <CategoriesManager initial={categories} productCounts={productCounts} />
      </div>
    </>
  );
}
