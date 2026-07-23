"use client";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF, peso } from "./theme";
import { Photo } from "./primitives";
import { useStore } from "./StoreContext";

export function CartDrawer() {
  const router = useRouter();
  const { cart, cartOpen, setCartOpen, removeFromCart, subtotal } = useStore();

  return (
    <>
      <div onClick={() => setCartOpen(false)} aria-hidden style={{ position: "fixed", inset: 0, zIndex: 60,
        background: "rgba(13,12,11,0.5)", opacity: cartOpen ? 1 : 0, pointerEvents: cartOpen ? "auto" : "none", transition: "opacity 0.35s" }} />
      <aside style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px,90vw)", zIndex: 61,
        background: T.bg, borderLeft: `1px solid ${T.border}`, transform: cartOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s cubic-bezier(0.4,0.1,0.2,1)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 26px", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: T.ink }}>Your bag ({cart.length})</span>
          <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, color: T.stone, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 26px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", fontFamily: SANS, fontWeight: 300, color: T.stone, fontSize: 14 }}>
              Your bag is empty.<br />
              <button onClick={() => { setCartOpen(false); router.push("/shop/all"); }} style={{ marginTop: 14, background: "none", border: "none", cursor: "pointer",
                fontFamily: SANS, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: T.ink, borderBottom: `1px solid ${T.ink}`, paddingBottom: 2 }}>Start shopping</button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.key} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ width: 64, flexShrink: 0 }}><Photo images={item.images} color={item.color} ratio="3/4" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 17, color: T.ink }}>{item.name}</div>
                  <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1, color: T.stone, margin: "3px 0" }}>
                    Size {item.size}{item.tier ? ` · ${item.tier}` : ""} · {peso(item.price)}
                  </div>
                  <button onClick={() => removeFromCart(item.key)} style={{ background: "none", border: "none", cursor: "pointer",
                    fontFamily: SANS, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: T.stone, padding: 0 }}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: "20px 26px", borderTop: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.stone }}>Subtotal</span>
              <span style={{ fontFamily: SERIF, fontSize: 22, color: T.ink }}>{peso(subtotal)}</span>
            </div>
            <button onClick={() => { setCartOpen(false); router.push("/checkout"); }}
              className="btn" style={{ width: "100%", fontFamily: SANS, fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
                padding: "14px 34px", cursor: "pointer", border: `1px solid ${T.ink}`, background: T.ink, color: T.linenLt }}>
              <span>Checkout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
