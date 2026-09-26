import Image from "next/image";

export type InstagramTile = { src: string; alt: string };

/**
 * Renders as a grid of image tiles, whichever source they came from.
 * HomeFlow decides that source: it calls fetchInstagramFeed() (see
 * src/lib/integrations.ts) and passes real Instagram photos here whenever
 * INSTAGRAM_TOKEN is configured and returns enough usable posts; otherwise
 * it falls back to the brand's own product photography, which is honest
 * about what it is while still giving the "follow along" section the
 * collage feel that was asked for. This component itself doesn't care
 * which one it's showing — it just lays out whatever tiles it's given.
 */
export function InstagramFeed({ tiles, handle, profileUrl }: { tiles: InstagramTile[]; handle: string; profileUrl: string }) {
  return (
    <div>
      <div className="reveal flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="micro text-muted-foreground">Follow along</p>
          <h3 className="display-md mt-2">
            Follow us on Instagram <span className="gold-italic">{handle}</span>
          </h3>
        </div>
        <a href={profileUrl} target="_blank" rel="noreferrer" className="link-underline micro tap-scale shrink-0">
          Follow {handle} →
        </a>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
        {tiles.map((t, i) => (
          <a
            key={t.src}
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="reveal card-zoom tap-scale relative block aspect-square overflow-hidden bg-secondary"
            style={{ transitionDelay: `${(i % 6) * 60}ms` }}
          >
            <Image src={t.src} alt={t.alt} fill sizes="(max-width: 640px) 33vw, 16vw" className="object-cover" />
          </a>
        ))}
      </div>
    </div>
  );
}
