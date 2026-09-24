"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "./StoreContext";

export function NavMegaMenu() {
  const { categories, catalogue } = useStore();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  function openNow() { clearTimeout(closeTimer.current); setOpen(true); }
  function closeSoon() { closeTimer.current = setTimeout(() => setOpen(false), 150); }

  // Representative photo per category, for the two image tiles — pulls whatever
  // real product happens to have an image in that category rather than
  // requiring separate "category banner" authoring.
  const tileCategories = categories.slice(0, 2).map((c) => {
    const rep = catalogue.find((p) => p.category === c.slug && p.images.length > 0);
    return { ...c, image: rep?.images[0] ?? null };
  });

  const explore: [string, string][] = [
    ["/shop/all", "Shop All"], ["/shop/all?availability=in", "Ready to Ship"], ["/lookbook", "Lookbook"], ["/blog", "Journal"], ["/bespoke", "Bespoke"],
  ];
  const ourWorld: [string, string][] = [
    ["/craft", "The Craft"], ["/founder", "The Founder"], ["/visit", "The Studio"],
  ];

  return (
    <div onMouseEnter={openNow} onMouseLeave={closeSoon} className="relative">
      <Link href="/shop/all" className="link-underline micro font-light text-muted-foreground">
        Collection
      </Link>
      {open && (
        <div className="absolute left-1/2 top-7 z-[55] grid w-[min(860px,90vw)] -translate-x-1/2 grid-cols-[160px_140px_160px_1fr] gap-10 border border-border bg-background p-8 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
          <div>
            <div className="eyebrow-muted mb-3">Explore</div>
            {explore.map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="link-underline mb-2.5 block font-display italic text-[15px]">
                {label}
              </Link>
            ))}
          </div>
          <div>
            <div className="eyebrow-muted mb-3">Our world</div>
            {ourWorld.map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="link-underline mb-2.5 block text-[13px] font-light text-muted-foreground">
                {label}
              </Link>
            ))}
          </div>
          <div>
            <div className="eyebrow-muted mb-3">Categories</div>
            {categories.map((c) => (
              <Link key={c.slug} href={`/shop/${c.slug}`} onClick={() => setOpen(false)} className="link-underline mb-2.5 block text-[13px] font-light text-muted-foreground">
                {c.name}
              </Link>
            ))}
          </div>
          {tileCategories.length > 0 && (
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${tileCategories.length},1fr)` }}>
              {tileCategories.map((c) => (
                <Link key={c.slug} href={`/shop/${c.slug}`} onClick={() => setOpen(false)} className="relative block aspect-3/4 overflow-hidden bg-paper">
                  {c.image && <Image src={c.image} alt="" fill sizes="200px" className="object-cover" />}
                  <span className="absolute bottom-2.5 left-2.5 font-display text-sm italic text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
