"use client";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF } from "./theme";
import { Photo, Eyebrow, Title, Btn } from "./primitives";
import type { SFProduct } from "@/lib/storefront-adapter";

export function About({ featurePiece }: { featurePiece: SFProduct | null }) {
  const router = useRouter();
  const rows: [string, string][] = [
    ["Hand-craft, not heritage cosplay", "We use real techniques — bandhani, mirror-work, zari — and cut them into shapes built for now."],
    ["Made in counts you can name", "Every piece is a limited run. When it's gone, it's gone. No restocks, no compromise."],
    ["Designed to be worn loudly", "Soft and certain in the same breath. Clothes that introduce you before you speak."],
  ];
  return (
    <>
      <section style={{ background: T.dark, padding: "clamp(64px,10vw,140px) 24px", textAlign: "center" }}>
        <Eyebrow light>Est. for the woman who decides</Eyebrow>
        <Title light size="clamp(34px,6vw,72px)">We don't follow<br /><span style={{ fontStyle: "italic", color: T.gold }}>the season.</span></Title>
        <p style={{ fontFamily: SANS, fontWeight: 300, color: "rgba(196,184,168,0.7)", fontSize: 15, lineHeight: 1.8, maxWidth: 520, margin: "26px auto 0" }}>
          A & I began with a simple frustration: clothes that were either beautifully Indian or quietly global, never both at once. So we made both — in the same piece.
        </p>
      </section>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(56px,8vw,100px) clamp(20px,4vw,48px)",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }} className="grid-2 reveal">
        {featurePiece && <Photo images={featurePiece.images} color={featurePiece.color} name={featurePiece.name} ratio="4/5" />}
        <div>
          <Eyebrow>How we make</Eyebrow>
          <Title size="clamp(26px,3.6vw,42px)">Small runs.<br /><span style={{ fontStyle: "italic", color: T.gold }}>Named hands.</span></Title>
          {rows.map(([h, b]) => (
            <div key={h} style={{ marginTop: 24 }}>
              <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 21, color: T.ink, marginBottom: 6 }}>{h}</div>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14, lineHeight: 1.7, color: T.mid, maxWidth: 420 }}>{b}</p>
            </div>
          ))}
          <div style={{ marginTop: 32 }}><Btn onClick={() => router.push("/shop/all")}>Shop the collection</Btn></div>
        </div>
      </section>
    </>
  );
}
