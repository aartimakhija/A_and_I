// Storefront collection/PLP: /shop/all plus one page per backend-configured category
import { prisma } from "@/lib/prisma";
import { categoryPaths, pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getCategories } from "@/lib/categories";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { Collection } from "@/components/storefront/Collection";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";

export async function generateStaticParams() { return categoryPaths(); }
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { category: string } }) {
  const categories = await getCategories();
  const label = params.category === "all" ? "The Collection" : categories.find((c) => c.slug === params.category)?.name ?? params.category;
  return pageMetadata({
    title: label,
    description: `Shop ${label === "The Collection" ? "the full A&I collection" : `A&I ${label} pieces`} — Indian craft, global silhouette, made in small runs across India.`,
    path: `/shop/${params.category}`,
  });
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categories = await getCategories();
  const where: any = { status: "ACTIVE" };
  if (params.category !== "all") where.category = params.category;
  const products = await prisma.product.findMany({ where, include: PRODUCT_INCLUDE, orderBy: { createdAt: "desc" } });
  const label = params.category === "all" ? "The Collection" : categories.find((c) => c.slug === params.category)?.name ?? params.category;

  // "Shop by category" tile row (matching Lovable's shop/all page) — one
  // representative piece per category, only shown on the unfiltered /shop/all view.
  let categoryTiles: { slug: string; name: string; imageUrl?: string | null }[] = [];
  if (params.category === "all") {
    const reps = await Promise.all(
      categories.map((c) => prisma.product.findFirst({ where: { status: "ACTIVE", category: c.slug }, include: PRODUCT_INCLUDE, orderBy: { createdAt: "desc" } }))
    );
    categoryTiles = categories.map((c, i) => ({ slug: c.slug, name: c.name, imageUrl: reps[i] ? toSFProduct(reps[i]!).images[0] : null }));
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Collection", path: "/shop/all" }, ...(params.category !== "all" ? [{ name: label, path: `/shop/${params.category}` }] : [])])
      ) }} />
      <Breadcrumb items={[{ name: "Home", path: "/" }, { name: "Collection", path: "/shop/all" }, ...(params.category !== "all" ? [{ name: label, path: `/shop/${params.category}` }] : [])]} />
      <Collection products={products.map(toSFProduct)} category={params.category} categories={categories} categoryTiles={categoryTiles} />
    </>
  );
}
