"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { SFProduct } from "@/lib/storefront-adapter";
import { formatPrice } from "@/lib/format";

// Max rotation in either axis, in degrees. Kept small and subtle on purpose —
// this is a hover polish detail, not a gimmick.
const MAX_TILT_DEG = 7;

/** Product card in the new design's visual language, wired to real catalogue data. */
export function ProductCard({ product }: { product: SFProduct }) {
  const secondImage = product.images[1];
  const linkRef = useRef<HTMLAnchorElement>(null);
  const rafId = useRef<number | null>(null);
  // Cached once per card instance rather than read on every pointer event.
  const canTilt = useRef<boolean | null>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLAnchorElement>) => {
    if (canTilt.current === null) {
      // Only real mouse-like pointers get the tilt — touch shouldn't fight scrolling,
      // and prefers-reduced-motion opts out entirely.
      canTilt.current =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    if (!canTilt.current) return;
    const el = linkRef.current;
    if (!el) return;

    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width; // 0 (left edge) .. 1 (right edge)
      const py = (clientY - rect.top) / rect.height; // 0 (top edge) .. 1 (bottom edge)
      // Tilt direction follows which side the pointer is on: entering from the
      // left tips the card toward the viewer on that side, entering from the
      // right tips it the other way — same idea on the vertical axis.
      const rotateY = (px - 0.5) * 2 * MAX_TILT_DEG;
      const rotateX = (0.5 - py) * 2 * MAX_TILT_DEG;
      el.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
      el.style.setProperty("--tilt-scale", "1.02");
    });
  }, []);

  const resetTilt = useCallback(() => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    const el = linkRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--tilt-scale", "1");
  }, []);

  return (
    <article className="group relative [perspective:1200px]">
      {/* Direction-aware tilt-on-hover: which side the pointer enters/moves on
          decides which way the card tips, tracked via pointermove and applied
          through CSS custom properties (imperative style writes, no re-render,
          rAF-throttled) so it can't jank or fight scroll performance. Touch and
          prefers-reduced-motion are excluded — see canTilt above. */}
      <Link
        ref={linkRef}
        href={`/products/${product.slug}`}
        prefetch={false}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        onPointerCancel={resetTilt}
        style={{ transform: "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) scale(var(--tilt-scale, 1))" }}
        className="relative block aspect-3/4 overflow-hidden bg-secondary transition-transform duration-300 ease-out will-change-transform active:scale-[0.98]"
      >
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
