import Link from "next/link";
import Image from "next/image";
import type { SFProduct } from "@/lib/storefront-adapter";
import { formatPrice } from "@/lib/format";

/** Product card in the new design's visual language, wired to real catalogue data. */
export function ProductCard({ product }: { product: SFProduct }) {
  const secondImage = product.images[1];
  return (
    <article className="group relative [perspective:1200px]">
      {/* Subtle tilt-on-hover, restored from the earlier design — pure CSS,
          no JS mouse-tracking, so it can't jank or fight scroll performance. */}
      <Link href={`/products/${product.slug}`} prefetch={false} className="relative block aspect-3/4 overflow-hidden bg-secondary transition-transform duration-500 ease-out will-change-transform group-hover:[transform:rotateX(2deg)_rotateY(-4deg)_scale(1.02)] active:scale-[0.98]">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={`${product.name}${product.colorName ? ` in ${product.colorName}` : ""}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-opacity duration-700 group-hover:opacity-0"
          />
        )}
        {secondImage && (
          <Image
            src={secondImage}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="absolute inset-0 object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        {(product.preOrder || product.limitedEdition) && (
          <span className="micro pointer-events-none absolute left-0 top-0 bg-background/85 px-3 py-2 text-muted-foreground">
            {product.preOrder ? "Pre-order" : "Limited edition"}
          </span>
        )}
      </Link>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-sm">
          <Link href={`/products/${product.slug}`} prefetch={false} className="link-underline">
            {product.name}
            {product.colorName && <span className="text-muted-foreground"> | {product.colorName}</span>}
          </Link>
        </h3>
        <span className="micro whitespace-nowrap text-muted-foreground">
          {product.mrp && <span className="mr-1.5 line-through">{formatPrice(product.mrp)}</span>}
          {formatPrice(product.price)}
        </span>
      </div>
      {product.silhouette && <p className="mt-1 text-xs text-muted-foreground">{product.silhouette}</p>}
    </article>
  );
}
