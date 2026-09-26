"use client";
import { useState, useEffect } from "react";

export function usePrefersReducedMotion() {
  const [rm, setRm] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setRm(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return rm;
}

export function useParallax(rm: boolean) {
  useEffect(() => {
    if (rm) return;
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      document.documentElement.style.setProperty("--px", String(x));
      document.documentElement.style.setProperty("--py", String(y));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [rm]);
}

export const layer = (depth: number, rm: boolean) =>
  rm ? {} : {
    transform: `translate3d(calc(var(--px,0) * ${20 / depth}px), calc(var(--py,0) * ${20 / depth}px), 0)`,
    transition: `transform ${0.12 + depth * 0.06}s ease-out`,
    willChange: "transform",
  };

