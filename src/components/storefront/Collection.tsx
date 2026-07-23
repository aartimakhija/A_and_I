"use client";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF, peso, CAT_LABEL } from "./theme";
import { Photo, Eyebrow, Title, TiltCard } from "./primitives";
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
  const { rm, saved, toggleSaved } = useStore();

  return (
    <>
      <header style={{ textAlign: "center", padding: "clamp(48px,7vw,90px) 24px clamp(28px,4vw,48px)" }}>
        <Eyebrow>SS'26 — {products.length} pieces</Eyebrow>
        <Title>The <span style={{ fontStyle: "italic", color: T.gold }}>Collection</span></Title>
      </header>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", padding: "0 24px 40px" }}>
        {FILTERS.map((f) => (
          <button key={f.id} onClick={() => router.push(`/shop/${f.id}`)}
            style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer",
              color: category === f.id ? T.ink : T.stone, background: category === f.id ? T.linen : "transparent",
              border: `1px solid ${category === f.id ? T.ink : T.border}`, padding: "9px 18px", transition: "all 0.25s" }}>
            {f.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px,4vw,48px) clamp(64px,9vw,110px)" }} className="grid-4 reveal">
        {products.map((d) => (
          <TiltCard rm={rm} key={d.id}>
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}` }}>
              <button onClick={(e) => { e.stopPropagation(); toggleSaved(d.id); }} aria-label="Save to wishlist"
                style={{ position: "absolute", top: 10, right: 10, zIndex: 2, background: "rgba(248,246,243,0.85)",
                  border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 15,
                  color: saved.includes(d.id) ? T.gold : T.stone, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {saved.includes(d.id) ? "♥" : "♡"}
              </button>
              <div onClick={() => router.push(`/products/${d.slug}`)} style={{ cursor: "pointer" }}>
                <Photo images={d.images} color={d.color} name={d.name} />
                <div style={{ background: T.card, padding: "14px 16px" }}>
                  <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 18, color: T.ink }}>{d.name}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 1, color: T.stone, marginTop: 4 }}>{peso(d.price)}</div>
                </div>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
      {products.length === 0 && (
        <p style={{ textAlign: "center", color: T.stone, fontFamily: SANS, padding: "0 24px 80px" }}>No pieces in this category yet.</p>
      )}
    </>
  );
}
