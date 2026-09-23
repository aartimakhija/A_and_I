import Link from "next/link";
import Image from "next/image";
import type { SFProduct } from "@/lib/storefront-adapter";

export type CollectionCard = { slug: string; name: string; imageUrl?: string | null; blurb?: string };

function formatINR(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function descriptor(p: SFProduct) {
  return [p.colorName, p.category].filter(Boolean).join(" · ");
}

function CuratedCard({ product, index }: { product: SFProduct; index: number }) {
  const second = product.images[1];
  return (
    <article className="reveal group" style={{ transitionDelay: `${(index % 6) * 80}ms` }}>
      <Link href={`/products/${product.slug}`} className="relative block aspect-3/4 overflow-hidden bg-secondary">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={`${product.name}${product.silhouette ? ` — ${product.silhouette}` : ""}, by A&I`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-opacity duration-700 group-hover:opacity-0"
          />
        )}
        {second && (
          <Image
            src={second}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="absolute inset-0 object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
      </Link>
      <h3 className="display-md mt-6 text-xl">{product.name}</h3>
      <p className="micro mt-2 text-muted-foreground">{descriptor(product)}</p>
      <p className="mt-3 text-sm text-muted-foreground">
        {product.mrp && <span className="mr-1.5 line-through">{formatINR(product.mrp)}</span>}
        {formatINR(product.price)}
      </p>
      <Link href={`/products/${product.slug}`} className="micro link-underline mt-4 inline-block text-foreground">
        Explore piece →
      </Link>
    </article>
  );
}

/**
 * "03 — The pieces / The Collection" — ported 1:1 from Lovable's
 * CollectionSection.tsx: a featured hero piece, six curated cards, and an
 * "Explore by world" tile grid. Fully data-driven (featured piece, curated
 * six and world tiles are all passed in), so this automatically shows
 * whatever is live in the catalogue rather than hard-coded slugs.
 */
export function CollectionSection({
  featuredProduct,
  curatedProducts,
  worldTiles,
  allHref = "/shop/all",
}: {
  featuredProduct?: SFProduct | null;
  curatedProducts: SFProduct[];
  worldTiles: CollectionCard[];
  allHref?: string;
}) {
  return (
    <section className="grain relative border-b border-border">
      <div className="shell py-20 lg:py-28">
        <div className="reveal max-w-2xl">
          <p className="micro text-primary">03 — The pieces</p>
          <h2 className="display-lg mt-6">
            The <span className="gold-italic">Collection</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">Pieces shaped by our current point of view.</p>
        </div>

        {featuredProduct && (
          <div className="mt-14 grid items-center gap-12 lg:mt-20 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="reveal">
              <Link
                href={`/products/${featuredProduct.slug}`}
                className="group relative block aspect-4/5 overflow-hidden bg-secondary"
              >
                {featuredProduct.images[0] && (
                  <Image
                    src={featuredProduct.images[0]}
                    alt={`${featuredProduct.name} — ${featuredProduct.silhouette ?? "A&I"}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-opacity duration-700 group-hover:opacity-0"
                  />
                )}
                {featuredProduct.images[1] && (
                  <Image
                    src={featuredProduct.images[1]}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="absolute inset-0 object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                )}
              </Link>
            </div>
            <div className="reveal" style={{ transitionDelay: "80ms" }}>
              <p className="micro text-muted-foreground">The featured piece</p>
              <h3 className="display-lg mt-5 text-4xl">{featuredProduct.name}</h3>
              <p className="micro mt-4 text-muted-foreground">{descriptor(featuredProduct)}</p>
              {featuredProduct.story && (
                <p className="mt-6 max-w-md text-muted-foreground">{featuredProduct.story.slice(0, 220)}</p>
              )}
              <p className="display-md mt-7 text-2xl">
                {featuredProduct.mrp && (
                  <span className="mr-2 text-lg text-muted-foreground line-through">{formatINR(featuredProduct.mrp)}</span>
                )}
                {formatINR(featuredProduct.price)}
              </p>
              <Link
                href={`/products/${featuredProduct.slug}`}
                className="micro link-underline mt-7 inline-block text-foreground"
              >
                Explore piece →
              </Link>
            </div>
          </div>
        )}

        {curatedProducts.length > 0 && (
          <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {curatedProducts.map((p, i) => (
              <CuratedCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}

        {worldTiles.length > 0 && (
          <>
            <div className="reveal mt-24 max-w-xl">
              <h3 className="display-lg text-3xl">
                Explore by <span className="gold-italic">world.</span>
              </h3>
              <p className="mt-4 text-muted-foreground">Every world of A&amp;I — each with its own reason to exist.</p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {worldTiles.map((w, i) => (
                <Link
                  key={w.slug}
                  href={`/shop/${w.slug}`}
                  className="reveal group block"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="relative aspect-3/4 overflow-hidden bg-secondary">
                    {w.imageUrl && (
                      <Image
                        src={w.imageUrl}
                        alt={`${w.name} — pieces from the A&I catalogue`}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                      />
                    )}
                    <span className="absolute inset-x-0 bottom-0 bg-background/85 px-4 py-3">
                      <span className="micro block text-foreground">{w.name}</span>
                    </span>
                  </div>
                  {w.blurb && <p className="mt-4 text-sm text-muted-foreground">{w.blurb}</p>}
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="reveal mt-20 text-center" style={{ transitionDelay: "80ms" }}>
          <Link href={allHref} className="btn-solid-gold">
            Explore the full collection →
          </Link>
        </div>
      </div>
    </section>
  );
}
