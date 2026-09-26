"use client";
import { useState, useEffect } from "react";

// PriceTag, Photo, FlipCard, TiltCard, Eyebrow, Btn and Title (the rest of
// this file's original Lovable-ported primitives) were never imported
// anywhere once the newer src/components/site/* components took over the
// same jobs (ProductCard for price + photo display, useTiltOnHover for
// tilt) — removed rather than left as unused dead code that looks live and
// invites a future edit to the wrong copy. useTilt (hooks.ts) was only used
// by TiltCard here and was removed alongside it. Countdown is still used
// (Announce.tsx) and is kept as-is.

export function Countdown({ target }: { target: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  let diff = Math.max(0, target - now);
  const d = Math.floor(diff / 864e5); diff -= d * 864e5;
  const h = Math.floor(diff / 36e5); diff -= h * 36e5;
  const m = Math.floor(diff / 6e4); diff -= m * 6e4;
  const s = Math.floor(diff / 1e3);
  const p = (n: number) => String(n).padStart(2, "0");
  return <span>Next drop in {d}d {p(h)}h {p(m)}m {p(s)}s</span>;
}
