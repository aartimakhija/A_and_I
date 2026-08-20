"use client";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF } from "./theme";
import { Eyebrow, Title, Btn, TiltCard } from "./primitives";
import { ProductCard } from "./ProductCard";
import { useStore } from "./StoreContext";
import type { SFProduct } from "@/lib/storefront-adapter";

export function Bespoke({ pieces }: { pieces: SFProduct[] }) {
  const router = useRouter();
  const { rm } = useStore();

  return (
    <>
      {/* Editorial hero — flat background, not full-bleed photo, distinct from Home/Journal patterns */}
      <section style={{ background: T.dark, padding: "clamp(64px,9vw,120px) 24px", textAlign: "center" }}>
        <Eyebrow light>Made to measure</Eyebrow>
        <Title light size="clamp(34px,5.5vw,64px)" style={{ marginTop: 10 }}>
          Your piece,<br /><span style={{ fontStyle: "italic", color: T.gold }}>your measurements.</span>
        </Title>
        <p style={{ fontFamily: SANS, fontWeight: 300, color: "rgba(240,235,227,0.75)", fontSize: 15, lineHeight: 1.8, maxWidth: 480, margin: "22px auto 0" }}>
          Every A&I piece already offers a choice of fabric tier. For a true bespoke commission — your exact measurements,
          a fabric or finish not in the current collection — our ateliers in Jaipur and Kutch take it further.
        </p>
      </section>

      {/* Category quick-links style row (Kindred pattern: horizontal list, not full cards) */}
      {pieces.length > 0 && (
        <section style={{ padding: "clamp(48px,7vw,90px) clamp(20px,4vw,48px)" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <Eyebrow>Start from a piece you love</Eyebrow>
              <Title size="clamp(24px,3.6vw,40px)" style={{ marginTop: 10 }}>Any craft piece can be <span style={{ fontStyle: "italic", color: T.gold }}>made bespoke.</span></Title>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }} className="grid-4">
              {pieces.slice(0, 4).map((p) => (
                <TiltCard rm={rm} key={p.id}>
                  <ProductCard product={p} />
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bespoke service block — pricing transparency + inquiry-based CTA, not a configurator */}
      <section style={{ background: T.card, padding: "clamp(56px,8vw,100px) 24px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
          <Eyebrow>The bespoke process</Eyebrow>
          <Title size="clamp(26px,3.8vw,42px)" style={{ marginTop: 10 }}>Transparent from the <span style={{ fontStyle: "italic", color: T.gold }}>first email.</span></Title>
          <p style={{ fontFamily: SANS, fontWeight: 300, color: T.mid, fontSize: 15, lineHeight: 1.85, marginTop: 20 }}>
            Bespoke commissions start at our Hand-embroidered couture tier pricing, with a minimum lead time of 6–8 weeks
            depending on the piece and atelier. We'll confirm exact pricing and timeline once we understand what you have in mind —
            no obligation, no configurator, just a conversation with the studio.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}>
            <Btn onClick={() => router.push("/contact?topic=bespoke")}>Enquire about a bespoke piece</Btn>
            <Btn variant="ghost" onClick={() => router.push("/about")}>Read our FAQ</Btn>
          </div>
        </div>
      </section>

      <div style={{ textAlign: "center", padding: "clamp(32px,5vw,56px) 24px" }}>
        <button onClick={() => router.push("/shop/all")} style={{ background: "none", border: "none", cursor: "pointer",
          fontFamily: SANS, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: T.stone, borderBottom: `1px solid ${T.border}`, paddingBottom: 3 }}>
          Full Collection →
        </button>
      </div>
    </>
  );
}
