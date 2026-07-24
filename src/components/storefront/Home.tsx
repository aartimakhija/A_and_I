"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF, peso } from "./theme";
import { Photo, Eyebrow, Title, Btn, TiltCard, FlipCard } from "./primitives";
import { layer } from "./hooks";
import { Hero3D } from "./Hero3D";
import { ProductCard } from "./ProductCard";
import { SocialProof } from "./SocialProof";
import { useStore } from "./StoreContext";
import type { SFProduct } from "@/lib/storefront-adapter";

const CRAFT_NAMES = ["Bandhani", "Sharara", "Zari"];

export function Home({ featured, craft, philosophyPiece, allProducts }: {
  featured: SFProduct[]; craft: SFProduct[]; philosophyPiece: SFProduct | null; allProducts: SFProduct[];
}) {
  const router = useRouter();
  const { rm } = useStore();
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const marquee = ["Indian craft", "Global silhouette", "Hand-finished", "Made to be seen", "SS'26 — The Drop"];

  return (
    <>
      {/* HERO */}
      <section style={{ position: "relative", minHeight: "min(88vh,760px)", background: T.dark,
        display: "grid", gridTemplateColumns: "1.35fr 1fr", overflow: "hidden" }} className="hero">
        <div style={{ position: "relative", padding: "clamp(40px,7vw,96px)", display: "flex",
          flexDirection: "column", justifyContent: "center", zIndex: 2 }}>
          <div style={layer(3, rm)}><Eyebrow light>SS'26 — The Drop</Eyebrow></div>
          <h1 style={{ ...layer(2, rm), fontFamily: SERIF, fontWeight: 300, color: T.linenLt,
            fontSize: "clamp(46px,7vw,104px)", lineHeight: 0.98, letterSpacing: "-0.02em", margin: "18px 0 0" }}>
            Style,<br /><span style={{ fontStyle: "italic", color: T.gold }}>with us.</span>
          </h1>
          <p style={{ ...layer(2.5, rm), fontFamily: SANS, fontWeight: 300, color: "rgba(196,184,168,0.7)",
            fontSize: 15, lineHeight: 1.7, maxWidth: 380, marginTop: 24 }}>
            Womenswear where Indian craft meets a global silhouette. Each piece made to command a room — softly.
          </p>
          <div style={{ ...layer(2.5, rm), display: "flex", gap: 14, marginTop: 34, flexWrap: "wrap" }}>
            <Btn variant="light" onClick={() => router.push("/shop/all")}>Explore the Drop</Btn>
            <Btn variant="gold" onClick={() => router.push("/lookbook")}>View the Lookbook</Btn>
          </div>
        </div>
        <div className="hero-plates" style={{ position: "relative", minHeight: 0 }}>
          <Hero3D rm={rm} heroImage={featured[0]?.images[0]} caption={featured[0] ? `${featured[0].name} · SS'26` : undefined} />
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: T.dark, borderTop: `1px solid ${T.darkBorder}`, overflow: "hidden", padding: "14px 0", whiteSpace: "nowrap" }}>
        <div className={rm ? "" : "marquee"} style={{ display: "inline-flex" }}>
          {[...marquee, ...marquee, ...marquee].map((m, i) => (
            <span key={i} style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 5, textTransform: "uppercase", color: T.stone, fontWeight: 300, padding: "0 38px" }}>
              {m}<span style={{ color: T.gold, marginLeft: 36 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section style={{ padding: "clamp(64px,9vw,120px) clamp(20px,4vw,48px)", maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
            <div><Eyebrow>Hand-picked</Eyebrow><Title size="clamp(28px,4vw,46px)"><span style={{ fontStyle: "italic" }}>Pieces</span> that introduce themselves</Title></div>
            <button onClick={() => router.push("/shop/all")} style={{ background: "none", border: "none", cursor: "pointer",
              fontFamily: SANS, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: T.stone, borderBottom: `1px solid ${T.stone}`, paddingBottom: 3 }}>View all</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }} className="grid-4">
            {featured.map((d) => (
              <TiltCard rm={rm} key={d.id}>
                <ProductCard product={d} />
              </TiltCard>
            ))}
          </div>
        </section>
      )}

      {/* PHILOSOPHY */}
      {philosophyPiece && (
        <section style={{ background: T.card }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "stretch" }} className="grid-2">
            <Photo images={philosophyPiece.images} color={philosophyPiece.color} name={philosophyPiece.name} ratio="auto" fit="contain"
              style={{ minHeight: 460, aspectRatio: "auto" }} eyebrow="In Jaipur" />
            <div className="" style={{ padding: "clamp(40px,6vw,84px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Eyebrow>The Philosophy</Eyebrow>
              <Title size="clamp(28px,4vw,48px)">Indian craft,<br /><span style={{ fontStyle: "italic", color: T.gold }}>global silhouette.</span></Title>
              <p style={{ fontFamily: SANS, fontWeight: 300, color: T.mid, fontSize: 15, lineHeight: 1.8, maxWidth: 440, marginTop: 22 }}>
                Bandhani tied by hand. Mirror-work set one disc at a time. Zari woven the slow way. We take techniques that built India's wardrobe and cut them into shapes that belong anywhere in the world.
              </p>
              <p style={{ fontFamily: SANS, fontWeight: 300, color: T.mid, fontSize: 15, lineHeight: 1.8, maxWidth: 440, marginTop: 14 }}>
                Nothing here is mass. Every piece is a small run, finished by people we know by name.
              </p>
              <div style={{ marginTop: 30 }}><Btn variant="ghost" onClick={() => router.push("/about")}>Read our story</Btn></div>
            </div>
          </div>
        </section>
      )}

      {/* THE CRAFT — flip cards */}
      {craft.length > 0 && (
        <section style={{ background: T.dark, padding: "clamp(64px,9vw,120px) clamp(20px,4vw,48px)" }}>
          <div style={{ maxWidth: 1320, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Eyebrow light>Tap to reveal</Eyebrow>
              <Title light size="clamp(28px,4vw,48px)">The craft <span style={{ fontStyle: "italic", color: T.gold }}>behind the cut</span></Title>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }} className="grid-3">
              {craft.map((d, i) => {
                const craftName = CRAFT_NAMES[i % CRAFT_NAMES.length];
                return (
                  <div key={d.id} style={{ height: 420 }}>
                    <FlipCard rm={rm} accent={T.gold}
                      front={
                        <div style={{ position: "relative", width: "100%", height: "100%" }}>
                          <Photo images={d.images} color={d.color} name={d.name} ratio="auto" style={{ height: "100%", aspectRatio: "auto" }} eyebrow={craftName} fit="contain" />
                          <span style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
                            fontFamily: SANS, fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>Tap to reveal</span>
                        </div>
                      }
                      back={
                        <div style={{ height: "100%", padding: "34px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <Eyebrow light>{craftName}</Eyebrow>
                          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 26, color: T.linenLt, margin: "8px 0 14px" }}>{d.name}</div>
                          <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13.5, lineHeight: 1.7, color: "rgba(196,184,168,0.78)" }}>{d.story}</p>
                          <div style={{ marginTop: 22 }}><Btn variant="gold" sm onClick={() => router.push(`/products/${d.slug}`)}>Shop the piece</Btn></div>
                        </div>
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <SocialProof products={allProducts} />

      {/* WAITLIST */}
      <section style={{ background: T.linen, padding: "clamp(56px,8vw,100px) 24px", textAlign: "center" }}>
        <Eyebrow>The next drop</Eyebrow>
        <Title size="clamp(26px,4vw,42px)">Be first <span style={{ fontStyle: "italic", color: T.gold }}>through the door</span></Title>
        <p style={{ fontFamily: SANS, fontWeight: 300, color: T.mid, fontSize: 14, lineHeight: 1.7, maxWidth: 420, margin: "16px auto 0" }}>
          Small runs sell through fast. Join the list for early access and nothing else.
        </p>
        <div style={{ display: "flex", maxWidth: 440, margin: "30px auto 0", justifyContent: "center" }} className="wl-row">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" type="email"
            style={{ flex: 1, padding: "14px 18px", background: T.card, border: `1px solid ${T.border}`, borderRight: "none", fontFamily: SANS, fontSize: 12, letterSpacing: 1, color: T.ink, outline: "none" }} />
          <button onClick={() => email && setJoined(true)} style={{ padding: "14px 26px", background: T.ink, color: T.linenLt, border: `1px solid ${T.ink}`, cursor: "pointer",
            fontFamily: SANS, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", whiteSpace: "nowrap" }}>
            {joined ? "You're in ✦" : "Claim access"}
          </button>
        </div>
      </section>
    </>
  );
}
