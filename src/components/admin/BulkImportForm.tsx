"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Result = { created: number; skipped: number; errors: { row: number; message: string }[] };

export default function BulkImportForm({ vendorSlugs, isAdmin }: { vendorSlugs: string[]; isAdmin: boolean }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [csv, setCsv] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    setError("");
    const reader = new FileReader();
    reader.onload = () => setCsv(String(reader.result || ""));
    reader.readAsText(file);
  }

  async function submit() {
    if (!csv.trim()) { setError("Choose a CSV file first."); return; }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Import failed");
      setResult(json);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function downloadTemplate() {
    const sampleVendor = vendorSlugs[0] || "your-vendor-slug";
    const header = "name,slug,category,colorHex,colorName,story,basePrice,stock,vendorSlug,status,imageUrls,featured,featuredOrder,lookbookOrder";
    const example = `Mint Flutter,,ready,#B9B7AD,Mint,"A soft, breathable co-ord for warm days.",4800,6,${sampleVendor},ACTIVE,,false,0,`;
    const blob = new Blob([header + "\n" + example + "\n"], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "aandi-products-template.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const box: React.CSSProperties = { background: "#fff", border: "1px solid #eee", padding: 24, maxWidth: 640 };
  const label: React.CSSProperties = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#666", display: "block", marginBottom: 6 };

  return (
    <div style={box}>
      <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginTop: 0 }}>
        Upload a CSV to create many products at once. Required columns: <code>name</code>, <code>category</code>
        {" "}(one of <code>ready</code>, <code>craft</code>, <code>linen</code>){isAdmin && <> and <code>vendorSlug</code></>}.
        Everything else is optional and has sensible defaults. Rows whose slug already exists are skipped, not overwritten.
      </p>

      <button onClick={downloadTemplate} style={{ fontSize: 12, background: "none", border: "1px solid #ccc", padding: "8px 14px", cursor: "pointer", marginBottom: 20 }}>
        Download CSV template
      </button>

      <label style={label}>CSV file</label>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
        <button onClick={() => fileRef.current?.click()} style={{ padding: "10px 18px", border: "1px solid #ccc", background: "#fafafa", cursor: "pointer", fontSize: 13 }}>
          Choose file
        </button>
        <span style={{ fontSize: 13, color: "#666" }}>{fileName || "No file chosen"}</span>
        <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={onFile} style={{ display: "none" }} />
      </div>

      {error && <div style={{ background: "#fdecea", color: "#B0503E", padding: 12, marginBottom: 16, fontSize: 13 }}>{error}</div>}

      <button onClick={submit} disabled={busy || !csv} style={{ padding: "12px 28px", background: "#0a0a0a", color: "#fff", border: 0, cursor: busy ? "default" : "pointer", opacity: !csv ? 0.5 : 1 }}>
        {busy ? "Importing…" : "Import products"}
      </button>

      {result && (
        <div style={{ marginTop: 24, borderTop: "1px solid #eee", paddingTop: 18 }}>
          <div style={{ fontSize: 14 }}>
            <strong>{result.created}</strong> created, <strong>{result.skipped}</strong> skipped (already existed)
            {result.errors.length > 0 && <>, <strong style={{ color: "#B0503E" }}>{result.errors.length}</strong> failed</>}.
          </div>
          {result.errors.length > 0 && (
            <ul style={{ marginTop: 10, fontSize: 12, color: "#B0503E", paddingLeft: 18 }}>
              {result.errors.map((e, i) => <li key={i}>Row {e.row}: {e.message}</li>)}
            </ul>
          )}
          <button onClick={() => router.push("/admin/products")} style={{ marginTop: 14, background: "none", border: "1px solid #ccc", padding: "8px 16px", cursor: "pointer", fontSize: 12 }}>
            View catalogue
          </button>
        </div>
      )}
    </div>
  );
}
