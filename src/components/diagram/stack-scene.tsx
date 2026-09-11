"use client";

import {
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

/** The interactive half of ArchitectureStack. Calm by design — nothing moves
 *  on its own:
 *  - pointing at a layer opens the stack at that layer;
 *  - the legend focuses a layer on hover or keyboard focus; a click pins it;
 *  - on touch, tapping a layer pins it (tap again to let go).
 *  Leaving returns the stack to rest, or to the pinned layer.
 *
 *  Which layer is "under the pointer" comes from invisible hit surfaces, one
 *  per layer, fixed at the layers' resting positions. The visible layers move
 *  when the stack opens; if they were the hit targets, the focus would jump as
 *  the geometry shifted under a still pointer. For the same reason the scene
 *  never tilts toward the pointer: a target that moves while you reach for
 *  it is one you miss. */
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

  // A mouse entering a layer's hit surface focuses it. Moving into the gap
  // between layers keeps the last one, so the focus doesn't blink off.
  const onEnterLayer =
    (i: number) => (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse") setHovered(i);
    };
  // Touch or pen: tapping a layer pins it; tapping it again lets go.
  const onTapLayer = (i: number) => (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    setPinned((prev) => (prev === i ? null : i));
  };

  const mode =
    variant === "hero"
      ? styles.scrollSpread
      : `${styles.inline} ${styles.viewSpread}`;

  return (
    <div className={`${styles.figure} ${mode}`}>
      <div
        role="img"
        aria-label={description}
        className={styles.viewport}
        onPointerLeave={() => setHovered(null)}
      >
        <div
          className={styles.scene}
          style={{ "--n": n } as CSSProperties}
          aria-hidden
        >
          <div className={styles.floor} />
          {/* Bottom layer first, top layer last. Chrome paints a 3D scene by
              depth, but where hit surfaces overlap it picks the one later in
              the DOM — so DOM order has to match depth order, or pointing at
              a layer would select the one beneath it. */}
          {plates
            .map((_, i) => i)
            .reverse()
            .map((i) => (
              <div
                key={`hit-${i}`}
                className={styles.hit}
                style={{ "--i": i } as CSSProperties}
                onPointerEnter={onEnterLayer(i)}
                onPointerUp={onTapLayer(i)}
              />
            ))}
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
            <span className={styles.legendIndex}>
              {String(i + 1).padStart(2, "0")}
            </span>
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
