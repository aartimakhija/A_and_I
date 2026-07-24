import { pageMetadata } from "@/lib/seo";
import { T, SANS, SERIF } from "@/components/storefront/theme";
import { Eyebrow, Title } from "@/components/storefront/primitives";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms that govern your use of the A&I website and purchases.",
  path: "/terms",
});

const h2: React.CSSProperties = { fontFamily: SERIF, fontStyle: "italic", fontSize: 21, color: T.ink, margin: "32px 0 10px" };
const p: React.CSSProperties = { fontFamily: SANS, fontWeight: 300, fontSize: 14.5, lineHeight: 1.8, color: T.mid, margin: "0 0 14px" };

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(48px,7vw,90px) 24px clamp(80px,10vw,120px)" }}>
      <Eyebrow>Legal</Eyebrow>
      <Title as="h1" size="clamp(28px,4vw,44px)" style={{ marginTop: 10, marginBottom: 8 }}>Terms of Service</Title>
      <p style={{ ...p, fontSize: 12, color: T.stone }}>Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

      <div style={{ background: "#fdf6e8", border: "1px solid #e8d9a8", padding: 16, fontSize: 13, color: "#5a4a1a", marginBottom: 24 }}>
        This is a starting template, not final legal copy — have a lawyer review it (your actual entity name/registration, jurisdiction, dispute-resolution process, and consumer-protection obligations) before relying on it in production.
      </div>

      <h2 style={h2}>Orders & pricing</h2>
      <p style={p}>All prices are in INR and inclusive of applicable taxes unless stated otherwise. We re-verify pricing and stock at checkout — an order is only confirmed once payment is captured.</p>

      <h2 style={h2}>Pre-orders</h2>
      <p style={p}>Pieces marked for pre-order are made only once enough interest is confirmed. No payment is taken for a pre-order reservation; we'll contact you once it moves into production.</p>

      <h2 style={h2}>Shipping & delivery</h2>
      <p style={p}>Orders are dispatched within 3–5 business days of confirmation, free of charge over ₹5,000. Delivery timeframes vary by location and are estimates, not guarantees.</p>

      <h2 style={h2}>Returns & refunds</h2>
      <p style={p}>Returns can be requested from your account once an order has shipped. Approved returns are refunded to the original payment method once the item is received back with us.</p>

      <h2 style={h2}>Referral codes</h2>
      <p style={p}>Referral discounts apply to a customer's first order only and cannot be combined with other offers. We reserve the right to void codes used in violation of these terms.</p>

      <h2 style={h2}>Intellectual property</h2>
      <p style={p}>All designs, photography, and content on this site belong to A&I or our atelier partners and may not be reproduced without permission.</p>

      <h2 style={h2}>Contact</h2>
      <p style={p}>Questions about these terms can be sent through our <a href="/contact" style={{ color: T.gold }}>Contact page</a>.</p>
    </main>
  );
}
