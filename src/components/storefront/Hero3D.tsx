"use client";
import { T, SANS } from "./theme";

// Lightweight CSS-only hero visual — replaces an earlier WebGL/Three.js
// version. Same "a piece slowly turning under a spotlight" feeling, but as
// pure CSS transforms on a real product photo: no external library, no CDN
// script to fail to load, no per-frame JS work. Respects reduced-motion.
export function Hero3D({ rm, heroImage, caption }: { rm: boolean; heroImage?: string; caption?: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", perspective: "1400px",
      background: "radial-gradient(120% 90% at 55% 32%, #1a1714 0%, #0D0C0B 60%, #060504 100%)" }}>
      <style>{`
        @keyframes aandi-hero-turn {
          0%, 100% { transform: rotateY(-7deg) rotateX(2deg) translateY(0px); }
          50% { transform: rotateY(7deg) rotateX(-1deg) translateY(-10px); }
        }
        @keyframes aandi-hero-glow {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.85; }
        }
        .hero-turn { animation: aandi-hero-turn 9s ease-in-out infinite; }
        .hero-glow { animation: aandi-hero-glow 5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hero-turn, .hero-glow { animation: none !important; }
        }
      `}</style>

      {/* volumetric spotlight glow behind the garment */}
      <div className={rm ? "" : "hero-glow"} style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)",
        width: "60%", height: "55%", borderRadius: "50%", background: "radial-gradient(circle, rgba(196,169,106,0.16) 0%, transparent 70%)",
        pointerEvents: "none" }} />

      {/* floor light pool */}
      <div style={{ position: "absolute", bottom: "6%", left: "50%", transform: "translateX(-50%)",
        width: "44%", height: 24, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,169,106,0.25) 0%, transparent 75%)",
        filter: "blur(4px)", pointerEvents: "none" }} />

      {/* the garment itself, gently turning */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "8%" }}>
        <div className={rm ? "" : "hero-turn"} style={{ transformStyle: "preserve-3d", width: "78%", maxWidth: 420 }}>
          {heroImage ? (
            <img src={heroImage} alt="" style={{ width: "100%", height: "auto", display: "block",
              filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.5))", borderRadius: 4 }} />
          ) : (
            <div style={{ width: "100%", aspectRatio: "3/4", background: "linear-gradient(155deg, rgba(196,169,106,0.15), rgba(13,12,11,0.4))",
              borderRadius: 4, boxShadow: "0 30px 40px rgba(0,0,0,0.5)" }} />
          )}
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(72% 62% at 50% 42%, transparent 46%, rgba(6,5,4,0.5) 100%)" }} />
      {caption && (
        <span style={{ position: "absolute", bottom: 18, right: 20, fontFamily: SANS, fontSize: 8, letterSpacing: 3, textTransform: "uppercase",
          color: "rgba(196,169,106,0.75)", fontWeight: 300, pointerEvents: "none" }}>{caption}</span>
      )}
    </div>
  );
}
