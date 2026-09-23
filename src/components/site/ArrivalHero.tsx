import Link from "next/link";
import Image from "next/image";

type MovementPiece = { slug: string; name: string; imageUrl?: string | null; videoUrl?: string | null };

/**
 * Full-bleed cinematic arrival — matches the Lovable "Brand Blossom Studio"
 * design 1:1: near full-height hero, single headline, two routes onward, a
 * floating "now in movement" card for a second piece, and a bottom bar with
 * a scroll cue. Video is optional (most catalogue items don't have one yet);
 * falls back gracefully to a still image, same as Lovable's own
 * prefers-reduced-motion fallback.
 */
export function ArrivalHero({
  imageUrl,
  videoUrl,
  movementPiece,
  shopHref = "/shop/all",
  storyHref = "/about",
}: {
  imageUrl?: string | null;
  videoUrl?: string | null;
  movementPiece?: MovementPiece | null;
  shopHref?: string;
  storyHref?: string;
}) {
  return (
    <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-paper text-white lg:min-h-dvh">
      {videoUrl ? (
        <video
          src={videoUrl}
          poster={imageUrl ?? undefined}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          aria-label="A&I film: the cloth, the making and the finished pieces"
          className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
        />
      ) : null}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover object-[center_15%] ${videoUrl ? "motion-safe:hidden" : ""}`}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/45" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />

      <div className="shell relative w-full pb-14 pt-32 lg:pb-16">
        <div className="flex items-end justify-between gap-12">
          <div>
            <p className="micro text-white/70">A&amp;I</p>

            <h1 className="display-lg mt-6 max-w-3xl text-white">
              Where an idea <span className="gold-italic">becomes a piece.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-white/85">
              Contemporary pieces shaped by considered design, distinctive materials and the hands
              that make them.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-8">
              <Link href={shopHref} className="btn-solid-gold">
                Explore the collection →
              </Link>
              <Link
                href={storyHref}
                className="micro text-white/85 underline decoration-white/40 underline-offset-8 transition-colors hover:decoration-white"
              >
                Discover A&amp;I →
              </Link>
            </div>
          </div>

          {movementPiece && (
            <Link
              href={`/products/${movementPiece.slug}`}
              className="group hidden w-56 shrink-0 lg:block"
            >
              {movementPiece.videoUrl ? (
                <video
                  src={movementPiece.videoUrl}
                  poster={movementPiece.imageUrl ?? undefined}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                  aria-label={`${movementPiece.name} in movement`}
                  className="aspect-4/5 w-full bg-black/40 object-cover"
                />
              ) : movementPiece.imageUrl ? (
                <div className="relative aspect-4/5 w-full bg-black/40">
                  <Image src={movementPiece.imageUrl} alt="" fill sizes="14rem" className="object-cover" />
                </div>
              ) : null}
              <p className="micro mt-4 text-white/60">{movementPiece.videoUrl ? "Now in movement" : "Also new"}</p>
              <p className="display-md mt-1 text-lg text-white group-hover:italic">{movementPiece.name}</p>
            </Link>
          )}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
          <p className="micro text-white/60">Designed with intention. Made in India.</p>
          <div className="flex items-center gap-3">
            <span className="micro text-white/55">Scroll to discover</span>
            <span aria-hidden className="animate-bounce text-white/55">
              ↓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
