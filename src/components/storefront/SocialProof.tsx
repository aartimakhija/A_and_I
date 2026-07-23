"use client";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF } from "./theme";
import { Photo, Eyebrow, Title } from "./primitives";
import type { SFProduct } from "@/lib/storefront-adapter";

export function SocialProof({ products }: { products: SFProduct[] }) {
  const router = useRouter();
  const quotes: [string, string][] = [
    ["The fit is unreal — I've never had compliments like this.", "Aditi · Mumbai"],
    ["Indian craft that never feels like costume. Finally.", "Rhea · London"],
    ["Wore it once and three people asked where it's from.", "Sana · Dubai"],
  ];
  const ugc = products.slice(0, 6);

  return (
    <>
      <section style={{ background: T.card, padding: "clamp(56px,8vw,104px) clamp(20px,4vw,52px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
          <Eyebrow>Kindred spirits</Eyebrow>
          <Title size="clamp(24px,3.4vw,40px)" style={{ marginTop: 12 }}>Worn, and <i style={{ color: T.gold }}>loved.</i></Title>
          <div className="grid-3 reveal" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 30, marginTop: 44, textAlign: "left" }}>
            {quotes.map(([q, who]) => (
              <div key={who}>
                <div style={{ fontFamily: SERIF, fontSize: 13, color: T.gold, letterSpacing: 2, marginBottom: 12 }}>★★★★★</div>
                <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 21, lineHeight: 1.4, color: T.ink }}>"{q}"</p>
                <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.stone, marginTop: 14 }}>{who}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {ugc.length > 0 && (
        <section className="reveal" style={{ padding: "0 0 clamp(20px,4vw,40px)" }}>
          <div style={{ textAlign: "center", padding: "clamp(28px,4vw,40px) 24px" }}>
            <Eyebrow>As worn by you</Eyebrow>
            <Title size="clamp(22px,3vw,34px)" style={{ marginTop: 10 }}>@aandi <i style={{ color: T.gold }}>· tag us to be featured</i></Title>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 4 }}>
            {ugc.map((d) => (
              <button key={d.id} onClick={() => router.push(`/products/${d.slug}`)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, position: "relative", overflow: "hidden" }}>
                <Photo images={d.images} color={d.color} ratio="1/1" fit="cover" />
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
