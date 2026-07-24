"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["DRAFT", "SENT", "ACCEPTED", "IN_TRANSIT", "RECEIVED"];

export default function MaterialOrderStatus({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/material-orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const idx = STATUSES.indexOf(status);
  const next = STATUSES[idx + 1];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 13 }}>Status: <strong>{status}</strong></span>
      {next && (
        <button disabled={busy} onClick={() => setStatus(next)} style={{ padding: "8px 16px", background: next === "RECEIVED" ? "#1a7a3c" : "#0a0a0a", color: "#fff", border: 0, cursor: "pointer", fontSize: 13 }}>
          {busy ? "Updating…" : next === "RECEIVED" ? "Mark received (adds stock)" : `Mark ${next.toLowerCase().replace("_", " ")}`}
        </button>
      )}
      {status === "RECEIVED" && <span style={{ fontSize: 12, color: "#1a7a3c" }}>Stock updated ✓</span>}
    </div>
  );
}
