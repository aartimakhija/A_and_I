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
          &ldquo;We have 365 days to get dressed, not ten. Looking and feeling considered
          shouldn&apos;t be reserved for parties. So I built the house I could never find.&rdquo;
        </p>
      </section>

      <section className="shell grid items-start gap-8 py-14 md:grid-cols-[1fr_1.15fr] md:gap-16 md:py-24">
        {originPiece?.images[0] && (
          <div className="reveal card-zoom relative aspect-4/5 overflow-hidden bg-secondary">
            <Image src={originPiece.images[0]} alt={originPiece.name} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
          </div>
        )}
        <div className="reveal" style={{ transitionDelay: "80ms" }}>
          <span className="eyebrow">In her own words</span>
          <h2 className="display-md mt-2.5">The house<br /><span className="gold-italic">I could never find.</span></h2>
          <p className="mt-5 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
            I have always believed that clothes should make ordinary days feel a little more intentional.
          </p>
          <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
            I was twelve when I first became fascinated by fashion. I spent hours stitching, embroidering
            and inventing my own designs. I would look at a garment and immediately wonder what I could
            change — the silhouette, the colour, the detail, the way it could become something else.
          </p>
          <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
            Eventually, people started noticing.
            <br />
            <i>&ldquo;Where did you get that?&rdquo;</i>
            <br />
            I would tell them, <i>&ldquo;I designed it.&rdquo;</i>
            <br />
            Then they began asking me to design and customise pieces for them too. I never outgrew
            that curiosity.
          </p>
          <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
            As I grew older and began searching for clothes for myself, I often found myself wanting
            something that was difficult to find — pieces that felt refined without feeling excessive,
            beautifully considered without feeling precious, and special enough to be remembered but
            easy enough to actually live in.
          </p>
          <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
            I kept returning to one simple truth: we have 365 days to get dressed, not ten. Looking and
            feeling considered shouldn&apos;t be reserved for parties. So I built the house I could
            never find.
          </p>
          <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
            A&amp;I is a contemporary womenswear label created in small runs in India. We pay close
            attention to design, fabric, construction and finish — creating pieces that feel distinctive,
            refined and made to be lived in.
          </p>
          <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
            Every garment must earn its place. It must feel good on the body. It must be thoughtfully
            made. And it must still feel right long after the first wear. We believe in making less,
            making carefully, and creating pieces that can become part of a woman&apos;s real wardrobe —
            not just her special-occasion wardrobe.
          </p>
          <p className="mt-4 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
            I still design with the same curiosity I had as a girl. Only now, the pieces leave my table
            and find their way into other women&apos;s lives. This is A&amp;I — clothes for the full
            year, made with care, meant to be lived in.
          </p>
          <p className="mt-5 max-w-md text-[15px] italic text-muted-foreground">
            — Artee Makhija, Founder &amp; Creative Director, A&amp;I
          </p>
          <p className="mt-6 max-w-md text-[15px] font-light leading-loose text-muted-foreground">
            {pieceCount > 0 ? `${pieceCount} pieces later, ` : "One collection later, "}that&apos;s
            still the only rule I follow: if it doesn&apos;t earn its place on the rail, it isn&apos;t made.
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
