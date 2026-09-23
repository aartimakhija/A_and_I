"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SIZES } from "./theme";
import { Lightbox } from "./Lightbox";
import { SizeChartButton } from "./SizeChartButton";
import { AccordionTabStrip } from "./AccordionTabStrip";
import { useStore } from "./StoreContext";
import { getAvailability } from "@/lib/availability";
import { formatINR } from "@/lib/format";
import { ProductCard } from "@/components/site/ProductCard";
import type { SFProduct } from "@/lib/storefront-adapter";

const CAT_LABEL: Record<string, string> = { ready: "Ready-to-Wear", craft: "Indian Craft", linen: "Linen" };

export function Product({ product, related, defaultDeliveryNotes }: { product: SFProduct; related: SFProduct[]; defaultDeliveryNotes?: string | null }) {
  const router = useRouter();
  const { addToCart, saved, toggleSaved, styleProfile } = useStore();
  const recommended = styleProfile?.recommendedSize;
  const recommendedInStock = recommended && product.variants.find((v) => v.size === recommended && v.stock > 0);
  const [size, setSize] = useState(recommendedInStock ? recommended! : product.variants.find((v) => v.stock > 0)?.size ?? SIZES[2]);
  const [tier, setTier] = useState(product.tiers[0]?.label);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [reserveName, setReserveName] = useState("");
  const [reserveEmail, setReserveEmail] = useState("");
  const [reservePhone, setReservePhone] = useState("");
  const [reserveLocation, setReserveLocation] = useState("");
  const [reserving, setReserving] = useState(false);
  const [reserved, setReserved] = useState<{ discountCode: string } | null>(null);
  const [reserveError, setReserveError] = useState("");

  const availability = getAvailability(product);
  const soldOut = availability.status === "SOLD_OUT";
  const tierAdd = product.tiers.find((t) => t.label === tier)?.priceAdd ?? 0;
  const finalPrice = product.price + tierAdd;
  const isSaved = saved.includes(product.id);
  const sizeStock = (s: string) => product.variants.find((v) => v.size === s)?.stock ?? 0;
  const catLabel = CAT_LABEL[product.category] ?? product.category;

  async function requestNotify() {
    if (!notifyEmail) return;
    try {
      await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id, email: notifyEmail, size }) });
    } catch {}
    setNotified(true);
  }

  async function reserve() {
    if (!reserveName.trim()) { setReserveError("Enter your name"); return; }
    if (!reserveEmail) { setReserveError("Enter your email"); return; }
    setReserving(true);
    setReserveError("");
    try {
      const res = await fetch("/api/preorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, size, name: reserveName, email: reserveEmail, phone: reservePhone || undefined, location: reserveLocation || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not reserve — try again");
      setReserved({ discountCode: json.discountCode });
    } catch (e: any) {
      setReserveError(e.message);
    } finally {
      setReserving(false);
    }
  }

  return (
    <>
      {lightbox && (
        <Lightbox imgs={product.images} index={activeImg} setIndex={setActiveImg} onClose={() => setLightbox(false)} name={product.name} />
      )}

      <div className="shell pt-5">
        <button onClick={() => router.push(`/shop/${product.category}`)} className="micro text-muted-foreground hover:text-foreground">
          ← Back to collection
        </button>
      </div>

      <section className="shell grid items-start gap-8 py-6 pb-16 md:grid-cols-[1.1fr_1fr] md:gap-14 md:pb-24">
        {/* Gallery: sticky main image + thumbnail rail, click to open lightbox */}
        <div className="md:sticky md:top-24">
          <button
            type="button"
            onClick={() => product.images.length && setLightbox(true)}
            className="relative block aspect-4/5 w-full overflow-hidden bg-secondary"
            style={!product.images.length ? { background: `linear-gradient(155deg, ${product.color}26 0%, var(--paper) 120%)` } : undefined}
            aria-label="Open full-screen view"
          >
            {product.images[activeImg] && (
              <Image src={product.images[activeImg]} alt={product.name} fill sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" priority />
            )}
          </button>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActiveImg(i)}
                  className={`relative aspect-4/5 w-16 shrink-0 overflow-hidden bg-secondary transition-opacity ${i === activeImg ? "opacity-100 ring-1 ring-foreground" : "opacity-60 hover:opacity-100"}`}
                >
                  <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between">
            <span className="eyebrow">{catLabel}</span>
            <button onClick={() => toggleSaved(product.id)} aria-label="Save to wishlist" className={`text-xl leading-none ${isSaved ? "text-primary" : "text-muted-foreground"}`}>
              {isSaved ? "♥" : "♡"}
            </button>
          </div>
          <h1 className="display-lg my-2.5">{product.name}</h1>

          <div className="mb-2">
            {finalPrice === product.price ? (
              product.mrp && product.discountPercent ? (
                <span className="inline-flex flex-wrap items-baseline gap-2">
                  <span className="text-sm text-muted-foreground line-through">{formatINR(product.mrp)}</span>
                  <span className="text-base font-medium">{formatINR(product.price)}</span>
                  <span className="text-xs font-semibold text-primary">{product.discountPercent}% off</span>
                </span>
              ) : (
                <span className="text-base">{formatINR(product.price)}</span>
              )
            ) : (
              <span className="text-base">{formatINR(finalPrice)}</span>
            )}
          </div>

          <div className={`micro mb-6 ${availability.status === "SOLD_OUT" ? "text-destructive" : "text-primary"}`}>
            {availability.status === "PRE_ORDER" ? "Pre-order — made once enough of you reserve" : availability.status === "SOLD_OUT" ? "Sold out — join the waitlist" : availability.label}
          </div>

          <p className="mb-5 text-xs text-muted-foreground">
            Dispatched in 3–5 days · Free shipping over ₹5,000 · Returns within 7 days
          </p>

          <AccordionTabStrip tabs={[
            { label: "Description", content: product.story ?? "" },
            { label: "Features", content: product.features ?? "" },
            { label: "Fit", content: product.fitNotes ?? "" },
            { label: "Care", content: product.careNotes ?? "" },
            { label: "Delivery", content: product.deliveryNotes ?? defaultDeliveryNotes ?? "" },
          ]} />

          {(!soldOut || product.preOrder) && (
            <>
              <div className="mb-2 mt-8 flex flex-wrap items-baseline gap-2">
                <span className="eyebrow">Size</span>
                {recommended && (
                  <span className="text-xs text-primary">
                    · we&apos;d suggest {recommended}{" "}
                    <a href="/fit-quiz" className="text-muted-foreground underline">(retake quiz)</a>
                  </span>
                )}
                <span className="ml-auto"><SizeChartButton category={product.category} /></span>
              </div>
              <div className="flex gap-2.5">
                {SIZES.map((s) => {
                  const stock = sizeStock(s);
                  const disabled = stock === 0 && !product.preOrder;
                  return (
                    <button
                      key={s}
                      disabled={disabled}
                      onClick={() => setSize(s)}
                      className={`h-11 w-11 text-xs transition-colors ${
                        disabled ? "cursor-not-allowed border border-border text-border line-through" :
                        size === s ? "border border-foreground bg-foreground text-background" :
                        "cursor-pointer border border-border text-foreground hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {product.tiers.length > 0 && (!soldOut || product.preOrder) && (
            <>
              <div className="mb-2 mt-6"><span className="eyebrow">Fabric</span></div>
              <div className="flex flex-col gap-2">
                {product.tiers.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setTier(t.label)}
                    className={`flex justify-between px-3.5 py-2.5 text-left text-xs transition-colors ${
                      tier === t.label ? "border border-foreground bg-secondary text-foreground" : "border border-border text-muted-foreground hover:border-foreground"
                    }`}
                  >
                    <span>{t.label}</span>
                    <span>{t.priceAdd > 0 ? `+${formatINR(t.priceAdd)}` : "Included"}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="mt-8 max-w-sm">
            {product.preOrder ? (
              reserved ? (
                <div>
                  <p className="gold-italic font-display text-base">You&apos;re reserved ✓</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    We&apos;ll email you the moment it&apos;s made. Use code <strong className="text-primary">{reserved.discountCode}</strong> for an early-access discount at checkout.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="micro mb-2.5 text-primary">Pre-order — not yet in production</div>
                  {reserveError && <div className="mb-2.5 bg-destructive/10 p-2.5 text-xs text-destructive">{reserveError}</div>}
                  <input value={reserveName} onChange={(e) => setReserveName(e.target.value)} placeholder="Your name" className="field-line mb-2" />
                  <input value={reserveEmail} onChange={(e) => setReserveEmail(e.target.value)} placeholder="your@email.com" type="email" className="field-line mb-2" />
                  <input value={reservePhone} onChange={(e) => setReservePhone(e.target.value)} placeholder="Phone (optional)" className="field-line mb-2" />
                  <input value={reserveLocation} onChange={(e) => setReserveLocation(e.target.value)} placeholder="City (optional)" className="field-line mb-3" />
                  <button onClick={reserve} className="btn-solid-gold w-full">{reserving ? "Reserving…" : `Reserve — Size ${size}`}</button>
                  <p className="mt-2 text-xs text-muted-foreground">No payment now. We only go into production once enough of you commit — you&apos;ll get an early-access discount for reserving.</p>
                </div>
              )
            ) : soldOut ? (
              notified ? (
                <p className="gold-italic font-display text-base">We&apos;ll email you when it&apos;s back ✓</p>
              ) : (
                <div className="flex gap-2">
                  <input value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} placeholder="your@email.com" type="email" className="field-line flex-1" />
                  <button onClick={requestNotify} className="btn-outline-ink shrink-0">Notify me</button>
                </div>
              )
            ) : (
              <button onClick={() => addToCart(product, size, tier)} className="btn-solid-gold w-full">
                Add to bag — {formatINR(finalPrice)}
              </button>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-card py-16 md:py-24">
          <div className="shell">
            <div className="mb-8">
              <span className="eyebrow">Complete the look</span>
              <h2 className="display-md mt-2">You may also <span className="gold-italic">like</span></h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile-only sticky CTA — the primary action stays thumb-reachable
          regardless of scroll depth, mirroring whichever action is live above. */}
      <div className="pdp-sticky-bar fixed inset-x-0 bottom-0 z-40 hidden border-t border-border bg-background p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        {product.preOrder ? (
          reserved ? null : <button onClick={reserve} className="btn-solid-gold w-full">{reserving ? "Reserving…" : `Reserve — Size ${size}`}</button>
        ) : soldOut ? (
          notified ? null : <button onClick={requestNotify} className="btn-solid-gold w-full">Notify me</button>
        ) : (
          <button onClick={() => addToCart(product, size, tier)} className="btn-solid-gold w-full">Add to bag — {formatINR(finalPrice)}</button>
        )}
      </div>
    </>
  );
}
