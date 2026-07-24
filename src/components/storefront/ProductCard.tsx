"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF, SIZES, peso } from "./theme";
import { useStore } from "./StoreContext";
import type { SFProduct } from "@/lib/storefront-adapter";

export function ProductCard({ product }: { product: SFProduct }) {
  const router = useRouter();
  const { addToCart, saved, toggleSaved } = useStore();
  const [imgIndex, setImgIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [added, setAdded] = useState(false);
  const images = product.images;
  const inStockSizes = new Set(product.variants.filter((v) => v.stock > 0).map((v) => v.size));
  const soldOut = inStockSizes.size === 0;
  const isSaved = saved.includes(product.id);

  function pick(size: string) {
    addToCart(product, size);
    setAdded(true);
    setExpanded(false);
    setTimeout(() => setAdded(false), 1800);
  }

  const arrowBtn: React.CSSProperties = {
    position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 2,
    width: 28, height: 28, borderRadius: "50%", border: "none", cursor: "pointer",
    background: "rgba(255,255,255,0.85)", color: T.ink, fontSize: 15, lineHeight: 1,
    display: "flex", alignItems: "center", justifyContent: "center",
  };

  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}`, background: T.card }}>
      <button onClick={(e) => { e.stopPropagation(); toggleSaved(product.id); }} aria-label="Save to wishlist"
        style={{ position: "absolute", top: 10, right: 10, zIndex: 3, background: "rgba(248,246,243,0.85)",
          border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 15,
          color: isSaved ? T.gold : T.stone, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isSaved ? "♥" : "♡"}
      </button>

      <span style={{ position: "absolute", top: 10, left: 10, zIndex: 3, background: soldOut ? "rgba(28,26,24,0.85)" : "rgba(240,235,227,0.92)",
        color: soldOut ? T.linenLt : T.ink, fontFamily: SANS, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase",
        padding: "5px 10px", borderRadius: 3 }}>
        {soldOut ? "Sold out" : "Ready to ship"}
      </span>

      <div style={{ position: "relative", cursor: "pointer" }} onClick={() => router.push(`/products/${product.slug}`)}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", overflow: "hidden",
          background: `radial-gradient(120% 90% at 28% 18%, ${product.color}40 0%, transparent 55%), linear-gradient(155deg, ${product.color}26 0%, ${T.darkCard} 120%)` }}>
          {images.length > 0 && (
            <img src={images[imgIndex]} alt={product.name} loading="lazy"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          )}
          {images.length === 0 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", padding: 16 }}>
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 20, color: "rgba(255,255,255,0.92)" }}>{product.name}</span>
            </div>
          )}
        </div>
        {images.length > 1 && (
          <>
            <button aria-label="Previous image" style={{ ...arrowBtn, left: 8 }}
              onClick={(e) => { e.stopPropagation(); setImgIndex((i) => (i - 1 + images.length) % images.length); }}>‹</button>
            <button aria-label="Next image" style={{ ...arrowBtn, right: 8 }}
              onClick={(e) => { e.stopPropagation(); setImgIndex((i) => (i + 1) % images.length); }}>›</button>
            <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, zIndex: 2, display: "flex", gap: 4, justifyContent: "center" }}>
              {images.map((_, i) => (
                <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i === imgIndex ? "#fff" : "rgba(255,255,255,0.4)" }} />
              ))}
            </div>
          </>
        )}
      </div>

      <div onClick={() => router.push(`/products/${product.slug}`)} style={{ cursor: "pointer", padding: "12px 14px 4px" }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 18, color: T.ink }}>{product.name}</div>
        <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 1, color: T.stone, marginTop: 4 }}>{peso(product.price)}</div>
      </div>

      <div style={{ padding: 12 }}>
        {!expanded ? (
          <button
            disabled={soldOut}
            onClick={(e) => { e.stopPropagation(); if (!soldOut) setExpanded(true); }}
            style={{ width: "100%", padding: "11px 14px", fontFamily: SANS, fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
              cursor: soldOut ? "default" : "pointer", border: "none",
              background: added ? T.gold : soldOut ? T.border : T.ink,
              color: added ? T.ink : soldOut ? T.stone : T.linenLt, transition: "background 0.2s" }}>
            {added ? "Added ✓" : soldOut ? "Sold out" : "Add to bag +"}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }} onClick={(e) => e.stopPropagation()}>
            {SIZES.map((s) => {
              const avail = inStockSizes.has(s);
              return (
                <button key={s} disabled={!avail} onClick={() => pick(s)}
                  style={{ flex: "1 1 auto", minWidth: 38, padding: "9px 0", fontFamily: SANS, fontSize: 11,
                    border: `1px solid ${avail ? T.ink : T.border}`, background: "transparent",
                    color: avail ? T.ink : T.border, cursor: avail ? "pointer" : "not-allowed",
                    textDecoration: avail ? "none" : "line-through" }}>
                  {s}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
