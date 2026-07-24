"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BulkSelectTable({ products }: {
  products: { id: string; name: string; category: string; vendorName: string; price: number; stock: number; status: string; thumbnail: string | null; preOrder: boolean }[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const allChecked = products.length > 0 && selected.size === products.length;

  const toggle = (id: string) => setSelected((s) => {
    const next = new Set(s);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(products.map((p) => p.id)));

  async function bulkPatch(data: Record<string, unknown>) {
    setBusy(true);
    try {
      await Promise.all([...selected].map((id) =>
        fetch(`/api/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      ));
      setSelected(new Set());
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {selected.size > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1px solid #eee", padding: "10px 16px", marginTop: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13 }}>{selected.size} selected</span>
          <button disabled={busy} onClick={() => bulkPatch({ status: "ACTIVE" })} style={{ fontSize: 12, padding: "6px 14px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>Activate</button>
          <button disabled={busy} onClick={() => bulkPatch({ status: "ARCHIVED" })} style={{ fontSize: 12, padding: "6px 14px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>Archive</button>
          <button disabled={busy} onClick={() => bulkPatch({ status: "SOLD_OUT" })} style={{ fontSize: 12, padding: "6px 14px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>Mark sold out</button>
          <span style={{ width: 1, height: 20, background: "#ddd" }} />
          <button disabled={busy} onClick={() => bulkPatch({ preOrder: true })} style={{ fontSize: 12, padding: "6px 14px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>Enable pre-order</button>
          <button disabled={busy} onClick={() => bulkPatch({ preOrder: false })} style={{ fontSize: 12, padding: "6px 14px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>Disable pre-order</button>
        </div>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead><tr>
          <th style={{ padding: 8 }}><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
          <th style={{ padding: 8 }}></th>
          {["Name", "Category", "Vendor", "Price", "Stock", "Status", "Pre-order", ""].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}
        </tr></thead>
        <tbody>{products.map((p) => (
          <tr key={p.id}>
            <td style={{ padding: 8 }}><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} /></td>
            <td style={{ padding: 8 }}>
              {p.thumbnail
                ? <img src={p.thumbnail} alt="" style={{ width: 40, height: 50, objectFit: "cover", border: "1px solid #eee" }} />
                : <div style={{ width: 40, height: 50, background: "#f0ece4", border: "1px solid #eee" }} />}
            </td>
            <td style={{ padding: 8 }}>{p.name}</td><td>{p.category}</td><td>{p.vendorName}</td>
            <td>₹{(p.price / 100).toLocaleString("en-IN")}</td>
            <td>{p.stock}</td>
            <td>{p.status}</td>
            <td>{p.preOrder ? "Yes" : "—"}</td>
            <td><a href={`/admin/products/${p.id}/edit`} style={{ fontSize: 12, color: "#0a0a0a" }}>Edit</a></td>
          </tr>
        ))}</tbody>
      </table>
    </>
  );
}
