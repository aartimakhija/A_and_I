"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const TOPICS: [string, string][] = [
  ["general", "General enquiry"],
  ["bespoke", "Bespoke / custom order"],
  ["wholesale", "Wholesale / stockist"],
  ["press", "Press"],
  ["vendor", "Vendor / atelier partnership"],
];

export function Contact() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", topic: "general", message: "" });
  useEffect(() => {
    try {
      const t = new URLSearchParams(window.location.search).get("topic");
      if (t && TOPICS.some(([id]) => id === t)) setF((prev) => ({ ...prev, topic: t }));
    } catch {}
  }, []);
  const [err, setErr] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const e2: Record<string, string> = {};
    if (!f.name.trim()) e2.name = "Required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e2.email = "Enter a valid email";
    if (!f.message.trim()) e2.message = "Required";
    setErr(e2);
    if (Object.keys(e2).length) return;

    setSending(true);
    setApiError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ? JSON.stringify(json.error) : "Something went wrong");
      setSent(true);
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <header className="shell pb-7 pt-16 text-center md:pb-12 md:pt-20">
        <span className="eyebrow">We&apos;d love to hear from you</span>
        <h1 className="display-lg mt-2">Get in <span className="gold-italic">touch</span></h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] font-light leading-relaxed text-muted-foreground">
          Questions about an order, a wholesale enquiry, or want to collaborate with our ateliers — write to us below.
        </p>
      </header>

      <section className="shell max-w-xl pb-20 md:pb-28">
        {sent ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-5.5 flex h-14 w-14 items-center justify-center rounded-full border border-primary text-xl text-primary">✓</div>
            <p className="gold-italic font-display text-xl">Thank you — we&apos;ll be in touch soon.</p>
            <div className="mt-6"><button onClick={() => router.push("/")} className="btn-outline-ink">Back to home</button></div>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4.5">
            {apiError && <div className="bg-destructive/10 p-3 text-sm text-destructive">{apiError}</div>}
            <label>
              <span className="eyebrow-muted">Name</span>
              <input className={`mt-1.5 w-full border bg-card px-3.5 py-3 text-sm outline-none ${err.name ? "border-destructive" : "border-border focus:border-primary"}`} value={f.name} onChange={set("name")} />
              {err.name && <span className="text-[11px] text-destructive">{err.name}</span>}
            </label>
            <label>
              <span className="eyebrow-muted">Email</span>
              <input type="email" className={`mt-1.5 w-full border bg-card px-3.5 py-3 text-sm outline-none ${err.email ? "border-destructive" : "border-border focus:border-primary"}`} value={f.email} onChange={set("email")} />
              {err.email && <span className="text-[11px] text-destructive">{err.email}</span>}
            </label>
            <label>
              <span className="eyebrow-muted">Topic</span>
              <select className="mt-1.5 w-full border border-border bg-card px-3.5 py-3 text-sm outline-none focus:border-primary" value={f.topic} onChange={set("topic")}>
                {TOPICS.map(([id, l]) => <option key={id} value={id}>{l}</option>)}
              </select>
            </label>
            <label>
              <span className="eyebrow-muted">Message</span>
              <textarea className={`mt-1.5 min-h-[130px] w-full border bg-card px-3.5 py-3 text-sm outline-none ${err.message ? "border-destructive" : "border-border focus:border-primary"}`} value={f.message} onChange={set("message")} />
              {err.message && <span className="text-[11px] text-destructive">{err.message}</span>}
            </label>
            <button type="submit" className="btn-solid-gold w-full">{sending ? "Sending…" : "Send message"}</button>
          </form>
        )}
      </section>

      {/* Studio / partner access — a quiet, discoverable entry point into the
          marketplace backend. The link itself is public; /admin is what's
          actually gated (by role + login), so an unauthenticated or non-admin
          visitor lands on /login or is redirected home rather than seeing anything. */}
      <div className="border-t border-border py-7 text-center">
        <button onClick={() => router.push("/admin")} className="border-b border-border pb-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Studio &amp; Partner Access
        </button>
      </div>
    </>
  );
}
