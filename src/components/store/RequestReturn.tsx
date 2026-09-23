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

  if (done) return <span className="text-xs text-muted-foreground">Return requested ✓</span>;

  if (!open) return (
    <button onClick={() => setOpen(true)} className="text-xs text-muted-foreground underline hover:text-foreground">
      Request return
    </button>
  );

  return (
    <div className="mt-2 max-w-xs border border-border p-3">
      <select value={reason} onChange={(e) => setReason(e.target.value)} className="mb-2 w-full border border-border bg-background px-2 py-2 text-sm">
        {REASONS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Anything else we should know? (optional)"
        className="mb-2 min-h-[60px] w-full border border-border bg-background px-2 py-2 text-sm"
      />
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
        className="btn-outline-ink px-4 py-2 text-xs"
      >
        {busy ? "Submitting…" : "Submit request"}
      </button>
    </div>
  );
}
