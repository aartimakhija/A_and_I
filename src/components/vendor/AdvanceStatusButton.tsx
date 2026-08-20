"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LABELS: Record<string, string> = {
  SENT: "Accept this order",
  ACCEPTED: "Start production",
  IN_PROGRESS: "Mark ready for pickup",
};

export default function AdvanceStatusButton({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const label = LABELS[status];

  if (!label) {
    return status === "COMPLETED"
      ? <p style={{ fontSize: 13, color: "#1a7a3c" }}>Completed — quality-checked and closed out by the studio.</p>
      : status === "READY_FOR_PICKUP"
      ? <p style={{ fontSize: 13, color: "#8a6d1a" }}>Marked ready — waiting on the studio to collect and run QC.</p>
      : <p style={{ fontSize: 13, color: "#999" }}>Waiting on the studio to send this order.</p>;
  }

  async function advance() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/vendor/production-orders/${id}/status`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not update");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {error && <div style={{ background: "#fdecea", color: "#B0503E", padding: 10, marginBottom: 10, fontSize: 13 }}>{error}</div>}
      <button disabled={busy} onClick={advance} style={{ padding: "10px 20px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer", fontSize: 13 }}>
        {busy ? "Updating…" : label}
      </button>
    </div>
  );
}
