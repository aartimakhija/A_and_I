// Storefront collection/PLP: /shop/all · /shop/ready · /shop/craft · /shop/linen
import { prisma } from "@/lib/prisma";
import { categoryPaths } from "@/lib/seo";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { Collection } from "@/components/storefront/Collection";

export async function generateStaticParams() { return categoryPaths(); }
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { category: string } }) {
  const c = params.category;
  const label = c === "all" ? "The Collection" : c[0].toUpperCase() + c.slice(1);
  return { title: `${label} — A & I`, description: `Shop A & I ${c === "all" ? "" : c + " "}pieces. Indian craft, global silhouette.` };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const where: any = { status: "ACTIVE" };
  if (params.category !== "all") where.category = params.category;
  const products = await prisma.product.findMany({ where, include: PRODUCT_INCLUDE, orderBy: { createdAt: "desc" } });
  return <Collection products={products.map(toSFProduct)} category={params.category} />;
}
