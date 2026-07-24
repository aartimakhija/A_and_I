"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF, peso } from "./theme";
import { OCCASIONS, VIBES } from "@/lib/stylist-static";
import { useStore } from "./StoreContext";

type Pick = { id: string; slug: string; name: string; category: string; colorHex: string; story: string | null };

export function StylistWidget() {
  const router = useRouter();
  const { stylistOpen, setStylistOpen } = useStore();
  const [occasion, setOccasion] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState<{ blurb: string; picks: Pick[] } | null>(null);

  async function go(occasionId: string, vibeId: string) {
    setOccasion(occasionId); setVibe(vibeId);
    setAsking(true);
    try {
      const res = await fetch("/api/stylist", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion: occasionId, vibe: vibeId }),
      });
      setResult(await res.json());
    } finally {
      setAsking(false);
    }
  }

  function reset() { setOccasion(null); setVibe(null); setResult(null); }

  const chip = (active: boolean): React.CSSProperties => ({
    padding: "9px 14px", fontFamily: SANS, fontSize: 12, cursor: "pointer",
    border: `1px solid ${active ? T.ink : T.border}`, background: active ? T.linen : T.card,
    color: active ? T.ink : T.stone, textAlign: "left",
  });

  return (
    <>
      <button onClick={() => setStylistOpen(!stylistOpen)} aria-label="Style finder"
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 70, width: 56, height: 56, borderRadius: "50%",
          background: T.ink, color: T.gold, border: "none", cursor: "pointer", fontFamily: SERIF, fontStyle: "italic", fontSize: 22,
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {stylistOpen ? "×" : "✦"}
      </button>

      {stylistOpen && (
        <div style={{ position: "fixed", bottom: 92, right: 24, zIndex: 70, width: "min(360px,88vw)", maxHeight: "72vh",
          background: T.bg, border: `1px solid ${T.border}`, boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 18px", borderBottom: `1px solid ${T.border}`, background: T.ink }}>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 18, color: T.linenLt }}>Style finder</div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: "rgba(196,184,168,0.7)", marginTop: 2 }}>Pick an occasion and a vibe — we'll pull from the collection.</div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
            {!occasion && (
              <>
                <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: T.stone, marginBottom: 8 }}>Occasion</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {OCCASIONS.map((o) => (
                    <button key={o.id} onClick={() => setOccasion(o.id)} style={chip(false)}>{o.label}</button>
                  ))}
                </div>
              </>
            )}

            {occasion && !vibe && (
              <>
                <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: T.stone, marginBottom: 12 }}>← back</button>
                <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: T.stone, marginBottom: 8 }}>Vibe</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {VIBES.map((v) => (
                    <button key={v.id} onClick={() => go(occasion, v.id)} style={chip(false)}>{v.label}</button>
                  ))}
                </div>
              </>
            )}

            {asking && <p style={{ fontFamily: SANS, fontSize: 13, color: T.stone }}>One moment…</p>}

            {result && !asking && (
              <div>
                <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: T.stone, marginBottom: 12 }}>← start over</button>
                <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13.5, lineHeight: 1.6, color: T.ink }}>{result.blurb}</p>
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.picks.map((p) => (
                    <button key={p.id} onClick={() => { setStylistOpen(false); router.push(`/products/${p.slug}`); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left", padding: "8px 10px",
                        border: "none", background: T.card, cursor: "pointer" }}>
                      <span style={{ width: 28, height: 34, flexShrink: 0, background: `linear-gradient(155deg, ${p.colorHex}55, ${p.colorHex}22)` }} />
                      <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 14, color: T.ink }}>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
