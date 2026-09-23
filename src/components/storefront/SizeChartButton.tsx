"use client";
import { useState } from "react";

// Mapped from standard extended alpha sizing (bust/waist/hips in inches).
// One shared chart across categories for now — see note in the PDP about
// per-category charts being a natural next step once fits genuinely differ.
const ROWS: { size: string; usSize: string; bust: string; waist: string; hips: string }[] = [
  { size: "XS", usSize: "0–2", bust: "31–32\"", waist: "24–25\"", hips: "33–35\"" },
  { size: "S", usSize: "4–6", bust: "33–35\"", waist: "26–27\"", hips: "36–37\"" },
  { size: "M", usSize: "8–10", bust: "36–37\"", waist: "28–29\"", hips: "38–39\"" },
  { size: "L", usSize: "12–14", bust: "38–40\"", waist: "30–32\"", hips: "41–42\"" },
  { size: "XL", usSize: "16–18", bust: "41–43\"", waist: "33–35\"", hips: "43–45\"" },
];

export function SizeChartButton({ category }: { category?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="text-xs text-muted-foreground underline">
        Size chart
      </button>
      {open && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center p-5" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/55" />
          <div onClick={(e) => e.stopPropagation()} className="relative max-h-[85vh] w-[min(560px,94vw)] overflow-y-auto bg-background p-7">
            <button onClick={() => setOpen(false)} className="absolute right-4 top-3.5 text-2xl text-muted-foreground">×</button>
            <div className="gold-italic font-display text-2xl">Size chart</div>
            <p className="mb-4 mt-1 text-xs text-muted-foreground">
              Measurements in inches. All A&amp;I pieces run true to size unless noted otherwise on the product page.
            </p>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Size", "US size", "Bust", "Waist", "Hips"].map((h) => (
                    <th key={h} className="eyebrow-muted border-b border-foreground py-2 px-2.5 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.size}>
                    <td className="border-b border-border py-2.5 px-2.5 font-display text-base text-foreground">{r.size}</td>
                    <td className="border-b border-border px-2.5 py-2.5 text-sm text-muted-foreground">{r.usSize}</td>
                    <td className="border-b border-border px-2.5 py-2.5 text-sm text-muted-foreground">{r.bust}</td>
                    <td className="border-b border-border px-2.5 py-2.5 text-sm text-muted-foreground">{r.waist}</td>
                    <td className="border-b border-border px-2.5 py-2.5 text-sm text-muted-foreground">{r.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-[11.5px] leading-relaxed text-muted-foreground">
              Between sizes, or not sure? <a href="/fit-quiz" className="text-primary">Take the two-minute Fit Quiz</a> for a personal recommendation.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
