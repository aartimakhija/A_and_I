"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { T, SANS } from "./theme";
import { Eyebrow, Title, TiltCard } from "./primitives";
import { ProductCard } from "./ProductCard";
import { getAvailability } from "@/lib/availability";
import { useStore } from "./StoreContext";
import type { SFProduct } from "@/lib/storefront-adapter";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL"];

export function Collection({ products, category, categories }: {
  products: SFProduct[]; category: string; categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const { rm } = useStore();
  const filters = [{ slug: "all", name: "View All" }, ...categories];

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dense, setDense] = useState(false); // grid-view toggle: 3-col (default) vs 4-col (dense)
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [availability, setAvailability] = useState<Set<string>>(new Set()); // "in" | "out"
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("availability");
      if (q === "in" || q === "out") { setAvailability(new Set([q])); setFiltersOpen(true); }
    } catch {}
  }, []);

  const colorOptions = useMemo(() => [...new Set(products.map((p) => p.colorName).filter(Boolean))].sort() as string[], [products]);
  const sizeOptions = useMemo(() => SIZE_ORDER.filter((s) => products.some((p) => p.variants.some((v) => v.size === s))), [products]);

  const filtered = useMemo(() => products.filter((p) => {
    if (selectedColors.size > 0 && (!p.colorName || !selectedColors.has(p.colorName))) return false;
    if (selectedSizes.size > 0 && !p.variants.some((v) => selectedSizes.has(v.size) && v.stock > 0)) return false;
    const inStock = getAvailability(p).canAddToBag;
    if (availability.size > 0) {
      const matchesIn = availability.has("in") && inStock;
      const matchesOut = availability.has("out") && !inStock;
      if (!matchesIn && !matchesOut) return false;
    }
    return true;
  }), [products, selectedColors, selectedSizes, availability]);

  function toggleInSet(setter: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) {
    setter((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  }
  function clearAll() { setSelectedColors(new Set()); setSelectedSizes(new Set()); setAvailability(new Set()); }
  const activeCount = selectedColors.size + selectedSizes.size + availability.size;

  const chipBtn = (active: boolean): React.CSSProperties => ({
    fontFamily: SANS, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer",
    color: active ? T.ink : T.stone, background: active ? T.linen : "transparent",
    border: `1px solid ${active ? T.ink : T.border}`, padding: "9px 18px", transition: "all 0.25s",
  });
  const checkboxRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, fontFamily: SANS, fontSize: 13, color: T.mid, padding: "5px 0", cursor: "pointer" };

  return (
    <>
      <header style={{ textAlign: "center", padding: "clamp(36px,5vw,64px) 24px clamp(20px,3vw,32px)" }}>
        <Eyebrow>SS'26 — {products.length} pieces</Eyebrow>
        <Title as="h1" size="clamp(28px,4vw,48px)">The <span style={{ fontStyle: "italic", color: T.gold }}>Collection</span></Title>
      </header>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", padding: "0 24px 20px" }}>
        {filters.map((f) => (
          <button key={f.slug} onClick={() => router.push(`/shop/${f.slug}`)} style={chipBtn(category === f.slug)}>
            {f.name}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "0 24px 24px" }}>
        <button onClick={() => setFiltersOpen((o) => !o)} style={chipBtn(filtersOpen || activeCount > 0)}>
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
        <button onClick={() => setDense((d) => !d)} style={chipBtn(dense)} aria-label="Toggle grid density">
          {dense ? "Grid: Compact" : "Grid: Standard"}
        </button>
      </div>

      {filtersOpen && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 24,
            border: `1px solid ${T.border}`, padding: "20px 24px", background: T.card }}>
            {colorOptions.length > 0 && (
              <div>
                <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: T.stone, marginBottom: 8 }}>Colour</div>
                {colorOptions.map((c) => (
                  <label key={c} style={checkboxRow}>
                    <input type="checkbox" checked={selectedColors.has(c)} onChange={() => toggleInSet(setSelectedColors, c)} />
                    {c}
                  </label>
                ))}
              </div>
            )}
            {sizeOptions.length > 0 && (
              <div>
                <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: T.stone, marginBottom: 8 }}>Size</div>
                {sizeOptions.map((s) => (
                  <label key={s} style={checkboxRow}>
                    <input type="checkbox" checked={selectedSizes.has(s)} onChange={() => toggleInSet(setSelectedSizes, s)} />
                    {s}
                  </label>
                ))}
              </div>
            )}
            <div>
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: T.stone, marginBottom: 8 }}>Availability</div>
              {[["in", "Ready to ship"], ["out", "Sold out"]].map(([key, label]) => (
                <label key={key} style={checkboxRow}>
                  <input type="checkbox" checked={availability.has(key)} onChange={() => toggleInSet(setAvailability, key)} />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <button onClick={clearAll} disabled={activeCount === 0}
              style={{ background: "none", border: "none", fontFamily: SANS, fontSize: 11, letterSpacing: 1, textTransform: "uppercase",
                color: activeCount === 0 ? T.border : T.stone, textDecoration: activeCount === 0 ? "none" : "underline", cursor: activeCount === 0 ? "default" : "pointer" }}>
              Clear all
            </button>
            <span style={{ fontFamily: SANS, fontSize: 11, color: T.stone }}>View products ({filtered.length})</span>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${dense ? 4 : 3},1fr)`, gap: dense ? 4 : 8, maxWidth: 1400, margin: "0 auto", padding: "0 clamp(12px,3vw,32px) clamp(64px,9vw,110px)" }} className="grid-catalogue">
        {filtered.map((d) => (
          <TiltCard rm={rm} key={d.id}>
            <ProductCard product={d} />
          </TiltCard>
        ))}
      </div>
      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: T.stone, fontFamily: SANS, padding: "0 24px 80px" }}>
          {products.length === 0 ? "No pieces in this category yet." : "No pieces match these filters — try clearing one."}
        </p>
      )}
    </>
  );
}
