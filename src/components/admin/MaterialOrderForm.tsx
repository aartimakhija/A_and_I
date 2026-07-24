"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Vendor = { id: string; name: string };
type MaterialOption = { id: string; name: string; unit: string; costPerUnit: number };
type Item = { materialId: string; qty: number; rate: number };

export default function MaterialOrderForm({ vendors, materials }: { vendors: Vendor[]; materials: MaterialOption[] }) {
  const router = useRouter();
  const [vendorId, setVendorId] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Item[]>([{ materialId: materials[0]?.id ?? "", qty: 1, rate: (materials[0]?.costPerUnit ?? 0) / 100 }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addItem() { setItems((it) => [...it, { materialId: materials[0]?.id ?? "", qty: 1, rate: 0 }]); }
  function removeItem(i: number) { setItems((it) => it.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, patch: Partial<Item>) {
    setItems((it) => it.map((row, idx) => {
      if (idx !== i) return row;
      const next = { ...row, ...patch };
      if (patch.materialId) {
        const m = materials.find((x) => x.id === patch.materialId);
        if (m) next.rate = m.costPerUnit / 100;
      }
      return next;
    }));
  }

  async function save(status: "DRAFT" | "SENT") {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/material-orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId: vendorId || undefined, supplierName: supplierName || undefined, expectedDate: expectedDate || undefined, notes, status, items }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "save failed");
      router.push(`/admin/material-orders/${json.id}`);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const field: React.CSSProperties = { padding: "9px 11px", border: "1px solid #ddd", fontSize: 13, width: "100%" };
  const label: React.CSSProperties = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#666", display: "block", marginTop: 16, marginBottom: 4 };
  const total = items.reduce((s, it) => s + it.qty * it.rate, 0);

  return (
    <div style={{ maxWidth: 800 }}>
      {error && <div style={{ background: "#fdecea", color: "#B0503E", padding: 12, marginBottom: 16 }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={label}>Preferred vendor (optional)</label>
          <select style={field} value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
            <option value="">— none —</option>
            {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
        <div>
          <label style={label}>Or supplier name</label>
          <input style={field} value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder="e.g. Rajasthan Textile Supply Co." />
        </div>
      </div>

      <label style={label}>Expected delivery date</label>
      <input style={field} type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} />

      <label style={label}>Materials</label>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr>{["Material", "Qty", "Rate (₹/unit)", ""].map((h) => <th key={h} style={{ textAlign: "left", fontSize: 11, color: "#999", padding: "4px 6px" }}>{h}</th>)}</tr></thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td style={{ padding: "4px 6px" }}>
                <select style={field} value={it.materialId} onChange={(e) => updateItem(i, { materialId: e.target.value })}>
                  {materials.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
                </select>
              </td>
              <td style={{ padding: "4px 6px", width: 90 }}>
                <input style={field} type="number" min={0} value={it.qty} onChange={(e) => updateItem(i, { qty: parseFloat(e.target.value || "0") })} />
              </td>
              <td style={{ padding: "4px 6px", width: 120 }}>
                <input style={field} type="number" min={0} value={it.rate} onChange={(e) => updateItem(i, { rate: parseFloat(e.target.value || "0") })} />
              </td>
              <td style={{ padding: "4px 6px" }}>
                <button type="button" onClick={() => removeItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#B0503E", fontSize: 16 }}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addItem} style={{ marginTop: 8, fontSize: 12, background: "none", border: "1px solid #ccc", padding: "6px 14px", cursor: "pointer" }}>+ Add material</button>

      <div style={{ textAlign: "right", marginTop: 10, fontSize: 14, fontWeight: 600 }}>Total: ₹{total.toLocaleString("en-IN")}</div>

      <label style={label}>Notes</label>
      <textarea style={{ ...field, minHeight: 60 }} value={notes} onChange={(e) => setNotes(e.target.value)} />

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button type="button" disabled={saving} onClick={() => save("DRAFT")} style={{ padding: "12px 24px", background: "#fff", border: "1px solid #ccc", cursor: "pointer" }}>
          Save draft
        </button>
        <button type="button" disabled={saving} onClick={() => save("SENT")} style={{ padding: "12px 24px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer" }}>
          {saving ? "Saving…" : "Save & mark sent"}
        </button>
      </div>
    </div>
  );
}
