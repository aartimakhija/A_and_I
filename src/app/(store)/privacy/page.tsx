import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How A&I collects, uses, and protects your personal information.",
  path: "/privacy",
});

const sections = [
  {
    t: "Who we are",
    body: [
      "A&I is a womenswear label run by Artee Makhija, working with specialist makers and ateliers across India. When this policy says we, us or the studio, it means A&I.",
      "This is a starting template, not final legal copy — have a lawyer review and customize it (data retention periods, your actual sub-processors, grievance-officer details for Indian IT Rules compliance, etc.) before relying on it in production.",
    ],
  },
  {
    t: "What we collect",
    body: [
      "Account details (name, email, phone), shipping addresses and order history.",
      "If you use the Fit Quiz or wishlist, the preferences you share with us. If you sign in, we also store your session securely.",
    ],
  },
  {
    t: "How we use it",
    body: [
      "To process orders and payments, communicate about your order (including via WhatsApp or SMS if you've engaged with us there), recommend sizes and pieces, and improve the site.",
      "We do not sell your personal data.",
    ],
  },
  {
    t: "Payments",
    body: [
      "Payments are processed by Razorpay. We never see or store your full card details — Razorpay's hosted checkout handles that directly.",
    ],
  },
  {
    t: "Cookies & local storage",
    body: [
      "We use browser storage to remember your bag and wishlist between visits, and essential cookies for keeping you signed in.",
      "We don't use third-party advertising trackers.",
    ],
  },
  {
    t: "Your rights",
    body: [
      "You can request a copy of your data, ask us to correct it, or request deletion, by writing to us via our Contact page.",
    ],
  },
];

const lastUpdated = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function PrivacyPage() {
  return (
    <>
      <section className="shell pb-12 pt-20">
        <p className="eyebrow">Legal</p>
        <h1 className="display-xl mt-6">
          Privacy, <span className="gold-italic">plainly.</span>
        </h1>
        <p className="mt-7 max-w-xl text-muted-foreground">
          What A&amp;I collects when you shop with us, why we collect it, and how to have it
          corrected or deleted. Last updated {lastUpdated}.
        </p>
      </section>

      <section className="shell pb-20">
        <dl className="max-w-3xl divide-y divide-border border-y border-border">
          {sections.map((s) => (
            <div key={s.t} className="grid gap-3 py-9 sm:grid-cols-[14rem_1fr]">
              <dt className="micro text-primary">{s.t}</dt>
              <dd className="space-y-4 text-sm text-muted-foreground">
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-paper text-paper-foreground">
        <div className="shell flex flex-wrap items-end justify-between gap-8 py-20">
          <div>
            <p className="micro text-paper-muted">Any question about your details</p>
            <h2 className="display-lg mt-5">
              Ask, and we <span className="italic text-accent">answer.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-5">
            <Link href="/contact" className="btn-solid-gold">
              Contact us
            </Link>
            <Link href="/terms" className="btn-outline-ink text-paper-foreground">
              Read the terms
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
