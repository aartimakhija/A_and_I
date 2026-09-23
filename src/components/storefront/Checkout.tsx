"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CField, CSelect } from "./CField";
import { INDIA_STATE_NAMES, INDIA_STATES } from "@/lib/india-locations";
import { useStore } from "./StoreContext";
import { formatINR } from "@/lib/format";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function Checkout() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useStore();
  const [f, setF] = useState({ email: "", phone: "", name: "", address: "", city: "", state: "", pin: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [apiError, setApiError] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; percentOff: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [checkingPromo, setCheckingPromo] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((s) => ({ ...s, [k]: e.target.value }));
  const setSelect = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLSelectElement>) => setF((s) => ({ ...s, [k]: e.target.value }));
  const setState = (e: React.ChangeEvent<HTMLSelectElement>) => setF((s) => ({ ...s, state: e.target.value, city: "" })); // city depends on state — reset it

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aandi:ref");
      if (saved) setPromoInput(saved);
    } catch {}
  }, []);

  async function applyPromo() {
    if (!promoInput.trim()) return;
    setCheckingPromo(true);
    setPromoError("");
    try {
      const res = await fetch(`/api/promo/validate?code=${encodeURIComponent(promoInput.trim())}`);
      const json = await res.json();
      if (!json.valid) { setPromoError("That code isn't valid or has already been used."); setPromo(null); return; }
      setPromo({ code: promoInput.trim().toUpperCase(), percentOff: json.percentOff });
    } finally {
      setCheckingPromo(false);
    }
  }

  const discount = promo ? Math.round(subtotal * (promo.percentOff / 100)) : 0;
  const shippingCost = subtotal >= 5000 ? 0 : 99;
  const total = Math.max(0, subtotal + shippingCost - discount);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email = "Enter a valid email";
    if (!/^\d{10}$/.test(f.phone.replace(/\D/g, ""))) e.phone = "Enter a 10-digit number";
    if (!f.name.trim()) e.name = "Required";
    if (!f.address.trim()) e.address = "Required";
    if (!f.city.trim()) e.city = "Required";
    if (!f.state.trim()) e.state = "Required";
    if (!/^\d{6}$/.test(f.pin)) e.pin = "6-digit PIN";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (processing) return;
    if (!validate()) return;
    setProcessing(true);
    setApiError("");
    try {
      // 1) Create the order server-side — this re-prices from the DB (never
      // trusts the client cart's prices) and opens a Razorpay order.
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: f.email,
          items: cart.map((i) => ({ productId: i.productId, size: i.size, tier: i.tier, qty: i.qty })),
          ship: { name: f.name, phone: f.phone, line1: f.address, city: f.city, state: f.state, pincode: f.pin },
          promoCode: promo?.code,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ? JSON.stringify(json.error) : "checkout failed");

      // 2) Open Razorpay's hosted payment modal — card/UPI/netbanking are all
      // handled inside it, so we never touch raw card details ourselves.
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Could not load payment gateway");

      const rzp = new (window as any).Razorpay({
        key: json.keyId,
        amount: json.amount,
        currency: "INR",
        name: "A&I — Style With Us",
        description: `Order ${json.number}`,
        order_id: json.razorpayOrderId,
        prefill: { email: f.email, contact: f.phone, name: f.name },
        theme: { color: "#1C1A18" },
        handler: async (response: any) => {
          try {
            const v = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: json.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const vjson = await v.json();
            setOrderNo(vjson.number || json.number);
            setPlaced(true);
            clearCart();
            try { localStorage.removeItem("aandi:ref"); } catch {}
          } catch {
            // webhook will still reconcile the order even if this verify call fails
            setOrderNo(json.number);
            setPlaced(true);
            clearCart();
            try { localStorage.removeItem("aandi:ref"); } catch {}
          } finally {
            setProcessing(false);
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
      });
      rzp.open();
    } catch (e: any) {
      setApiError(e.message || "Something went wrong");
      setProcessing(false);
    }
  };

  if (placed) {
    return (
      <section className="shell py-16 md:py-24">
        <div className="mx-auto max-w-lg py-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary text-2xl text-primary">✓</div>
          <span className="eyebrow">Order confirmed</span>
          <h1 className="display-lg mt-2">Thank you.</h1>
          <p className="mt-4 text-[15px] font-light leading-relaxed text-muted-foreground">
            Your pieces are being prepared with care. A confirmation is on its way to <strong className="font-normal text-foreground">{f.email}</strong>.
          </p>
          <div className="mx-auto mt-6 max-w-[300px] border border-border bg-card px-5 py-4">
            <span className="eyebrow-muted">Order number</span>
            <div className="mt-1 font-display text-2xl">{orderNo}</div>
          </div>
          <div className="mt-8"><button onClick={() => router.push("/shop/all")} className="btn-outline-ink">Continue shopping</button></div>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="shell py-16 md:py-24">
        <div className="py-10 text-center">
          <span className="eyebrow">Checkout</span>
          <h1 className="display-md mt-2">Your bag is empty.</h1>
          <div className="mt-6"><button onClick={() => router.push("/shop/all")} className="btn-outline-ink">Browse the collection</button></div>
        </div>
      </section>
    );
  }

  const groupTitle = (n: string, t: string) => (
    <div className="mb-4 flex items-baseline gap-2.5">
      <span className="gold-italic font-display text-xl">{n}</span>
      <span className="micro">{t}</span>
    </div>
  );

  return (
    <section className="shell py-10 md:py-16">
      <div className="mb-10 text-center md:mb-14">
        <span className="eyebrow">Secure Checkout</span>
        <h1 className="display-lg mt-2">Almost <span className="gold-italic">yours.</span></h1>
      </div>

      <div className="grid items-start gap-8 md:grid-cols-[1.4fr_1fr] md:gap-14">
        <div className="flex flex-col gap-8">
          <div>
            {groupTitle("01", "Contact")}
            <div className="flex flex-col gap-3.5">
              <CField label="Email" value={f.email} onChange={set("email")} error={err.email} type="email" placeholder="you@email.com" />
              <CField label="Phone" value={f.phone} onChange={set("phone")} error={err.phone} inputMode="numeric" placeholder="10-digit mobile" />
            </div>
          </div>

          <div>
            {groupTitle("02", "Shipping address")}
            <div className="flex flex-col gap-3.5">
              <CField label="Full name" value={f.name} onChange={set("name")} error={err.name} placeholder="First and last name" />
              <CField label="Address" value={f.address} onChange={set("address")} error={err.address} placeholder="House no., street, area" />
              <div className="flex flex-col gap-3.5 sm:flex-row">
                <div className="flex-1"><CSelect label="State" value={f.state} onChange={setState} error={err.state} options={INDIA_STATE_NAMES} /></div>
                <div className="flex-1">
                  <CSelect label="City" value={f.city} onChange={setSelect("city")} error={err.city}
                    options={f.state ? (INDIA_STATES[f.state] ?? []) : []} disabled={!f.state}
                    placeholder={f.state ? "Select city…" : "Select a state first"} />
                </div>
                <div className="flex-1"><CField label="PIN" value={f.pin} onChange={set("pin")} error={err.pin} inputMode="numeric" /></div>
              </div>
            </div>
          </div>

          <div>
            {groupTitle("03", "Payment")}
            <p className="text-[13px] font-light leading-relaxed text-muted-foreground">
              Card, UPI, and netbanking are handled securely inside Razorpay&apos;s payment window — we never see or store your card details.
            </p>
            {apiError && <div className="mt-3 bg-destructive/10 p-3 text-xs text-destructive">{apiError}</div>}
          </div>
        </div>

        <div className="md:sticky md:top-20">
          <div className="border border-border bg-card p-6 md:p-8">
            <span className="micro">Order summary</span>
            <div className="my-4.5 flex flex-col gap-3.5">
              {cart.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <div className="relative aspect-3/4 w-12 shrink-0 overflow-hidden bg-secondary">
                    {item.images[0] && <Image src={item.images[0]} alt={item.name} fill sizes="48px" className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{item.name}</div>
                    <div className="text-[10px] tracking-wide text-muted-foreground">Size {item.size}{item.tier ? ` · ${item.tier}` : ""}</div>
                  </div>
                  <div className="text-xs">{formatINR(item.price)}</div>
                </div>
              ))}
            </div>
            <div className="mb-1 border-b border-border pb-3.5">
              {promo ? (
                <div className="flex items-center justify-between text-xs text-primary">
                  <span>Code <strong>{promo.code}</strong> applied — {promo.percentOff}% off</span>
                  <button onClick={() => { setPromo(null); setPromoInput(""); }} className="text-base leading-none text-muted-foreground">×</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Promo or referral code" className="field-line flex-1 border px-2.5 py-2 text-xs" />
                  <button onClick={applyPromo} disabled={checkingPromo} className="btn-outline-ink px-3.5 py-2 text-[11px]">
                    {checkingPromo ? "…" : "Apply"}
                  </button>
                </div>
              )}
              {promoError && <div className="mt-1.5 text-[11px] text-destructive">{promoError}</div>}
            </div>
            <div className="flex flex-col gap-2.5 border-t border-border pt-3.5">
              <div className="flex justify-between text-[13px] text-muted-foreground">
                <span>Subtotal</span><span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-muted-foreground">
                <span>Shipping</span><span className="text-primary">{shippingCost === 0 ? "Complimentary" : formatINR(shippingCost)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[13px] text-primary">
                  <span>Discount ({promo?.percentOff}%)</span><span>−{formatINR(discount)}</span>
                </div>
              )}
              <div className="mt-1.5 flex items-baseline justify-between">
                <span className="micro">Total</span>
                <span className="font-display text-2xl">{formatINR(total)}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Inclusive of all taxes</span>
            </div>
            <div className="mt-5">
              <button onClick={placeOrder} className="btn-solid-gold w-full">{processing ? "Processing…" : `Pay ${formatINR(total)}`}</button>
            </div>
            <button onClick={() => router.push("/shop/all")} className="micro mt-3 w-full text-muted-foreground">Continue shopping</button>
          </div>
        </div>
      </div>
    </section>
  );
}
