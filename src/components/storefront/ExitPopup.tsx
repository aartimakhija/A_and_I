"use client";
import { useState, useEffect, useRef } from "react";
import { T, SANS, SERIF } from "./theme";
import { Photo, Eyebrow, Title, Btn } from "./primitives";
import { useStore } from "./StoreContext";

export function ExitPopup() {
  const { catalogue } = useStore();
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const fired = useRef(false);

  useEffect(() => {
    const onOut = (e: MouseEvent) => { if (!fired.current && e.clientY <= 0 && !e.relatedTarget) { fired.current = true; setShow(true); } };
    const t = setTimeout(() => document.addEventListener("mouseout", onOut), 6000);
    return () => { clearTimeout(t); document.removeEventListener("mouseout", onOut); };
  }, []);

  if (!show) return null;
  const feature = catalogue[0];

  async function claim() {
    if (!email || !feature) return;
    try { await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: feature.id, email }) }); } catch {}
    setDone(true);
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 96, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={() => setShow(false)} style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.55)" }} />
      <div style={{ position: "relative", background: T.bg, width: "min(460px,94vw)", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="grid-2">
        <div style={{ minHeight: 220 }}>
          {feature && <Photo images={feature.images} color={feature.color} ratio="auto" fit="cover" style={{ height: "100%", aspectRatio: "auto" }} />}
        </div>
        <div style={{ padding: "30px 26px", position: "relative" }}>
          <button onClick={() => setShow(false)} style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", cursor: "pointer", fontSize: 22, color: T.stone }}>×</button>
          <Eyebrow>Before you go</Eyebrow>
          <Title size="26px" style={{ margin: "8px 0 10px" }}>Take <i>10% off</i></Title>
          <p style={{ fontFamily: SANS, fontSize: 12.5, color: T.stone, lineHeight: 1.6, marginBottom: 16 }}>
            Join the A & I Post for early access to the next drop — and a welcome code.
          </p>
          {done ? (
            <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 18, color: T.ink }}>You're on the list ✓</p>
          ) : (
            <>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" type="email"
                style={{ width: "100%", padding: "12px 14px", border: `1px solid ${T.ink}`, marginBottom: 10, fontFamily: SANS, fontSize: 13, color: T.ink, outline: "none", background: T.card }} />
              <Btn full onClick={claim}>Claim my code</Btn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
