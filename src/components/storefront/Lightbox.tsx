"use client";
import { useEffect } from "react";
import { T, SANS } from "./theme";

export function Lightbox({ imgs, index, setIndex, onClose, name }: {
  imgs: string[]; index: number; setIndex: (fn: (i: number) => number) => void; onClose: () => void; name: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % imgs.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + imgs.length) % imgs.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imgs.length, onClose, setIndex]);
  if (!imgs.length) return null;
  const arrow: React.CSSProperties = { position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 2,
    background: "rgba(248,246,243,0.12)", color: T.linenLt, border: "none", cursor: "pointer",
    width: 46, height: 46, fontSize: 26, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 98, background: "rgba(8,8,7,0.95)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 18, right: 22, zIndex: 3, background: "none", border: "none", cursor: "pointer", color: T.linenLt, fontSize: 30, lineHeight: 1 }}>×</button>
      {imgs.length > 1 && <button aria-label="Previous" style={{ ...arrow, left: 14 }} onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + imgs.length) % imgs.length); }}>‹</button>}
      <img src={imgs[index]} alt={name} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "88vh", objectFit: "contain", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }} />
      {imgs.length > 1 && <button aria-label="Next" style={{ ...arrow, right: 14 }} onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % imgs.length); }}>›</button>}
      {imgs.length > 1 && (
        <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", fontFamily: SANS, fontSize: 11, letterSpacing: 2, color: "rgba(240,235,227,0.7)" }}>
          {index + 1} / {imgs.length}
        </div>
      )}
    </div>
  );
}
