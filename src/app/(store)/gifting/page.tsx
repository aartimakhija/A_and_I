import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/lib/seo";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { ProductCard } from "@/components/site/ProductCard";

export const metadata = pageMetadata({
  title: "Gifting — Reserved With Care, Wrapped by Hand",
  description: "Gift an A&I piece: reserve a shortlisted design, no payment up front, hand-wrapped once it ships, with easy size exchanges.",
  path: "/gifting",
});

// Every current piece is a shortlisted, pre-order design rather than
// something sitting in stock — this used to promise a 3-5 day dispatch
// that nothing in the live catalogue can actually honour, and its product
// showcase (below) silently rendered empty because the query only asked
// for in-stock pieces. Rewritten to describe gifting the way pre-order
// actually works here, and the query now pulls from the real catalogue.
const steps = [
  { n: "01", k: "Choose a piece", v: "Reserve any shortlisted design as a gift — no payment up front, just a size." },
  { n: "02", k: "We tell you when it ships", v: "The run opens once there's enough interest, the same as any pre-order — we email the moment it's ready." },
  { n: "03", k: "We wrap by hand", v: "Folded in unbleached cotton, tied and sealed in marigold paper. No price anywhere in the box." },
  { n: "04", k: "They swap sizes freely", v: "Any gifted piece can be exchanged into another size within 7 days of delivery." },
];

const occasions = [
  { k: "Weddings", v: "Mehndi to reception, for the bride and everyone standing near her." },
  { k: "Milestones", v: "A first job, a fortieth, a house — a piece that lasts longer than flowers." },
  { k: "Festivals", v: "Diwali and Eid, ordered early because the ateliers fill up fast." },
  { k: "Just because", v: "The everyday linen pieces, which get worn far more than the grand ones." },
];

export default async function GiftingPage() {
  const raw = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: PRODUCT_INCLUDE,
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  const giftable = raw.map(toSFProduct);

  return (
    <>
      <section className="shell py-20">
        <p className="eyebrow">Gifting</p>
        <h1 className="display-xl mt-6">
          Something with <span className="gold-italic">hours in it.</span>
        </h1>
        <p className="mt-7 max-w-lg text-muted-foreground">
          Hand-finished pieces, reserved with no payment up front, wrapped without a price in sight
          once they ship, and exchangeable if you guessed the size wrong. No plastic gift card, no
          rush job.
        </p>
      </section>

      <section className="shell py-16">
        <h2 className="display-lg">How gifting works.</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="border-t border-border pt-6">
              <p className="micro text-primary">{s.n}</p>
              <h3 className="display-md mt-3 text-xl italic">{s.k}</h3>
              <p className="mt-4 text-sm text-muted-foreground">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      {giftable.length > 0 && (
        <section className="border-y border-border bg-card">
          <div className="shell py-20">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="eyebrow">Reserve as a gift</p>
                <h2 className="display-lg mt-5">Gift these.</h2>
              </div>
              <Link href="/shop/all" className="link-underline micro tap-scale text-muted-foreground">
                See the full capsule
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {giftable.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-paper text-paper-foreground">
        <div className="shell py-24">
          <p className="micro text-paper-muted">What people gift</p>
          <h2 className="display-lg mt-6 max-w-2xl">
            For the weeks that <span className="italic text-accent">get photographed.</span>
          </h2>
          <dl className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {occasions.map((o) => (
              <div key={o.k} className="border-t border-paper-foreground/20 pt-6">
                <dt className="display-md text-xl italic">{o.k}</dt>
                <dd className="mt-4 text-sm text-paper-muted">{o.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="shell flex flex-wrap items-end justify-between gap-8 py-20">
        <div>
          <h2 className="display-md">Gifting more than one piece?</h2>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            For bridal parties and corporate gifting we quote per piece and hold sizes. Tell us the
            headcount and the date.
          </p>
        </div>
        <div className="flex flex-wrap gap-5">
          <Link href="/contact" className="btn-solid-gold">
            Talk to the studio
          </Link>
          <Link href="/size-fit" className="btn-outline-ink">
            Size &amp; fit guide
          </Link>
        </div>
      </section>
    </>
  );
}
