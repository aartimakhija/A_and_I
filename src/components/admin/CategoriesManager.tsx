"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string; slug: string; position: number; active: boolean };

export default function CategoriesManager({ initial, productCounts }: { initial: Category[]; productCounts: Record<string, number> }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const res = await fetch("/api/admin/categories");
    setCategories(await res.json());
    router.refresh();
  }

  async function addCategory() {
    if (!newName.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "failed");
      setNewName("");
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function update(id: string, data: Partial<Category>) {
    setBusy(true);
    try {
      await fetch(`/api/admin/categories/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "failed");
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const field: React.CSSProperties = { padding: "8px 10px", border: "1px solid #ddd", fontSize: 13 };

  return (
    <div style={{ maxWidth: 720 }}>
      {error && <div style={{ background: "#fdecea", color: "#B0503E", padding: 12, marginBottom: 16, fontSize: 13 }}>{error}</div>}
      <p style={{ fontSize: 13, color: "#666", marginTop: 0 }}>
        These are the only categories your storefront's collection filters and product-edit dropdown will offer. Deactivating hides a category from the site without deleting it or touching its products.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #eee", marginTop: 12 }}>
        <thead><tr>{["Name", "Slug", "Products", "Active", ""].map((h) => <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee", fontSize: 12 }}>{h}</th>)}</tr></thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td style={{ padding: 8 }}>
                <input defaultValue={c.name} style={field} onBlur={(e) => e.target.value !== c.name && update(c.id, { name: e.target.value })} />
              </td>
              <td style={{ padding: 8, fontFamily: "monospace", fontSize: 12, color: "#666" }}>{c.slug}</td>
              <td style={{ padding: 8 }}>{productCounts[c.slug] ?? 0}</td>
              <td style={{ padding: 8 }}>
                <input type="checkbox" checked={c.active} onChange={(e) => update(c.id, { active: e.target.checked })} />
              </td>
              <td style={{ padding: 8 }}>
                <button disabled={busy} onClick={() => remove(c.id)} style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer", color: "#B0503E" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New category name" style={{ ...field, flex: 1 }} />
        <button disabled={busy} onClick={addCategory} style={{ padding: "8px 20px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer", fontSize: 13 }}>
          Add category
        </button>
      </div>
    </div>
  );
}
