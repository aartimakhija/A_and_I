import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "The Founder — Artee Makhija",
  description: "A&I is founded and run by Artee Makhija in Ahmedabad. Nine years across founder's offices, brand direction, sales and procurement — now one rail, one standard.",
  path: "/founder",
});

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

export default function FounderPage() {
  return (
    <>
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
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="aspect-square w-full bg-secondary" aria-hidden="true" />
          <div>
            <p className="eyebrow">Founder · design, craft and the calendar</p>
            <h2 className="display-lg mt-5">
              <span className="gold-italic">Artee Makhija</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              Nine years spent at the centre of founders&apos; offices across furniture, automobiles,
              retail, workspaces and software — the work of turning intention into something that
              actually ships.
            </p>
            <p className="mt-5 text-muted-foreground">
              Twice a co-founder before A&amp;I, most recently of a womenswear venture. A&amp;I is
              what she wanted to exist: design-led clothing that can explain itself completely — the
              idea, the cloth and the hands.
            </p>
            <p className="mt-5 text-muted-foreground">
              She decides which technique a season is built around, how large a run can honestly be,
              and whether a piece survives an ordinary Tuesday.
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
          <div className="aspect-4/5 w-full bg-secondary" aria-hidden="true" />
          <div>
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
