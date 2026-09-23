"use client";
import { useState } from "react";

/**
 * Real expand/collapse accordion (matches the Lovable design's "Catalogue
 * notes" / "Enquiry & fit" pattern) rather than a single-open-at-a-time tab
 * strip. First available item opens by default. Empty sections are dropped
 * silently so a product missing e.g. care notes doesn't show a blank tab.
 */
export function AccordionTabStrip({ tabs }: { tabs: { label: string; content: string }[] }) {
  const available = tabs.filter((t) => t.content && t.content.trim().length > 0);
  const [open, setOpen] = useState<number | null>(0);
  if (available.length === 0) return null;

  return (
    <div className="mt-8 border-t border-border">
      {available.map((t, i) => (
        <div key={t.label} className="border-b border-border">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between py-4 text-left"
          >
            <span className="micro">{t.label}</span>
            <span
              aria-hidden="true"
              className={`text-primary transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}
            >
              +
            </span>
          </button>
          {open === i && (
            <p className="whitespace-pre-wrap pb-5 text-sm font-light leading-relaxed text-muted-foreground">
              {t.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
