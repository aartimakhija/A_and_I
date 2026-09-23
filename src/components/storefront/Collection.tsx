"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/site/ProductCard";
import { getAvailability } from "@/lib/availability";
import type { SFProduct } from "@/lib/storefront-adapter";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL"];

/** Storefront collection/PLP grid (re-skinned in the new design system).
 * Same data contract and filter behaviour as before this port: category
 * chips still route to /shop/[slug], colour/size/availability filters and
 * the grid-density toggle are all unchanged — only the visual language
 * moved from inline styles onto the new Tailwind tokens. */
export function Collection({ products, category, categories }: {
  products: SFProduct[]; category: string; categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const filters = [{ slug: "all", name: "View All" }, ...categories];
  const label = category === "all" ? "The Collection" : categories.find((c) => c.slug === category)?.name ?? category;

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

  const chip = (active: boolean) =>
    `micro border px-4 py-2 transition-colors ${active ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`;
  const checkboxRow = "flex cursor-pointer items-center gap-2 py-1 text-sm text-foreground";

  return (
    <>
      <header className="shell flex flex-col items-center gap-3 pb-8 pt-16 text-center md:pt-20">
        <span className="eyebrow">SS&apos;26 — {products.length} pieces</span>
        <h1 className="display-lg">
          {category === "all" ? (
            <>The <span className="gold-italic">Collection</span></>
          ) : (
            label
          )}
        </h1>
      </header>

      <div className="shell flex flex-wrap justify-center gap-3 pb-5">
        {filters.map((f) => (
          <button key={f.slug} onClick={() => router.push(`/shop/${f.slug}`)} className={chip(category === f.slug)}>
            {f.name}
          </button>
        ))}
      </div>

      <div className="shell flex justify-center gap-2.5 pb-6">
        <button onClick={() => setFiltersOpen((o) => !o)} className={chip(filtersOpen || activeCount > 0)}>
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
        <button onClick={() => setDense((d) => !d)} className={chip(dense)} aria-label="Toggle grid density">
          {dense ? "Grid: Compact" : "Grid: Standard"}
        </button>
      </div>

      {filtersOpen && (
        <div className="shell mx-auto mb-7 max-w-3xl">
          <div className="grid grid-cols-2 gap-6 border border-border bg-card p-6 sm:grid-cols-3">
            {colorOptions.length > 0 && (
              <div>
                <div className="eyebrow-muted mb-2">Colour</div>
                {colorOptions.map((c) => (
                  <label key={c} className={checkboxRow}>
                    <input type="checkbox" checked={selectedColors.has(c)} onChange={() => toggleInSet(setSelectedColors, c)} />
                    {c}
                  </label>
                ))}
              </div>
            )}
            {sizeOptions.length > 0 && (
              <div>
                <div className="eyebrow-muted mb-2">Size</div>
                {sizeOptions.map((s) => (
                  <label key={s} className={checkboxRow}>
                    <input type="checkbox" checked={selectedSizes.has(s)} onChange={() => toggleInSet(setSelectedSizes, s)} />
                    {s}
                  </label>
                ))}
              </div>
            )}
            <div>
              <div className="eyebrow-muted mb-2">Availability</div>
              {([["in", "Ready to ship"], ["out", "Sold out"]] as const).map(([key, txt]) => (
                <label key={key} className={checkboxRow}>
                  <input type="checkbox" checked={availability.has(key)} onChange={() => toggleInSet(setAvailability, key)} />
                  {txt}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={clearAll}
              disabled={activeCount === 0}
              className={`micro ${activeCount === 0 ? "cursor-default text-border" : "cursor-pointer text-muted-foreground underline hover:text-foreground"}`}
            >
              Clear all
            </button>
            <span className="micro text-muted-foreground">View products ({filtered.length})</span>
          </div>
        </div>
      )}

      <div className={`shell grid gap-4 pb-20 md:gap-6 md:pb-28 ${dense ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3"}`}>
        {filtered.map((d) => (
          <ProductCard key={d.id} product={d} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="shell pb-20 text-center text-sm text-muted-foreground">
          {products.length === 0 ? "No pieces in this category yet." : "No pieces match these filters — try clearing one."}
        </p>
      )}
    </>
  );
}
