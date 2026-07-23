import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { StoreShell } from "@/components/storefront/StoreShell";

// Product/order data changes constantly and depends on a live database, so
// this whole route group should never be statically prerendered at build
// time — that's what was causing every storefront page to fail the build
// (Next tried to pre-render them before the database even had tables).
export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  const catalogue = products.map(toSFProduct);

  return <StoreShell catalogue={catalogue}>{children}</StoreShell>;
}
