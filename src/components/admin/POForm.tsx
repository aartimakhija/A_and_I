"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Vendor = { id: string; name: string };
type ProductOption = { id: string; name: string; basePrice: number };
type Item = { productId: string; description: string; size?: string; qty: number; unitCost: number };

const SIZES = ["", "XS", "S", "M", "L", "XL"];
const PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"];

export default function POForm({ vendors, products, initialVendorId, initialItems, po }: {
  vendors: Vendor[]; products: ProductOption[]; initialVendorId?: string; initialItems?: Item[];
  po?: {
    id: string; poNumber: string; vendorId: string; notes: string | null; terms: string | null; status: string;
    priority?: string; expectedDelivery?: string | null; measurementNotes?: string | null; referenceImages?: string[];
    items: Item[];
  };
}) {
  const router = useRouter();
  const [vendorId, setVendorId] = useState(po?.vendorId ?? initialVendorId ?? vendors[0]?.id ?? "");
  const [items, setItems] = useState<Item[]>(po?.items.length ? po.items : initialItems?.length ? initialItems : [{ productId: "", description: "", qty: 1, unitCost: 0 }]);
  const [notes, setNotes] = useState(po?.notes ?? "");
  const [terms, setTerms] = useState(po?.terms ?? "Payment due within 30 days of delivery. Please confirm production timeline upon receipt.");
  const [priority, setPriority] = useState(po?.priority ?? "NORMAL");
  const [expectedDelivery, setExpectedDelivery] = useState(po?.expectedDelivery?.slice(0, 10) ?? "");
  const [measurementNotes, setMeasurementNotes] = useState(po?.measurementNotes ?? "");
  const [referenceImages, setReferenceImages] = useState<string[]>(po?.referenceImages ?? []);
  const [uploading, setUploading] = useState(false);
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

  async function uploadReference(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "upload failed");
      setReferenceImages((imgs) => [...imgs, json.url]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function save(status: string) {
    setSaving(true);
    setError("");
    const payload = { vendorId, notes, terms, status, priority, expectedDelivery: expectedDelivery || null, measurementNotes, referenceImages, items };
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
    <div style={{ maxWidth: 860 }}>
      {error && <div style={{ background: "#fdecea", color: "#B0503E", padding: 12, marginBottom: 16 }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}>
        <div>
          <label style={label}>Vendor / atelier</label>
          <select style={field} value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
            {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
        <div>
          <label style={label}>Priority</label>
          <select style={field} value={priority} onChange={(e) => setPriority(e.target.value)}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label style={label}>Expected delivery</label>
          <input style={field} type="date" value={expectedDelivery} onChange={(e) => setExpectedDelivery(e.target.value)} />
        </div>
      </div>

      <label style={label}>Line items</label>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr>{["Product (optional)", "Description", "Size", "Qty", "Unit cost (₹)", ""].map((h) => <th key={h} style={{ textAlign: "left", fontSize: 11, color: "#999", padding: "4px 6px" }}>{h}</th>)}</tr></thead>
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
              <td style={{ padding: "4px 6px", width: 80 }}>
                <select style={field} value={it.size ?? ""} onChange={(e) => updateItem(i, { size: e.target.value })}>
                  {SIZES.map((s) => <option key={s} value={s}>{s || "—"}</option>)}
                </select>
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

      <label style={label}>Measurements / custom fit notes</label>
      <textarea style={{ ...field, minHeight: 60 }} value={measurementNotes} onChange={(e) => setMeasurementNotes(e.target.value)} placeholder="e.g. Bust 36in, waist 29in, length +2in from standard M" />

      <label style={label}>Reference images / blueprint</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
        {referenceImages.map((url, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img src={url} alt="" style={{ width: 72, height: 90, objectFit: "cover", border: "1px solid #ddd" }} />
            <button type="button" onClick={() => setReferenceImages((imgs) => imgs.filter((_, idx) => idx !== i))}
              style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", border: "none", background: "#000", color: "#fff", cursor: "pointer" }}>×</button>
          </div>
        ))}
        <label style={{ width: 72, height: 90, border: "1px dashed #bbb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 24, color: "#999" }}>
          {uploading ? "…" : "+"}
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadReference(e.target.files[0])} style={{ display: "none" }} disabled={uploading} />
        </label>
      </div>

      <label style={label}>Notes (internal)</label>
      <textarea style={{ ...field, minHeight: 60 }} value={notes} onChange={(e) => setNotes(e.target.value)} />

      <label style={label}>Terms (printed on the PO)</label>
      <textarea style={{ ...field, minHeight: 70 }} value={terms} onChange={(e) => setTerms(e.target.value)} />

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button type="button" disabled={saving} onClick={() => save("DRAFT")} style={{ padding: "12px 24px", background: "#fff", border: "1px solid #ccc", cursor: "pointer" }}>
          Save draft
        </button>
        <button type="button" disabled={saving} onClick={() => save("SENT")} style={{ padding: "12px 24px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer" }}>
          {saving ? "Saving…" : "Save & send to vendor"}
        </button>
      </div>
    </div>
  );
}
