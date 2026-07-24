"use client";
import { useState } from "react";

const REASONS = [
  ["SIZE_ISSUE", "Doesn't fit"],
  ["DAMAGED", "Arrived damaged"],
  ["NOT_AS_DESCRIBED", "Not as described"],
  ["CHANGED_MIND", "Changed my mind"],
  ["QUALITY_ISSUE", "Quality issue"],
  ["OTHER", "Other"],
] as const;

export default function RequestReturn({ orderItemId, email }: { orderItemId: string; email: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>(REASONS[0][0]);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (done) return <span style={{ fontSize: 12, color: "#666" }}>Return requested ✓</span>;

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>
      Request return
    </button>
  );

  return (
    <div style={{ marginTop: 8, padding: 12, border: "1px solid #eee", maxWidth: 320 }}>
      <select value={reason} onChange={(e) => setReason(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }}>
        {REASONS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything else we should know? (optional)"
        style={{ width: "100%", padding: 8, minHeight: 60, marginBottom: 8 }} />
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const res = await fetch("/api/returns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderItemId, email, reason, note }),
          });
          setBusy(false);
          if (res.ok) setDone(true);
        }}
        style={{ padding: "8px 16px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer", fontSize: 12 }}
      >
        {busy ? "Submitting…" : "Submit request"}
      </button>
    </div>
  );
}
