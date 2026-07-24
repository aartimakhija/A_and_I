import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { Lookbook } from "@/components/storefront/Lookbook";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Lookbook",
  description: "Styled head to toe — the bag, the jewellery, the shoes. See the SS'26 collection worn, look by look.",
  path: "/lookbook",
});

export default async function LookbookPage() {
  // Admin-curated order (set via each product's edit page) takes priority.
  const curated = await prisma.product.findMany({
    where: { status: "ACTIVE", lookbookOrder: { not: null } },
    include: PRODUCT_INCLUDE,
    orderBy: { lookbookOrder: "asc" },
    take: 8,
  });
  if (curated.length > 0) {
    return <Lookbook products={curated.map(toSFProduct)} />;
  }

  // Fallback so the page still works before anyone has curated anything.
  const recent = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  return <Lookbook products={recent.map(toSFProduct)} />;
}
