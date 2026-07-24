import { prisma } from "@/lib/prisma";
import { productJsonLd, pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { Product } from "@/components/storefront/Product";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { notFound } from "next/navigation";

const CAT_LABEL: Record<string, string> = { ready: "Ready-to-Wear", craft: "Indian Craft", linen: "Linen" };

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await prisma.product.findUnique({ where: { slug: params.slug }, include: { images: true } });
  if (!p) return {};
  return pageMetadata({
    title: p.metaTitle || p.name,
    description: p.metaDesc || p.story || `${p.name} — Indian craft, global silhouette. Handmade in small runs across India.`,
    path: `/products/${p.slug}`,
    image: p.images[0]?.url,
  });
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
  const catLabel = CAT_LABEL[p.category] ?? p.category;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(p)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Collection", path: "/shop/all" }, { name: catLabel, path: `/shop/${p.category}` }, { name: p.name, path: `/products/${p.slug}` }])
      ) }} />
      <Breadcrumb items={[{ name: "Home", path: "/" }, { name: "Collection", path: "/shop/all" }, { name: catLabel, path: `/shop/${p.category}` }, { name: p.name, path: `/products/${p.slug}` }]} />
      <Product product={product} related={related} />
    </>
  );
}
