import type { CSSProperties, ReactNode } from "react";
import { TiltScene } from "./tilt-scene";
import styles from "./architecture-stack.module.css";

export interface StackLayer {
  label: string;
  detail?: string;
  /** A short sentence printed on the layer. */
  note?: string;
  /** Richer layer content (the hero draws code, checks, a sparkline). */
  body?: ReactNode;
}

/** The site's signature diagram: layers of a system stacked in 3D, the first
 *  one on top. It tilts with the pointer, opens as you scroll and runs a signal
 *  down through the layers. The hero uses it, and so can any article (see
 *  LayerStack), so the site and its essays share one visual language.
 *
 *  Decorative to assistive tech: `description` is its accessible name. */
export function ArchitectureStack({
  layers,
  description,
  variant = "hero",
}: {
  layers: StackLayer[];
  description: string;
  variant?: "hero" | "inline";
}) {
  const n = layers.length;
  const mode =
    variant === "hero" ? styles.scrollSpread : `${styles.inline} ${styles.viewSpread}`;

  return (
    <figure role="img" aria-label={description} className={`${styles.figure} ${mode}`}>
      <TiltScene className={styles.viewport}>
        <div
          className={styles.scene}
          style={{ "--n": n } as CSSProperties}
          aria-hidden
        >
          <div className={styles.floor} />
          {layers.map((layer, i) => (
            <div
              key={`${i}-${layer.label}`}
              className={styles.plate}
              style={{ "--i": i } as CSSProperties}
            >
              <div className={styles.face}>
                <div className={styles.head}>
                  <span>
                    <span className={styles.index}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.label}>{layer.label}</span>
                  </span>
                  {layer.detail && (
                    <span className={styles.detail}>{layer.detail}</span>
                  )}
                </div>
                {layer.note && <p className={styles.note}>{layer.note}</p>}
                {layer.body}
              </div>
              {i < n - 1 && <span className={styles.riser} />}
            </div>
          ))}
        </div>
      </TiltScene>
    </figure>
  );
}

export { styles as stackStyles };
