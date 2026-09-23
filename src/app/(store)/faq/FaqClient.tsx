"use client";
import Link from "next/link";
import { useState } from "react";

export function FaqClient({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <section className="shell pb-14 pt-20">
        <p className="eyebrow">Questions</p>
        <h1 className="display-xl mt-6">
          Asked, and <span className="gold-italic">answered.</span>
        </h1>
        <p className="mt-7 max-w-xl text-muted-foreground">
          Everything we get asked most, in the order we get asked it. If your question is not here,
          the studio answers within two working days.
        </p>
      </section>

      <section className="shell pb-20">
        <ul className="border-t border-border">
          {faqs.map((f, i) => (
            <li key={f.q} className="border-b border-border">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-baseline justify-between gap-6 py-6 text-left transition-colors hover:text-primary"
              >
                <span className="text-lg">{f.q}</span>
                <span className="micro shrink-0 text-muted-foreground">{open === i ? "×" : "+"}</span>
              </button>
              {open === i && <p className="max-w-2xl pb-7 text-sm text-muted-foreground">{f.a}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-paper text-paper-foreground">
        <div className="shell flex flex-wrap items-end justify-between gap-8 py-20">
          <div>
            <p className="micro text-paper-muted">Still stuck</p>
            <h2 className="display-lg mt-5">
              Ask us <span className="italic text-accent">directly.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-5">
            <Link href="/contact" className="btn-solid-gold">
              Contact us
            </Link>
            <Link href="/size-fit" className="btn-outline-ink">
              Size &amp; fit guide
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
