import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { pageMetadata, founderPersonJsonLd, faqJsonLd, breadcrumbJsonLd, jsonLdHtml } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";
import { FaqAccordion } from "@/components/storefront/FaqAccordion";

// This page used to be split across /founder (bio, facts, operating
// philosophy) and /about (brand story, FAQ) — two pages telling the same
// "one founder, one point of view" idea twice. Merged into one page at
// /founder; /about now 301s here (see next.config.mjs).
export const metadata = pageMetadata({
  title: "The Founder — Artee Makhija",
  description: "A&I is founded and run by Artee Makhija in Ahmedabad — the story behind the label, in her own words, plus the nine years of founder's-office experience it draws on.",
  path: "/founder",
});

const FAQS = [
  { question: "Where are A&I pieces made?", answer: "Every piece is made in India, in small runs, by a specialist craft partner — never mass-produced." },
  { question: "What fabric is used?", answer: "Most current pieces are 100% washed linen, chosen for how cleanly it holds a laser-cut edge without fraying. A handful of pieces use silk or organza instead, and that's always stated plainly on that piece's own product page." },
  { question: "Do you restock sold-out pieces?", answer: "No — every piece is a limited run. Once it sells out, it's gone, though you can join the waitlist to be notified if a restock happens." },
  { question: "How do I know my size?", answer: "Take our two-minute Fit Quiz — no measuring tape needed — and we'll recommend a size across the whole collection." },
];

const facts = [
  { k: "Based in", v: "Ahmedabad, Gujarat" },
  { k: "Years of practice", v: "Nine, across eight organisations" },
  { k: "Ventures founded", v: "Two before A&I" },
  { k: "Languages", v: "English, Hindi, Gujarati, Sindhi, Punjabi, Urdu" },
];

const rooms = [
  { k: "Founder's office", v: "Nine years at the centre of founders' offices — sequencing priorities, writing the SOPs and running the reviews that keep a business honest with itself." },
  { k: "Brand & content", v: "More than twenty client shoots directed end to end, from brief to final cut, holding one standard across every image and caption." },
  { k: "Revenue & procurement", v: "Built a B2B sales function from zero to ₹82 Cr annual turnover with a team of twenty, and governed a ₹10 Cr+ procurement programme on the buying side." },
  { k: "A technical start", v: "A Bachelor's in Computer Science and an Android developer's first year — the habit of building systems never left." },
];

const method = [
  { n: "01", k: "Get the real picture", v: "Before anything is designed, know what the cloth can do, what the atelier can hold and which numbers are trustworthy." },
  { n: "02", k: "Sequence the priorities", v: "Not every piece can be urgent. The season is sequenced and written down, so the whole studio argues with the same list." },
  { n: "03", k: "Build the cadence", v: "Reviews, trackers and standards that a small team keeps running without being chased. Good operations should be quietly invisible." },
  { n: "04", k: "Close the loop", v: "Decisions documented, follow-through verified, learnings folded back in — so nothing has to be re-decided next season." },
];

const gates = [
  { k: "The idea holds", v: "It has a reason to exist beside everything else on the rail. If it repeats a piece we have, one of the two goes." },
  { k: "The cloth behaves", v: "Sampled, washed and worn before the run is sized. If the cloth fights the cut, the cut changes — not the cloth." },
  { k: "The atelier agrees", v: "The makers cost the hours honestly. If it cannot be made well in the time, the launch moves." },
];

