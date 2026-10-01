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

// A&I doesn't offer cash refunds — every request here resolves to either a
// replacement (same piece, a different size if that's the issue) or, if that
// size has sold out, a store credit. See src/app/api/returns for the policy.
export default function RequestReturn({ orderItemId, email }: { orderItemId: string; email: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>(REASONS[0][0]);
  const [preferredSize, setPreferredSize] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (done) return <span className="text-xs text-muted-foreground">Exchange requested ✓</span>;

  if (!open) return (
    <button onClick={() => setOpen(true)} className="text-xs text-muted-foreground underline hover:text-foreground">
      Request exchange
    </button>
  );

  return (
    <div className="mt-2 max-w-xs border border-border p-3">
      <select value={reason} onChange={(e) => setReason(e.target.value)} className="mb-2 w-full border border-border bg-background px-2 py-2 text-sm">
        {REASONS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select>
      <input
        value={preferredSize}
        onChange={(e) => setPreferredSize(e.target.value)}
        placeholder="Preferred size instead (optional)"
        className="mb-2 w-full border border-border bg-background px-2 py-2 text-sm"
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Anything else we should know? (optional)"
        className="mb-2 min-h-[60px] w-full border border-border bg-background px-2 py-2 text-sm"
      />
      <p className="mb-2 text-[11px] text-muted-foreground">
        We exchange for a different size when it&apos;s available, or send a store credit if it isn&apos;t
        — we don&apos;t offer cash refunds.
      </p>
      {error && <p className="mb-2 text-[11px] text-destructive">{error}</p>}
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          const res = await fetch("/api/returns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderItemId, email, reason, note, preferredSize: preferredSize || undefined }),
          });
          setBusy(false);
          if (res.ok) { setDone(true); return; }
          const json = await res.json().catch(() => null);
          setError(json?.error || "Something went wrong — please try again.");
        }}
        className="btn-outline-ink px-4 py-2 text-xs"
      >
        {busy ? "Submitting…" : "Submit request"}
      </button>
    </div>
  );
}
