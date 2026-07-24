"use client";
import { useState, useEffect } from "react";
import { T, SERIF, SANS } from "./theme";
import { usePrefersReducedMotion, useTilt } from "./hooks";

// Photo / generated-plate. Takes real image URLs (from ProductImage.url) with a
// color-plate fallback (from Product.colorHex) — the same auto-advancing deck
// behaviour as the original, just fed by the DB instead of a hardcoded IMG map.
export function Photo({ images = [], color = T.stone, name = "", ratio = "3/4", style, eyebrow, fit = "cover", reveal = false }:
  { images?: string[]; color?: string; name?: string; ratio?: string; style?: React.CSSProperties; eyebrow?: string; fit?: string; reveal?: boolean }) {
  const rm = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [bad, setBad] = useState<Record<number, boolean>>({});
  useEffect(() => { setI(0); }, [images]);
  useEffect(() => {
    if (rm || images.length < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % images.length), 3400);
    return () => clearInterval(id);
  }, [rm, images.length]);
  const okCount = images.filter((_, idx) => !bad[idx]).length;
  const plate: React.CSSProperties = {
    position: "relative", width: "100%", aspectRatio: ratio, overflow: "hidden",
    background: `radial-gradient(120% 90% at 28% 18%, ${color}40 0%, transparent 55%),
                 linear-gradient(155deg, ${color}26 0%, ${T.darkCard} 120%)`,
    ...style,
  };
  return (
    <div className={reveal ? "reveal-img" : undefined} style={plate} data-in="true">
      {images.map((src, idx) => bad[idx] ? null : (
        <img key={idx} src={src} alt={idx === 0 ? name : ""} loading="lazy"
          onError={() => setBad((b) => ({ ...b, [idx]: true }))}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: fit as any, objectPosition: "center",
            opacity: idx === i ? 1 : 0, transition: rm ? "none" : "opacity 0.85s ease" }} />
      ))}
      {images.length > 1 && (
        <div style={{ position: "absolute", bottom: 9, left: 0, right: 0, zIndex: 4, display: "flex", gap: 5, justifyContent: "center" }}>
          {images.map((_, idx) => (
            <button key={idx} aria-label={`View image ${idx + 1}`} onClick={(e) => { e.stopPropagation(); setI(idx); }}
              style={{ width: 6, height: 6, borderRadius: "50%", padding: 0, cursor: "pointer", border: "none",
                background: idx === i ? T.linenLt : "rgba(255,255,255,0.45)", boxShadow: "0 0 3px rgba(0,0,0,0.45)", transition: "background 0.3s" }} />
          ))}
        </div>
      )}
      {okCount === 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 20 }}>
          <span aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: `radial-gradient(${color} 0.6px, transparent 0.6px)`, backgroundSize: "5px 5px" }} />
          <span style={{ fontFamily: SANS, fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 300 }}>{eyebrow || "A&I"}</span>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 22, lineHeight: 1.1, color: "rgba(255,255,255,0.92)", marginTop: 4 }}>{name}</span>
        </div>
      )}
    </div>
  );
}

export function FlipCard({ rm, front, back, accent = T.gold }: { rm: boolean; front: React.ReactNode; back: React.ReactNode; accent?: string }) {
  const [flipped, setFlipped] = useState(false);
  const face: React.CSSProperties = { position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: 14, overflow: "hidden", background: T.darkCard, border: `1px solid ${T.darkBorder}` };
  return (
    <div style={{ perspective: "1100px", width: "100%", height: "100%" }}>
      <div role="button" tabIndex={0} aria-pressed={flipped}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setFlipped((f) => !f))}
        style={{ position: "relative", width: "100%", height: "100%", cursor: "pointer", transformStyle: "preserve-3d",
          transition: rm ? "none" : "transform 0.7s cubic-bezier(0.4,0.2,0.2,1)", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", willChange: "transform" }}>
        <div style={face}>{front}</div>
        <div style={{ ...face, border: `1px solid ${accent}40`, transform: "rotateY(180deg)" }}>{back}</div>
      </div>
    </div>
  );
}

export function TiltCard({ rm, children, strength = 9, style }: { rm: boolean; children: React.ReactNode; strength?: number; style?: React.CSSProperties }) {
  const { ref, style: ts, glare, onMove, onLeave } = useTilt(rm, strength);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ position: "relative", ...ts, ...style }}>
      {children}
      <div style={glare} />
    </div>
  );
}

export const Eyebrow = ({ children, light }: { children: React.ReactNode; light?: boolean }) => (
  <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 4, textTransform: "uppercase", fontWeight: 300, color: light ? "rgba(196,184,168,0.6)" : T.stone }}>{children}</span>
);
export const Title = ({ children, light, size = "clamp(30px,4.4vw,58px)", style, as = "h2" }: { children: React.ReactNode; light?: boolean; size?: string; style?: React.CSSProperties; as?: "h1" | "h2" }) => {
  const Tag = as;
  return (
    <Tag style={{ fontFamily: SERIF, fontWeight: 300, fontSize: size, lineHeight: 1.05, letterSpacing: "-0.01em", color: light ? T.linenLt : T.ink, margin: 0, ...style }}>{children}</Tag>
  );
};
export function Btn({ children, onClick, variant = "dark", full, sm }: { children: React.ReactNode; onClick?: () => void; variant?: "dark" | "light" | "ghost" | "gold"; full?: boolean; sm?: boolean }) {
  const base: React.CSSProperties = {
    fontFamily: SANS, fontSize: sm ? 8 : 9, letterSpacing: 3, textTransform: "uppercase",
    fontWeight: 400, padding: sm ? "11px 24px" : "14px 34px", cursor: "pointer",
    width: full ? "100%" : "auto", transition: "all 0.3s ease", border: "1px solid",
  };
  const v = {
    dark: { background: T.ink, color: T.linenLt, borderColor: T.ink },
    light: { background: T.linenLt, color: T.dark, borderColor: T.linenLt },
    ghost: { background: "transparent", color: T.ink, borderColor: T.border },
    gold: { background: "transparent", color: T.gold, borderColor: T.gold },
  }[variant];
  return <button onClick={onClick} className="btn" style={{ ...base, ...v, ["--sweep" as any]: T.gold, ["--sweeptext" as any]: T.ink }}><span>{children}</span></button>;
}

export function Countdown({ target }: { target: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  let diff = Math.max(0, target - now);
  const d = Math.floor(diff / 864e5); diff -= d * 864e5;
  const h = Math.floor(diff / 36e5); diff -= h * 36e5;
  const m = Math.floor(diff / 6e4); diff -= m * 6e4;
  const s = Math.floor(diff / 1e3);
  const p = (n: number) => String(n).padStart(2, "0");
  return <span>Next drop in {d}d {p(h)}h {p(m)}m {p(s)}s</span>;
}