export default async function FounderPage() {
  const [studioProduct, settings] = await Promise.all([
    prisma.product.findFirst({ where: { status: "ACTIVE" }, include: PRODUCT_INCLUDE, orderBy: { createdAt: "desc" }, skip: 1 }),
    getSiteSettings(),
  ]);
  const studioImage = studioProduct ? toSFProduct(studioProduct).images[0] : null;
  // Falls back to the photo shipped in /public until (or unless) the admin
  // uploads a different one via Settings, which still takes precedence.
  const founderImage = settings.founderImageUrl ?? "/founder-artee.jpg";
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(founderPersonJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Founder", path: "/founder" }])) }} />
      <section className="shell py-20">
        <p className="eyebrow">Our world</p>
        <h1 className="display-xl mt-6">
          One person <span className="gold-italic">answers for everything.</span>
        </h1>
        <p className="mt-7 max-w-xl text-muted-foreground">
          A&amp;I is founded and run by Artee Makhija. There is no committee here — every run is
          signed off by her, and when a piece is not ready it waits.
        </p>
      </section>

      <section className="shell pb-24">
        <div className="reveal grid items-start gap-12 lg:grid-cols-2">
          <div className="card-zoom relative aspect-square w-full overflow-hidden bg-secondary lg:sticky lg:top-24">
            {founderImage ? (
              <Image src={founderImage} alt="Artee Makhija, founder of A&I" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
                <span className="gold-italic text-6xl">AM</span>
              </div>
            )}
          </div>
          <div>
            <p className="eyebrow">In her own words</p>
            <h2 className="display-lg mt-5">
              <span className="gold-italic">Artee Makhija</span>
            </h2>

            <p className="mt-6 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
              I have always believed that clothes should make ordinary days feel a little more
              intentional.
            </p>
            <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
              I was twelve when I first became fascinated by fashion. I spent hours stitching,
              embroidering and inventing my own designs. I would look at a garment and immediately
              wonder what I could change — the silhouette, the colour, the detail, the way it could
              become something else.
            </p>
            <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
              Eventually, people started noticing.
              <br />
              <i>&ldquo;Where did you get that?&rdquo;</i>
              <br />
              I would tell them, <i>&ldquo;I designed it.&rdquo;</i>
              <br />
              Then they began asking me to design and customise pieces for them too.
              <br />
              I never outgrew that curiosity.
            </p>
            <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
              As I grew older and began searching for clothes for myself, I often found myself
              wanting something that was difficult to find — pieces that felt refined without
              feeling excessive, beautifully considered without feeling precious, and special
              enough to be remembered but easy enough to actually live in.
            </p>
            <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
              I kept returning to one simple truth:
              <br />
              We have 365 days to get dressed, not ten.
              <br />
              Looking and feeling considered shouldn&apos;t be reserved for parties.
              <br />
              So I built the house I could never find.
            </p>
            <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
              A&amp;I is a contemporary womenswear label created in small runs in India. We pay
              close attention to design, fabric, construction and finish — creating pieces that
              feel distinctive, refined and made to be lived in.
            </p>
            <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
              Every garment must earn its place.
              <br />
              It must feel good on the body.
              <br />
              It must be thoughtfully made.
              <br />
              And it must still feel right long after the first wear.
            </p>
            <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
              We believe in making less, making carefully, and creating pieces that can become
              part of a woman&apos;s real wardrobe — not just her special-occasion wardrobe.
            </p>
            <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
              I still design with the same curiosity I had as a girl.
              <br />
              Only now, the pieces leave my table and find their way into other women&apos;s lives.
              <br />
              This is A&amp;I.
            </p>
            <p className="mt-5 max-w-md font-display text-lg italic text-foreground">
              Clothes for the full year.
              <br />
              Made with care.
              <br />
              Meant to be lived in.
            </p>
            <p className="mt-5 max-w-md text-[15px] italic text-muted-foreground">
              — Artee Makhija
              <br />
              Founder &amp; Creative Director, A&amp;I
            </p>

            <dl className="mt-10 grid gap-6 border-t border-border pt-8 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.k}>
                  <dt className="micro text-primary">{f.k}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="shell pb-24">
        <h2 className="display-lg max-w-2xl">
          The rooms <span className="gold-italic">behind the label.</span>
        </h2>
        <p className="mt-6 max-w-xl text-muted-foreground">
          A&amp;I is a first collection, not a first job. Four areas of practice carry into how it is
          run.
        </p>
        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          {rooms.map((r) => (
            <div key={r.k} className="border-t border-border pt-6">
              <p className="micro text-primary">{r.k}</p>
              <p className="mt-3 text-sm text-muted-foreground">{r.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="shell grid gap-14 py-24 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="reveal card-zoom relative aspect-4/5 w-full bg-secondary">
            {studioImage && <Image src={studioImage} alt="A piece from the A&I studio" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />}
          </div>
          <div className="reveal" style={{ transitionDelay: "80ms" }}>
            <p className="eyebrow">How the work moves</p>
            <h2 className="display-lg mt-6">
              Four moves, <span className="gold-italic">in this order.</span>
            </h2>
            <dl className="mt-10 space-y-7 border-t border-border pt-8">
              {method.map((m) => (
                <div key={m.n}>
                  <dt className="micro text-primary">{m.n} — {m.k}</dt>
                  <dd className="mt-2 text-muted-foreground">{m.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="shell py-24">
        <h2 className="display-lg max-w-2xl">
          How a piece <span className="gold-italic">gets approved.</span>
        </h2>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Three gates, in this order. A piece that fails any one of them goes back to the table
          rather than onto the site.
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {gates.map((g) => (
            <div key={g.k} className="border-t border-border pt-6">
              <p className="micro text-primary">{g.k}</p>
              <p className="mt-3 text-sm text-muted-foreground">{g.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="shell max-w-3xl py-16 md:py-24">
          <div className="reveal mb-4 text-center">
            <span className="eyebrow">Before you ask</span>
            <h2 className="display-lg mt-5">The <span className="gold-italic">honest answers.</span></h2>
          </div>
          <div className="reveal mt-10" style={{ transitionDelay: "80ms" }}>
            <FaqAccordion faqs={FAQS} />
          </div>
        </div>
      </section>

      <section className="bg-paper text-paper-foreground">
        <div className="shell py-24">
          <h2 className="display-lg max-w-2xl">
            The one rule <span className="italic text-accent">she will not break.</span>
          </h2>
          <p className="mt-7 max-w-2xl text-paper-muted">
            No atelier is asked to work faster than the craft allows. Everything else — the season,
            the launch date, the size of the run — bends around that.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-8">
            <Link href="/craft" className="link-underline micro text-paper-foreground">
              See how it is made →
            </Link>
            <Link href="/shop/all" className="link-underline micro text-paper-foreground">
              Explore the collection →
            </Link>
            <a
              href="https://www.linkedin.com/in/artee-makhija-36316083/"
              target="_blank"
              rel="noreferrer"
              className="link-underline micro text-paper-foreground"
            >
              Artee on LinkedIn →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
