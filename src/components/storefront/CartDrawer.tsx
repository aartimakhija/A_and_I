"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useStore } from "./StoreContext";
import { formatINR } from "@/lib/format";

export function CartDrawer() {
  const router = useRouter();
  const { cart, cartOpen, setCartOpen, removeFromCart, subtotal, catalogue, addToCart } = useStore();

  const inCartIds = new Set(cart.map((i) => i.productId));
  const recommendations = catalogue.filter((p) => !inCartIds.has(p.id) && p.variants.some((v) => v.stock > 0)).slice(0, 4);

  return (
    <>
      <div
        onClick={() => setCartOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${cartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-[61] flex w-[min(420px,90vw)] flex-col bg-background transition-transform duration-400 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ borderLeft: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <span className="micro">Your bag ({cart.length})</span>
          <button onClick={() => setCartOpen(false)} className="text-2xl leading-none text-muted-foreground">×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {cart.length === 0 ? (
            <div className="py-16 text-center text-sm font-light text-muted-foreground">
              Your bag is empty.<br />
              <button
                onClick={() => { setCartOpen(false); router.push("/shop/all"); }}
                className="micro mt-3.5 border-b border-foreground pb-0.5 text-foreground"
              >
                Start shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.key} className="flex gap-3.5 border-b border-border py-4">
                <div className="relative aspect-3/4 w-16 shrink-0 overflow-hidden bg-secondary">
                  {item.images[0] && <Image src={item.images[0]} alt={item.name} fill sizes="64px" className="object-cover" />}
                </div>
                <div className="flex-1">
                  <div className="text-base">{item.name}</div>
                  <div className="my-1 text-[10px] tracking-wide text-muted-foreground">
                    Size {item.size}{item.tier ? ` · ${item.tier}` : ""} · {formatINR(item.price)}
                  </div>
                  <button onClick={() => removeFromCart(item.key)} className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground">
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}

          {cart.length > 0 && recommendations.length > 0 && (
            <div className="mt-5 border-t border-border pt-4.5">
              <div className="eyebrow-muted mb-3">We think you would like</div>
              <div className="flex gap-3 overflow-x-auto pb-1.5">
                {recommendations.map((p) => {
                  const firstSize = p.variants.find((v) => v.stock > 0)?.size;
                  return (
                    <div key={p.id} className="w-24 shrink-0">
                      <button onClick={() => { setCartOpen(false); router.push(`/products/${p.slug}`); }} className="block w-full text-left">
                        <div className="relative aspect-3/4 w-full overflow-hidden bg-secondary">
                          {p.images[0] && <Image src={p.images[0]} alt={p.name} fill sizes="96px" className="object-cover" />}
                        </div>
                        <div className="mt-1.5 text-xs leading-tight">{p.name}</div>
                        <div className="mt-0.5 text-[10px] text-muted-foreground">{formatINR(p.price)}</div>
                      </button>
                      {firstSize && (
                        <button onClick={() => addToCart(p, firstSize)} className="mt-1.5 w-full border border-border py-1.5 text-[9px] uppercase tracking-wide hover:border-foreground">
                          + Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="border-t border-border px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="eyebrow-muted">Subtotal</span>
              <span className="font-display text-xl">{formatINR(subtotal)}</span>
            </div>
            <button onClick={() => { setCartOpen(false); router.push("/checkout"); }} className="btn-solid-gold w-full">
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
