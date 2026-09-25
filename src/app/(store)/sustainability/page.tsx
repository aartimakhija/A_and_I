import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Responsibility — Small Runs, Named Hands",
  description: "How A&I makes: small runs, natural fibres, named ateliers, and the things we haven't solved yet.",
  path: "/sustainability",
});

const commitments = [
  { n: "01", t: "Mostly made after you order", d: "Most pieces are made once ordered rather than speculatively — a run opens, we count the interest, we make that many. Select pieces are kept in stock for faster dispatch." },
  { n: "02", t: "Small runs", d: "Run sizes are set by the hours an atelier has, not by a forecast. When the hours run out, the run closes." },
  { n: "03", t: "Natural fibres, by default", d: "Washed linen is the current default, chosen for how it holds a laser-cut edge. No polyester linings, no plastic sequins, ever." },
  { n: "04", t: "The same hands, repeatedly", d: "A small group of makers works with Artee season after season, paid per piece at rates agreed before the season opens rather than squeezed at the end of it." },
];

const honest = [
  { q: "Shipping", a: "Pieces travel by courier across India. We consolidate dispatches rather than sending single parcels daily, which is mitigation, not absolution." },
  { q: "Packaging", a: "Cotton bag, recycled board, paper tape. The courier's own label is plastic and we have not found a way around it." },
  { q: "Water", a: "Dyeing and finishing use a great deal of water. We reuse dye baths where the shade allows it, but we do not yet measure our usage well enough to publish an honest number — so we will not publish one." },
];

// Replaces an earlier three-tier list (linen / handloom cotton / hand
// embroidery) that described a prior collection. The current catalogue is a
// single material — washed linen — so this is three honest facts about that
// one fabric rather than three different fabrics that aren't actually sold.
const materials = [
  { t: "Washed linen", d: "100% linen, pre-washed so what you receive is the size and softness it will stay — chosen because it holds a laser-cut edge without fraying.", life: "Hand-wash cold · dry flat in shade" },
  { t: "Why it breathes", d: "Flax fibre is naturally hollow, which is part of why linen has stayed a warm-climate staple for thousands of years.", life: "Worth wearing closer to skin than you'd expect" },
  { t: "How it ages", d: "Linen creases by nature and softens with every wash — a sign of a natural fibre being worn, not a laundering failure.", life: "Gets better, not worse, with wear" },
];

export default async function SustainabilityPage() {
  const linenProduct = await prisma.product.findFirst({ where: { status: "ACTIVE", category: "linen" }, include: PRODUCT_INCLUDE, orderBy: { createdAt: "desc" } });
  const linenImage = linenProduct ? toSFProduct(linenProduct).images[0] : null;
  return (
    <>
      <section className="shell py-20">
        <p className="eyebrow">Our world</p>
        <h1 className="display-xl mt-6">
          Fewer things, <span className="gold-italic">made properly.</span>
        </h1>
        <p className="mt-7 max-w-xl text-muted-foreground">
          We are a small studio, not a certified anything. Here is exactly how we make, and the
          parts we haven&apos;t solved.
        </p>
      </section>

      <section className="shell grid gap-12 pb-24 md:grid-cols-2">
        {commitments.map((c) => (
          <div key={c.n} className="border-t border-border pt-7">
            <p className="font-[family-name:var(--font-display)] text-4xl italic text-primary">{c.n}</p>
            <h2 className="display-md mt-4 text-xl">{c.t}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </section>

      <section className="bg-paper text-paper-foreground">
        <div className="shell grid items-center gap-14 py-24 lg:grid-cols-[1fr_1.1fr]">
          <div className="reveal card-zoom relative aspect-4/5 w-full bg-paper-foreground/10">
            {linenImage && <Image src={linenImage} alt="A natural-fibre piece from the A&I collection" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />}
          </div>
          <div className="reveal" style={{ transitionDelay: "80ms" }}>
            <h2 className="display-lg">
              What we <span className="italic text-accent">haven&apos;t fixed.</span>
            </h2>
            <dl className="mt-10 divide-y divide-paper-muted/25 border-y border-paper-muted/25">
              {honest.map((h) => (
                <div key={h.q} className="py-6">
                  <dt className="micro">{h.q}</dt>
                  <dd className="mt-2 text-sm text-paper-muted">{h.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="shell border-t border-border py-20">
        <p className="eyebrow">Material</p>
        <h2 className="display-lg mt-6 max-w-2xl">
          One cloth, <span className="gold-italic">chosen for wear.</span>
        </h2>
        <dl className="mt-12 grid gap-10 md:grid-cols-3">
          {materials.map((m) => (
            <div key={m.t} className="border-t border-border pt-6">
              <dt className="display-md text-lg">{m.t}</dt>
              <dd className="mt-3 text-sm text-muted-foreground">{m.d}</dd>
              <p className="micro mt-4 text-primary">{m.life}</p>
            </div>
          ))}
        </dl>
        <p className="mt-12 max-w-2xl text-sm text-muted-foreground">
          Making mostly after you order has one real environmental advantage and it is not a
          certificate: we rarely make a piece nobody asked for. Everything else on this page is us
          trying to be honest about the rest.
        </p>
      </section>

      <section className="bg-secondary">
        <div className="shell flex flex-wrap items-center justify-between gap-8 py-20">
          <h2 className="display-lg max-w-lg">
            Buy one thing <span className="gold-italic">you&apos;ll keep.</span>
          </h2>
          <Link href="/shop/all" className="btn-solid-gold">
            Explore the collection
          </Link>
        </div>
      </section>
    </>
  );
}
