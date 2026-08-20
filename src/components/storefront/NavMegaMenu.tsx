"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { T, SANS, SERIF } from "./theme";
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

  return (
    <div onMouseEnter={openNow} onMouseLeave={closeSoon} style={{ position: "relative" }}>
      <Link href="/shop/all" className="ulink" style={{
        fontFamily: SANS, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 300, color: T.stone,
        textDecoration: "none",
      }}>
        Collection
      </Link>
      {open && (
        <div style={{ position: "absolute", top: 28, left: "50%", transform: "translateX(-50%)", zIndex: 55,
          background: T.bg, border: `1px solid ${T.border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
          padding: "32px 36px", display: "grid", gridTemplateColumns: "160px 160px 1fr", gap: 40, width: "min(720px,90vw)" }}>
          <div>
            <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: T.stone, marginBottom: 12 }}>Explore</div>
            {explore.map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="ulink" style={{ display: "block", marginBottom: 10,
                fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: T.ink, textDecoration: "none" }}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: T.stone, marginBottom: 12 }}>Categories</div>
            {categories.map((c) => (
              <Link key={c.slug} href={`/shop/${c.slug}`} onClick={() => setOpen(false)} className="ulink" style={{ display: "block", marginBottom: 10,
                fontFamily: SANS, fontSize: 13, fontWeight: 300, color: T.mid, textDecoration: "none" }}>
                {c.name}
              </Link>
            ))}
          </div>
          {tileCategories.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${tileCategories.length},1fr)`, gap: 12 }}>
              {tileCategories.map((c) => (
                <Link key={c.slug} href={`/shop/${c.slug}`} onClick={() => setOpen(false)} style={{ position: "relative", display: "block", aspectRatio: "3/4", overflow: "hidden", background: T.darkCard }}>
                  {c.image && <img src={c.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  <span style={{ position: "absolute", bottom: 10, left: 10, fontFamily: SERIF, fontStyle: "italic", fontSize: 14, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
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
