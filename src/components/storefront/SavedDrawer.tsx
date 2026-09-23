"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useStore } from "./StoreContext";
import { formatINR } from "@/lib/format";

export function SavedDrawer() {
  const router = useRouter();
  const { catalogue, saved, toggleSaved, savedOpen, setSavedOpen, addToCart } = useStore();
  const items = catalogue.filter((d) => saved.includes(d.id));

  const goProduct = (slug: string) => { setSavedOpen(false); router.push(`/products/${slug}`); };

  return (
    <>
      <div
        onClick={() => setSavedOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-[92] bg-black/45 transition-opacity duration-300 ${savedOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-[93] flex w-[min(440px,92vw)] flex-col bg-background transition-transform duration-500 ${savedOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <span className="micro">Saved ({items.length})</span>
          <button onClick={() => setSavedOpen(false)} className="text-2xl leading-none text-muted-foreground">×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-1.5">
          {items.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Nothing saved yet.<br />
              <button
                onClick={() => { setSavedOpen(false); router.push("/shop/all"); }}
                className="micro mt-4 border-b border-foreground pb-0.5 text-foreground"
              >
                Browse the collection
              </button>
            </div>
          ) : items.map((d) => (
            <div key={d.id} className="flex gap-3.5 border-b border-border py-4">
              <button onClick={() => goProduct(d.slug)} className="relative aspect-3/4 w-[70px] shrink-0 overflow-hidden bg-secondary">
                {d.images[0] && <Image src={d.images[0]} alt={d.name} fill sizes="70px" className="object-cover" />}
              </button>
              <div className="flex-1">
                <div className="text-base">{d.name}</div>
                <div className="my-1 text-xs text-muted-foreground">{formatINR(d.price)}</div>
                <div className="flex gap-3.5">
                  <button onClick={() => addToCart(d, d.variants.find((v) => v.stock > 0)?.size ?? "M")} className="border-b border-foreground pb-0.5 text-[9px] uppercase tracking-wider text-foreground">
                    Add to bag
                  </button>
                  <button onClick={() => toggleSaved(d.id)} className="border-b border-border pb-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
