"use client";
import { useRouter } from "next/navigation";
import { T, SANS, CAT_LABEL } from "./theme";
import { Eyebrow, Title, TiltCard } from "./primitives";
import { ProductCard } from "./ProductCard";
import { useStore } from "./StoreContext";
import type { SFProduct } from "@/lib/storefront-adapter";

const FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "View All" },
  { id: "ready", label: CAT_LABEL.ready },
  { id: "craft", label: CAT_LABEL.craft },
  { id: "linen", label: CAT_LABEL.linen },
];

export function Collection({ products, category }: { products: SFProduct[]; category: string }) {
  const router = useRouter();
  const { rm } = useStore();

  return (
    <>
      <header style={{ textAlign: "center", padding: "clamp(36px,5vw,64px) 24px clamp(20px,3vw,32px)" }}>
        <Eyebrow>SS'26 — {products.length} pieces</Eyebrow>
        <Title size="clamp(28px,4vw,48px)">The <span style={{ fontStyle: "italic", color: T.gold }}>Collection</span></Title>
      </header>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", padding: "0 24px 32px" }}>
        {FILTERS.map((f) => (
          <button key={f.id} onClick={() => router.push(`/shop/${f.id}`)}
            style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer",
              color: category === f.id ? T.ink : T.stone, background: category === f.id ? T.linen : "transparent",
              border: `1px solid ${category === f.id ? T.ink : T.border}`, padding: "9px 18px", transition: "all 0.25s" }}>
            {f.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px,4vw,48px) clamp(64px,9vw,110px)" }} className="grid-4">
        {products.map((d) => (
          <TiltCard rm={rm} key={d.id}>
            <ProductCard product={d} />
          </TiltCard>
        ))}
      </div>
      {products.length === 0 && (
        <p style={{ textAlign: "center", color: T.stone, fontFamily: SANS, padding: "0 24px 80px" }}>No pieces in this category yet.</p>
      )}
    </>
  );
}
