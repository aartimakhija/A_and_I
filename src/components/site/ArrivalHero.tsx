import Link from "next/link";
import Image from "next/image";

/** Full-bleed home hero in the new design's language. Uses the admin-set
 * hero banner (Settings → hero image) when present, falling back to a
 * featured product photo so the page never ships with a blank hero. */
export function ArrivalHero({ imageUrl, shopHref = "/shop/all", storyHref = "/about" }: {
  imageUrl?: string | null;
  shopHref?: string;
  storyHref?: string;
}) {
  return (
    <section className="relative flex min-h-[min(82vh,680px)] flex-col justify-end overflow-hidden bg-paper">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_15%]"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(13,12,11,0.75) 0%, rgba(13,12,11,0.4) 42%, rgba(13,12,11,0.15) 65%, rgba(13,12,11,0.45) 100%)",
        }}
      />
      <div className="shell relative z-10 pb-16 pt-24 md:pb-24">
        <span className="eyebrow text-paper-foreground/80">Designed &amp; made in India</span>
        <h1 className="display-xl mt-4 max-w-3xl text-paper-foreground">
          Where an idea <span className="gold-italic">becomes a piece.</span>
        </h1>
        <p className="mt-5 max-w-md font-sans text-[15px] font-light leading-relaxed text-paper-foreground/80">
          Contemporary womenswear shaped by considered design, distinctive materials and the hands that make them.
        </p>
        <div className="mt-8 flex flex-wrap gap-8">
          <Link href={shopHref} className="link-underline micro text-paper-foreground">
            Shop the collection
          </Link>
          <Link href={storyHref} className="link-underline micro text-paper-foreground">
            Our world
          </Link>
        </div>
      </div>
    </section>
  );
}
