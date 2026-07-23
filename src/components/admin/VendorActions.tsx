"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VendorActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: string) {
    setBusy(true);
    try {
      await fetch(`/api/vendors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const btn = (disabled: boolean): React.CSSProperties => ({
    fontSize: 11, padding: "6px 12px", border: "1px solid #ccc", background: disabled ? "#f4f4f4" : "#fff",
    cursor: disabled ? "default" : "pointer", marginRight: 6,
  });

  return (
    <div style={{ display: "flex" }}>
      <button disabled={busy || status === "APPROVED"} style={btn(status === "APPROVED")} onClick={() => setStatus("APPROVED")}>Approve</button>
      <button disabled={busy || status === "SUSPENDED"} style={btn(status === "SUSPENDED")} onClick={() => setStatus("SUSPENDED")}>Suspend</button>
    </div>
  );
}
