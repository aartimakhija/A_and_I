"use client";
import { useState, useRef, useEffect, useCallback } from "react";

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

export function useTilt(rm: boolean, strength = 9) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const [t, setT] = useState({ x: 0, y: 0, on: false });

  const onMove = useCallback((e: React.MouseEvent) => {
    if (rm || raf.current) return;
    const { clientX, clientY } = e;
    raf.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const x = ((clientX - r.left) / r.width - 0.5) * 2;
        const y = ((clientY - r.top) / r.height - 0.5) * 2;
        setT({ x, y, on: true });
      }
      raf.current = null;
    });
  }, [rm]);
  const onLeave = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    setT({ x: 0, y: 0, on: false });
  }, []);

  const style = rm ? {} : {
    transform: `perspective(900px) rotateY(${t.x * strength}deg) rotateX(${t.y * -strength}deg) scale3d(${t.on ? 1.025 : 1},${t.on ? 1.025 : 1},1)`,
    transition: t.on ? "transform 0.06s linear" : "transform 0.55s cubic-bezier(0.2,0.8,0.2,1)",
    willChange: "transform",
  };
  const glare = rm ? { display: "none" as const } : {
    position: "absolute" as const, inset: 0, pointerEvents: "none" as const, borderRadius: "inherit",
    background: `radial-gradient(circle at ${(t.x + 1) * 50}% ${(t.y + 1) * 50}%, rgba(255,255,255,${t.on ? 0.16 : 0}) 0%, transparent 62%)`,
    transition: "background 0.06s linear", mixBlendMode: "overlay" as const,
  };

  return { ref, style, glare, onMove, onLeave };
}
