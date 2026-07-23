import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { StoreShell } from "@/components/storefront/StoreShell";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  const catalogue = products.map(toSFProduct);

  return <StoreShell catalogue={catalogue}>{children}</StoreShell>;
}
