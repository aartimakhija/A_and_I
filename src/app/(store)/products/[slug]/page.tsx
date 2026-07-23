import { prisma } from "@/lib/prisma";
import { productJsonLd } from "@/lib/seo";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { Product } from "@/components/storefront/Product";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!p) return {};
  return { title: p.metaTitle || `${p.name} — A & I`, description: p.metaDesc || p.story || undefined };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await prisma.product.findUnique({ where: { slug: params.slug }, include: PRODUCT_INCLUDE });
  if (!p) notFound();

  const relatedRaw = await prisma.product.findMany({
    where: { category: p.category, status: "ACTIVE", id: { not: p.id } },
    include: PRODUCT_INCLUDE,
    take: 4,
  });

  const product = toSFProduct(p);
  const related = relatedRaw.map(toSFProduct);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(p)) }} />
      <Product product={product} related={related} />
    </>
  );
}
