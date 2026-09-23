import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { HomeV2 } from "@/components/storefront/HomeV2";
import { pageMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";
import { getCategories } from "@/lib/categories";
import type { CollectionCard } from "@/components/site/CollectionSection";

export const metadata = pageMetadata({
  title: "A&I — Style With Us",
  description: "Indian craft, global silhouette. Womenswear handmade in small runs across India — bandhani, mirror-work, and zari cut into contemporary silhouettes.",
  path: "/",
});

export default async function HomePage() {
  const [products, settings, categories] = await Promise.all([
    prisma.product.findMany({ where: { status: "ACTIVE" }, include: PRODUCT_INCLUDE, orderBy: { createdAt: "desc" }, take: 40 }),
    getSiteSettings(),
    getCategories(),
  ]);
  const all = products.map(toSFProduct);

  // Admin-curated picks (set via each product's edit page) take priority;
  // fall back to "most recent" so the homepage still works before anyone
  // has curated anything.
  const curatedFeatured = products
    .filter((p) => p.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder)
    .map(toSFProduct);
  const featured = curatedFeatured.length > 0 ? curatedFeatured.slice(0, 4) : all.slice(0, 4);

  const philosophyPiece = all.find((p) => p.category === "linen") ?? all[4] ?? null;

  const collections: CollectionCard[] = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    imageUrl: c.coverImageUrl ?? all.find((p) => p.category === c.slug)?.images[0] ?? null,
  }));

  return <HomeV2 featured={featured} philosophyPiece={philosophyPiece} collections={collections} heroImageUrl={settings.heroImageUrl} />;
}
