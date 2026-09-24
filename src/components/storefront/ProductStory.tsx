import Image from "next/image";
import Link from "next/link";
import type { SFProduct } from "@/lib/storefront-adapter";

/**
 * The ideation-to-care narrative shown below the fold on every product page,
 * matching the Lovable design's story sequence (idea → direction → reality →
 * the hand behind the piece → fabric & care → the story, complete).
 *
 * Where a product has dedicated story photography (sketch / colour+material
 * palette / making-of / fabric close-up / care), each beat uses its own
 * matching asset. Products without that photography fall back to cycling
 * through the product's regular catalogue images, so nothing breaks for
 * older catalogue items that only ever had front/back/side shots.
 */

function StepLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-6">
      <span className="display-md text-2xl italic text-primary">{n}</span>
      <span className="h-px flex-1 bg-border" />
      <span className="micro text-muted-foreground">{label}</span>
    </div>
  );
}

function Frame({
  src, alt, ratio = "aspect-3/4", color,
}: { src: string | null; alt: string; ratio?: string; color: string }) {
  return (
    <div
      className={`relative ${ratio} w-full overflow-hidden bg-secondary`}
      style={!src ? { background: `linear-gradient(155deg, ${color}26 0%, var(--paper) 120%)` } : undefined}
    >
      {src && <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />}
    </div>
  );
}

