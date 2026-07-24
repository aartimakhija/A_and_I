"use client";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF } from "./theme";
import { Photo, Eyebrow, Title, Btn } from "./primitives";
import type { SFProduct } from "@/lib/storefront-adapter";

const PILLARS = [
  { n: "01", h: "Curation, not volume", b: "We don't chase every trend into existence. Every piece earns its place in the collection before it's ever made — fewer choices, each one considered." },
  { n: "02", h: "Craft, not costume", b: "Bandhani tied by hand. Mirror-work set one disc at a time. Zari woven the slow way. Real techniques, cut into shapes built for right now — not heritage as decoration." },
  { n: "03", h: "Trust, not trend", b: "Every garment carries its own story — who made it, where the fabric came from. Scan the passport and see it for yourself. Signal over noise." },
];

const PROCESS = [
  { n: "01", h: "Selected", b: "Our curation board reviews every design against one question: does this earn its place? Most don't make the cut." },
  { n: "02", h: "Made in small runs", b: "Produced in limited counts with named ateliers in Jaipur and Kutch — never a factory line, never a guess at demand." },
  { n: "03", h: "Fitted to you", b: "Choose your size and fabric tier — signature linen, premium handloom, or hand-embroidered couture — before it's finished." },
  { n: "04", h: "Delivered, and remembered", b: "Every piece ships with its own digital passport: the atelier, the material origin, the hands behind it." },
];

export function About({ originPiece, processPieces, pieceCount, faqs }: {
  originPiece: SFProduct | null; processPieces: SFProduct[]; pieceCount: number; faqs: { question: string; answer: string }[];
}) {
  const router = useRouter();

  return (
    <>
      {/* HERO */}
      <section style={{ background: T.dark, padding: "clamp(64px,10vw,140px) 24px", textAlign: "center" }}>
        <Eyebrow light>Est. for the woman who decides</Eyebrow>
        <Title as="h1" light size="clamp(34px,6vw,72px)">We don't follow<br /><span style={{ fontStyle: "italic", color: T.gold }}>the season.</span></Title>
        <p style={{ fontFamily: SANS, fontWeight: 300, color: "rgba(196,184,168,0.7)", fontSize: 15, lineHeight: 1.8, maxWidth: 520, margin: "26px auto 0" }}>
          A&I began with a simple frustration: clothes that were either beautifully Indian or quietly global, never both at once. So we made both — in the same piece.
        </p>
      </section>

      {/* ORIGIN STORY */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(56px,8vw,100px) clamp(20px,4vw,48px)",
        display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }} className="grid-2">
        {originPiece && <Photo images={originPiece.images} color={originPiece.color} name={originPiece.name} ratio="4/5" />}
        <div>
          <Eyebrow>How it started</Eyebrow>
          <Title size="clamp(26px,3.6vw,42px)" style={{ marginTop: 10 }}>Two women, one<br /><span style={{ fontStyle: "italic", color: T.gold }}>closet problem.</span></Title>
          <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.85, color: T.mid, marginTop: 20, maxWidth: 460 }}>
            A&I didn't start as a business plan. It started as two friends standing in front of a closet full of clothes and still feeling like there was nothing to wear — everything was either loud heritage or quiet minimalism, never a version of both that felt like <i>us</i>.
          </p>
          <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.85, color: T.mid, marginTop: 16, maxWidth: 460 }}>
            So we went looking for the ateliers who still do it the old way — hand-tied bandhani, mirror-work set disc by disc, zari woven on a slow loom — and asked them to help us cut it into something that belonged as easily in Jaipur as it did anywhere else in the world.
          </p>
          <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.85, color: T.mid, marginTop: 16, maxWidth: 460 }}>
            {pieceCount > 0 ? `${pieceCount} pieces later, ` : "One collection later, "}that's still the only rule we follow: if it doesn't feel like both halves of us, it doesn't get made.
          </p>
          <div style={{ marginTop: 28 }}><Btn variant="ghost" onClick={() => router.push("/lookbook")}>See it styled</Btn></div>
        </div>
      </section>

      {/* PILLARS */}
      <section style={{ background: T.linen, padding: "clamp(56px,8vw,100px) clamp(20px,4vw,48px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Eyebrow>What we won't compromise on</Eyebrow>
            <Title size="clamp(26px,3.6vw,42px)" style={{ marginTop: 10 }}>Three rules, <span style={{ fontStyle: "italic", color: T.gold }}>no exceptions.</span></Title>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }} className="grid-3">
            {PILLARS.map((p) => (
              <div key={p.n}>
                <div style={{ fontFamily: SERIF, fontSize: 40, color: T.gold, opacity: 0.5, lineHeight: 1 }}>{p.n}</div>
                <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 22, color: T.ink, margin: "10px 0 10px" }}>{p.h}</div>
                <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14, lineHeight: 1.75, color: T.mid }}>{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section style={{ padding: "clamp(56px,8vw,100px) clamp(20px,4vw,48px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Eyebrow>From atelier to you</Eyebrow>
            <Title size="clamp(26px,3.6vw,42px)" style={{ marginTop: 10 }}>How a piece <span style={{ fontStyle: "italic", color: T.gold }}>comes to life.</span></Title>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }} className="grid-4">
            {PROCESS.map((p, i) => (
              <div key={p.n} style={{ borderTop: `2px solid ${T.gold}`, paddingTop: 18, position: "relative" }}>
                <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 2, color: T.stone }}>{p.n}</div>
                <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 21, color: T.ink, margin: "8px 0 10px" }}>{p.h}</div>
                <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13.5, lineHeight: 1.7, color: T.mid }}>{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS GALLERY (real pieces, if available) */}
      {processPieces.length > 0 && (
        <section style={{ display: "grid", gridTemplateColumns: `repeat(${processPieces.length},1fr)`, gap: 4 }}>
          {processPieces.map((p) => (
            <div key={p.id} onClick={() => router.push(`/products/${p.slug}`)} style={{ cursor: "pointer" }}>
              <Photo images={p.images} color={p.color} name={p.name} ratio="4/5" eyebrow="Made by hand" />
            </div>
          ))}
        </section>
      )}

      {/* FAQ */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(48px,7vw,90px) clamp(20px,4vw,48px)" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Eyebrow>Questions we hear often</Eyebrow>
          <Title size="clamp(24px,3.4vw,38px)" style={{ marginTop: 10 }}>Frequently <span style={{ fontStyle: "italic", color: T.gold }}>asked.</span></Title>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {faqs.map((f) => (
            <div key={f.question}>
              <h3 style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 19, color: T.ink, margin: "0 0 8px" }}>{f.question}</h3>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14, lineHeight: 1.7, color: T.mid, margin: 0 }}>{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section style={{ background: T.dark, padding: "clamp(56px,8vw,100px) 24px", textAlign: "center" }}>
        <Eyebrow light>Made in India, worn anywhere</Eyebrow>
        <Title light size="clamp(28px,4vw,48px)" style={{ marginTop: 10 }}>Come see what<br /><span style={{ fontStyle: "italic", color: T.gold }}>we made this season.</span></Title>
        <div style={{ marginTop: 30 }}><Btn variant="light" onClick={() => router.push("/shop/all")}>Shop the collection</Btn></div>
      </section>
    </>
  );
}
