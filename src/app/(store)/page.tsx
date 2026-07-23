import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { Home } from "@/components/storefront/Home";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: 24,
  });
  const all = products.map(toSFProduct);

  const featured = all.slice(0, 4);
  const craft = all.filter((p) => p.category === "craft").slice(0, 3);
  const philosophyPiece = all.find((p) => p.category === "linen") ?? all[4] ?? null;

  return <Home featured={featured} craft={craft.length ? craft : all.slice(0, 3)} philosophyPiece={philosophyPiece} allProducts={all} />;
}
