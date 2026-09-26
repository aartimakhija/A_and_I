"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OCCASIONS, VIBES } from "@/lib/stylist-static";
import { useStore } from "./StoreContext";

type Pick = { id: string; slug: string; name: string; category: string; colorHex: string; story: string | null };

export function StylistWidget() {
  const router = useRouter();
  const { stylistOpen, setStylistOpen } = useStore();
  const [occasion, setOccasion] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState<{ blurb: string; picks: Pick[] } | { error: string } | null>(null);

  async function go(occasionId: string, vibeId: string) {
    setOccasion(occasionId); setVibe(vibeId);
    setAsking(true);
    try {
      const res = await fetch("/api/stylist", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion: occasionId, vibe: vibeId }),
      });
      const data = await res.json();
      setResult(res.ok ? data : { error: data?.error || "Something went wrong — try again in a moment." });
    } finally {
      setAsking(false);
    }
  }

  function reset() { setOccasion(null); setVibe(null); setResult(null); }

  const chip = (active: boolean) =>
    `border px-3.5 py-2.5 text-left text-sm ${active ? "border-foreground bg-secondary text-foreground" : "border-border bg-card text-muted-foreground hover:border-foreground"}`;

  return (
    <>
      <button
        onClick={() => setStylistOpen(!stylistOpen)}
        aria-label="Style finder"
        className="fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-foreground font-display text-xl italic text-primary shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
      >
        {stylistOpen ? "×" : "✦"}
      </button>

      {stylistOpen && (
        <div className="fixed bottom-[92px] right-6 z-[70] flex max-h-[72vh] w-[min(360px,88vw)] flex-col overflow-hidden border border-border bg-background shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="bg-foreground px-4.5 py-4 text-background">
            <div className="font-display text-lg italic">Style finder</div>
            <div className="mt-0.5 text-xs opacity-70">Pick an occasion and a vibe — we&apos;ll pull from the collection.</div>
          </div>

          <div className="flex-1 overflow-y-auto p-4.5">
            {!occasion && (
              <>
                <div className="eyebrow-muted mb-2">Occasion</div>
                <div className="flex flex-col gap-1.5">
                  {OCCASIONS.map((o) => (
                    <button key={o.id} onClick={() => setOccasion(o.id)} className={chip(false)}>{o.label}</button>
                  ))}
                </div>
              </>
            )}

            {occasion && !vibe && (
              <>
                <button onClick={reset} className="mb-3 text-xs text-muted-foreground">← back</button>
                <div className="eyebrow-muted mb-2">Vibe</div>
                <div className="flex flex-col gap-1.5">
                  {VIBES.map((v) => (
                    <button key={v.id} onClick={() => go(occasion, v.id)} className={chip(false)}>{v.label}</button>
                  ))}
                </div>
              </>
            )}

            {asking && <p className="text-sm text-muted-foreground">One moment…</p>}

            {result && !asking && "error" in result && (
              <div>
                <button onClick={reset} className="mb-3 text-xs text-muted-foreground">← start over</button>
                <p className="text-[13.5px] font-light leading-relaxed text-foreground">{result.error}</p>
              </div>
            )}

            {result && !asking && "picks" in result && (
              <div>
                <button onClick={reset} className="mb-3 text-xs text-muted-foreground">← start over</button>
                <p className="text-[13.5px] font-light leading-relaxed text-foreground">{result.blurb}</p>
                <div className="mt-3.5 flex flex-col gap-2">
                  {result.picks.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setStylistOpen(false); router.push(`/products/${p.slug}`); }}
                      className="flex items-center gap-2.5 bg-card px-2.5 py-2 text-left"
                    >
                      <span className="h-8.5 w-7 shrink-0" style={{ background: `linear-gradient(155deg, ${p.colorHex}55, ${p.colorHex}22)` }} />
                      <span className="font-display text-sm italic">{p.name}</span>
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
