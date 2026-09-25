"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductCard } from "@/components/site/ProductCard";
import { getAvailability } from "@/lib/availability";
import type { SFProduct } from "@/lib/storefront-adapter";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL"];

/** Storefront collection/PLP grid (re-skinned in the new design system).
 * Same data contract and filter behaviour as before this port: category
 * chips still route to /shop/[slug], colour/size/availability filters and
 * the grid-density toggle are all unchanged — only the visual language
 * moved from inline styles onto the new Tailwind tokens. */
export function Collection({ products, category, categories, categoryTiles = [] }: {
  products: SFProduct[]; category: string; categories: { slug: string; name: string }[];
  categoryTiles?: { slug: string; name: string; imageUrl?: string | null }[];
}) {
  const router = useRouter();
  const filters = [{ slug: "all", name: "View All" }, ...categories];
  const label = category === "all" ? "The Collection" : categories.find((c) => c.slug === category)?.name ?? category;

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dense, setDense] = useState(false); // grid-view toggle: 3-col (default) vs 4-col (dense)
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [availability, setAvailability] = useState<Set<string>>(new Set()); // "in" | "out"
  const [search, setSearch] = useState("");
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("availability");
      if (q === "in" || q === "out") { setAvailability(new Set([q])); setFiltersOpen(true); }
    } catch {}
  }, []);

  const colorOptions = useMemo(() => [...new Set(products.map((p) => p.colorName).filter(Boolean))].sort() as string[], [products]);
  const sizeOptions = useMemo(() => SIZE_ORDER.filter((s) => products.some((p) => p.variants.some((v) => v.size === s))), [products]);

  const filtered = useMemo(() => products.filter((p) => {
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const haystack = `${p.name} ${p.colorName ?? ""} ${p.silhouette ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (selectedColors.size > 0 && (!p.colorName || !selectedColors.has(p.colorName))) return false;
    if (selectedSizes.size > 0 && !p.variants.some((v) => selectedSizes.has(v.size) && v.stock > 0)) return false;
    const inStock = getAvailability(p).canAddToBag;
    if (availability.size > 0) {
      const matchesIn = availability.has("in") && inStock;
      const matchesOut = availability.has("out") && !inStock;
      if (!matchesIn && !matchesOut) return false;
    }
    return true;
  }), [products, selectedColors, selectedSizes, availability, search]);

  function toggleInSet(setter: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) {
    setter((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  }
  function clearAll() { setSelectedColors(new Set()); setSelectedSizes(new Set()); setAvailability(new Set()); }
  const activeCount = selectedColors.size + selectedSizes.size + availability.size;
  const searchClass =
    "w-full border border-border bg-transparent px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-foreground focus:outline-none sm:w-52";

  const chip = (active: boolean) =>
    `micro border px-4 py-2 transition-colors ${active ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`;
  const checkboxRow = "flex cursor-pointer items-center gap-2 py-1 text-sm text-foreground";

  return (
    <>
      <header className="shell pb-8 pt-16 text-center md:pt-20">
        <span className="eyebrow">SS&apos;26 — {products.length} pieces</span>
        <h1 className="display-xl mt-4">
          {category === "all" ? (
            <>Shop <span className="gold-italic">everything.</span></>
          ) : (
            label
          )}
        </h1>
        {category === "all" && (
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Explore the complete catalogue through verified garment views. Price, fit, availability
            and delivery are confirmed the moment you enquire.
          </p>
        )}
      </header>

      {category === "all" && categoryTiles.length > 0 && (
        <section className="shell pb-14">
          <h2 className="eyebrow-muted text-center md:text-left">Shop by category</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-5">
            {categoryTiles.map((t) => (
              <button
                key={t.slug}
                onClick={() => router.push(`/shop/${t.slug}`)}
                className="reveal group block text-left"
              >
                <span className="relative block aspect-4/5 overflow-hidden bg-secondary">
                  {t.imageUrl && (
                    <Image
                      src={t.imageUrl}
                      alt={`${t.name} — by A&I`}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </span>
                <span className="micro mt-3 block text-foreground">{t.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="shell mb-1 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-wrap gap-2.5">
          {filters.map((f) => (
            <button key={f.slug} onClick={() => router.push(`/shop/${f.slug}`)} className={chip(category === f.slug)}>
              {f.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search this collection…"
              className={searchClass}
              aria-label="Search this collection"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            )}
          </div>
          <button onClick={() => setFiltersOpen((o) => !o)} className={chip(filtersOpen || activeCount > 0)}>
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
          <button onClick={() => setDense((d) => !d)} className={chip(dense)} aria-label="Toggle grid density">
            {dense ? "Grid: Compact" : "Grid: Standard"}
          </button>
        </div>
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
        {filtered.map((d, i) => (
          <div key={d.id} className="reveal" style={{ transitionDelay: `${(i % 8) * 60}ms` }}>
            <ProductCard product={d} />
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="shell pb-20 text-center text-sm text-muted-foreground">
          {products.length === 0
            ? "No pieces in this category yet."
            : search.trim()
            ? `No pieces match “${search.trim()}”.`
            : "No pieces match these filters — try clearing one."}
        </p>
      )}
    </>
  );
}
