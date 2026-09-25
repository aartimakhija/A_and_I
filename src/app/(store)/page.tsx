import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { HomeV2 } from "@/components/storefront/HomeV2";
import { pageMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";
import { getCategories } from "@/lib/categories";
import type { CollectionCard } from "@/components/site/CollectionSection";

export const metadata = pageMetadata({
  title: "A&I — Style With Us",
  description: "Architecture in Linen: girih cutwork laser-cut into washed linen, shortlisted in small runs and made once it's wanted. Womenswear designed in Ahmedabad, India.",
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

  // The Collection section (Lovable-style: one featured piece + six curated
  // cards). Reuses "featured" for the hero piece and fills the six from the
  // rest of the live catalogue, avoiding repeats.
  const featuredPiece = featured[0] ?? all[0] ?? null;
  const curatedSix = all.filter((p) => p.id !== featuredPiece?.id).slice(0, 6);

  // "Now in movement" hero card: a second piece, preferring one with a video.
  const movementCandidate = all.find((p) => p.id !== featuredPiece?.id && p.videoUrl) ?? all.find((p) => p.id !== featuredPiece?.id) ?? null;

  const collections: CollectionCard[] = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    imageUrl: c.coverImageUrl ?? all.find((p) => p.category === c.slug)?.images[0] ?? null,
    blurb: `Pieces from the ${c.name} edit.`,
  }));

  return (
    <HomeV2
      heroVideoUrl={featuredPiece?.videoUrl ?? null}
      heroImageUrl={settings.heroImageUrl ?? featuredPiece?.images[0] ?? null}
      movementPiece={
        movementCandidate
          ? { slug: movementCandidate.slug, name: movementCandidate.name, imageUrl: movementCandidate.images[0] ?? null, videoUrl: movementCandidate.videoUrl }
          : null
      }
      philosophyPiece={philosophyPiece}
      featuredProduct={featuredPiece}
      curatedProducts={curatedSix}
      collections={collections}
    />
  );
}
