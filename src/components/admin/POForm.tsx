"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Vendor = { id: string; name: string };
type ProductOption = { id: string; name: string; basePrice: number };
type Item = { productId: string; description: string; qty: number; unitCost: number };

export default function POForm({ vendors, products, initialVendorId, po }: {
  vendors: Vendor[]; products: ProductOption[]; initialVendorId?: string;
  po?: { id: string; poNumber: string; vendorId: string; notes: string | null; terms: string | null; status: string; items: Item[] };
}) {
  const router = useRouter();
  const [vendorId, setVendorId] = useState(po?.vendorId ?? initialVendorId ?? vendors[0]?.id ?? "");
  const [items, setItems] = useState<Item[]>(po?.items.length ? po.items : [{ productId: "", description: "", qty: 1, unitCost: 0 }]);
  const [notes, setNotes] = useState(po?.notes ?? "");
  const [terms, setTerms] = useState(po?.terms ?? "Payment due within 30 days of delivery. Please confirm production timeline upon receipt.");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addItem() { setItems((it) => [...it, { productId: "", description: "", qty: 1, unitCost: 0 }]); }
  function removeItem(i: number) { setItems((it) => it.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, patch: Partial<Item>) {
    setItems((it) => it.map((row, idx) => {
      if (idx !== i) return row;
      const next = { ...row, ...patch };
      if (patch.productId) {
        const p = products.find((x) => x.id === patch.productId);
        if (p) { next.description = p.name; next.unitCost = p.basePrice / 100; }
      }
      return next;
    }));
  }

  async function save(publish?: boolean) {
    setSaving(true);
    setError("");
    const payload = { vendorId, notes, terms, status: publish ? "SENT" : "DRAFT", items };
    try {
      const res = await fetch(po ? `/api/admin/purchase-orders/${po.id}` : "/api/admin/purchase-orders", {
        method: po ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "save failed");
      router.push(`/admin/purchase-orders/${json.id}`);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const field: React.CSSProperties = { padding: "9px 11px", border: "1px solid #ddd", fontSize: 13, width: "100%" };
  const label: React.CSSProperties = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#666", display: "block", marginTop: 16, marginBottom: 4 };
  const total = items.reduce((s, it) => s + it.qty * it.unitCost, 0);

  return (
    <div style={{ maxWidth: 800 }}>
      {error && <div style={{ background: "#fdecea", color: "#B0503E", padding: 12, marginBottom: 16 }}>{error}</div>}

      <label style={label}>Vendor / atelier</label>
      <select style={field} value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
        {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
      </select>

      <label style={label}>Line items</label>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr>{["Product (optional)", "Description", "Qty", "Unit cost (₹)", ""].map((h) => <th key={h} style={{ textAlign: "left", fontSize: 11, color: "#999", padding: "4px 6px" }}>{h}</th>)}</tr></thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td style={{ padding: "4px 6px" }}>
                <select style={field} value={it.productId} onChange={(e) => updateItem(i, { productId: e.target.value })}>
                  <option value="">— none —</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </td>
              <td style={{ padding: "4px 6px" }}>
                <input style={field} value={it.description} onChange={(e) => updateItem(i, { description: e.target.value })} placeholder="Description" />
              </td>
              <td style={{ padding: "4px 6px", width: 70 }}>
                <input style={field} type="number" min={1} value={it.qty} onChange={(e) => updateItem(i, { qty: parseInt(e.target.value || "1", 10) })} />
              </td>
              <td style={{ padding: "4px 6px", width: 110 }}>
                <input style={field} type="number" min={0} value={it.unitCost} onChange={(e) => updateItem(i, { unitCost: parseFloat(e.target.value || "0") })} />
              </td>
              <td style={{ padding: "4px 6px" }}>
                <button type="button" onClick={() => removeItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#B0503E", fontSize: 16 }}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addItem} style={{ marginTop: 8, fontSize: 12, background: "none", border: "1px solid #ccc", padding: "6px 14px", cursor: "pointer" }}>+ Add line item</button>

      <div style={{ textAlign: "right", marginTop: 10, fontSize: 14, fontWeight: 600 }}>Total: ₹{total.toLocaleString("en-IN")}</div>

      <label style={label}>Notes (internal)</label>
      <textarea style={{ ...field, minHeight: 60 }} value={notes} onChange={(e) => setNotes(e.target.value)} />

      <label style={label}>Terms (printed on the PO)</label>
      <textarea style={{ ...field, minHeight: 70 }} value={terms} onChange={(e) => setTerms(e.target.value)} />

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button type="button" disabled={saving} onClick={() => save(false)} style={{ padding: "12px 24px", background: "#fff", border: "1px solid #ccc", cursor: "pointer" }}>
          Save draft
        </button>
        <button type="button" disabled={saving} onClick={() => save(true)} style={{ padding: "12px 24px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer" }}>
          {saving ? "Saving…" : "Save & mark sent"}
        </button>
      </div>
    </div>
  );
}
