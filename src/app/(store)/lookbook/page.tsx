import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { Lookbook } from "@/components/storefront/Lookbook";

export default async function LookbookPage() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  return <Lookbook products={products.map(toSFProduct)} />;
}
