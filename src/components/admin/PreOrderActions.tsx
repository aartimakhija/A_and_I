"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PreOrderActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: string) {
    setBusy(true);
    try {
      await fetch(`/api/preorders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (["CONFIRMED", "FULFILLED", "CANCELLED"].includes(status)) {
    return <span style={{ fontSize: 12, color: status === "CANCELLED" ? "#B0503E" : "#1a7a3c" }}>{status}</span>;
  }

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {status === "PENDING" && (
        <button disabled={busy} onClick={() => setStatus("CONTACTED")} style={{ fontSize: 11, padding: "4px 8px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>Mark contacted</button>
      )}
      <button disabled={busy} onClick={() => setStatus("CONFIRMED")} style={{ fontSize: 11, padding: "4px 8px", border: "1px solid #1a7a3c", color: "#1a7a3c", background: "#fff", cursor: "pointer" }}>Approve</button>
      <button disabled={busy} onClick={() => setStatus("CANCELLED")} style={{ fontSize: 11, padding: "4px 8px", border: "1px solid #B0503E", color: "#B0503E", background: "#fff", cursor: "pointer" }}>Reject</button>
    </div>
  );
}
