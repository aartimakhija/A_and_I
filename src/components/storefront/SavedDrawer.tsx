"use client";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF, peso } from "./theme";
import { Photo } from "./primitives";
import { useStore } from "./StoreContext";

export function SavedDrawer() {
  const router = useRouter();
  const { catalogue, saved, toggleSaved, savedOpen, setSavedOpen, addToCart } = useStore();
  const items = catalogue.filter((d) => saved.includes(d.id));

  const goProduct = (slug: string) => { setSavedOpen(false); router.push(`/products/${slug}`); };

  return (
    <>
      <div onClick={() => setSavedOpen(false)} aria-hidden style={{ position: "fixed", inset: 0, zIndex: 92,
        background: "rgba(10,10,10,0.45)", opacity: savedOpen ? 1 : 0, pointerEvents: savedOpen ? "auto" : "none", transition: "opacity .35s" }} />
      <aside style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(440px,92vw)", zIndex: 93,
        background: T.bg, transform: savedOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform .45s cubic-bezier(.4,.1,.2,1)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 26px", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.ink }}>Saved ({items.length})</span>
          <button onClick={() => setSavedOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, color: T.stone, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "6px 26px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", fontFamily: SANS, color: T.stone, fontSize: 14 }}>
              Nothing saved yet.<br />
              <button onClick={() => { setSavedOpen(false); router.push("/shop/all"); }} style={{ marginTop: 16, background: "none", border: "none", cursor: "pointer",
                fontFamily: SANS, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: T.ink, borderBottom: `1px solid ${T.ink}` }}>Browse the collection</button>
            </div>
          ) : items.map((d) => (
            <div key={d.id} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: `1px solid ${T.borderSoft}` }}>
              <button onClick={() => goProduct(d.slug)} style={{ width: 70, flexShrink: 0, padding: 0, border: "none", background: "none", cursor: "pointer" }}>
                <Photo images={d.images} color={d.color} ratio="3/4" />
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 18, color: T.ink }}>{d.name}</div>
                <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 0.5, color: T.stone, margin: "4px 0 8px" }}>{peso(d.price)}</div>
                <div style={{ display: "flex", gap: 14 }}>
                  <button onClick={() => addToCart(d, d.variants.find((v) => v.stock > 0)?.size ?? "M")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
                    fontFamily: SANS, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: T.ink, borderBottom: `1px solid ${T.ink}` }}>Add to bag</button>
                  <button onClick={() => toggleSaved(d.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
                    fontFamily: SANS, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: T.stone, borderBottom: `1px solid ${T.border}` }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
