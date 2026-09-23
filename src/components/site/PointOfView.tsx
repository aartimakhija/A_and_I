import Image from "next/image";
import Link from "next/link";

/** Brand-philosophy editorial section — static copy, paired with a real
 * catalogue photo so it never depends on unseeded editorial assets. */
export function PointOfView({ imageUrl, imageAlt }: { imageUrl?: string | null; imageAlt?: string }) {
  return (
    <section className="bg-card">
      <div className="grid items-stretch md:grid-cols-2">
        <div className="relative min-h-[320px] md:min-h-[460px]">
          {imageUrl && (
            <Image src={imageUrl} alt={imageAlt ?? ""} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          )}
        </div>
        <div className="flex flex-col justify-center px-6 py-16 md:px-14 md:py-20">
          <span className="eyebrow">The philosophy</span>
          <h2 className="display-lg mt-3">
            Indian craft,
            <br />
            <span className="gold-italic">global silhouette.</span>
          </h2>
          <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-muted-foreground">
            Bandhani tied by hand. Mirror-work set one disc at a time. Zari woven the slow way. We take
            techniques that built India&apos;s wardrobe and cut them into shapes that belong anywhere in
            the world.
          </p>
          <p className="mt-4 max-w-md text-[15px] font-light leading-relaxed text-muted-foreground">
            Nothing here is mass. Every piece is a small run, finished by people we know by name.
          </p>
          <Link href="/about" className="btn-outline-ink mt-8 w-fit">
            Read our story
          </Link>
        </div>
      </div>
    </section>
  );
}
