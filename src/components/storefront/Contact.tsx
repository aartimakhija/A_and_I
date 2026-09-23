"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TOPICS: [string, string][] = [
  ["general", "General enquiry"],
  ["bespoke", "Bespoke / custom order"],
  ["wholesale", "Wholesale / stockist"],
  ["press", "Press"],
  ["vendor", "Vendor / atelier partnership"],
];

const DETAILS = [
  { t: "Studio", d: "Ahmedabad, Gujarat · by appointment" },
  { t: "Making", d: "Specialist makers across India" },
  { t: "Response time", d: "Within two working days" },
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
      <section className="shell grid gap-16 py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="eyebrow">Studio &amp; partner access</p>
          <h1 className="display-xl mt-6">
            Say <span className="gold-italic">hello.</span>
          </h1>
          <p className="mt-7 max-w-md text-muted-foreground">
            Every message is read by Artee, the founder. Tell us what you need and we&apos;ll come
            back with something useful, not a template.
          </p>

          {sent ? (
            <div className="mt-12 max-w-md py-10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-primary text-xl text-primary">✓</div>
              <p className="gold-italic font-display text-xl">Thank you — we&apos;ll be in touch soon.</p>
              <div className="mt-6"><button onClick={() => router.push("/")} className="btn-outline-ink">Back to home</button></div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-10 flex max-w-md flex-col gap-4.5">
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
                <textarea className={`mt-1.5 min-h-[130px] w-full border bg-card px-3.5 py-3 text-sm outline-none ${err.message ? "border-destructive" : "border-border focus:border-primary"}`} value={f.message} onChange={set("message")} placeholder="Tell us about the piece, the occasion and the date, if you have one." />
                {err.message && <span className="text-[11px] text-destructive">{err.message}</span>}
              </label>
              <button type="submit" className="btn-solid-gold w-full">{sending ? "Sending…" : "Send enquiry"}</button>
            </form>
          )}
        </div>

        <aside className="lg:pt-24">
          <dl className="divide-y divide-border border-y border-border">
            {DETAILS.map((row) => (
              <div key={row.t} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr]">
                <dt className="micro text-muted-foreground">{row.t}</dt>
                <dd className="text-sm">{row.d}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="shell grid gap-10 py-20 md:grid-cols-3">
          <div>
            <h2 className="display-md text-xl">Looking for something made for you?</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Bespoke starts with one email and a conversation about the occasion.
            </p>
            <Link href="/bespoke" className="link-underline micro mt-5 inline-block">
              Bespoke →
            </Link>
          </div>
          <div>
            <h2 className="display-md text-xl">Unsure of your size?</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Four questions and we point you at the right one — no measuring tape.
            </p>
            <Link href="/fit-quiz" className="link-underline micro mt-5 inline-block">
              Fit quiz →
            </Link>
          </div>
          <div>
            <h2 className="display-md text-xl">Have an account question?</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Check your order status, referral code and saved details any time.
            </p>
            <Link href="/account/orders" className="link-underline micro mt-5 inline-block">
              Your account →
            </Link>
          </div>
        </div>
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