export function ProductStory({ product }: { product: SFProduct }) {
  const imgs = product.images;
  const view = (i: number) => (imgs.length ? imgs[i % imgs.length] : null);
  const maker = product.category === "craft" ? "a specialist craft partner" : "our studio";
  const colourway = product.colorName ?? "this colourway";

  const ideaImg = product.sketchImageUrl ?? view(1) ?? view(0);
  const paletteImg = product.paletteImageUrl ?? view(2) ?? view(0);
  const makingImg = product.makingImageUrl ?? view(3) ?? view(0);
  const fabricImg = product.fabricImageUrl ?? view(3) ?? view(0);
  const careImg = product.careImageUrl;

  return (
    <>
      {/* 02 — THE IDEA */}
      <section className="shell border-t border-border py-20 md:py-24">
        <StepLabel n="02" label="The idea" />
        <h2 className="display-lg mt-8 max-w-3xl">
          Before the piece, there was <span className="gold-italic">a line.</span>
        </h2>
        <div className="mt-14 grid items-center gap-14 lg:grid-cols-2">
          <Frame src={ideaImg} alt={`${product.name} — original design sketch`} color={product.color} />
          <div>
            <p className="text-muted-foreground">
              {product.name} began with proportion — where the piece sits on the body, and how much
              room it is given to move — settled before any colour or cloth was chosen. At this
              stage the only questions are line and balance.
            </p>
            <h3 className="display-md mt-10">The first line</h3>
            <p className="mt-5 text-muted-foreground">
              {product.silhouette
                ? `${product.silhouette} That silhouette was settled before anything was cut.`
                : "The silhouette was settled before anything was cut."}
            </p>
          </div>
        </div>
      </section>

      {/* 03 — THE DIRECTION */}
      <section className="border-y border-border bg-card">
        <div className="shell py-20 md:py-24">
          <StepLabel n="03" label="The direction" />
          <h2 className="display-lg mt-8 max-w-3xl">
            From line <span className="gold-italic">to palette.</span>
          </h2>
          <div className="mt-14 grid items-center gap-14 lg:grid-cols-2">
            <dl className="space-y-6 border-t border-border pt-8">
              <div>
                <dt className="micro text-primary">Colourway</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{colourway}</dd>
              </div>
              {product.silhouette && (
                <div>
                  <dt className="micro text-primary">Silhouette</dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{product.silhouette}</dd>
                </div>
              )}
              {product.features && (
                <div>
                  <dt className="micro text-primary">Design details</dt>
                  <dd className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{product.features}</dd>
                </div>
              )}
            </dl>
            <Frame src={paletteImg} alt={`Fabric, colour and trim palette for ${product.name}`} color={product.color} />
          </div>
        </div>
      </section>

      {/* 04 — THE REALITY */}
      <section className="shell py-20 md:py-24">
        <StepLabel n="04" label="The reality" />
        <h2 className="display-lg mt-8 max-w-3xl">
          A sketch shows the idea. The garment{" "}
          <span className="gold-italic">reveals the experience.</span>
        </h2>
        <div className="mt-14 grid items-center gap-14 lg:grid-cols-2">
          <Frame src={view(0)} alt={`${product.name} in ${colourway}, finished garment`} color={product.color} />
          <div>
            <h3 className="display-md">From idea to form</h3>
            <p className="mt-5 whitespace-pre-wrap text-muted-foreground">
              {product.story ||
                `${product.name} moved from drawing to garment through a series of small, deliberate decisions — the ones that don't photograph, but that you feel the moment you put it on.`}
            </p>
          </div>
        </div>
      </section>

      {/* 05 — THE HAND BEHIND THE PIECE */}
      <section className="bg-paper text-paper-foreground">
        <div className="shell py-20 md:py-24">
          <div className="flex items-center gap-6">
            <span className="display-md text-2xl italic text-accent">05</span>
            <span className="h-px flex-1 bg-paper-foreground/15" />
            <span className="micro text-paper-muted">The hand behind the piece</span>
          </div>
          <h2 className="display-lg mt-8 max-w-3xl">
            Then, the making <span className="italic text-accent">begins.</span>
          </h2>
          <div className="mt-14 grid items-center gap-14 lg:grid-cols-2">
            <Frame
              src={makingImg}
              alt={`${product.name} — in the making, construction and finishing`}
              ratio="aspect-4/3"
              color={product.color}
            />
            <div>
              <p className="text-paper-muted">
                Cut, finished and checked with {maker}, in a small run
                {product.madeCount ? ` of ${product.madeCount}` : ""}. The drawing sets the
                direction; the hands decide how a seam sits, where an edge is turned, and when a
                piece is finished.
              </p>
              <p className="display-md mt-10">
                The sketch becomes proportion.
                <br />
                The cloth becomes form.
                <br />
                <span className="italic text-accent">The idea becomes a garment.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — THE FABRIC AND ITS CARE */}
      {(fabricImg || product.fitNotes || product.careNotes) && (
        <section className="shell py-20 md:py-24">
          <StepLabel n="06" label="Why this fabric?" />
          <h2 className="display-lg mt-8 max-w-3xl">
            The cloth, <span className="gold-italic">up close.</span>
          </h2>
          <div className="mt-14 grid items-start gap-14 lg:grid-cols-2">
            <Frame
              src={fabricImg}
              alt={`Detail of the cloth and cutwork used for ${product.name}`}
              ratio="aspect-4/3"
              color={product.color}
            />
            <div>
              {product.fitNotes && <p className="whitespace-pre-wrap text-muted-foreground">{product.fitNotes}</p>}
              <p className="mt-5 text-sm text-muted-foreground">
                Held at this distance, the weave, the thread colours and the finish are the piece.
                Exact composition and care are confirmed before the cloth is cut.
              </p>
              {(product.careNotes || careImg) && (
                <>
                  <h3 className="display-md mt-10">Taking care of it</h3>
                  <div className="mt-5 flex items-start gap-5">
                    {careImg && (
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-secondary">
                        <Image src={careImg} alt={`How to care for ${product.name}`} fill sizes="80px" className="object-cover" />
                      </div>
                    )}
                    {product.careNotes && (
                      <p className="whitespace-pre-wrap text-sm text-muted-foreground">{product.careNotes}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 07 — THE STORY, COMPLETE */}
      <section className="border-y border-border">
        <div className="shell grid items-center gap-14 py-20 md:py-24 lg:grid-cols-2">
          <Frame src={view(imgs.length - 1) ?? view(0)} alt={`${product.name} in ${colourway}, worn`} color={product.color} />
          <div>
            <StepLabel n="07" label="The story, complete" />
            <h2 className="display-lg mt-8">
              One drawing. One cloth. <span className="gold-italic">One run.</span>
            </h2>
            <p className="mt-6 text-muted-foreground">
              {product.modelNote || "Made once, in a small run, and not repeated once it's gone."}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-8">
              <a href="#pdp-top" className="btn-solid-gold">
                Back to the piece
              </a>
              <Link href="/shop/all" className="link-underline micro">
                Explore the collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
