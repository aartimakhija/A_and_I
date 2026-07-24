import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { About } from "@/components/storefront/About";

export default async function AboutPage() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  const all = products.map(toSFProduct);
  const originPiece = all.find((p) => p.category === "craft") ?? all[0] ?? null;
  const processPieces = all.filter((p) => p.id !== originPiece?.id).slice(0, 3);

  return <About originPiece={originPiece} processPieces={processPieces} pieceCount={all.length} />;
}
