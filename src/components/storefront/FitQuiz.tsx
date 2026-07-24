"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF } from "./theme";
import { Eyebrow, Title, Btn } from "./primitives";
import { recommendSize, SIZES, type FitAnswers } from "@/lib/fit";
import { useStore } from "./StoreContext";

export function FitQuiz() {
  const router = useRouter();
  const { setStyleProfile } = useStore();
  const [heightCm, setHeightCm] = useState("165");
  const [weightKg, setWeightKg] = useState("60");
  const [usualSize, setUsualSize] = useState<FitAnswers["usualSize"]>("M");
  const [fitPreference, setFitPreference] = useState<FitAnswers["fitPreference"]>("true-to-size");
  const [result, setResult] = useState<{ size: string; note: string } | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const answers: FitAnswers = { heightCm: parseFloat(heightCm), weightKg: parseFloat(weightKg), usualSize, fitPreference };
    const rec = recommendSize(answers);
    setResult(rec);
    setStyleProfile({ answers, recommendedSize: rec.size, note: rec.note });
    // Best-effort save for signed-in customers — silently ignored if not logged in.
    fetch("/api/fit-profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(answers) }).catch(() => {});
  }

  const field: React.CSSProperties = { width: "100%", padding: "12px 14px", marginTop: 6, fontFamily: SANS, fontSize: 14, color: T.ink, background: T.card, border: `1px solid ${T.border}`, outline: "none" };
  const label: React.CSSProperties = { fontFamily: SANS, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: T.stone };

  return (
    <>
      <header style={{ textAlign: "center", padding: "clamp(48px,7vw,90px) 24px clamp(20px,3vw,32px)" }}>
        <Eyebrow>Two minutes, no measuring tape</Eyebrow>
        <Title>Find your <span style={{ fontStyle: "italic", color: T.gold }}>fit</span></Title>
        <p style={{ fontFamily: SANS, fontWeight: 300, color: T.mid, fontSize: 15, lineHeight: 1.7, maxWidth: 440, margin: "16px auto 0" }}>
          A few quick details, and we'll suggest your size across the collection — no body scan, nothing intrusive.
        </p>
      </header>

      <section style={{ maxWidth: 480, margin: "0 auto", padding: "0 24px clamp(64px,9vw,110px)" }}>
        {result ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px", border: `1px solid ${T.gold}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 24, color: T.gold }}>{result.size}</div>
            <p style={{ fontFamily: SANS, fontSize: 14, color: T.mid, lineHeight: 1.7, maxWidth: 380, margin: "0 auto" }}>{result.note}</p>
            <p style={{ fontFamily: SANS, fontSize: 12, color: T.stone, marginTop: 14 }}>We'll use this to pre-select your size across the site, and to give our stylist better context when you ask for recommendations.</p>
            <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
              <Btn onClick={() => router.push("/shop/all")}>Shop the collection</Btn>
              <Btn variant="ghost" onClick={() => setResult(null)}>Retake quiz</Btn>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <label>
                <span style={label}>Height (cm)</span>
                <input style={field} type="number" min={130} max={210} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} required />
              </label>
              <label>
                <span style={label}>Weight (kg)</span>
                <input style={field} type="number" min={35} max={160} value={weightKg} onChange={(e) => setWeightKg(e.target.value)} required />
              </label>
            </div>
            <label>
              <span style={label}>Your usual size (any brand)</span>
              <select style={field} value={usualSize} onChange={(e) => setUsualSize(e.target.value as FitAnswers["usualSize"])}>
                {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label>
              <span style={label}>How do you like things to fit?</span>
              <select style={field} value={fitPreference} onChange={(e) => setFitPreference(e.target.value as FitAnswers["fitPreference"])}>
                <option value="fitted">Fitted / structured</option>
                <option value="true-to-size">True to size</option>
                <option value="loose">Loose / relaxed</option>
              </select>
            </label>
            <Btn full onClick={() => {}}>Get my size</Btn>
          </form>
        )}
      </section>
    </>
  );
}
