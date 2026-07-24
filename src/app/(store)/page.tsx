import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { Home } from "@/components/storefront/Home";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "A&I — Style With Us",
  description: "Indian craft, global silhouette. Womenswear handmade in small runs across India — bandhani, mirror-work, and zari cut into contemporary silhouettes.",
  path: "/",
});

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: 40,
  });
  const all = products.map(toSFProduct);

  // Admin-curated picks (set via each product's edit page) take priority;
  // fall back to "most recent" so the homepage still works before anyone
  // has curated anything.
  const curatedFeatured = products
    .filter((p) => p.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder)
    .map(toSFProduct);
  const featured = curatedFeatured.length > 0 ? curatedFeatured.slice(0, 4) : all.slice(0, 4);

  const craft = all.filter((p) => p.category === "craft").slice(0, 3);
  const philosophyPiece = all.find((p) => p.category === "linen") ?? all[4] ?? null;

  return <Home featured={featured} craft={craft.length ? craft : all.slice(0, 3)} philosophyPiece={philosophyPiece} allProducts={all} />;
}
