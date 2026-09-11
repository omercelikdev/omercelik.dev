"use client";

import { useEffect, useRef, type ReactNode } from "react";

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

/** Feeds the pointer position into --tilt-x / --tilt-y (−1…1, relative to
 *  this element's centre), eased so the scene glides rather than snaps. Only
 *  for a fine pointer and without reduced motion; otherwise it's a plain div
 *  and the CSS decides (idle sway on touch, stillness for reduced motion). */
export function TiltScene({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const tick = () => {
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;
      el.style.setProperty("--tilt-x", x.toFixed(3));
      el.style.setProperty("--tilt-y", y.toFixed(3));
      const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < 0.002;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      targetX = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 1.2));
      targetY = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 1.2));
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
