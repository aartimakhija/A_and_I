import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms that govern your use of the A&I website and purchases.",
  path: "/terms",
});

const sections = [
  {
    t: "This is a starting template",
    body: [
      "Not final legal copy — have a lawyer review it (your actual entity name and registration, jurisdiction, dispute-resolution process, and consumer-protection obligations) before relying on it in production.",
    ],
  },
  {
    t: "Orders & pricing",
    body: [
      "All prices are in INR and inclusive of applicable taxes unless stated otherwise.",
      "We re-verify pricing and stock at checkout — an order is only confirmed once payment is captured.",
    ],
  },
  {
    t: "Pre-orders",
    body: [
      "Pieces marked for pre-order are made only once enough interest is confirmed. No payment is taken for a pre-order reservation; we'll contact you once it moves into production.",
    ],
  },
  {
    t: "Shipping & delivery",
    body: [
      "Orders are dispatched within 3–5 business days of confirmation, free of charge over ₹5,000.",
      "Delivery timeframes vary by location and are estimates, not guarantees.",
    ],
  },
  {
    t: "Returns & refunds",
    body: [
      "Returns can be requested from your account once an order has shipped.",
      "Approved returns are refunded to the original payment method once the item is received back with us.",
    ],
  },
  {
    t: "Referral codes",
    body: [
      "Referral discounts apply to a customer's first order only and cannot be combined with other offers.",
      "We reserve the right to void codes used in violation of these terms.",
    ],
  },
  {
    t: "Intellectual property",
    body: [
      "All designs, photography, and content on this site belong to A&I or our atelier partners and may not be reproduced without permission.",
    ],
  },
];

const lastUpdated = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function TermsPage() {
  return (
    <>
      <section className="shell pb-12 pt-20">
        <p className="eyebrow">Legal</p>
        <h1 className="display-xl mt-6">
          Terms, <span className="gold-italic">without the fog.</span>
        </h1>
        <p className="mt-7 max-w-xl text-muted-foreground">
          The terms that govern your use of the A&amp;I website and purchases. Last updated {lastUpdated}.
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
            <p className="micro text-paper-muted">Before you check out</p>
            <h2 className="display-lg mt-5">
              Ask us <span className="italic text-accent">anything.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-5">
            <Link href="/contact" className="btn-solid-gold">
              Contact us
            </Link>
            <Link href="/privacy" className="btn-outline-ink text-paper-foreground">
              Read the privacy policy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
