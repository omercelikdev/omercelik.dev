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

/** How long each layer stays in focus while the stack plays itself. */
const STEP_MS = 2800;
/** Pause on the last layer before starting over. */
const REST_MS = 4200;
/** First step, once the entrance animation has settled. */
const FIRST_MS = 1400;
/** After a tap, a click or keyboard focus: hands off for this long. */
const HOLD_MS = 8000;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
/** When a hand-off that starts now ends. Module scope: reading the clock is
 *  event-handler work, never render work. */
const holdDeadline = () => Date.now() + HOLD_MS;

/** The interactive half of ArchitectureStack. One layer is in focus at a
 *  time: it plays top to bottom on its own while in view, a mouse moving up
 *  and down the stack scrubs through the layers, a tap steps forward, and the
 *  legend below selects a layer directly (keyboard included). The whole scene
 *  also tilts toward a fine pointer. Reduced motion: no autoplay, no tilt —
 *  selection still works, without transitions. */
export function StackScene({
  plates,
  description,
  legendLabel,
  variant,
}: {
  plates: ScenePlate[];
  description: string;
  legendLabel: string;
  variant: "hero" | "inline";
}) {
  const n = plates.length;
  const [active, setActive] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<number | null>(null);
  const hovering = useRef(false);
  const holdUntil = useRef(0);
  const inView = useRef(true);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Autoplay: step through the layers while the stack is in view and nobody
  // is steering it. After someone has, wait a full step before moving on.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = rootRef.current;
    const io = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
    });
    if (root) io.observe(root);

    let timer = 0;
    let steered = false;
    const tick = () => {
      const idle =
        !hovering.current &&
        Date.now() >= holdUntil.current &&
        inView.current &&
        !document.hidden;
      if (!idle) {
        steered = true;
        timer = window.setTimeout(tick, 400);
        return;
      }
      // After someone steered it, give the chosen layer a full step before
      // moving on. A stack that never started (it was off-screen) doesn't
      // wait: it starts the moment it comes into view.
      if (steered && activeRef.current !== null) {
        steered = false;
        timer = window.setTimeout(tick, STEP_MS);
        return;
      }
      steered = false;
      const prev = activeRef.current;
      const next = prev === null ? 0 : (prev + 1) % n;
      setActive(next);
      timer = window.setTimeout(tick, next === n - 1 ? REST_MS : STEP_MS);
    };
    timer = window.setTimeout(tick, FIRST_MS);

    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [n]);

  // Tilt toward a fine pointer, eased so the scene glides rather than snaps.
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
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;
      el.style.setProperty("--tilt-x", x.toFixed(3));
      el.style.setProperty("--tilt-y", y.toFixed(3));
      const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < 0.002;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      targetX = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 1.2), -1, 1);
      targetY = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 1.2), -1, 1);
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Mouse over the stack: its height maps onto the layers, top layer first.
  // (Hit-testing the plates themselves would flicker: the active one moves.)
  const onScrub = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    hovering.current = true;
    const r = e.currentTarget.getBoundingClientRect();
    // Continuous position along the stack, in layers (0 = top of layer 1).
    const pos = (((e.clientY - r.top) / r.height - 0.15) / 0.7) * n;
    // Hysteresis: only move once the pointer is well into another layer's
    // band, so resting near a boundary doesn't flicker between two layers.
    const current = activeRef.current;
    if (current !== null && Math.abs(pos - (current + 0.5)) < 0.8) return;
    setActive(clamp(Math.floor(pos), 0, n - 1));
  };
  // Touch or pen: each tap steps to the next layer.
  const onTap = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    holdUntil.current = holdDeadline();
    setActive((prev) => (prev === null ? 0 : (prev + 1) % n));
  };
  const hold = (i: number) => {
    holdUntil.current = holdDeadline();
    setActive(i);
  };

  const mode =
    variant === "hero" ? styles.scrollSpread : `${styles.inline} ${styles.viewSpread}`;

  return (
    <div ref={rootRef} className={`${styles.figure} ${mode}`}>
      <div
        ref={viewportRef}
        role="img"
        aria-label={description}
        className={styles.viewport}
        onPointerMove={onScrub}
        onPointerLeave={() => {
          hovering.current = false;
        }}
        onPointerUp={onTap}
      >
        <div
          className={styles.scene}
          style={{ "--n": n } as CSSProperties}
          data-live={active !== null ? "" : undefined}
          aria-hidden
        >
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
              if (e.pointerType !== "mouse") return;
              hovering.current = true;
              setActive(i);
            }}
            onPointerLeave={() => {
              hovering.current = false;
            }}
            onFocus={() => hold(i)}
            onClick={() => hold(i)}
          >
            <span className={styles.legendIndex}>{String(i + 1).padStart(2, "0")}</span>
            {plate.label}
          </button>
        ))}
      </div>
      <p className={styles.description}>{plates[active ?? 0]?.description}</p>
    </div>
  );
}
