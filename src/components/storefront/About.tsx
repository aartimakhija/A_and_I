"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { SFProduct } from "@/lib/storefront-adapter";

const PILLARS = [
  { n: "01", h: "Curation, not volume", b: "We don't chase every trend into existence. Every piece earns its place in the collection before it's ever made — fewer choices, each one considered." },
  { n: "02", h: "Craft, not costume", b: "Bandhani tied by hand. Mirror-work set one disc at a time. Zari woven the slow way. Real techniques, cut into shapes built for right now — not heritage as decoration." },
  { n: "03", h: "Trust, not trend", b: "Every garment carries its own story — who made it, where the fabric came from. Scan the passport and see it for yourself. Signal over noise." },
];

const PROCESS = [
  { n: "01", h: "Selected", b: "Our curation board reviews every design against one question: does this earn its place? Most don't make the cut." },
  { n: "02", h: "Made in small runs", b: "Produced in limited counts with named ateliers in Jaipur and Kutch — never a factory line, never a guess at demand." },
  { n: "03", h: "Fitted to you", b: "Choose your size and fabric tier — signature linen, premium handloom, or hand-embroidered couture — before it's finished." },
  { n: "04", h: "Delivered, and remembered", b: "Every piece ships with its own digital passport: the atelier, the material origin, the hands behind it." },
];

export function About({ originPiece, processPieces, pieceCount, faqs }: {
  originPiece: SFProduct | null; processPieces: SFProduct[]; pieceCount: number; faqs: { question: string; answer: string }[];
}) {
  const router = useRouter();

  return (
    <>
      <section className="bg-paper px-6 py-20 text-center text-paper-foreground md:py-32">
        <span className="eyebrow text-paper-foreground/70">Founded by Artee Makhija</span>
        <h1 className="display-xl mt-4">One founder,<br /><span className="gold-italic">one point of view.</span></h1>
        <p className="mx-auto mt-6 max-w-lg text-[15px] font-light leading-loose text-paper-foreground/70">
          A&amp;I began with a simple frustration: wanting clothes that felt considered without feeling
          precious — beautifully Indian or quietly global, never both at once. So Artee began building
          the house she wanted to exist.
        </p>
      </section>

      <section className="shell grid items-center gap-8 py-14 md:grid-cols-[1fr_1.15fr] md:gap-16 md:py-24">
        {originPiece?.images[0] && (
          <div className="relative aspect-4/5 overflow-hidden bg-secondary">
            <Image src={originPiece.images[0]} alt={originPiece.name} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
          </div>
        )}
        <div>
          <span className="eyebrow">How it started</span>
          <h2 className="display-md mt-2.5">The house she wanted<br /><span className="gold-italic">to exist.</span></h2>
          <p className="mt-5 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
            A&amp;I was founded by Artee Makhija. It began with a simple frustration: wanting clothes
            that felt considered without feeling precious, and finding too few pieces that brought
            together contemporary silhouettes, distinctive materials and Indian craft in the way she
            imagined — everything was either loud heritage or quiet minimalism, never a version of
            both that felt like <i>her</i>.
          </p>
          <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
            So she went looking for the ateliers who still do it the old way — hand-tied bandhani,
            mirror-work set disc by disc, zari woven on a slow loom — and asked them to help her cut it
            into something contemporary, made with intention.
          </p>
          <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
            {pieceCount > 0 ? `${pieceCount} pieces later, ` : "One collection later, "}that&apos;s
            still the only rule she follows: if it doesn&apos;t earn its place on the rail, it isn&apos;t made.
          </p>
          <div className="mt-7"><button onClick={() => router.push("/lookbook")} className="btn-outline-ink">See it styled</button></div>
        </div>
      </section>

      <section className="bg-secondary px-6 py-14 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <span className="eyebrow">What we won&apos;t compromise on</span>
            <h2 className="display-md mt-2.5">Three rules, <span className="gold-italic">no exceptions.</span></h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.n}>
                <div className="font-display text-4xl leading-none text-primary/50">{p.n}</div>
                <div className="my-2.5 font-display text-xl italic">{p.h}</div>
                <p className="text-sm font-light leading-relaxed text-muted-foreground">{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <span className="eyebrow">From atelier to you</span>
            <h2 className="display-md mt-2.5">How a piece <span className="gold-italic">comes to life.</span></h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {PROCESS.map((p) => (
              <div key={p.n} className="border-t-2 border-primary pt-4.5">
                <div className="micro text-muted-foreground">{p.n}</div>
                <div className="my-2 font-display text-lg italic">{p.h}</div>
                <p className="text-[13.5px] font-light leading-relaxed text-muted-foreground">{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {processPieces.length > 0 && (
        <section className="grid gap-1" style={{ gridTemplateColumns: `repeat(${processPieces.length},1fr)` }}>
          {processPieces.map((p) => (
            <button key={p.id} onClick={() => router.push(`/products/${p.slug}`)} className="relative aspect-4/5 bg-secondary">
              {p.images[0] && <Image src={p.images[0]} alt={p.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />}
            </button>
          ))}
        </section>
      )}

      <section className="shell max-w-3xl py-12 md:py-20">
        <div className="mb-10 text-center">
          <span className="eyebrow">Questions we hear often</span>
          <h2 className="display-md mt-2.5">Frequently <span className="gold-italic">asked.</span></h2>
        </div>
        <div className="flex flex-col gap-7">
          {faqs.map((f) => (
            <div key={f.question}>
              <h3 className="mb-2 font-display text-lg italic">{f.question}</h3>
              <p className="m-0 text-sm font-light leading-relaxed text-muted-foreground">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper px-6 py-14 text-center text-paper-foreground md:py-24">
        <span className="eyebrow text-paper-foreground/70">Made in India, worn anywhere</span>
        <h2 className="display-lg mt-2.5">Come see what<br /><span className="gold-italic">we made this season.</span></h2>
        <div className="mt-7">
          <button onClick={() => router.push("/shop/all")} className="btn-solid-gold">Shop the collection</button>
        </div>
      </section>
    </>
  );
}
