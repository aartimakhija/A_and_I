import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shipping & Returns",
  description: "How A&I ships: dispatch timelines, pre-order timing, and our exchange-only policy — no cash refunds, ever.",
  path: "/shipping-returns",
});

const timelines = [
  { k: "In stock", v: "Dispatched within 3–5 working days of your order." },
  { k: "Pre-order", v: "Made once enough of you reserve — we email you the moment it's ready, no payment taken until then." },
  { k: "Bespoke", v: "Made to your measurements once fabric and fit are confirmed with the studio." },
];

const exchanges = [
  { k: "In-stock pieces", v: "Request an exchange from your account within 7 days of delivery, unworn with tags on. We'll exchange it for a different size once we receive it back — if that size has sold out, we issue a store credit instead. We don't offer cash refunds." },
  { k: "Pre-order pieces", v: "Exchangeable into another size while the run is still open, free of charge. Once cutting begins, the piece exists only for you and the same 7-day, size-only exchange window applies after delivery." },
  { k: "Bespoke pieces", v: "Made to your measurements, so once cutting begins they can't be exchanged for a different size — one round of alterations is included instead." },
  { k: "Anything faulty", v: "Tell us within 7 days with a photograph and we repair, remake, or issue a store credit — whichever gets you a piece that's right." },
];

export default function ShippingReturnsPage() {
  return (
    <>
      <section className="shell pb-14 pt-20">
        <p className="eyebrow">Shipping &amp; returns</p>
        <h1 className="display-xl mt-6">
          Made carefully, sent <span className="gold-italic">quickly.</span>
        </h1>
        <p className="mt-7 max-w-xl text-muted-foreground">
          Everything ships from our Ahmedabad studio by tracked courier, complimentary over
          ₹5,000. Here is exactly how long each route takes.
        </p>
      </section>

      <section className="shell pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {timelines.map((t) => (
            <div key={t.k} className="h-full border border-border bg-card p-8">
              <h2 className="display-md text-xl italic">{t.k}</h2>
              <p className="mt-4 text-sm text-muted-foreground">{t.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper text-paper-foreground">
        <div className="shell py-24">
          <p className="micro text-paper-muted">Where we ship</p>
          <h2 className="display-lg mt-6">
            Across <span className="italic text-accent">India.</span>
          </h2>
          <p className="mt-6 max-w-xl text-paper-muted">
            Tracked courier to every serviceable pincode in India, with tracking sent the day your
            order leaves the studio. Considering an address outside India? Write to us and we&apos;ll
            confirm what&apos;s possible before you order.
          </p>
        </div>
      </section>

      <section className="shell py-20">
        <h2 className="display-lg">Exchanges, honestly.</h2>
        <p className="mt-6 max-w-xl text-muted-foreground">
          We don&apos;t offer cash refunds, for any reason — but nothing here is
          final-sale-and-good-luck either. Every piece can be exchanged for a different size, or
          credited, within 7 days of delivery.
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {exchanges.map((r) => (
            <div key={r.k} className="border-t border-border pt-6">
              <h3 className="display-md text-xl italic">{r.k}</h3>
              <p className="mt-4 text-sm text-muted-foreground">{r.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="shell flex flex-wrap items-end justify-between gap-8 py-20">
          <div>
            <h2 className="display-md">Need to start an exchange?</h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Request it from your account with your order number and the piece — we'll confirm next
              steps by email.
            </p>
          </div>
          <div className="flex flex-wrap gap-5">
            <Link href="/account/orders" className="btn-solid-gold">
              Go to your orders
            </Link>
            <Link href="/faq" className="btn-outline-ink">
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
