import Link from "next/link";
import Image from "next/image";

export type CollectionCard = { slug: string; name: string; imageUrl?: string | null };

/** Category/collection grid, linking into the existing /shop/[category] route
 * (URLs unchanged from the pre-redesign site, per the migration plan). */
export function CollectionSection({ collections }: { collections: CollectionCard[] }) {
  if (collections.length === 0) return null;
  return (
    <section className="shell py-16 md:py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Shop by</span>
          <h2 className="display-md mt-2">
            <span className="gold-italic">Collections</span>
          </h2>
        </div>
        <Link href="/shop/all" className="micro link-underline text-muted-foreground">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {collections.map((c) => (
          <Link key={c.slug} href={`/shop/${c.slug}`} className="card-zoom group relative block aspect-3/4 bg-secondary">
            {c.imageUrl && (
              <Image src={c.imageUrl} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
            <span className="absolute bottom-4 left-4 font-display text-lg italic text-white">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
