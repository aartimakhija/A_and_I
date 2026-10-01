"use client";
import { useState } from "react";

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

// Extracted from the old About.tsx so the Founder page (a Server Component,
// since it fetches via prisma) can still host an interactive accordion
// without the whole page needing "use client".
export function FaqAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <>
      {faqs.map((f, i) => (
        <FaqRow
          key={f.question}
          question={f.question}
          answer={f.answer}
          open={openFaq === i}
          onToggle={() => setOpenFaq(openFaq === i ? null : i)}
        />
      ))}
    </>
  );
}
