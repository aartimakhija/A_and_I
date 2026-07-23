import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { About } from "@/components/storefront/About";

export default async function AboutPage() {
  const p = await prisma.product.findFirst({ where: { status: "ACTIVE", category: "craft" }, include: PRODUCT_INCLUDE });
  return <About featurePiece={p ? toSFProduct(p) : null} />;
}
