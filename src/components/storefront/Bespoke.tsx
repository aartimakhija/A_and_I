"use client";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/site/ProductCard";
import type { SFProduct } from "@/lib/storefront-adapter";

export function Bespoke({ pieces }: { pieces: SFProduct[] }) {
  const router = useRouter();

  return (
    <>
      {/* Editorial hero — flat background, not full-bleed photo, distinct from Home/Journal patterns */}
      <section className="bg-paper px-6 py-16 text-center text-paper-foreground md:py-28">
        <span className="eyebrow text-paper-foreground/70">Made to measure</span>
        <h1 className="display-lg mt-2.5">
          Your piece,<br /><span className="gold-italic">your measurements.</span>
        </h1>
        <p className="mx-auto mt-5.5 max-w-lg text-[15px] font-light leading-loose text-paper-foreground/75">
          For a true bespoke commission — your exact measurements, or a colourway not in the current shortlist — our
          craft partner can take a design further than the standard run.
        </p>
      </section>

      {pieces.length > 0 && (
        <section className="px-6 py-14 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-9 text-center">
              <span className="eyebrow">Start from a piece you love</span>
              <h2 className="display-md mt-2.5">Any craft piece can be <span className="gold-italic">made bespoke.</span></h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {pieces.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-card px-6 py-14 md:py-24">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">The bespoke process</span>
          <h2 className="display-md mt-2.5">Transparent from the <span className="gold-italic">first email.</span></h2>
          <p className="mt-5 text-[15px] font-light leading-loose text-muted-foreground">
            Bespoke commissions are priced per piece once we understand what you have in mind, with a minimum lead time
            of 6–8 weeks depending on the design. No obligation, no configurator, just a conversation with the studio.
          </p>
          <div className="mt-7.5 flex flex-wrap justify-center gap-3.5">
            <button onClick={() => router.push("/contact?topic=bespoke")} className="btn-solid-gold">Enquire about a bespoke piece</button>
            <button onClick={() => router.push("/faq")} className="btn-outline-ink">Read our FAQ</button>
          </div>
        </div>
      </section>

      <div className="px-6 py-10 text-center md:py-14">
        <button onClick={() => router.push("/shop/all")} className="border-b border-border pb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
          Full Collection →
        </button>
      </div>
    </>
  );
}
