"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import styles from "./architecture-stack.module.css";

export interface ScenePlate {
  label: string;
  description?: string;
  /** The layer's face, rendered on the server. */
  face: ReactNode;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** The interactive half of ArchitectureStack. Calm by design — nothing moves
 *  on its own:
 *  - a mouse over the stack opens it at the layer under the pointer (the
 *    stack's height maps onto the layers, top first), and the scene tilts a
 *    few degrees toward the pointer;
 *  - the legend focuses a layer on hover or keyboard focus; a click pins it;
 *  - on touch, each tap steps to the next layer.
 *  Leaving returns the stack to rest, or to the pinned layer. */
export function StackScene({
  plates,
  description,
  legendLabel,
  idle,
  variant,
}: {
  plates: ScenePlate[];
  description: string;
  legendLabel: string;
  /** Shown under the stack while no layer is in focus. */
  idle?: ReactNode;
  variant: "hero" | "inline";
}) {
  const n = plates.length;
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const active = hovered ?? pinned;
  const viewportRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef<number | null>(null);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  // Tilt toward the pointer while it's over the stack; ease back on leave.
  useEffect(() => {
    const el = viewportRef.current;
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
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      el.style.setProperty("--tilt-x", x.toFixed(3));
      el.style.setProperty("--tilt-y", y.toFixed(3));
      const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < 0.002;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      targetX = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
      targetY = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1);
      kick();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      kick();
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Mouse over the stack: its height maps onto the layers, top layer first.
  // (Hit-testing the plates themselves would flicker: the focused one moves.)
  const onScrub = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const pos = (((e.clientY - r.top) / r.height - 0.15) / 0.7) * n;
    // Hysteresis: only move once the pointer is well into another layer's
    // band, so resting near a boundary doesn't flicker between two layers.
    const current = hoveredRef.current;
    if (current !== null && Math.abs(pos - (current + 0.5)) < 0.8) return;
    setHovered(clamp(Math.floor(pos), 0, n - 1));
  };
  // Touch or pen: each tap steps to the next layer.
  const onTap = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    setPinned((prev) => (prev === null ? 0 : (prev + 1) % n));
  };

  const mode =
    variant === "hero" ? styles.scrollSpread : `${styles.inline} ${styles.viewSpread}`;

  return (
    <div className={`${styles.figure} ${mode}`}>
      <div
        ref={viewportRef}
        role="img"
        aria-label={description}
        className={styles.viewport}
        onPointerMove={onScrub}
        onPointerLeave={() => setHovered(null)}
        onPointerUp={onTap}
      >
        <div className={styles.scene} style={{ "--n": n } as CSSProperties} aria-hidden>
          <div className={styles.floor} />
          {plates.map((plate, i) => (
            <div
              key={i}
              className={styles.plate}
              style={{ "--i": i } as CSSProperties}
              data-state={
                active === null
                  ? undefined
                  : i < active
                    ? "above"
                    : i === active
                      ? "active"
                      : "below"
              }
            >
              <div className={styles.face}>{plate.face}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.legend} role="group" aria-label={legendLabel}>
        {plates.map((plate, i) => (
          <button
            key={i}
            type="button"
            className={styles.legendItem}
            aria-pressed={active === i}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setHovered(i);
            }}
            onPointerLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            onClick={() => setPinned((prev) => (prev === i ? null : i))}
          >
            <span className={styles.legendIndex}>{String(i + 1).padStart(2, "0")}</span>
            {plate.label}
          </button>
        ))}
      </div>
      <p className={styles.description}>
        {active !== null ? plates[active]?.description : idle}
      </p>
    </div>
  );
}
