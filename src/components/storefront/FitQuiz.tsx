"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

  return (
    <>
      <header className="shell pb-5 pt-16 text-center md:pb-8 md:pt-20">
        <span className="eyebrow">Two minutes, no measuring tape</span>
        <h1 className="display-lg mt-2">Find your <span className="gold-italic">fit</span></h1>
        <p className="mx-auto mt-4 max-w-sm text-[15px] font-light leading-relaxed text-muted-foreground">
          A few quick details, and we&apos;ll suggest your size across the collection — no body scan, nothing intrusive.
        </p>
      </header>

      <section className="shell max-w-md pb-20 md:pb-28">
        {result ? (
          <div className="py-5 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-primary font-display text-2xl italic text-primary">{result.size}</div>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">{result.note}</p>
            <p className="mt-3.5 text-xs text-muted-foreground">We&apos;ll use this to pre-select your size across the site, and to give our stylist better context when you ask for recommendations.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={() => router.push("/shop/all")} className="btn-solid-gold">Shop the collection</button>
              <button onClick={() => setResult(null)} className="btn-outline-ink">Retake quiz</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4.5">
            <div className="grid grid-cols-2 gap-3.5">
              <label>
                <span className="eyebrow-muted">Height (cm)</span>
                <input className="mt-1.5 w-full border border-border bg-card px-3.5 py-3 text-sm outline-none focus:border-primary" type="number" min={130} max={210} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} required />
              </label>
              <label>
                <span className="eyebrow-muted">Weight (kg)</span>
                <input className="mt-1.5 w-full border border-border bg-card px-3.5 py-3 text-sm outline-none focus:border-primary" type="number" min={35} max={160} value={weightKg} onChange={(e) => setWeightKg(e.target.value)} required />
              </label>
            </div>
            <label>
              <span className="eyebrow-muted">Your usual size (any brand)</span>
              <select className="mt-1.5 w-full border border-border bg-card px-3.5 py-3 text-sm outline-none focus:border-primary" value={usualSize} onChange={(e) => setUsualSize(e.target.value as FitAnswers["usualSize"])}>
                {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label>
              <span className="eyebrow-muted">How do you like things to fit?</span>
              <select className="mt-1.5 w-full border border-border bg-card px-3.5 py-3 text-sm outline-none focus:border-primary" value={fitPreference} onChange={(e) => setFitPreference(e.target.value as FitAnswers["fitPreference"])}>
                <option value="fitted">Fitted / structured</option>
                <option value="true-to-size">True to size</option>
                <option value="loose">Loose / relaxed</option>
              </select>
            </label>
            <button type="submit" className="btn-solid-gold w-full">Get my size</button>
          </form>
        )}
      </section>
    </>
  );
}
