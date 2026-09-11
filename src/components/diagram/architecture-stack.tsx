import type { ReactNode } from "react";
import { StackScene } from "./stack-scene";
import styles from "./architecture-stack.module.css";

export interface StackLayer {
  label: string;
  detail?: string;
  /** A short sentence printed on the layer itself. */
  note?: string;
  /** Shown under the stack while this layer is in focus (defaults to note). */
  description?: string;
  /** Richer layer content (the hero draws code, checks, a sparkline). */
  body?: ReactNode;
}

/** The site's signature diagram: layers of a system stacked in 3D, the first
 *  one on top. Pointing at a layer opens the stack there and shows what the
 *  layer is for (StackScene). The hero uses it, and so can any article (see
 *  LayerStack), so the site and its essays share one visual language.
 *
 *  Layer faces are rendered here, on the server; only the behaviour ships to
 *  the browser. `description` is the diagram's accessible name. */
export function ArchitectureStack({
  layers,
  description,
  legendLabel,
  idle,
  variant = "hero",
}: {
  layers: StackLayer[];
  description: string;
  legendLabel: string;
  /** Shown under the stack while no layer is in focus. */
  idle?: ReactNode;
  variant?: "hero" | "inline";
}) {
  const plates = layers.map((layer, i) => ({
    label: layer.label,
    description: layer.description ?? layer.note,
    face: (
      <>
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
      </>
    ),
  }));

  return (
    <StackScene
      plates={plates}
      description={description}
      legendLabel={legendLabel}
      idle={idle}
      variant={variant}
    />
  );
}

export { styles as stackStyles };
