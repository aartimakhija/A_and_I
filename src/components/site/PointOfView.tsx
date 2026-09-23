import Link from "next/link";
import Image from "next/image";

type Principle = { n: string; title: string; caption: string; body: string; image?: string | null; alt: string };

/**
 * "The A&I point of view" — ported 1:1 from Lovable's PointOfView.tsx: a
 * centred editorial statement followed by a 4-column Idea/Form/Material/Craft
 * grid. Images are passed in (from whichever piece the homepage is
 * showcasing) rather than hard-coded, so this keeps working as the featured
 * piece changes — same layout and copy as the Lovable source either way.
 */
export function PointOfView({ images = [], storyHref = "/about" }: { images?: (string | null | undefined)[]; storyHref?: string }) {
  const principles: Principle[] = [
    {
      n: "01",
      title: "Idea",
      caption: "Thought & perspective",
      body: "Every piece begins with a thought, an observation or a point of view.",
      image: images[0],
      alt: "The starting point for an A&I design — a first concept reference",
    },
    {
      n: "02",
      title: "Form",
      caption: "Silhouette & proportion",
      body: "Silhouette, proportion and movement give the idea its physical language.",
      image: images[1] ?? images[0],
      alt: "The finished silhouette worn, showing proportion and movement",
    },
    {
      n: "03",
      title: "Material",
      caption: "Fabric & texture",
      body: "Fabric, texture, colour and surface are chosen as part of the design — not simply added afterwards.",
      image: images[2] ?? images[0],
      alt: "Close-up of the fabric, colour and surface texture",
    },
    {
      n: "04",
      title: "Craft",
      caption: "Hands & precision",
      body: "The final piece emerges through the hands, skill and precision of the people who make it.",
      image: images[3] ?? images[0],
      alt: "The hands and precision behind the finished piece",
    },
  ];

  return (
    <section className="grain relative border-b border-border">
      <div className="shell py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="reveal">
            <p className="micro text-primary">The A&amp;I point of view</p>
            <h2 className="display-lg mt-6">
              We begin <span className="gold-italic">with the idea.</span>
            </h2>
          </div>
          <div className="reveal" style={{ transitionDelay: "80ms" }}>
            <p className="mt-8 text-lg text-muted-foreground">
              Before a fabric is cut or a stitch is made, there is an idea.
            </p>
            <p className="mt-5 text-muted-foreground">
              We explore proportion, silhouette, material, colour and detail to create pieces that
              feel considered from the very beginning.
            </p>
            <p className="mt-5 text-muted-foreground">
              For us, clothing is not simply something to be worn. It is a form of expression —
              shaped by design, material and the hands that bring it to life.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {principles.map((p, i) => (
            <figure key={p.n} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="block h-px w-full bg-border" />
              <div className="mt-6 flex items-baseline gap-4">
                <span className="display-md text-xl italic text-primary">{p.n}</span>
                <h3 className="micro text-foreground">{p.title}</h3>
              </div>
              <p className="micro mt-2 text-muted-foreground">{p.caption}</p>
              {p.image && (
                <div className="card-zoom relative mt-6 aspect-4/5 w-full bg-secondary">
                  <Image src={p.image} alt={p.alt} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                </div>
              )}
              <figcaption className="mt-5 text-sm text-muted-foreground">{p.body}</figcaption>
            </figure>
          ))}
        </div>

        <div className="reveal mt-16 text-center" style={{ transitionDelay: "80ms" }}>
          <Link href={storyHref} className="micro link-underline text-primary">
            Explore the world of A&amp;I →
          </Link>
        </div>
      </div>
    </section>
  );
}
