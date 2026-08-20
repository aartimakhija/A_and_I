"use client";
import { useState } from "react";
import { T, SANS } from "./theme";

export function AccordionTabStrip({ tabs }: { tabs: { label: string; content: string }[] }) {
  const available = tabs.filter((t) => t.content && t.content.trim().length > 0);
  const [active, setActive] = useState(0);
  if (available.length === 0) return null;

  return (
    <div style={{ marginTop: 28, maxWidth: 460 }}>
      <div style={{ display: "flex", gap: 20, borderBottom: `1px solid ${T.border}` }}>
        {available.map((t, i) => (
          <button key={t.label} onClick={() => setActive(i)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0 10px", fontFamily: SANS,
              fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: active === i ? T.ink : T.stone,
              borderBottom: active === i ? `2px solid ${T.ink}` : "2px solid transparent", marginBottom: -1 }}>
            {t.label}
          </button>
        ))}
      </div>
      <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14, lineHeight: 1.8, color: T.mid, marginTop: 16, whiteSpace: "pre-wrap" }}>
        {available[active]?.content}
      </p>
    </div>
  );
}
