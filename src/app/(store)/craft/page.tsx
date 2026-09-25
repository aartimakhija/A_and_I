import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "The Craft — Laser-Cut Girih, Bauhaus & Moorish Cutwork",
  description: "How Architecture in Linen is actually made: girih geometry drawn by hand, laser-cut for precision, then finished edge by edge.",
  path: "/craft",
});

// Replaces an earlier version of this page describing bandhani, mirror-work
// and zari — techniques from a prior collection that isn't part of the
// current catalogue. Every technique below is one the live "Architecture in
// Linen" capsule actually uses (see scripts/seed-blog.ts and the product
// pages themselves for the same facts, verified against the live catalogue).
const TECHNIQUES = [
  {
    name: "Girih cutwork",
    eyebrow: "Architecture in Linen · Laser-cut",
    text: "The girih grid — the interlocking star-and-polygon tiling found in centuries-old Islamic tilework — is drawn to each garment's own pattern pieces before a single cut is made, then laser-cut by a specialist craft partner so the geometry stays exact.",
    tell: "Look close at the repeat: it's drawn to fit this exact panel, not a stock pattern trimmed to size.",
  },
  {
    name: "Hand-finished edges",
    eyebrow: "Every piece · Bound by hand",
    text: "A laser-cut edge in linen would fray without help. Every cut edge is hand-bound once the pattern is cut, so the open geometry holds its shape wear after wear instead of coming apart at the edge.",
    tell: "Run a finger along a cut edge — it should feel finished and bound, not raw or fibrous.",
  },
  {
    name: "Four design languages, one technique",
    eyebrow: "Girih · Bauhaus · Moorish muqarnas · Art Nouveau",
    text: "The same laser-cut technique carries four real design traditions across the capsule — Persian girih tiling, the honeycomb muqarnas vaulting of Moorish architecture, Bauhaus's reduction to grid and right angle, and Art Nouveau's flowing vine line work.",
    tell: "Compare two pieces side by side — the cut technique is identical, but the geometry it's tracing is different each time.",
  },
];

export default async function CraftPage() {
  const craftProducts = await prisma.product.findMany({
    where: { status: "ACTIVE", category: "craft" },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  const images = craftProducts.map((p) => toSFProduct(p).images[0]).filter(Boolean) as string[];

  return (
    <>
      <section className="shell py-20">
        <p className="eyebrow">Our world</p>
        <h1 className="display-xl mt-6">
          The craft <span className="gold-italic">behind the cut.</span>
        </h1>
        <p className="mt-7 max-w-xl text-muted-foreground">
          One technique, four design languages, and a couple of things to check with your own hands.
        </p>
      </section>

      <section className="shell space-y-20 pb-24">
        {TECHNIQUES.map((t, i) => (
          <div key={t.name} className={`reveal grid items-center gap-12 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className="card-zoom relative aspect-4/5 w-full bg-secondary">
              {images[i] && (
                <Image src={images[i]} alt={`${t.name}, up close on an Architecture in Linen piece`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              )}
            </div>
            <div>
              <p className="eyebrow">{t.eyebrow}</p>
              <h2 className="display-lg mt-5">
                <span className="gold-italic">{t.name}</span>
              </h2>
              <p className="mt-6 text-muted-foreground">{t.text}</p>
              <p className="mt-5 border-l border-primary pl-5 text-sm text-muted-foreground">
                <span className="micro text-primary">How to tell</span>
                <br />
                {t.tell}
              </p>
              <Link href="/shop/all" className="link-underline micro tap-scale mt-8 inline-block">
                See the capsule →
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-paper text-paper-foreground">
        <div className="shell grid items-center gap-14 py-24 lg:grid-cols-2">
          <div className="reveal card-zoom relative aspect-4/5 w-full bg-paper-foreground/10">
            {images[3] && (
              <Image src={images[3]} alt="A finished A&I craft piece" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            )}
          </div>
          <div className="reveal" style={{ transitionDelay: "80ms" }}>
            <h2 className="display-lg">
              Then it is <span className="italic text-accent">finished by hand.</span>
            </h2>
            <p className="mt-6 text-paper-muted">
              Our finishing team rolls every hem, sets every button and hand-binds every cut edge.
              The last centimetre decides how a garment falls, so we refuse to give it to a machine.
            </p>
            <Link href="/blog" className="link-underline micro tap-scale mt-9 inline-block text-paper-foreground">
              Read more from the journal
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
