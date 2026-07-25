"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecordPaymentForm({ vendorId, defaultAmount }: { vendorId: string; defaultAmount?: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(defaultAmount ? (defaultAmount / 100).toString() : "");
  const [method, setMethod] = useState("Bank transfer");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!amount || parseFloat(amount) <= 0) { setError("Enter a valid amount"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/vendor-payments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId, amount: parseFloat(amount), method, reference, notes }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "save failed");
      setOpen(false);
      setAmount(""); setReference(""); setNotes("");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const field: React.CSSProperties = { padding: "8px 10px", border: "1px solid #ddd", fontSize: 13 };

  if (!open) {
    return <button onClick={() => setOpen(true)} style={{ padding: "8px 16px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer", fontSize: 13 }}>Record payment</button>;
  }

  return (
    <div style={{ border: "1px solid #eee", padding: 14, background: "#fafafa", maxWidth: 420 }}>
      {error && <div style={{ background: "#fdecea", color: "#B0503E", padding: 8, marginBottom: 8, fontSize: 12 }}>{error}</div>}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input style={{ ...field, flex: 1 }} type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <select style={field} value={method} onChange={(e) => setMethod(e.target.value)}>
          {["Bank transfer", "UPI", "Cash", "Cheque"].map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <input style={{ ...field, width: "100%", marginBottom: 8 }} placeholder="Reference / transaction ID" value={reference} onChange={(e) => setReference(e.target.value)} />
      <textarea style={{ ...field, width: "100%", minHeight: 50, marginBottom: 8 }} placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <div style={{ display: "flex", gap: 8 }}>
        <button disabled={saving} onClick={submit} style={{ padding: "8px 18px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer", fontSize: 13 }}>
          {saving ? "Saving…" : "Save payment"}
        </button>
        <button onClick={() => setOpen(false)} style={{ padding: "8px 18px", background: "none", border: "1px solid #ccc", cursor: "pointer", fontSize: 13 }}>Cancel</button>
      </div>
    </div>
  );
}
