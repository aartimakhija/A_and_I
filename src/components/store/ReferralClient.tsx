"use client";
import { useState } from "react";

export function ReferralClient({ code, link, rewards }: {
  code: string; link: string; rewards: { code: string; percentOff: number; used: boolean; active: boolean }[];
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ background: "#fff", border: "1px solid #eee", padding: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#999" }}>Your code</div>
        <div style={{ fontFamily: "monospace", fontSize: 22, margin: "6px 0 14px" }}>{code}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input readOnly value={link} onClick={(e) => (e.target as HTMLInputElement).select()}
            style={{ flex: 1, padding: "10px 12px", border: "1px solid #ddd", fontSize: 13 }} />
          <button onClick={copy} style={{ padding: "10px 18px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}>
            {copied ? "Copied ✓" : "Copy link"}
          </button>
        </div>
      </div>

      <h2 style={{ fontSize: 15, marginTop: 32 }}>Rewards earned</h2>
      {rewards.length === 0 ? (
        <p style={{ color: "#999", fontSize: 13 }}>None yet — share your link above. Once a friend's first order comes through, a 10% code shows up here.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          {rewards.map((r) => (
            <div key={r.code} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "#fff", border: "1px solid #eee" }}>
              <span style={{ fontFamily: "monospace", fontSize: 14 }}>{r.code}</span>
              <span style={{ fontSize: 12, color: r.used ? "#999" : "#1a7a3c" }}>{r.used ? "Used" : `${r.percentOff}% off — ready to use`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
