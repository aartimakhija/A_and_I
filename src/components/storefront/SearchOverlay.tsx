"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF, CAT_LABEL, peso } from "./theme";
import { Photo, Eyebrow } from "./primitives";
import { useStore } from "./StoreContext";

export function SearchOverlay() {
  const router = useRouter();
  const { catalogue, searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return catalogue.filter((d) => d.name.toLowerCase().includes(s) || CAT_LABEL[d.category]?.toLowerCase().includes(s)).slice(0, 8);
  }, [q, catalogue]);
  const popular = ["Linen", "Emerald", "Lilac", "Olive", "Bralette"];

  const go = (slug: string) => { setSearchOpen(false); router.push(`/products/${slug}`); };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, pointerEvents: searchOpen ? "auto" : "none" }}>
      <div onClick={() => setSearchOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.4)", opacity: searchOpen ? 1 : 0, transition: "opacity .3s" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: T.bg, padding: "26px clamp(20px,5vw,60px) 36px",
        transform: searchOpen ? "translateY(0)" : "translateY(-100%)", transition: "transform .4s cubic-bezier(.3,.8,.3,1)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, borderBottom: `1px solid ${T.ink}`, paddingBottom: 12 }}>
            <input autoFocus={searchOpen} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pieces…"
              style={{ flex: 1, border: "none", background: "none", outline: "none", fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(22px,4vw,38px)", color: T.ink }} />
            <button onClick={() => setSearchOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: SANS, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.stone }}>Close</button>
          </div>
          {!q && (
            <div style={{ marginTop: 22 }}>
              <Eyebrow>Popular searches</Eyebrow>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                {popular.map((p) => (
                  <button key={p} onClick={() => setQ(p)} style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 1, color: T.ink, background: "transparent", border: `1px solid ${T.border}`, padding: "9px 16px", cursor: "pointer" }}>{p}</button>
                ))}
              </div>
            </div>
          )}
          {q && (
            <div style={{ marginTop: 22 }}>
              <Eyebrow>{results.length} result{results.length !== 1 ? "s" : ""}</Eyebrow>
              <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 14 }}>
                {results.map((d) => (
                  <button key={d.id} onClick={() => go(d.slug)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
                    <Photo images={d.images} color={d.color} name={d.name} ratio="3/4" />
                    <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 16, color: T.ink, marginTop: 8 }}>{d.name}</div>
                    <div style={{ fontFamily: SANS, fontSize: 11, color: T.stone, marginTop: 3 }}>{peso(d.price)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
