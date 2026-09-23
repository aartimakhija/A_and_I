"use client";
import { useEffect } from "react";
import Image from "next/image";

export function Lightbox({ imgs, index, setIndex, onClose, name }: {
  imgs: string[]; index: number; setIndex: (fn: (i: number) => number) => void; onClose: () => void; name: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % imgs.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + imgs.length) % imgs.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imgs.length, onClose, setIndex]);
  if (!imgs.length) return null;
  const arrowBtn = "absolute top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/10 text-2xl leading-none text-white/90 hover:bg-white/20";
  return (
    <div className="fixed inset-0 z-[98] flex items-center justify-center bg-black/95" onClick={onClose}>
      <button onClick={onClose} aria-label="Close" className="absolute right-5 top-4 z-[3] text-3xl leading-none text-white/90">×</button>
      {imgs.length > 1 && (
        <button aria-label="Previous" className={`${arrowBtn} left-3.5`} onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + imgs.length) % imgs.length); }}>‹</button>
      )}
      <div className="relative h-[88vh] w-[90vw] max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <Image src={imgs[index]} alt={name} fill sizes="90vw" className="object-contain" />
      </div>
      {imgs.length > 1 && (
        <button aria-label="Next" className={`${arrowBtn} right-3.5`} onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % imgs.length); }}>›</button>
      )}
      {imgs.length > 1 && (
        <div className="micro absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70">
          {index + 1} / {imgs.length}
        </div>
      )}
    </div>
  );
}
