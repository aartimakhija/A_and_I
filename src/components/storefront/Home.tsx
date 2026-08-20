"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF, peso } from "./theme";
import { Photo, Eyebrow, Title, Btn, TiltCard, FlipCard } from "./primitives";
import { layer } from "./hooks";
import { ProductCard } from "./ProductCard";
import { SocialProof } from "./SocialProof";
import { useStore } from "./StoreContext";
import type { SFProduct } from "@/lib/storefront-adapter";

const CRAFT_NAMES = ["Bandhani", "Sharara", "Zari"];

export function Home({ featured, craft, philosophyPiece, allProducts, heroImageUrl }: {
  featured: SFProduct[]; craft: SFProduct[]; philosophyPiece: SFProduct | null; allProducts: SFProduct[]; heroImageUrl?: string | null;
}) {
  const router = useRouter();
  const { rm } = useStore();
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const marquee = ["Indian craft", "Global silhouette", "Hand-finished", "Made to be seen", "SS'26 — The Drop"];

  return (
    <>
      {/* HERO — CampaignHero pattern: full-bleed image, overlaid mixed roman/italic
          headline, underline text-CTAs, floating "shop the look" chip.
          Uses a dedicated hero banner image (Admin → Settings) when set —
          product photos are shot as vertical 3:4 crops for cards, and
          stretching one across a wide letterbox band crops it unpredictably
          (often mid-torso, cutting off the face). Falls back to a featured
          product image with a top-biased crop as a safety net. */}
      <section style={{ position: "relative", minHeight: "min(82vh,680px)", background: T.dark, overflow: "hidden" }} className="hero">
        {(heroImageUrl || featured[0]?.images[0]) && (
          <img src={heroImageUrl || featured[0].images[0]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: heroImageUrl ? "center center" : "center 15%" }} />
        )}
        {/* Deliberate scrim (not just photo darkness) for reliable text contrast */}
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(100deg, rgba(13,12,11,0.75) 0%, rgba(13,12,11,0.4) 42%, rgba(13,12,11,0.15) 65%, rgba(13,12,11,0.45) 100%)" }} />

        <div style={{ position: "relative", zIndex: 2, minHeight: "min(82vh,680px)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(32px,6vw,80px)" }}>
          <div style={layer(3, rm)}><Eyebrow light>SS'26 — The Drop</Eyebrow></div>
          <h1 style={{ ...layer(2, rm), fontFamily: SERIF, fontWeight: 300, color: T.linenLt,
            fontSize: "clamp(42px,7vw,96px)", lineHeight: 0.98, letterSpacing: "-0.02em", margin: "16px 0 0" }}>
            Indian craft,<br /><span style={{ fontStyle: "italic", color: T.gold }}>reimagined.</span>
          </h1>
          <p style={{ ...layer(2.5, rm), fontFamily: SANS, fontWeight: 300, color: "rgba(240,235,227,0.8)",
            fontSize: 15, lineHeight: 1.7, maxWidth: 380, marginTop: 20 }}>
            Womenswear where Indian craft meets a global silhouette. Each piece made to command a room — softly.
          </p>
          <div style={{ ...layer(2.5, rm), display: "flex", gap: 32, marginTop: 30, flexWrap: "wrap" }}>
            <button onClick={() => router.push("/shop/all")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
              fontFamily: SANS, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: T.linenLt,
              borderBottom: "1px solid rgba(240,235,227,0.6)", paddingBottom: 4 }}>
              Discover SS'26
            </button>
            <button onClick={() => router.push("/about")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
              fontFamily: SANS, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: T.linenLt,
              borderBottom: "1px solid rgba(240,235,227,0.6)", paddingBottom: 4 }}>
              Our World
            </button>
          </div>
        </div>

        {/* Floating "shop the look" chip */}
        {featured[1] && (
          <button onClick={() => router.push(`/products/${featured[1].slug}`)}
            style={{ position: "absolute", zIndex: 3, right: "clamp(20px,5vw,64px)", bottom: "clamp(20px,5vw,64px)",
              display: "flex", alignItems: "center", gap: 10, background: "rgba(251,248,245,0.94)", border: "none",
              borderRadius: 3, padding: "8px 14px 8px 8px", cursor: "pointer", boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>
            <span style={{ width: 40, height: 50, overflow: "hidden", flexShrink: 0, position: "relative" }}>
              {featured[1].images[0] && <img src={featured[1].images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </span>
            <span style={{ textAlign: "left" }}>
              <span style={{ display: "block", fontFamily: SANS, fontSize: 8, letterSpacing: 1, textTransform: "uppercase", color: T.stone }}>Shop the look</span>
              <span style={{ display: "block", fontFamily: SERIF, fontStyle: "italic", fontSize: 13, color: T.ink }}>{featured[1].name}</span>
            </span>
            <span style={{ fontFamily: SANS, fontSize: 16, color: T.gold, marginLeft: 4 }}>+</span>
          </button>
        )}
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

      {/* CAMPAIGN BANNER — oversized overlapping display numeral, matching the
          spec's --xxxl-text-font-size (~250px) token used for "SS26"/"404" */}
      {featured[0] && (
        <section onClick={() => router.push("/shop/all")} style={{ position: "relative", height: "min(70vh,560px)", overflow: "hidden", cursor: "pointer" }}>
          {featured[0].images[0] && <img src={featured[0].images[0]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(13,12,11,0.55) 0%, rgba(13,12,11,0.05) 60%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", padding: "0 clamp(16px,4vw,40px)" }}>
            <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, color: "rgba(240,235,227,0.92)",
              fontSize: "clamp(120px,22vw,280px)", lineHeight: 0.75, letterSpacing: "-0.03em", marginBottom: "clamp(-10px,-1vw,10px)" }}>
              SS'26
            </span>
          </div>
          <div style={{ position: "absolute", top: "clamp(24px,4vw,48px)", left: "clamp(16px,4vw,40px)" }}>
            <Eyebrow light>Discover the</Eyebrow>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(22px,3vw,34px)", color: T.linenLt, marginTop: 6 }}>Within the Garden</div>
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

      {/* EDITORIAL PAIRING — two images side by side, caption below (Kindred's
          "Pastel Stripes" pattern: a texture/detail shot beside a full look) */}
      {featured[2] && featured[3] && (
        <section style={{ padding: "0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="grid-2">
            <div style={{ aspectRatio: "3/4", overflow: "hidden" }}>
              {featured[2].images[0] && <img src={featured[2].images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
            </div>
            <div style={{ aspectRatio: "3/4", overflow: "hidden", background: T.darkCard }}>
              {featured[3].images[0] && <img src={featured[3].images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "clamp(28px,4vw,44px) 24px", background: T.card }}>
            <Title size="clamp(20px,2.6vw,30px)">{featured[2].colorName || featured[2].name} <span style={{ fontStyle: "italic", color: T.gold }}>& {featured[3].colorName || featured[3].name}</span></Title>
            <div style={{ marginTop: 16 }}>
              <button onClick={() => router.push("/shop/all")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
                fontFamily: SANS, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: T.stone, borderBottom: `1px solid ${T.stone}`, paddingBottom: 3 }}>
                Discover the edit
              </button>
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
