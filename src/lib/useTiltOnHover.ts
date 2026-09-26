"use client";

import { useCallback, useRef } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

const DEFAULT_MAX_TILT_DEG = 7;

/**
 * Direction-aware tilt-on-hover, shared by every card that wants it (product
 * cards, curated collection cards, …). Which side the pointer enters/moves
 * on decides which way the card tips — tracked via pointermove and applied
 * through CSS custom properties (imperative style writes, no re-render,
 * rAF-throttled) so it can't jank or fight scroll performance. Touch and
 * prefers-reduced-motion are excluded: only a real mouse-like pointer gets
 * the tilt.
 *
 * Extracted from ProductCard so a second, separately-written card (the
 * homepage's CuratedCard) can't quietly ship its own static, non-direction-
 * aware fallback the way it did before — one implementation, shared.
 *
 * Usage: spread the returned props onto the element that should tilt,
 * give its parent `[perspective:1200px]`, and merge `style` into the
 * element's own inline style (or use it directly if there's nothing else).
 */
export function useTiltOnHover<T extends HTMLElement>(maxTiltDeg: number = DEFAULT_MAX_TILT_DEG) {
  const elRef = useRef<T>(null);
  const rafId = useRef<number | null>(null);
  // Cached once per element instance rather than read on every pointer event.
  const canTilt = useRef<boolean | null>(null);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<T>) => {
      if (canTilt.current === null) {
        canTilt.current =
          window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
      if (!canTilt.current) return;
      const el = elRef.current;
      if (!el) return;

      const clientX = e.clientX;
      const clientY = e.clientY;
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const px = (clientX - rect.left) / rect.width; // 0 (left edge) .. 1 (right edge)
        const py = (clientY - rect.top) / rect.height; // 0 (top edge) .. 1 (bottom edge)
        // Tilt direction follows which side the pointer is on: entering from
        // the left tips the card toward the viewer on that side, entering
        // from the right tips it the other way — same idea vertically.
        const rotateY = (px - 0.5) * 2 * maxTiltDeg;
        const rotateX = (0.5 - py) * 2 * maxTiltDeg;
        el.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
        el.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
        el.style.setProperty("--tilt-scale", "1.02");
      });
    },
    [maxTiltDeg],
  );

  const resetTilt = useCallback(() => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    const el = elRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--tilt-scale", "1");
  }, []);

  const tiltStyle: CSSProperties = {
    transform: "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) scale(var(--tilt-scale, 1))",
  };

  return {
    ref: elRef,
    onPointerMove,
    onPointerLeave: resetTilt,
    onPointerCancel: resetTilt,
    style: tiltStyle,
  };
}
