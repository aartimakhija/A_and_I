import Link from "next/link";
import Image from "next/image";
import { Marquee } from "@/components/site/Marquee";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { InstagramFeed } from "@/components/site/InstagramFeed";

/**
 * Sections 04–08 of the homepage flow, adapted to the "Architecture in
 * Linen" capsule (Persian girih cutwork) — the collection this narrative is
 * built around while it's in pre-production. Sections 01–03 (arrival, point
 * of view, collection) are composed ahead of this in app/(store)/page.tsx.
 *
 * These are shortlisted concept renders, not studio photography — the copy
 * below is written to be true to that (laser-cut + hand-finished by a craft
 * partner, pending production), not to claim a finished making-of that
 * hasn't happened yet.
 *
 * Restructured from an earlier 8-section version that repeated the same
 * "shortlisted, honest, laser-cut" points three separate times (a standalone
 * "idea to form" section immediately followed by an almost-identical
 * "concept to atelier" section, and a "difference" value-prop grid answered
 * a page later by a near-duplicate "quality & trust" grid). Nothing here is
 * new copy replacing verified facts — it's the same verified facts, told
 * once each instead of twice, so the page reads tighter without losing any
 * of the material/process/trust information it had before.
 *
 * The former "From idea to atelier" 5-photo process gallery (sketch / direction /
 * cut / finish / fit) was removed on direct request — it duplicated the same
 * making-of story already told on every product page (see ProductStory.tsx's
 * "The idea" / "The direction" sections) without adding anything the homepage
 * needed on top of that. Sections renumbered 04–08 accordingly.
 */

const IMG = "/uploads/products";
const flagshipBase = "1790000000000-architecture-in-linen-look-01-asymmetric-one-shoulder-girih-cutwork-gown";
const flagship = {
  name: "Asymmetric One-Shoulder Girih Cutwork Gown",
  slug: "architecture-in-linen-look-01-asymmetric-one-shoulder-girih-cutwork-gown",
  image: `${IMG}/${flagshipBase}-0.jpg`,
  sketchImage: `${IMG}/${flagshipBase}-sketch.jpg`,
  fabricImage: `${IMG}/${flagshipBase}-fabric.jpg`,
};

// The full pipeline in one sequence — was two separate sections (a 3-step
// "idea to form" and a 4-step "concept to atelier") that shared the same
// story arc. Told once, as five steps from sketch to finished fit.
const materialFacts = [
  { k: "Why this fabric", v: "Mostly 100% washed linen, chosen for how it holds a laser-cut edge without fraying — a handful of pieces use silk or organza instead, always stated on their own page." },
  { k: "How the cutwork is made", v: "Precision laser-cut by a specialist craft partner, then hand-finished at every edge so the pattern holds its shape wear after wear." },
  { k: "What the colour does", v: "A diagonal colour-block seam sets a rust or teal panel against the base linen — the girih motif reads differently across each half." },
  { k: "Where this stands today", v: "Shortlisted from a capsule of forty looks. We're sharing the designs ahead of production so the pieces people want most get made first." },
];

// Merged from two nearly-identical four-item lists ("The A&I difference"
// and "Quality & trust") into one de-duplicated set of five — each point
// kept once, at its clearest phrasing.
const valueProps = [
  { k: "Pattern with purpose", v: "Every cutwork motif starts from a real geometric tradition, not a printed stand-in." },
  { k: "Material with reason", v: "Linen and silk are chosen for how they hold a laser-cut edge, not just for how they drape." },
  { k: "Made once it's wanted", v: "Shortlisted first, produced once enough of you reserve — nothing is made on spec." },
  { k: "Honest about the stage", v: "We tell you plainly when a piece is a concept render versus a finished garment." },
  { k: "Full transparency", v: "Clear sizing, delivery, returns and support information on every product page." },
];

const whyWeExist = [
  { k: "The observation", v: "Girih tiling has shaped architecture for centuries but rarely appears in clothing at this scale — most of what exists is printed, not cut." },
  { k: "The belief", v: "A geometric pattern earns its place on a garment when it's cut into the cloth itself, not laid over it." },
  { k: "The intention", v: "A small, shortlisted capsule — Architecture in Linen — built to find out which of these forty ideas deserves to be made." },
];

