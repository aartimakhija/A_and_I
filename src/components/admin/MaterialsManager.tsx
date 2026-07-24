"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Material = { id: string; name: string; sku: string; unit: string; costPerUnit: number; stockQty: number; reorderLevel: number; vendorId: string | null };
type Vendor = { id: string; name: string };

export default function MaterialsManager({ initial, vendors }: { initial: Material[]; vendors: Vendor[] }) {
  const router = useRouter();
  const [materials, setMaterials] = useState(initial);
  const [form, setForm] = useState({ name: "", sku: "", unit: "meters", costPerUnit: "", stockQty: "", reorderLevel: "", vendorId: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const res = await fetch("/api/admin/materials");
    setMaterials(await res.json());
    router.refresh();
  }

  async function addMaterial() {
    if (!form.name.trim() || !form.sku.trim()) { setError("Name and SKU are required"); return; }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/materials", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, costPerUnit: parseFloat(form.costPerUnit || "0"), stockQty: parseFloat(form.stockQty || "0"), reorderLevel: parseFloat(form.reorderLevel || "0") }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "failed");
      setForm({ name: "", sku: "", unit: "meters", costPerUnit: "", stockQty: "", reorderLevel: "", vendorId: "" });
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function updateStock(id: string, stockQty: number) {
    setBusy(true);
    try {
      await fetch(`/api/admin/materials/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stockQty }) });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/materials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "failed");
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const field: React.CSSProperties = { padding: "8px 10px", border: "1px solid #ddd", fontSize: 13, width: "100%" };

  return (
    <div style={{ maxWidth: 980 }}>
      {error && <div style={{ background: "#fdecea", color: "#B0503E", padding: 12, marginBottom: 16, fontSize: 13 }}>{error}</div>}

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #eee" }}>
        <thead><tr>{["Name", "SKU", "Unit", "Cost/unit", "Stock", "Reorder at", "Preferred vendor", ""].map((h) => <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee", fontSize: 12 }}>{h}</th>)}</tr></thead>
        <tbody>
          {materials.map((m) => {
            const low = m.stockQty <= m.reorderLevel;
            return (
              <tr key={m.id} style={{ background: low ? "#fdf6e8" : undefined }}>
                <td style={{ padding: 8 }}>{m.name}</td>
                <td style={{ padding: 8, fontFamily: "monospace", fontSize: 12 }}>{m.sku}</td>
                <td style={{ padding: 8 }}>{m.unit}</td>
                <td style={{ padding: 8 }}>₹{(m.costPerUnit / 100).toLocaleString("en-IN")}</td>
                <td style={{ padding: 8 }}>
                  <input type="number" defaultValue={m.stockQty} style={{ width: 70, padding: 4, border: "1px solid #ddd" }}
                    onBlur={(e) => parseFloat(e.target.value) !== m.stockQty && updateStock(m.id, parseFloat(e.target.value || "0"))} />
                  {low && <span style={{ color: "#B0503E", fontSize: 11, marginLeft: 6 }}>Low</span>}
                </td>
                <td style={{ padding: 8 }}>{m.reorderLevel}</td>
                <td style={{ padding: 8, fontSize: 12, color: "#666" }}>{vendors.find((v) => v.id === m.vendorId)?.name ?? "—"}</td>
                <td style={{ padding: 8 }}><button disabled={busy} onClick={() => remove(m.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#B0503E", fontSize: 12 }}>Delete</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: 24, background: "#fff", border: "1px solid #eee", padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Add a material</div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1.5fr", gap: 8 }}>
          <input style={field} placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <input style={field} placeholder="SKU" value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} />
          <select style={field} value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}>
            {["meters", "pieces", "kg", "rolls", "sets"].map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <input style={field} type="number" placeholder="Cost/unit ₹" value={form.costPerUnit} onChange={(e) => setForm((f) => ({ ...f, costPerUnit: e.target.value }))} />
          <input style={field} type="number" placeholder="Stock" value={form.stockQty} onChange={(e) => setForm((f) => ({ ...f, stockQty: e.target.value }))} />
          <input style={field} type="number" placeholder="Reorder at" value={form.reorderLevel} onChange={(e) => setForm((f) => ({ ...f, reorderLevel: e.target.value }))} />
          <select style={field} value={form.vendorId} onChange={(e) => setForm((f) => ({ ...f, vendorId: e.target.value }))}>
            <option value="">No preferred vendor</option>
            {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
        <button disabled={busy} onClick={addMaterial} style={{ marginTop: 12, padding: "8px 20px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer", fontSize: 13 }}>
          Add material
        </button>
      </div>
    </div>
  );
}
