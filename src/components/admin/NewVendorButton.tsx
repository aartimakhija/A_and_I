"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, fieldClass, labelClass } from "@/components/admin/ui";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function NewVendorButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug: slugify(name), email, phone: phone || undefined }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Couldn't create vendor.");
      setOpen(false);
      setName(""); setEmail(""); setPhone("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>+ New vendor</Button>
      <Modal open={open} onClose={() => !busy && setOpen(false)} title="New vendor" width={420}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input className={`${fieldClass} mt-1`} value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={`${fieldClass} mt-1`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Phone (optional)</label>
            <input className={`${fieldClass} mt-1`} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={busy || !name || !email}>
              {busy ? "Creating…" : "Create vendor"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