const instagramTiles = [
  { src: flagship.image, alt: "Asymmetric one-shoulder girih cutwork gown" },
  { src: `${IMG}/1790000000001-architecture-in-linen-look-02-sculptural-halterneck-girih-backless-midi-dress-0.jpg`, alt: "Sculptural halterneck girih backless midi dress" },
  { src: `${IMG}/1790000000002-architecture-in-linen-look-06-sculptural-wide-leg-girih-linen-jumpsuit-0.jpg`, alt: "Sculptural wide-leg girih linen jumpsuit" },
  { src: `${IMG}/1790000000037-architecture-in-linen-look-123-bauhaus-grid-cutwork-jumpsuit-0.jpg`, alt: "Bauhaus grid cutwork jumpsuit" },
  { src: `${IMG}/1790000000023-architecture-in-linen-look-64-peach-line-print-cropped-blazer-slit-skirt-co-ord-0.jpg`, alt: "Peach line-print cropped blazer and slit skirt co-ord" },
  { src: `${IMG}/1790000000027-architecture-in-linen-look-72-marigold-line-print-blazer-dress-0.jpg`, alt: "Marigold line-print blazer dress" },
];

export function HomeFlow() {
  return (
    <>
      <Marquee items={["Girih geometry", "Laser-cut linen", "Hand-finished edges", "Shortlisted capsule", "A&I"]} />

      {/* 04 — MATERIAL AS DESIGN */}
      <section className="border-y border-border bg-card">
        <div className="shell py-24">
          <div className="reveal">
            <div className="flex items-center gap-6">
              <span className="display-md text-2xl italic text-primary">04</span>
              <span className="h-px flex-1 bg-border" />
              <span className="micro text-muted-foreground">Material as design</span>
            </div>
            <h2 className="display-lg mt-8 max-w-3xl">
              Material is part of <span className="gold-italic">the design.</span>
            </h2>
          </div>
          <div className="mt-14 grid items-start gap-14 lg:grid-cols-2">
            <div className="reveal">
              <div className="card-zoom relative aspect-4/3 w-full bg-secondary">
                <Image src={flagship.fabricImage} alt="Macro close-up of the laser-cut girih cutwork fabric" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
              <p className="micro mt-6 text-muted-foreground">Material → design → body</p>
            </div>
            <div className="reveal" style={{ transitionDelay: "80ms" }}>
              <dl className="divide-y divide-border border-y border-border">
                {materialFacts.map((f) => (
                  <div key={f.k} className="py-5">
                    <dt className="micro text-primary">{f.k}</dt>
                    <dd className="mt-2 text-sm text-muted-foreground">{f.v}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/shop/all" className="link-underline micro tap-scale mt-8 inline-block">
                See every shortlisted look →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — THE A&I DIFFERENCE */}
      <section className="shell py-24">
        <div className="reveal">
          <div className="flex items-center gap-6">
            <span className="display-md text-2xl italic text-primary">05</span>
            <span className="h-px flex-1 bg-border" />
            <span className="micro text-muted-foreground">The A&amp;I difference</span>
          </div>
          <h2 className="display-lg mt-8 max-w-3xl">
            Made <span className="gold-italic">differently.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            We believe the difference is in what you consider before the piece is finished.
          </p>
        </div>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 md:grid-cols-5">
          {valueProps.map((d, i) => (
            <div key={d.k} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="border-t border-border pt-6">
                <p className="micro text-primary">{d.k}</p>
                <p className="mt-3 text-sm text-muted-foreground">{d.v}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="reveal">
          <p className="display-md mt-16 italic">A piece should have a reason to exist.</p>
          <Link href="/about" className="link-underline micro tap-scale mt-8 inline-block">
            See what makes a piece A&amp;I →
          </Link>
        </div>
        <div className="reveal">
          <div className="mt-20 border-t border-border pt-12">
            <h3 className="display-md">A&amp;I, in the world.</h3>
            <p className="mt-5 max-w-2xl text-muted-foreground">
              We are a young label, so we would rather show you nothing than show you borrowed
              credibility. As reviews, customer photographs, stockists and press become real, they
              will appear here — named, dated and verifiable.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-8">
              <Link href="/press" className="link-underline micro tap-scale">Press &amp; stockist enquiries →</Link>
              <Link href="/shipping-returns" className="link-underline micro tap-scale">Delivery &amp; returns →</Link>
              <Link href="/size-fit" className="link-underline micro tap-scale">Size &amp; fit →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — WHY THIS CAPSULE EXISTS */}
      <section className="border-y border-border bg-card">
        <div className="shell grid gap-14 py-24 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="reveal">
            <div className="card-zoom relative aspect-4/5 w-full bg-secondary">
              <Image
                src={`${IMG}/1790000000037-architecture-in-linen-look-123-bauhaus-grid-cutwork-jumpsuit-0.jpg`}
                alt="Design reference render from the Architecture in Linen capsule"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="reveal" style={{ transitionDelay: "80ms" }}>
            <div className="flex items-center gap-6">
              <span className="display-md text-2xl italic text-primary">06</span>
              <span className="h-px flex-1 bg-border" />
              <span className="micro text-muted-foreground">Why this capsule exists</span>
            </div>
            <h2 className="display-lg mt-8">
              Why Architecture in Linen <span className="gold-italic">exists.</span>
            </h2>
            <dl className="mt-10 space-y-7 border-t border-border pt-8">
              {whyWeExist.map((w) => (
                <div key={w.k}>
                  <dt className="micro text-primary">{w.k}</dt>
                  <dd className="mt-2 text-muted-foreground">{w.v}</dd>
                </div>
              ))}
            </dl>
            <blockquote className="display-md mt-12 max-w-xl italic">
              "A pattern this old deserves to be cut into cloth, not printed on it."
              <footer className="micro mt-5 not-italic text-muted-foreground">Artee Makhija, founder of A&amp;I</footer>
            </blockquote>
            <Link href="/founder" className="link-underline micro tap-scale mt-8 inline-block">
              Read the founder&apos;s story →
            </Link>
          </div>
        </div>
      </section>

      {/* 07 — THE A&I WORLD */}
      <section className="bg-paper text-paper-foreground">
        <div className="shell py-24">
          <div className="reveal">
            <div className="flex items-center gap-6">
              <span className="display-md text-2xl italic text-accent">07</span>
              <span className="h-px flex-1 bg-paper-foreground/15" />
              <span className="micro text-paper-muted">The A&amp;I world</span>
            </div>
            <h2 className="display-lg mt-8 max-w-3xl">
              Enter the world <span className="italic text-accent">of A&amp;I.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-paper-muted">
              Beyond the clothes: what we write, how the season looks, who is behind it and where it
              is made. A few rooms, each a way in.
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {[
              { href: "/blog", kicker: "Reading", label: "The journal", body: "Stories, ideas and conversations from inside the studio.", cta: "Read the journal", image: `${IMG}/1790000000023-architecture-in-linen-look-64-peach-line-print-cropped-blazer-slit-skirt-co-ord-0.jpg` },
              { href: "/lookbook", kicker: "Looking", label: "The lookbook", body: "The capsule styled and shown as a full season.", cta: "View the lookbook", image: `${IMG}/1790000000025-architecture-in-linen-look-69-lavender-line-print-tuxedo-blazer-jumpsuit-0.jpg` },
              { href: "/founder", kicker: "People", label: "The founder", body: "Artee Makhija on the point of view behind every piece.", cta: "Meet Artee", image: `${IMG}/1790000000027-architecture-in-linen-look-72-marigold-line-print-blazer-dress-0.jpg` },
              { href: "/visit", kicker: "Places", label: "The studio", body: "Where the pieces are drawn, fitted and shortlisted.", cta: "Plan a visit", image: `${IMG}/1790000000029-architecture-in-linen-look-79-tangerine-line-print-cape-sleeve-blazer-high-rise-shorts-0.jpg` },
            ].map((t, i) => (
              <Link key={t.label} href={t.href} className="reveal tap-scale group block focus-visible:outline-none" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="relative overflow-hidden">
                  <div className="relative aspect-4/3 w-full">
                    <Image
                      src={t.image}
                      alt={t.label}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                  <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-6 bottom-6">
                    <p className="micro text-white/70">{t.kicker}</p>
                    <p className="display-md mt-1 text-2xl text-white">{t.label}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm text-paper-muted">{t.body}</p>
                <p className="micro mt-3 text-accent group-hover:italic">{t.cta} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — FIND YOURS / CLOSING */}
      <section className="grain relative overflow-hidden border-t border-border">
        <div className="absolute inset-0">
          <Image
            src={`${IMG}/1790000000031-architecture-in-linen-look-101-girih-cutwork-vest-sarong-skirt-0.jpg`}
            alt="Design reference render from the Architecture in Linen capsule, in quiet light"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/40" />
        <div className="shell relative flex flex-col justify-end py-24">
          <div className="reveal-scale">
            <p className="display-lg max-w-3xl">
              A piece should have <span className="gold-italic">a reason to exist.</span>
            </p>
            <p className="mt-6 max-w-xl text-muted-foreground">
              From the first thought to the final stitch, every decision should serve the piece.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <Link href="/shop/all" className="btn-solid-gold">Explore the collection →</Link>
              <Link href="/bespoke" className="btn-outline-ink">Reserve a piece →</Link>
            </div>
          </div>
          <div className="reveal mt-14 max-w-xl border-t border-border pt-10" style={{ transitionDelay: "80ms" }}>
            <h3 className="display-md">Stay close to A&amp;I.</h3>
            <p className="mt-4 text-muted-foreground">
              New pieces, stories, materials and things we&apos;re exploring — shared occasionally.
            </p>
            <div className="mt-7">
              <NewsletterForm source="homepage-closing" />
            </div>
          </div>
          <div className="reveal mt-16 border-t border-border pt-10" style={{ transitionDelay: "120ms" }}>
            <InstagramFeed tiles={instagramTiles} handle="@arteeandi" profileUrl="https://www.instagram.com/arteeandi/" />
          </div>
        </div>
      </section>
    </>
  );
}
