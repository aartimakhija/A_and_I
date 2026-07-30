"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MessageActions({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function markUnread() {
    setBusy(true);
    try {
      await fetch(`/api/admin/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: false }) });
      router.push("/admin/messages");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this message? This can't be undone.")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      router.push("/admin/messages");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
      <button disabled={busy} onClick={markUnread} style={{ padding: "8px 16px", background: "#fff", border: "1px solid #ccc", cursor: "pointer", fontSize: 13 }}>
        Mark as unread
      </button>
      <button disabled={busy} onClick={remove} style={{ padding: "8px 16px", background: "#fff", border: "1px solid #B0503E", color: "#B0503E", cursor: "pointer", fontSize: 13 }}>
        Delete
      </button>
    </div>
  );
}
