import type { SFProduct } from "@/lib/storefront-adapter";
import { ArrivalHero } from "@/components/site/ArrivalHero";
import { Marquee } from "@/components/site/Marquee";
import { ProductCard } from "@/components/site/ProductCard";
import { PointOfView } from "@/components/site/PointOfView";
import { CollectionSection, type CollectionCard } from "@/components/site/CollectionSection";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import Link from "next/link";

const MARQUEE_WORDS = ["Indian craft", "Global silhouette", "Hand-finished", "Made to be seen", "Small runs, made well"];

/** Re-skinned homepage (new "Ink, Marigold, Raw Ivory" design). Renders inside
 * the existing StoreShell (nav/footer/cart untouched for now — see the
 * migration plan's Phase 5). Data-driven: no hard-coded catalogue content. */
export function HomeV2({
  featured,
  philosophyPiece,
  collections,
  heroImageUrl,
}: {
  featured: SFProduct[];
  philosophyPiece: SFProduct | null;
  collections: CollectionCard[];
  heroImageUrl?: string | null;
}) {
  return (
    <>
      <ArrivalHero imageUrl={heroImageUrl || featured[0]?.images[0]} />
      <Marquee items={MARQUEE_WORDS} />

      {featured.length > 0 && (
        <section className="shell py-16 md:py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Hand-picked</span>
              <h2 className="display-md mt-2">
                <span className="gold-italic">Pieces</span> that introduce themselves
              </h2>
            </div>
            <Link href="/shop/all" className="micro link-underline text-muted-foreground">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <PointOfView imageUrl={philosophyPiece?.images[0]} imageAlt={philosophyPiece?.name} />

      <CollectionSection collections={collections} />

      <section className="shell flex flex-col items-center gap-4 border-t border-border py-16 text-center md:py-20">
        <span className="eyebrow">Stay close</span>
        <h2 className="display-md max-w-md">First look at every new drop.</h2>
        <div className="mt-2">
          <NewsletterForm source="homepage" />
        </div>
      </section>
    </>
  );
}
