// Storefront collection/PLP: /shop/all plus one page per backend-configured category
import { prisma } from "@/lib/prisma";
import { categoryPaths, pageMetadata, breadcrumbJsonLd, jsonLdHtml } from "@/lib/seo";
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
  const allCategories = await getCategories();
  const where: any = { status: "ACTIVE" };
  if (params.category !== "all") where.category = params.category;
  const products = await prisma.product.findMany({ where, include: PRODUCT_INCLUDE, orderBy: { createdAt: "desc" } });
  const label = params.category === "all" ? "The Collection" : allCategories.find((c) => c.slug === params.category)?.name ?? params.category;

  // A category with zero live products is a dead end, not a "coming soon" —
  // never show it as something to browse (filter chips here, tiles below,
  // and anywhere else categories are listed on the storefront). The admin
  // Categories page still shows everything, since staff need to manage a
  // category before it has products in it.
  const counts = await prisma.product.groupBy({ by: ["category"], where: { status: "ACTIVE" }, _count: { _all: true } });
  const countBySlug = new Map(counts.map((c) => [c.category, c._count._all]));
  const categories = allCategories.filter((c) => (countBySlug.get(c.slug) ?? 0) > 0);

  // "Shop by category" tile row (matching Lovable's shop/all page) — one
  // representative piece per category, only shown on the unfiltered /shop/all view.
  // Picks the newest ACTIVE product that actually HAS a photo, not just the
  // newest product overall — otherwise a freshly-added, not-yet-photographed
  // product silently blanks out its whole category tile.
  let categoryTiles: { slug: string; name: string; imageUrl?: string | null }[] = [];
  if (params.category === "all") {
    // A hiccup fetching tile images (e.g. a cold-start DB blip) should never
    // take down the whole page — worst case, "Shop by category" just doesn't
    // render this one visit instead of the entire collection page 500ing.
    try {
      const reps = await Promise.all(
        categories.map((c) =>
          prisma.product.findMany({ where: { status: "ACTIVE", category: c.slug }, include: PRODUCT_INCLUDE, orderBy: { createdAt: "desc" }, take: 10 })
        )
      );
      categoryTiles = categories.map((c, i) => {
        const withImage = reps[i].map(toSFProduct).find((p) => p.images[0]);
        return { slug: c.slug, name: c.name, imageUrl: withImage?.images[0] ?? null };
      });
    } catch (err) {
      console.error("Failed to build category tiles for /shop/all:", err);
      categoryTiles = [];
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Collection", path: "/shop/all" }, ...(params.category !== "all" ? [{ name: label, path: `/shop/${params.category}` }] : [])])
      ) }} />
      <Breadcrumb items={[{ name: "Home", path: "/" }, { name: "Collection", path: "/shop/all" }, ...(params.category !== "all" ? [{ name: label, path: `/shop/${params.category}` }] : [])]} />
      <Collection products={products.map(toSFProduct)} category={params.category} categories={categories} categoryTiles={categoryTiles} />
    </>
  );
}
