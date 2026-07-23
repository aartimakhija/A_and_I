"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF, peso } from "./theme";
import { Photo, Eyebrow, Title, Btn } from "./primitives";
import { CField } from "./CField";
import { useStore } from "./StoreContext";

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
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

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
        name: "A & I — Style With Us",
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
          } catch {
            // webhook will still reconcile the order even if this verify call fails
            setOrderNo(json.number);
            setPlaced(true);
            clearCart();
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

  const wrap: React.CSSProperties = { maxWidth: 1120, margin: "0 auto", padding: "clamp(40px,6vw,80px) clamp(20px,4vw,48px)" };

  if (placed) {
    return (
      <section style={wrap}>
        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center", padding: "clamp(20px,5vw,50px) 0" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 26px", border: `1px solid ${T.gold}`,
            display: "flex", alignItems: "center", justifyContent: "center", color: T.gold, fontSize: 28 }}>✓</div>
          <Eyebrow>Order confirmed</Eyebrow>
          <Title size="clamp(30px,4.4vw,52px)">Thank you.</Title>
          <p style={{ fontFamily: SANS, fontWeight: 300, color: T.mid, fontSize: 15, lineHeight: 1.7, marginTop: 18 }}>
            Your pieces are being prepared with care. A confirmation is on its way to <strong style={{ color: T.ink, fontWeight: 400 }}>{f.email}</strong>.
          </p>
          <div style={{ margin: "26px auto 0", padding: "16px 20px", maxWidth: 300, border: `1px solid ${T.border}`, background: T.card }}>
            <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: T.stone }}>Order number</span>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 24, color: T.ink, marginTop: 4 }}>{orderNo}</div>
          </div>
          <div style={{ marginTop: 34 }}><Btn onClick={() => router.push("/shop/all")}>Continue shopping</Btn></div>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section style={wrap}>
        <div style={{ textAlign: "center", padding: "clamp(30px,7vw,80px) 0" }}>
          <Eyebrow>Checkout</Eyebrow>
          <Title size="clamp(28px,4vw,46px)">Your bag is empty.</Title>
          <div style={{ marginTop: 26 }}><Btn onClick={() => router.push("/shop/all")}>Browse the collection</Btn></div>
        </div>
      </section>
    );
  }

  const rowStyle = { display: "flex", gap: 14 };
  const groupTitle = (n: string, t: string) => (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "0 0 16px" }}>
      <span style={{ fontFamily: SERIF, fontStyle: "italic", color: T.gold, fontSize: 20 }}>{n}</span>
      <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: T.ink }}>{t}</span>
    </div>
  );

  return (
    <section style={wrap}>
      <div style={{ textAlign: "center", marginBottom: "clamp(30px,4vw,52px)" }}>
        <Eyebrow>Secure Checkout</Eyebrow>
        <Title size="clamp(30px,4.4vw,54px)">Almost <span style={{ fontStyle: "italic", color: T.gold }}>yours.</span></Title>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "clamp(28px,4vw,60px)", alignItems: "start" }} className="grid-2">
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          <div>
            {groupTitle("01", "Contact")}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <CField label="Email" value={f.email} onChange={set("email")} error={err.email} type="email" placeholder="you@email.com" />
              <CField label="Phone" value={f.phone} onChange={set("phone")} error={err.phone} inputMode="numeric" placeholder="10-digit mobile" />
            </div>
          </div>

          <div>
            {groupTitle("02", "Shipping address")}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <CField label="Full name" value={f.name} onChange={set("name")} error={err.name} placeholder="First and last name" />
              <CField label="Address" value={f.address} onChange={set("address")} error={err.address} placeholder="House no., street, area" />
              <div style={rowStyle} className="co-row">
                <div style={{ flex: 1 }}><CField label="City" value={f.city} onChange={set("city")} error={err.city} /></div>
                <div style={{ flex: 1 }}><CField label="State" value={f.state} onChange={set("state")} error={err.state} /></div>
                <div style={{ flex: 1 }}><CField label="PIN" value={f.pin} onChange={set("pin")} error={err.pin} inputMode="numeric" /></div>
              </div>
            </div>
          </div>

          <div>
            {groupTitle("03", "Payment")}
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13, lineHeight: 1.7, color: T.mid }}>
              Card, UPI, and netbanking are handled securely inside Razorpay's payment window — we never see or store your card details.
            </p>
            {apiError && <div style={{ background: "#fdecea", color: "#B0503E", padding: 12, marginTop: 12, fontSize: 12 }}>{apiError}</div>}
          </div>
        </div>

        <div style={{ position: "sticky", top: 84 }} className="co-summary">
          <div style={{ background: T.card, border: `1px solid ${T.border}`, padding: "clamp(22px,3vw,32px)" }}>
            <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: T.ink }}>Order summary</span>
            <div style={{ margin: "18px 0", display: "flex", flexDirection: "column", gap: 14 }}>
              {cart.map((item) => (
                <div key={item.key} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 48, flexShrink: 0 }}><Photo images={item.images} color={item.color} ratio="3/4" /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: T.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                    <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1, color: T.stone }}>Size {item.size}{item.tier ? ` · ${item.tier}` : ""}</div>
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 12, color: T.ink }}>{peso(item.price)}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 13, color: T.mid }}>
                <span>Subtotal</span><span>{peso(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 13, color: T.mid }}>
                <span>Shipping</span><span style={{ color: T.gold }}>{subtotal >= 5000 ? "Complimentary" : peso(99)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
                <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.ink }}>Total</span>
                <span style={{ fontFamily: SERIF, fontSize: 26, color: T.ink }}>{peso(subtotal + (subtotal >= 5000 ? 0 : 99))}</span>
              </div>
              <span style={{ fontFamily: SANS, fontSize: 10, color: T.stone, marginTop: 2 }}>Inclusive of all taxes</span>
            </div>
            <div style={{ marginTop: 22 }}>
              <Btn full onClick={placeOrder}>{processing ? "Processing…" : `Pay ${peso(subtotal + (subtotal >= 5000 ? 0 : 99))}`}</Btn>
            </div>
            <button onClick={() => router.push("/shop/all")} style={{ width: "100%", marginTop: 12, background: "none", border: "none", cursor: "pointer",
              fontFamily: SANS, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: T.stone }}>Continue shopping</button>
          </div>
        </div>
      </div>
    </section>
  );
}
