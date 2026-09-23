import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "The Craft — Bandhani, Mirror-Work, Zari",
  description: "Three techniques and the hours behind each one. How bandhani, mirror-work and zari become a modern wardrobe at A&I.",
  path: "/craft",
});

const techniques = [
  {
    name: "Bandhani",
    place: "India",
    hours: "16 days per length",
    text: "Cloth is lifted into thousands of points, each bound twice in thread, then dyed in a single lot. Untied, the pattern appears as tiny unrepeatable circles.",
    tell: "Look for a faint drift in the grid across the shoulder — the fold, recorded.",
  },
  {
    name: "Mirror-work",
    place: "Bhuj, Gujarat",
    hours: "1,200 discs per garment",
    text: "Each glass disc is caught under a hand-worked buttonhole ring. No glue, no plastic sequins, no shortcut version of this.",
    tell: "Turn the piece over: the reverse should be as tidy as the front.",
  },
  {
    name: "Zari",
    place: "India",
    hours: "4 metres a day",
    text: "Fine metal thread woven into handloom on a wooden pit loom. It catches light in a way foil printing never manages.",
    tell: "Hold it to a window — real zari warms rather than flashes.",
  },
];

export default function CraftPage() {
  return (
    <>
      <section className="shell py-20">
        <p className="eyebrow">Our world</p>
        <h1 className="display-xl mt-6">
          The craft <span className="gold-italic">behind the cut.</span>
        </h1>
        <p className="mt-7 max-w-xl text-muted-foreground">
          Three techniques, and an honest count of the hours. If you know what to look for, you can
          check every claim on this page with your own hands.
        </p>
      </section>

      <section className="shell space-y-20 pb-24">
        {techniques.map((t, i) => (
          <div key={t.name} className={`grid items-center gap-12 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className="aspect-4/5 w-full bg-secondary" aria-hidden="true" />
            <div>
              <p className="eyebrow">{t.place} · {t.hours}</p>
              <h2 className="display-lg mt-5">
                <span className="gold-italic">{t.name}</span>
              </h2>
              <p className="mt-6 text-muted-foreground">{t.text}</p>
              <p className="mt-5 border-l border-primary pl-5 text-sm text-muted-foreground">
                <span className="micro text-primary">How to tell</span>
                <br />
                {t.tell}
              </p>
              <Link href="/shop/craft" className="link-underline micro mt-8 inline-block">
                See pieces in {t.name.toLowerCase()}
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-paper text-paper-foreground">
        <div className="shell grid items-center gap-14 py-24 lg:grid-cols-2">
          <div className="aspect-4/5 w-full bg-paper-foreground/10" aria-hidden="true" />
          <div>
            <h2 className="display-lg">
              Then it is <span className="italic text-accent">finished by hand.</span>
            </h2>
            <p className="mt-6 text-paper-muted">
              Our finishing team rolls every hem, sets every button and presses every panel. The
              last centimetre decides how a garment falls, so we refuse to give it to a machine.
            </p>
            <Link href="/blog" className="link-underline micro mt-9 inline-block text-paper-foreground">
              Read more from the journal
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
