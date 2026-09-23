"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
    <div className="fixed inset-0 z-[96] flex items-center justify-center p-5">
      <div onClick={() => setShow(false)} className="absolute inset-0 bg-black/55" />
      <div className="relative grid w-[min(460px,94vw)] grid-cols-2 bg-background">
        <div className="relative min-h-[220px] bg-secondary">
          {feature?.images[0] && <Image src={feature.images[0]} alt={feature.name} fill sizes="230px" className="object-cover" />}
        </div>
        <div className="relative p-7">
          <button onClick={() => setShow(false)} className="absolute right-3.5 top-3 text-xl text-muted-foreground">×</button>
          <span className="eyebrow">Before you go</span>
          <h3 className="display-md my-2 text-2xl">Take <span className="gold-italic">10% off</span></h3>
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
            Join the A&amp;I Post for early access to the next drop — and a welcome code.
          </p>
          {done ? (
            <p className="gold-italic font-display text-lg">You&apos;re on the list ✓</p>
          ) : (
            <>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                type="email"
                className="mb-2.5 w-full border border-foreground bg-card px-3.5 py-3 text-sm text-foreground outline-none"
              />
              <button onClick={claim} className="btn-solid-gold w-full">Claim my code</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
