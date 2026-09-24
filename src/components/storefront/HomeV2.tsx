import type { SFProduct } from "@/lib/storefront-adapter";
import { ArrivalHero } from "@/components/site/ArrivalHero";
import { Marquee } from "@/components/site/Marquee";
import { PointOfView } from "@/components/site/PointOfView";
import { CollectionSection, type CollectionCard } from "@/components/site/CollectionSection";
import { HomeFlow } from "@/components/site/HomeFlow";

const MARQUEE_WORDS = ["Indian craft", "Global silhouette", "Hand-finished", "Made to be seen", "Small runs, made well"];

type MovementPiece = { slug: string; name: string; imageUrl?: string | null; videoUrl?: string | null };

/**
 * Homepage flow — ported 1:1 from Lovable's index.tsx + HomeFlow.tsx:
 * ArrivalHero (01) → Marquee → PointOfView (02) → CollectionSection (03) →
 * HomeFlow (04–12, closes with the newsletter + Instagram line). Every
 * section is data-driven from the live catalogue, so this stays correct as
 * products change instead of pointing at hard-coded slugs.
 */
export function HomeV2({
  heroImageUrl,
  heroVideoUrl,
  movementPiece,
  philosophyPiece,
  featuredProduct,
  curatedProducts,
  collections,
}: {
  heroImageUrl?: string | null;
  heroVideoUrl?: string | null;
  movementPiece?: MovementPiece | null;
  philosophyPiece: SFProduct | null;
  featuredProduct: SFProduct | null;
  curatedProducts: SFProduct[];
  collections: CollectionCard[];
}) {
  return (
    <>
      <ArrivalHero imageUrl={heroImageUrl} videoUrl={heroVideoUrl} movementPiece={movementPiece} />
      <Marquee items={MARQUEE_WORDS} />

      {/* PointOfView's four steps are typed (Idea/Form/Material/Craft), not just
          "four photos" — feed each one the story-photo that actually matches,
          falling back to plain gallery shots only where a product has none. */}
      <PointOfView
        images={
          philosophyPiece
            ? [
                philosophyPiece.sketchImageUrl ?? philosophyPiece.images[0] ?? null,
                philosophyPiece.images[0] ?? null,
                philosophyPiece.fabricImageUrl ?? philosophyPiece.images[1] ?? null,
                philosophyPiece.makingImageUrl ?? philosophyPiece.images[2] ?? null,
              ]
            : []
        }
      />

      <CollectionSection
        featuredProduct={featuredProduct}
        curatedProducts={curatedProducts}
        worldTiles={collections}
      />

      <HomeFlow />
    </>
  );
}
