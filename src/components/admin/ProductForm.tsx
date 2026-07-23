"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Vendor = { id: string; name: string };
type ImageRow = { url: string };
type Props = {
  vendors: Vendor[];
  isAdmin: boolean;
  product?: {
    id: string; slug: string; name: string; story: string | null; category: string;
    colorHex: string; colorName: string | null; basePrice: number; status: string;
    vendorId: string; images: ImageRow[];
    variants: { size: string; stock: number }[];
    tiers: { label: string; priceAdd: number }[];
  };
};

const SIZES = ["XS", "S", "M", "L", "XL"];
const CATS = ["ready", "craft", "linen"];

export default function ProductForm({ vendors, isAdmin, product }: Props) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [story, setStory] = useState(product?.story ?? "");
  const [category, setCategory] = useState(product?.category ?? CATS[0]);
  const [colorHex, setColorHex] = useState(product?.colorHex ?? "#8A7A6A");
  const [colorName, setColorName] = useState(product?.colorName ?? "");
  const [basePrice, setBasePrice] = useState(((product?.basePrice ?? 480000) / 100).toString());
  const [status, setStatus] = useState(product?.status ?? "ACTIVE");
  const [vendorId, setVendorId] = useState(product?.vendorId ?? vendors[0]?.id ?? "");
  const [images, setImages] = useState<string[]>(product?.images.map((i) => i.url) ?? []);
  const [stock, setStock] = useState<Record<string, number>>(
    Object.fromEntries(SIZES.map((s) => [s, product?.variants.find((v) => v.size === s)?.stock ?? 6]))
  );
  const [tiers, setTiers] = useState(
    product?.tiers.map((t) => ({ label: t.label, priceAdd: t.priceAdd / 100 })) ?? [
      { label: "Signature linen", priceAdd: 0 },
      { label: "Premium handloom", priceAdd: 1500 },
      { label: "Hand-embroidered couture", priceAdd: 3500 },
    ]
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "upload failed");
      setImages((imgs) => [...imgs, json.url]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name, slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), story, category,
      colorHex, colorName, basePrice: Math.round(parseFloat(basePrice || "0") * 100), status,
      vendorId: isAdmin ? vendorId : undefined,
      images,
      variants: SIZES.map((s) => ({ size: s, stock: stock[s] ?? 0 })),
      tiers: tiers.map((t, i) => ({ label: t.label, priceAdd: Math.round(t.priceAdd * 100), position: i })),
    };
    try {
      const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.formErrors?.join(", ") || json.error || "save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const field: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #ddd", marginTop: 4, fontFamily: "inherit" };
  const label: React.CSSProperties = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#666", display: "block", marginTop: 16 };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 640 }}>
      {error && <div style={{ background: "#fdecea", color: "#B0503E", padding: 12, marginBottom: 16 }}>{error}</div>}

      <label style={label}>Name</label>
      <input style={field} value={name} onChange={(e) => setName(e.target.value)} required />

      <label style={label}>Slug (URL)</label>
      <input style={field} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated from name if blank" />

      <label style={label}>Story</label>
      <textarea style={{ ...field, minHeight: 80 }} value={story} onChange={(e) => setStory(e.target.value)} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={label}>Category</label>
          <select style={field} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={label}>Status</label>
          <select style={field} value={status} onChange={(e) => setStatus(e.target.value)}>
            {["DRAFT", "ACTIVE", "ARCHIVED", "SOLD_OUT"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <div>
          <label style={label}>Color hex</label>
          <input style={field} value={colorHex} onChange={(e) => setColorHex(e.target.value)} />
        </div>
        <div>
          <label style={label}>Color name</label>
          <input style={field} value={colorName} onChange={(e) => setColorName(e.target.value)} />
        </div>
        <div>
          <label style={label}>Base price (₹)</label>
          <input style={field} type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
        </div>
      </div>

      {isAdmin && (
        <>
          <label style={label}>Vendor</label>
          <select style={field} value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
            {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </>
      )}

      <label style={label}>Stock by size</label>
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        {SIZES.map((s) => (
          <div key={s}>
            <div style={{ fontSize: 10, textAlign: "center", marginBottom: 4 }}>{s}</div>
            <input type="number" style={{ width: 56, padding: 8, border: "1px solid #ddd" }}
              value={stock[s]} onChange={(e) => setStock((st) => ({ ...st, [s]: parseInt(e.target.value || "0", 10) }))} />
          </div>
        ))}
      </div>

      <label style={label}>Fabric tiers (price add in ₹)</label>
      {tiers.map((t, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <input style={{ ...field, marginTop: 0, flex: 1 }} value={t.label}
            onChange={(e) => setTiers((ts) => ts.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))} />
          <input style={{ ...field, marginTop: 0, width: 100 }} type="number" value={t.priceAdd}
            onChange={(e) => setTiers((ts) => ts.map((x, idx) => idx === i ? { ...x, priceAdd: parseFloat(e.target.value || "0") } : x))} />
        </div>
      ))}

      <label style={label}>Images</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
        {images.map((url, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img src={url} alt="" style={{ width: 72, height: 90, objectFit: "cover", border: "1px solid #ddd" }} />
            <button type="button" onClick={() => setImages((imgs) => imgs.filter((_, idx) => idx !== i))}
              style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", border: "none", background: "#000", color: "#fff", cursor: "pointer" }}>×</button>
          </div>
        ))}
        <label style={{ width: 72, height: 90, border: "1px dashed #bbb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 24, color: "#999" }}>
          {uploading ? "…" : "+"}
          <input type="file" accept="image/*" onChange={onUpload} style={{ display: "none" }} disabled={uploading} />
        </label>
      </div>
      <p style={{ fontSize: 11, color: "#999", marginTop: 6 }}>
        Uploads go to S3/R2 in production, or /public/uploads in dev (see storageBackend in src/lib/storage.ts).
      </p>

      <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
        <button type="submit" disabled={saving} style={{ padding: "12px 28px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer" }}>
          {saving ? "Saving…" : product ? "Save changes" : "Create product"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} style={{ padding: "12px 28px", background: "none", border: "1px solid #ccc", cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
