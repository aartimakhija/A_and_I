"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF, peso, CAT_LABEL, SIZES } from "./theme";
import { Photo, Eyebrow, Title, Btn, TiltCard } from "./primitives";
import { Lightbox } from "./Lightbox";
import { SizeChartButton } from "./SizeChartButton";
import { useStore } from "./StoreContext";
import type { SFProduct } from "@/lib/storefront-adapter";

export function Product({ product, related }: { product: SFProduct; related: SFProduct[] }) {
  const router = useRouter();
  const { rm, addToCart, saved, toggleSaved, styleProfile } = useStore();
  const recommended = styleProfile?.recommendedSize;
  const recommendedInStock = recommended && product.variants.find((v) => v.size === recommended && v.stock > 0);
  const [size, setSize] = useState(recommendedInStock ? recommended! : product.variants.find((v) => v.stock > 0)?.size ?? SIZES[2]);
  const [tier, setTier] = useState(product.tiers[0]?.label);
  const [lightbox, setLightbox] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [reserveEmail, setReserveEmail] = useState("");
  const [reservePhone, setReservePhone] = useState("");
  const [reserving, setReserving] = useState(false);
  const [reserved, setReserved] = useState<{ discountCode: string } | null>(null);
  const [reserveError, setReserveError] = useState("");

  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
  const soldOut = product.status === "SOLD_OUT" || totalStock === 0;
  const tierAdd = product.tiers.find((t) => t.label === tier)?.priceAdd ?? 0;
  const finalPrice = product.price + tierAdd;
  const isSaved = saved.includes(product.id);
  const sizeStock = (s: string) => product.variants.find((v) => v.size === s)?.stock ?? 0;

  async function requestNotify() {
    if (!notifyEmail) return;
    try {
      await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id, email: notifyEmail, size }) });
    } catch {}
    setNotified(true);
  }

  async function reserve() {
    if (!reserveEmail) { setReserveError("Enter your email"); return; }
    setReserving(true);
    setReserveError("");
    try {
      const res = await fetch("/api/preorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, size, email: reserveEmail, phone: reservePhone || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not reserve — try again");
      setReserved({ discountCode: json.discountCode });
    } catch (e: any) {
      setReserveError(e.message);
    } finally {
      setReserving(false);
    }
  }

  return (
    <>
      {lightbox && (
        <Lightbox imgs={product.images} index={lbIndex} setIndex={setLbIndex} onClose={() => setLightbox(false)} name={product.name} />
      )}
      <div style={{ padding: "20px clamp(20px,4vw,48px) 0" }}>
        <button onClick={() => router.push(`/shop/${product.category}`)} style={{ background: "none", border: "none", cursor: "pointer",
          fontFamily: SANS, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: T.stone }}>← Back to collection</button>
      </div>
      <section style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "clamp(24px,4vw,64px)",
        maxWidth: 1320, margin: "0 auto", padding: "24px clamp(20px,4vw,48px) clamp(56px,8vw,96px)", alignItems: "start" }} className="pdp">
        <div style={{ position: "sticky", top: 80, cursor: product.images.length ? "zoom-in" : "default" }} className="pdp-gallery"
          onClick={() => product.images.length && (setLbIndex(0), setLightbox(true))}>
          <Photo images={product.images} color={product.color} name={product.name} ratio="4/5" reveal />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Eyebrow>{CAT_LABEL[product.category] ?? product.category}</Eyebrow>
            <button onClick={() => toggleSaved(product.id)} aria-label="Save to wishlist" style={{ background: "none", border: "none",
              cursor: "pointer", fontSize: 20, color: isSaved ? T.gold : T.stone, lineHeight: 1 }}>{isSaved ? "♥" : "♡"}</button>
          </div>
          <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(32px,4.5vw,54px)", lineHeight: 1.05, color: T.ink, margin: "10px 0" }}>{product.name}</h1>
          <div style={{ fontFamily: SANS, fontSize: 16, letterSpacing: 1, color: T.mid, marginBottom: 8 }}>{peso(finalPrice)}</div>
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 1, color: product.preOrder ? T.gold : soldOut ? "#B0503E" : T.gold, marginBottom: 24 }}>
            {product.preOrder ? "Pre-order — made once enough of you reserve" : soldOut ? "Sold out — join the waitlist" : totalStock <= 5 ? `Only ${totalStock} left` : "In stock"}
          </div>
          {product.story && <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.8, color: T.mid, maxWidth: 460 }}>{product.story}</p>}

          {(!soldOut || product.preOrder) && (
            <>
              <div style={{ margin: "30px 0 8px", display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <Eyebrow>Size</Eyebrow>
                {recommended && (
                  <span style={{ fontFamily: SANS, fontSize: 11, color: T.gold }}>
                    · we'd suggest {recommended} <a href="/fit-quiz" style={{ color: T.stone, textDecoration: "underline" }}>(retake quiz)</a>
                  </span>
                )}
                <span style={{ marginLeft: "auto" }}><SizeChartButton category={product.category} /></span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {SIZES.map((s) => {
                  const stock = sizeStock(s);
                  return (
                    <button key={s} disabled={stock === 0 && !product.preOrder} onClick={() => setSize(s)}
                      style={{ width: 46, height: 46, cursor: stock === 0 ? "not-allowed" : "pointer", fontFamily: SANS, fontSize: 11, letterSpacing: 1,
                        color: stock === 0 ? T.border : size === s ? T.linenLt : T.ink, background: size === s ? T.ink : "transparent",
                        border: `1px solid ${size === s ? T.ink : T.border}`, transition: "all 0.2s", textDecoration: stock === 0 ? "line-through" : "none" }}>{s}</button>
                  );
                })}
              </div>
            </>
          )}

          {product.tiers.length > 0 && (!soldOut || product.preOrder) && (
            <>
              <div style={{ margin: "24px 0 8px" }}><Eyebrow>Fabric</Eyebrow></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {product.tiers.map((t) => (
                  <button key={t.label} onClick={() => setTier(t.label)} style={{ display: "flex", justifyContent: "space-between",
                    padding: "10px 14px", cursor: "pointer", textAlign: "left", fontFamily: SANS, fontSize: 12,
                    color: tier === t.label ? T.ink : T.stone, background: tier === t.label ? T.linen : "transparent",
                    border: `1px solid ${tier === t.label ? T.ink : T.border}` }}>
                    <span>{t.label}</span><span>{t.priceAdd > 0 ? `+${peso(t.priceAdd)}` : "Included"}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div style={{ marginTop: 32, maxWidth: 360 }}>
            {product.preOrder ? (
              reserved ? (
                <div>
                  <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 16, color: T.ink }}>You're reserved ✓</p>
                  <p style={{ fontFamily: SANS, fontSize: 12, color: T.stone, marginTop: 6 }}>
                    We'll email you the moment it's made. Use code <strong style={{ color: T.gold }}>{reserved.discountCode}</strong> for an early-access discount at checkout.
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 1, color: T.gold, marginBottom: 10 }}>Pre-order — not yet in production</div>
                  {reserveError && <div style={{ background: "#fdecea", color: "#B0503E", padding: 10, marginBottom: 10, fontSize: 12 }}>{reserveError}</div>}
                  <input value={reserveEmail} onChange={(e) => setReserveEmail(e.target.value)} placeholder="your@email.com" type="email"
                    style={{ width: "100%", padding: "12px 14px", background: T.card, border: `1px solid ${T.border}`, fontFamily: SANS, fontSize: 13, color: T.ink, outline: "none", marginBottom: 8 }} />
                  <input value={reservePhone} onChange={(e) => setReservePhone(e.target.value)} placeholder="Phone (optional)"
                    style={{ width: "100%", padding: "12px 14px", background: T.card, border: `1px solid ${T.border}`, fontFamily: SANS, fontSize: 13, color: T.ink, outline: "none", marginBottom: 10 }} />
                  <Btn full onClick={reserve}>{reserving ? "Reserving…" : `Reserve — Size ${size}`}</Btn>
                  <p style={{ fontFamily: SANS, fontSize: 11, color: T.stone, marginTop: 8 }}>No payment now. We only go into production once enough of you commit — you'll get an early-access discount for reserving.</p>
                </div>
              )
            ) : soldOut ? (
              notified ? (
                <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 16, color: T.ink }}>We'll email you when it's back ✓</p>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} placeholder="your@email.com" type="email"
                    style={{ flex: 1, padding: "12px 14px", background: T.card, border: `1px solid ${T.border}`, fontFamily: SANS, fontSize: 13, color: T.ink, outline: "none" }} />
                  <Btn onClick={requestNotify}>Notify me</Btn>
                </div>
              )
            ) : (
              <Btn full onClick={() => addToCart(product, size, tier)}>Add to bag — {peso(finalPrice)}</Btn>
            )}
          </div>

          <div style={{ marginTop: 34, borderTop: `1px solid ${T.border}`, paddingTop: 22 }}>
            {[["Fabric & care", "Small-batch, hand-finished. Dry clean only."],
              ["Fit", "True to size. Model wears M."],
              ["Shipping", "Dispatched in 3–5 days. Free over ₹5,000."]].map(([h, b]) => (
              <div key={h} style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: T.ink, marginBottom: 4 }}>{h}</div>
                <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13, color: T.stone, lineHeight: 1.6 }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ background: T.card, padding: "clamp(48px,7vw,90px) clamp(20px,4vw,48px)" }}>
          <div style={{ maxWidth: 1320, margin: "0 auto" }}>
            <div style={{ marginBottom: 32 }}><Eyebrow>Complete the look</Eyebrow><Title size="clamp(24px,3.4vw,38px)">You may also <span style={{ fontStyle: "italic" }}>like</span></Title></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }} className="grid-4">
              {related.map((r) => (
                <TiltCard rm={rm} key={r.id}>
                  <div onClick={() => router.push(`/products/${r.slug}`)} style={{ cursor: "pointer", borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}` }}>
                    <Photo images={r.images} color={r.color} name={r.name} />
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 17, color: T.ink }}>{r.name}</div>
                      <div style={{ fontFamily: SANS, fontSize: 11, color: T.stone, marginTop: 3 }}>{peso(r.price)}</div>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
