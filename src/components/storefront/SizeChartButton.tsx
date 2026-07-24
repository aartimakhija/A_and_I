"use client";
import { useState } from "react";
import { T, SANS, SERIF } from "./theme";

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
      <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer",
        fontFamily: SANS, fontSize: 11, color: T.stone, textDecoration: "underline", padding: 0 }}>
        Size chart
      </button>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => setOpen(false)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.55)" }} />
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", background: T.bg, width: "min(560px,94vw)", maxHeight: "85vh", overflowY: "auto", padding: "clamp(24px,4vw,36px)" }}>
            <button onClick={() => setOpen(false)} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", cursor: "pointer", fontSize: 22, color: T.stone }}>×</button>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 24, color: T.ink, marginBottom: 4 }}>Size chart</div>
            <p style={{ fontFamily: SANS, fontSize: 12.5, color: T.stone, marginBottom: 18 }}>
              Measurements in inches. All A&I pieces run true to size unless noted otherwise on the product page.
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Size", "US size", "Bust", "Waist", "Hips"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", borderBottom: `1px solid ${T.ink}`, fontFamily: SANS, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: T.ink }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.size}>
                    <td style={{ padding: "9px 10px", borderBottom: `1px solid ${T.border}`, fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: T.ink }}>{r.size}</td>
                    <td style={{ padding: "9px 10px", borderBottom: `1px solid ${T.border}`, fontFamily: SANS, fontSize: 13, color: T.mid }}>{r.usSize}</td>
                    <td style={{ padding: "9px 10px", borderBottom: `1px solid ${T.border}`, fontFamily: SANS, fontSize: 13, color: T.mid }}>{r.bust}</td>
                    <td style={{ padding: "9px 10px", borderBottom: `1px solid ${T.border}`, fontFamily: SANS, fontSize: 13, color: T.mid }}>{r.waist}</td>
                    <td style={{ padding: "9px 10px", borderBottom: `1px solid ${T.border}`, fontFamily: SANS, fontSize: 13, color: T.mid }}>{r.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontFamily: SANS, fontSize: 11.5, color: T.stone, marginTop: 16, lineHeight: 1.6 }}>
              Between sizes, or not sure? <a href="/fit-quiz" style={{ color: T.gold }}>Take the two-minute Fit Quiz</a> for a personal recommendation.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
