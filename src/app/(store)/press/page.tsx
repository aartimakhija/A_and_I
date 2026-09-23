import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Press — A&I",
  description: "Press enquiries and where to see A&I in person: our Ahmedabad studio, video appointments, and swatches by post.",
  path: "/press",
});

const seeing = [
  { k: "Ahmedabad — the studio", v: "Our own atelier. Full collection, fabric swatches and made-to-measure appointments, by appointment.", status: "By appointment" },
  { k: "Video call", v: "Swatches posted ahead of the call, wherever you are.", status: "Always open" },
  { k: "Swatches by post", v: "Name the pieces you're weighing up and we post the cloths, anywhere in India.", status: "On request" },
];

const kit = [
  { k: "For writers", v: "Collection notes, atelier background, founder biography and production timelines." },
  { k: "For editors", v: "High-resolution look images, flat product shots and process photography from the atelier." },
  { k: "For stylists", v: "Sample loans by arrangement, subject to availability of the run and return dates." },
];

export default function PressPage() {
  return (
    <>
      <section className="shell grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="micro text-muted-foreground">Press &amp; stockists</p>
          <h1 className="display-lg mt-6">
            Where to see A&amp;I <span className="gold-italic">in person.</span>
          </h1>
          <p className="mt-7 max-w-xl text-muted-foreground">
            We are a small studio, so we show the collection in a small number of ways — our own
            atelier, video appointments, and swatches by post. Press and stylist requests are
            answered by the founder directly.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-8">
            <Link href="/contact" className="btn-solid-gold">
              Press enquiry
            </Link>
            <Link href="/visit" className="link-underline micro">
              Visit the studio
            </Link>
          </div>
        </div>
        <div className="aspect-4/5 w-full bg-secondary" aria-hidden="true" />
      </section>

      <section className="shell py-24">
        <h2 className="display-lg max-w-2xl">
          Seeing pieces <span className="gold-italic">in person.</span>
        </h2>
        <dl className="mt-12 divide-y divide-border border-y border-border">
          {seeing.map((s) => (
            <div key={s.k} className="flex flex-col gap-2 py-7 md:flex-row md:items-baseline md:gap-10">
              <dt className="display-md w-full text-xl md:w-72">{s.k}</dt>
              <dd className="flex-1 text-sm text-muted-foreground">{s.v}</dd>
              <span className="micro text-primary">{s.status}</span>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-paper text-paper-foreground">
        <div className="shell grid gap-14 py-24 lg:grid-cols-2">
          <div>
            <p className="micro text-paper-muted">The press kit</p>
            <h2 className="display-lg mt-6">
              Everything you need <span className="italic text-accent">to write it well.</span>
            </h2>
            <dl className="mt-10 space-y-7 border-t border-paper-foreground/15 pt-8">
              {kit.map((k) => (
                <div key={k.k}>
                  <dt className="micro text-accent">{k.k}</dt>
                  <dd className="mt-2 text-sm text-paper-muted">{k.v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 text-sm text-paper-muted">
              Tell us your publication, deadline and the pieces you are interested in, and we will
              send the assets across.
            </p>
          </div>
          <div className="aspect-4/5 w-full bg-paper-foreground/10" aria-hidden="true" />
        </div>
      </section>

      <section className="shell py-24 text-center">
        <h2 className="display-lg">
          Reading first? <span className="gold-italic">Start with the making.</span>
        </h2>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-8">
          <Link href="/craft" className="link-underline micro">
            The craft
          </Link>
          <Link href="/blog" className="link-underline micro">
            Journal
          </Link>
        </div>
      </section>
    </>
  );
}
