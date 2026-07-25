"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CHECKLIST_ITEMS: [string, string][] = [
  ["stitching", "Stitching quality"],
  ["measurements", "Measurements match spec"],
  ["colorMatch", "Color match"],
  ["embroidery", "Embroidery / print quality"],
  ["packaging", "Packaging"],
];

export default function QCForm({ poItemId, maxQty, productName, size }: { poItemId: string; maxQty: number; productName: string; size: string | null }) {
  const router = useRouter();
  const [checklist, setChecklist] = useState<Record<string, boolean>>(Object.fromEntries(CHECKLIST_ITEMS.map(([k]) => [k, true])));
  const [qtyChecked, setQtyChecked] = useState(maxQty);
  const [qtyFailed, setQtyFailed] = useState(0);
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ result: string; stockUpdated: boolean } | null>(null);
  const [error, setError] = useState("");

  async function uploadPhoto(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "upload failed");
      setPhotos((p) => [...p, json.url]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/quality-checks", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poItemId, checklist, qtyChecked, qtyPassed: qtyChecked - qtyFailed, qtyFailed, notes, photos }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "save failed");
      setResult({ result: json.result, stockUpdated: json.stockUpdated });
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const field: React.CSSProperties = { padding: "8px 10px", border: "1px solid #ddd", fontSize: 13 };

  if (result) {
    return (
      <div style={{ padding: 12, background: result.result === "PASSED" ? "#eaf6ee" : result.result === "FAILED" ? "#fdecea" : "#fdf6e8", fontSize: 13 }}>
        QC recorded: <strong>{result.result}</strong>.
        {result.stockUpdated && " Stock updated for passed units ✓"}
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #eee", padding: 14, marginTop: 8, background: "#fafafa" }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>QC — {productName}{size ? ` (${size})` : ""}</div>
      {error && <div style={{ background: "#fdecea", color: "#B0503E", padding: 8, marginBottom: 8, fontSize: 12 }}>{error}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
        {CHECKLIST_ITEMS.map(([key, label]) => (
          <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <input type="checkbox" checked={checklist[key]} onChange={(e) => setChecklist((c) => ({ ...c, [key]: e.target.checked }))} />
            {label}
          </label>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
        <label style={{ fontSize: 12 }}>Units checked
          <input style={{ ...field, width: 70, marginLeft: 6 }} type="number" min={1} max={maxQty} value={qtyChecked} onChange={(e) => setQtyChecked(parseInt(e.target.value || "0", 10))} />
        </label>
        <label style={{ fontSize: 12 }}>Units failed
          <input style={{ ...field, width: 70, marginLeft: 6 }} type="number" min={0} max={qtyChecked} value={qtyFailed} onChange={(e) => setQtyFailed(parseInt(e.target.value || "0", 10))} />
        </label>
        <span style={{ fontSize: 12, color: "#666" }}>→ {qtyChecked - qtyFailed} pass</span>
      </div>

      <textarea style={{ ...field, width: "100%", minHeight: 50 }} placeholder="Notes (defects found, rework needed, etc.)" value={notes} onChange={(e) => setNotes(e.target.value)} />

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
        {photos.map((url, i) => <img key={i} src={url} alt="" style={{ width: 50, height: 62, objectFit: "cover", border: "1px solid #ddd" }} />)}
        <label style={{ width: 50, height: 62, border: "1px dashed #bbb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: "#999" }}>
          {uploading ? "…" : "+"}
          <input type="file" accept="image/*" style={{ display: "none" }} disabled={uploading} onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
        </label>
      </div>

      <button disabled={saving} onClick={submit} style={{ marginTop: 10, padding: "8px 18px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer", fontSize: 13 }}>
        {saving ? "Saving…" : "Record QC result"}
      </button>
    </div>
  );
}
