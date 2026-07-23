"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF } from "./theme";
import { Eyebrow, Title, Btn } from "./primitives";

const TOPICS: [string, string][] = [
  ["general", "General enquiry"],
  ["wholesale", "Wholesale / stockist"],
  ["press", "Press"],
  ["vendor", "Vendor / atelier partnership"],
];

export function Contact() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", topic: "general", message: "" });
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

  const field: React.CSSProperties = {
    width: "100%", padding: "12px 14px", marginTop: 6, fontFamily: SANS, fontSize: 14,
    color: T.ink, background: T.card, border: `1px solid ${T.border}`, outline: "none",
  };
  const label: React.CSSProperties = { fontFamily: SANS, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: T.stone };

  return (
    <>
      <header style={{ textAlign: "center", padding: "clamp(48px,7vw,90px) 24px clamp(28px,4vw,48px)" }}>
        <Eyebrow>We'd love to hear from you</Eyebrow>
        <Title>Get in <span style={{ fontStyle: "italic", color: T.gold }}>touch</span></Title>
        <p style={{ fontFamily: SANS, fontWeight: 300, color: T.mid, fontSize: 15, lineHeight: 1.7, maxWidth: 460, margin: "16px auto 0" }}>
          Questions about an order, a wholesale enquiry, or want to collaborate with our ateliers — write to us below.
        </p>
      </header>

      <section style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px clamp(64px,9vw,110px)" }}>
        {sent ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 22px", border: `1px solid ${T.gold}`,
              display: "flex", alignItems: "center", justifyContent: "center", color: T.gold, fontSize: 24 }}>✓</div>
            <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 22, color: T.ink }}>Thank you — we'll be in touch soon.</p>
            <div style={{ marginTop: 24 }}><Btn variant="ghost" onClick={() => router.push("/")}>Back to home</Btn></div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {apiError && <div style={{ background: "#fdecea", color: "#B0503E", padding: 12, fontSize: 13 }}>{apiError}</div>}
            <label>
              <span style={label}>Name</span>
              <input style={{ ...field, borderColor: err.name ? "#B0503E" : T.border }} value={f.name} onChange={set("name")} />
              {err.name && <span style={{ fontSize: 11, color: "#B0503E" }}>{err.name}</span>}
            </label>
            <label>
              <span style={label}>Email</span>
              <input type="email" style={{ ...field, borderColor: err.email ? "#B0503E" : T.border }} value={f.email} onChange={set("email")} />
              {err.email && <span style={{ fontSize: 11, color: "#B0503E" }}>{err.email}</span>}
            </label>
            <label>
              <span style={label}>Topic</span>
              <select style={field} value={f.topic} onChange={set("topic")}>
                {TOPICS.map(([id, l]) => <option key={id} value={id}>{l}</option>)}
              </select>
            </label>
            <label>
              <span style={label}>Message</span>
              <textarea style={{ ...field, minHeight: 130, borderColor: err.message ? "#B0503E" : T.border }} value={f.message} onChange={set("message")} />
              {err.message && <span style={{ fontSize: 11, color: "#B0503E" }}>{err.message}</span>}
            </label>
            <Btn full onClick={() => {}}>{sending ? "Sending…" : "Send message"}</Btn>
          </form>
        )}
      </section>

      {/* Studio / partner access — a quiet, discoverable entry point into the
          marketplace backend. The link itself is public; /admin is what's
          actually gated (by role + login), so an unauthenticated or non-admin
          visitor lands on /login or is redirected home rather than seeing anything. */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "28px 24px 60px", textAlign: "center" }}>
        <button
          onClick={() => router.push("/admin")}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: SANS, fontSize: 9,
            letterSpacing: 2.5, textTransform: "uppercase", color: T.stone, borderBottom: `1px solid ${T.border}`, paddingBottom: 3 }}
        >
          Studio &amp; Partner Access
        </button>
      </div>
    </>
  );
}
