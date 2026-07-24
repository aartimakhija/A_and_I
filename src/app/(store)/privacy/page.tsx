import { pageMetadata } from "@/lib/seo";
import { T, SANS, SERIF } from "@/components/storefront/theme";
import { Eyebrow, Title } from "@/components/storefront/primitives";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How A&I collects, uses, and protects your personal information.",
  path: "/privacy",
});

const h2: React.CSSProperties = { fontFamily: SERIF, fontStyle: "italic", fontSize: 21, color: T.ink, margin: "32px 0 10px" };
const p: React.CSSProperties = { fontFamily: SANS, fontWeight: 300, fontSize: 14.5, lineHeight: 1.8, color: T.mid, margin: "0 0 14px" };

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(48px,7vw,90px) 24px clamp(80px,10vw,120px)" }}>
      <Eyebrow>Legal</Eyebrow>
      <Title as="h1" size="clamp(28px,4vw,44px)" style={{ marginTop: 10, marginBottom: 8 }}>Privacy Policy</Title>
      <p style={{ ...p, fontSize: 12, color: T.stone }}>Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

      <div style={{ background: "#fdf6e8", border: "1px solid #e8d9a8", padding: 16, fontSize: 13, color: "#5a4a1a", marginBottom: 24 }}>
        This is a starting template, not final legal copy — have a lawyer review and customize it (data retention periods, your actual sub-processors, grievance-officer details for Indian IT Rules compliance, etc.) before relying on it in production.
      </div>

      <h2 style={h2}>What we collect</h2>
      <p style={p}>Account details (name, email, phone), shipping addresses, order history, and — if you use our Fit Quiz or wishlist — the preferences you share with us. If you sign in, we also store your session securely.</p>

      <h2 style={h2}>How we use it</h2>
      <p style={p}>To process orders and payments, communicate about your order (including via WhatsApp/SMS if you've engaged with us there), recommend sizes and pieces, and improve the site. We do not sell your personal data.</p>

      <h2 style={h2}>Payments</h2>
      <p style={p}>Payments are processed by Razorpay. We never see or store your full card details — Razorpay's hosted checkout handles that directly.</p>

      <h2 style={h2}>Cookies & local storage</h2>
      <p style={p}>We use browser storage to remember your bag and wishlist between visits, and essential cookies for keeping you signed in. We don't use third-party advertising trackers.</p>

      <h2 style={h2}>Your rights</h2>
      <p style={p}>You can request a copy of your data, ask us to correct it, or request deletion, by writing to us via our <a href="/contact" style={{ color: T.gold }}>Contact page</a>.</p>

      <h2 style={h2}>Contact</h2>
      <p style={p}>Questions about this policy can be sent through our <a href="/contact" style={{ color: T.gold }}>Contact page</a>.</p>
    </main>
  );
}
