"use client";
import { useState } from "react";

export function AccordionTabStrip({ tabs }: { tabs: { label: string; content: string }[] }) {
  const available = tabs.filter((t) => t.content && t.content.trim().length > 0);
  const [active, setActive] = useState(0);
  if (available.length === 0) return null;

  return (
    <div className="mt-7 max-w-md">
      <div className="flex gap-5 border-b border-border">
        {available.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className={`-mb-px micro border-b-2 pb-2.5 ${active === i ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm font-light leading-relaxed text-muted-foreground">
        {available[active]?.content}
      </p>
    </div>
  );
}
