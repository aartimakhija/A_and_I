"use client";
import { useState } from "react";

type Settings = {
  siteName: string; tagline: string | null; description: string | null;
  faviconUrl: string | null; logoUrl: string | null; ogImageUrl: string | null;
  announcementText: string | null;
  socialInstagram: string | null; socialWhatsapp: string | null; socialPinterest: string | null;
  socialFacebook: string | null; socialTwitter: string | null;
  contactEmail: string | null; contactPhone: string | null;
  gaMeasurementId: string | null; googleSiteVerification: string | null; bingSiteVerification: string | null;
};

export default function SettingsForm({ initial }: { initial: Settings }) {
  const [s, setS] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const set = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setS((prev) => ({ ...prev, [k]: e.target.value }));

  async function uploadImage(key: "faviconUrl" | "logoUrl" | "ogImageUrl", file: File) {
    setUploading(key);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "upload failed");
      setS((prev) => ({ ...prev, [key]: json.url }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s),
      });
      if (!res.ok) throw new Error((await res.json()).error || "save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const field: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #ddd", marginTop: 4 };
  const label: React.CSSProperties = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#666", display: "block", marginTop: 16 };
  const section: React.CSSProperties = { background: "#fff", border: "1px solid #eee", padding: 24, marginBottom: 24 };
  const sectionTitle: React.CSSProperties = { fontSize: 14, fontWeight: 600, marginBottom: 4 };

  function ImageField({ label: l, k }: { label: string; k: "faviconUrl" | "logoUrl" | "ogImageUrl" }) {
    return (
      <div style={{ marginTop: 16 }}>
        <span style={label}>{l}</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 6 }}>
          {s[k] && <img src={s[k]!} alt="" style={{ width: 64, height: 64, objectFit: "contain", border: "1px solid #ddd", background: "#fafafa" }} />}
          <label style={{ padding: "9px 16px", border: "1px dashed #bbb", cursor: "pointer", fontSize: 12, color: "#666" }}>
            {uploading === k ? "Uploading…" : s[k] ? "Replace" : "Upload"}
            <input type="file" accept="image/*" style={{ display: "none" }} disabled={!!uploading}
              onChange={(e) => e.target.files?.[0] && uploadImage(k, e.target.files[0])} />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720 }}>
      {error && <div style={{ background: "#fdecea", color: "#B0503E", padding: 12, marginBottom: 16 }}>{error}</div>}

      <div style={section}>
        <div style={sectionTitle}>Brand & SEO defaults</div>
        <label style={label}>Site name</label>
        <input style={field} value={s.siteName} onChange={set("siteName")} />
        <label style={label}>Tagline</label>
        <input style={field} value={s.tagline ?? ""} onChange={set("tagline")} />
        <label style={label}>Default meta description</label>
        <textarea style={{ ...field, minHeight: 70 }} value={s.description ?? ""} onChange={set("description")} />
        <ImageField label="Favicon" k="faviconUrl" />
        <ImageField label="Logo" k="logoUrl" />
        <ImageField label="Default social share image (Open Graph)" k="ogImageUrl" />
      </div>

      <div style={section}>
        <div style={sectionTitle}>Announcement bar</div>
        <label style={label}>Message shown at the top of every page</label>
        <input style={field} value={s.announcementText ?? ""} onChange={set("announcementText")} />
      </div>

      <div style={section}>
        <div style={sectionTitle}>Social links</div>
        {([
          ["socialInstagram", "Instagram URL"], ["socialWhatsapp", "WhatsApp link (wa.me/...)"],
          ["socialPinterest", "Pinterest URL"], ["socialFacebook", "Facebook URL"], ["socialTwitter", "X / Twitter URL"],
        ] as const).map(([k, l]) => (
          <div key={k}>
            <label style={label}>{l}</label>
            <input style={field} value={s[k] ?? ""} onChange={set(k)} placeholder="https://…" />
          </div>
        ))}
      </div>

      <div style={section}>
        <div style={sectionTitle}>Contact details</div>
        <label style={label}>Contact email</label>
        <input style={field} value={s.contactEmail ?? ""} onChange={set("contactEmail")} />
        <label style={label}>Contact phone</label>
        <input style={field} value={s.contactPhone ?? ""} onChange={set("contactPhone")} />
      </div>

      <div style={section}>
        <div style={sectionTitle}>Analytics & search console verification</div>
        <p style={{ fontSize: 12, color: "#999", marginTop: 0 }}>Paste the IDs from each service — no code changes needed.</p>
        <label style={label}>Google Analytics 4 Measurement ID</label>
        <input style={field} value={s.gaMeasurementId ?? ""} onChange={set("gaMeasurementId")} placeholder="G-XXXXXXXXXX" />
        <label style={label}>Google Search Console verification code</label>
        <input style={field} value={s.googleSiteVerification ?? ""} onChange={set("googleSiteVerification")} placeholder="the content= value from the meta tag Google gives you" />
        <label style={label}>Bing Webmaster verification code</label>
        <input style={field} value={s.bingSiteVerification ?? ""} onChange={set("bingSiteVerification")} />
      </div>

      <button onClick={save} disabled={saving} style={{ padding: "12px 28px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer" }}>
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save settings"}
      </button>
    </div>
  );
}
