"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReturnActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function update(next: string) {
    setBusy(true);
    try {
      await fetch(`/api/returns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const btn: React.CSSProperties = { fontSize: 11, padding: "6px 12px", border: "1px solid #ccc", background: "#fff", cursor: "pointer", marginRight: 6 };

  if (status === "REQUESTED") return (
    <div>
      <button disabled={busy} style={btn} onClick={() => update("APPROVED")}>Approve</button>
      <button disabled={busy} style={btn} onClick={() => update("REJECTED")}>Reject</button>
    </div>
  );
  if (status === "APPROVED") return <button disabled={busy} style={btn} onClick={() => update("PICKED_UP")}>Mark picked up</button>;
  if (status === "PICKED_UP") return <button disabled={busy} style={btn} onClick={() => update("RECEIVED")}>Mark received</button>;
  if (status === "RECEIVED") return <button disabled={busy} style={btn} onClick={() => update("REFUNDED")}>Issue refund</button>;
  return <span style={{ fontSize: 11, color: "#999" }}>—</span>;
}
