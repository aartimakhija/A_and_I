"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductOption = { id: string; name: string };
type Props = {
  allProducts: ProductOption[];
  post?: {
    id: string; slug: string; title: string; subtitle: string | null; coverImage: string | null;
    body: string; status: string; authorName: string;
    products: { productId: string; product: { name: string } }[];
  };
};

export default function BlogPostForm({ allProducts, post }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [subtitle, setSubtitle] = useState(post?.subtitle ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [status, setStatus] = useState(post?.status ?? "DRAFT");
  const [authorName, setAuthorName] = useState(post?.authorName ?? "A & I Editorial");
  const [productIds, setProductIds] = useState<string[]>(post?.products.map((p) => p.productId) ?? []);
  const [productSearch, setProductSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const taggedNames = new Map(
    (post?.products.map((p) => [p.productId, p.product.name] as const) ?? [])
  );

  async function onUploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "upload failed");
      setCoverImage(json.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function toggleProduct(id: string) {
    setProductIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  async function submit(e: React.FormEvent, publish?: boolean) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      title, slug: slug || undefined, subtitle: subtitle || null, coverImage: coverImage || null,
      body, authorName, status: publish ? "PUBLISHED" : status, productIds,
    };
    try {
      const res = await fetch(post ? `/api/admin/blog/${post.id}` : "/api/admin/blog", {
        method: post ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "save failed");
      router.push("/admin/blog");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const field: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #ddd", marginTop: 4, fontFamily: "inherit" };
  const label: React.CSSProperties = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#666", display: "block", marginTop: 16 };
  const filtered = allProducts.filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()));

  return (
    <form onSubmit={(e) => submit(e)} style={{ maxWidth: 720 }}>
      {error && <div style={{ background: "#fdecea", color: "#B0503E", padding: 12, marginBottom: 16 }}>{error}</div>}

      <label style={label}>Title</label>
      <input style={field} value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label style={label}>Slug (URL)</label>
      <input style={field} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated from title if blank" />

      <label style={label}>Subtitle / deck</label>
      <input style={field} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="One line under the headline" />

      <label style={label}>Author</label>
      <input style={field} value={authorName} onChange={(e) => setAuthorName(e.target.value)} />

      <label style={label}>Cover image</label>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 6 }}>
        {coverImage && <img src={coverImage} alt="" style={{ width: 120, height: 80, objectFit: "cover", border: "1px solid #ddd" }} />}
        <label style={{ padding: "10px 16px", border: "1px dashed #bbb", cursor: "pointer", fontSize: 13, color: "#666" }}>
          {uploading ? "Uploading…" : coverImage ? "Replace" : "Upload cover"}
          <input type="file" accept="image/*" onChange={onUploadCover} style={{ display: "none" }} disabled={uploading} />
        </label>
      </div>

      <label style={label}>Body</label>
      <textarea style={{ ...field, minHeight: 300, lineHeight: 1.6 }} value={body} onChange={(e) => setBody(e.target.value)}
        placeholder="Write in plain paragraphs — leave a blank line between paragraphs." required />

      <label style={label}>Shop this post — tag products</label>
      <input style={field} value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search catalogue…" />
      <div style={{ maxHeight: 180, overflowY: "auto", border: "1px solid #eee", marginTop: 6 }}>
        {filtered.slice(0, 40).map((p) => (
          <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", fontSize: 13, borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}>
            <input type="checkbox" checked={productIds.includes(p.id)} onChange={() => toggleProduct(p.id)} />
            {p.name}
          </label>
        ))}
      </div>
      {productIds.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
          {productIds.map((id) => {
            const name = taggedNames.get(id) ?? allProducts.find((p) => p.id === id)?.name ?? id;
            return (
              <span key={id} style={{ fontSize: 12, padding: "5px 10px", background: "#f0ece4", display: "flex", alignItems: "center", gap: 6 }}>
                {name}
                <button type="button" onClick={() => toggleProduct(id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>×</button>
              </span>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
        <button type="button" disabled={saving} onClick={(e) => submit(e as any, false)}
          style={{ padding: "12px 24px", background: "#fff", border: "1px solid #ccc", cursor: "pointer" }}>
          Save draft
        </button>
        <button type="button" disabled={saving} onClick={(e) => submit(e as any, true)}
          style={{ padding: "12px 24px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer" }}>
          {saving ? "Saving…" : "Publish"}
        </button>
        <button type="button" onClick={() => router.push("/admin/blog")} style={{ padding: "12px 24px", background: "none", border: "1px solid #ccc", cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
