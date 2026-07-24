"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["DRAFT", "SENT", "ACCEPTED", "IN_PROGRESS", "READY_FOR_PICKUP", "COMPLETED"];

export default function PurchaseOrderStatus({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/purchase-orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const idx = STATUSES.indexOf(status);
  const next = STATUSES[idx + 1];

  return (
    <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <span style={{ fontSize: 13 }}>Status: <strong>{status.replaceAll("_", " ")}</strong></span>
      {next && (
        <button disabled={busy} onClick={() => setStatus(next)} style={{ padding: "8px 16px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer", fontSize: 13 }}>
          {busy ? "Updating…" : `Mark ${next.toLowerCase().replaceAll("_", " ")}`}
        </button>
      )}
    </div>
  );
}
