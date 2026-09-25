"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useStore } from "./StoreContext";
import { formatPrice } from "@/lib/format";

const CAT_LABEL: Record<string, string> = { ready: "Ready-to-Wear", craft: "Indian Craft", linen: "Linen" };

export function SearchOverlay() {
  const router = useRouter();
  const { catalogue, searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    // Matches name, category, colour and silhouette — not just the product
    // name — so "girih", "wrap" or "olive" all find something, the way a
    // shopper actually searches rather than only exact-title matches.
    return catalogue
      .filter((d) => {
        const haystack = `${d.name} ${CAT_LABEL[d.category] ?? ""} ${d.colorName ?? ""} ${d.silhouette ?? ""}`.toLowerCase();
        return haystack.includes(s);
      })
      .slice(0, 8);
  }, [q, catalogue]);
  const popular = ["Linen", "Girih", "Lilac", "Olive", "Co-ord"];

  const go = (slug: string) => { setSearchOpen(false); router.push(`/products/${slug}`); };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      go(results[0].slug);
    }
    if (e.key === "Escape") setSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[80]" style={{ pointerEvents: searchOpen ? "auto" : "none" }}>
      <div onClick={() => setSearchOpen(false)} className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${searchOpen ? "opacity-100" : "opacity-0"}`} />
      <div
        className={`absolute inset-x-0 top-0 bg-background px-5 pb-9 pt-6 transition-transform duration-400 md:px-14 ${searchOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4 border-b border-foreground pb-3">
            <input
              autoFocus={searchOpen}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search pieces… (try a colour, a fabric, a silhouette)"
              className="flex-1 bg-transparent font-display text-2xl italic text-foreground outline-none md:text-4xl"
            />
            <button onClick={() => setSearchOpen(false)} className="micro tap-scale text-muted-foreground">Close</button>
          </div>
          {!q && (
            <div className="mt-5.5">
              <span className="eyebrow">Popular searches</span>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {popular.map((p) => (
                  <button key={p} onClick={() => setQ(p)} className="tap-scale border border-border px-4 py-2 text-xs hover:border-foreground">{p}</button>
                ))}
              </div>
            </div>
          )}
          {q && (
            <div className="mt-5.5">
              <span className="eyebrow">{results.length} result{results.length !== 1 ? "s" : ""}</span>
              <div className="mt-3.5 grid grid-cols-2 gap-4 md:grid-cols-4">
                {results.map((d) => (
                  <button key={d.id} onClick={() => go(d.slug)} className="group text-left tap-scale">
                    <div className="card-zoom relative aspect-3/4 overflow-hidden bg-secondary">
                      {d.images[0] && <Image src={d.images[0]} alt={d.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />}
                    </div>
                    <div className="mt-2 text-sm">{d.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{formatPrice(d.price)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
