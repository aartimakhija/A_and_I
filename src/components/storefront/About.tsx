"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { SFProduct } from "@/lib/storefront-adapter";

const PILLARS = [
  { n: "01", h: "Curation, not volume", b: "We don't chase every trend into existence. Every piece earns its place in the collection before it's ever made — fewer choices, each one considered." },
  { n: "02", h: "Craft, not costume", b: "Girih geometry drawn by hand before a single cut is made. Laser precision where a blade alone can't hold the pattern. Every edge finished by hand once the cut is done. Real technique, not heritage as decoration." },
  { n: "03", h: "Trust, not trend", b: "Every garment carries its own story — who made it, where the fabric came from. Scan the passport and see it for yourself. Signal over noise." },
];

const PROCESS = [
  { n: "01", h: "Selected", b: "Our curation board reviews every design against one question: does this earn its place? Most don't make the cut." },
  { n: "02", h: "Made in small runs", b: "Produced in limited counts with a specialist craft partner — never a factory line, never a guess at demand." },
  { n: "03", h: "Fitted to you", b: "Choose your size before it's confirmed for production — the fabric and cutwork are fixed for each design, laser-cut and hand-finished the same way across the capsule." },
  { n: "04", h: "Delivered, and remembered", b: "Every piece ships with its own digital passport: the atelier, the material origin, the hands behind it." },
];

function FaqRow({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center justify-between gap-6 py-6 text-left">
        <span className="font-display text-lg italic">{question}</span>
        <span aria-hidden className={`text-2xl text-primary transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <p className="max-w-2xl pb-7 text-sm font-light leading-relaxed text-muted-foreground">{answer}</p>}
    </div>
  );
}

export function About({ originPiece, processImage, processPieces, pieceCount, faqs }: {
  originPiece: SFProduct | null; processImage: SFProduct | null; processPieces: SFProduct[]; pieceCount: number; faqs: { question: string; answer: string }[];
}) {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
          <div className="reveal card-zoom relative aspect-4/5 overflow-hidden bg-secondary">
            <Image src={originPiece.images[0]} alt={originPiece.name} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
          </div>
        )}
        <div className="reveal" style={{ transitionDelay: "80ms" }}>
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

      {/* Dark ink panel, matching Lovable's "no exceptions" break between the
          ivory sections either side of it. */}
      <section className="bg-paper text-paper-foreground">
        <div className="shell py-24">
          <div className="reveal mx-auto max-w-2xl text-center">
            <span className="eyebrow text-paper-foreground/70">What we won&apos;t compromise on</span>
            <h2 className="display-lg mt-5">Three rules, <span className="italic text-accent">no exceptions.</span></h2>
          </div>
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <div key={p.n} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <p className="font-display text-5xl italic text-accent">{p.n}</p>
                <h3 className="display-md mt-4 text-xl">{p.h}</h3>
                <p className="mt-3 text-sm text-paper-muted">{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell grid gap-14 py-24 lg:grid-cols-[1fr_1.1fr]">
        {processImage?.images[0] && (
          <div className="reveal card-zoom relative aspect-4/5 overflow-hidden bg-secondary">
            <Image src={processImage.images[0]} alt={`${processImage.name} in progress at the atelier`} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
          </div>
        )}
        <div className="reveal" style={{ transitionDelay: "80ms" }}>
          <span className="eyebrow">From atelier to you</span>
          <h2 className="display-lg mt-5">How a piece <span className="gold-italic">comes to life.</span></h2>
          <ol className="mt-10 divide-y divide-border border-y border-border">
            {PROCESS.map((p) => (
              <li key={p.n} className="grid gap-2 py-6 sm:grid-cols-[4rem_1fr]">
                <span className="micro text-primary">{p.n}</span>
                <div>
                  <h3 className="display-md text-lg">{p.h}</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">{p.b}</p>
                </div>
              </li>
            ))}
          </ol>
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

      <section className="border-y border-border bg-card">
        <div className="shell max-w-3xl py-16 md:py-24">
          <div className="reveal mb-4 text-center">
            <span className="eyebrow">Before you ask</span>
            <h2 className="display-lg mt-5">The <span className="gold-italic">honest answers.</span></h2>
          </div>
          <div className="reveal mt-10" style={{ transitionDelay: "80ms" }}>
            {faqs.map((f, i) => (
              <FaqRow
                key={f.question}
                question={f.question}
                answer={f.answer}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="reveal shell flex flex-wrap items-center justify-between gap-8 py-20">
          <h2 className="display-lg max-w-lg">
            Come see what <span className="gold-italic">we made this season.</span>
          </h2>
          <button onClick={() => router.push("/shop/all")} className="btn-solid-gold">Shop the collection</button>
        </div>
      </section>
    </>
  );
}
