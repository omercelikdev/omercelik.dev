"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import styles from "./flow.module.css";

/** A signal travelling through the stages of a system. In MDX, with plain
 *  string props (the pipeline doesn't evaluate expressions):
 *
 *  <Flow
 *    title="The path of a change"
 *    steps="Manifest: intent, versioned | Contracts: OpenAPI · AsyncAPI | Code | Gate: drift + contract tests"
 *    notes="Intent first. | Derived, never hand-edited. | Generated and completed by people. | Deterministic; no model decides."
 *  />
 *
 *  `steps` are "Label: detail" pairs separated by "|". `notes` (optional) is
 *  one sentence per step, shown while the signal is there. The diagram plays
 *  once when it scrolls into view and can be replayed or stepped by hand;
 *  with reduced motion it renders the finished path, still. */
export function Flow({
  steps,
  notes = "",
  title,
  autoplay = true,
  stepMs = 900,
}: {
  steps: string;
  notes?: string;
  title?: string;
  autoplay?: boolean;
  stepMs?: number;
}) {
  const stages = useMemo(() => parseSteps(steps), [steps]);
  const noteList = useMemo(() => split(notes), [notes]);
  const layout = useMemo(() => layoutSnake(stages.length), [stages.length]);
  const [current, setCurrent] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const played = useRef(false);
  const root = useRef<HTMLElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const id = useId();

  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Play once, the first time the diagram is in view.
  useEffect(() => {
    if (!autoplay || !root.current || played.current) return;
    if (reduced()) {
      played.current = true;
      // Show the finished path; scheduled so the effect itself doesn't render.
      const t = setTimeout(() => setCurrent(stages.length - 1), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !played.current) {
          played.current = true;
          setCurrent(0);
          setPlaying(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(root.current);
    return () => io.disconnect();
  }, [autoplay, stages.length]);

  // Advance while playing; the step that reaches the last stage also stops.
  useEffect(() => {
    const last = stages.length - 1;
    if (!playing || current >= last) return;
    const t = setTimeout(() => {
      const next = current + 1;
      setCurrent(next);
      if (next >= last) setPlaying(false);
    }, stepMs);
    return () => clearTimeout(t);
  }, [playing, current, stages.length, stepMs]);

  // Move the signal along the edge that leads to the current stage.
  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    dot.classList.remove(styles.run);
    const edge = current > 0 ? layout.edges[current - 1] : null;
    if (!edge || reduced()) return;
    dot.style.offsetPath = `path("${edge}")`;
    void dot.getBoundingClientRect(); // restart the animation
    dot.classList.add(styles.run);
  }, [current, layout.edges]);

  const note =
    current >= 0
      ? (noteList[current] ?? stages[current]?.label)
      : (title ?? "");

  return (
    <figure
      ref={root}
      className={styles.figure}
      style={{ "--flow-step": `${stepMs}ms` } as React.CSSProperties}
      aria-labelledby={`${id}-cap`}
    >
      <svg
        className={styles.svg}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        role="img"
        aria-label={`${title ?? "Flow"}: ${stages.map((s) => s.label).join(" → ")}`}
      >
        {layout.edges.map((d, i) => (
          <path
            key={i}
            d={d}
            className={`${styles.edge} ${
              i + 1 < current
                ? styles.done
                : i + 1 === current
                  ? styles.current
                  : ""
            }`}
          />
        ))}
        {stages.map((stage, i) => {
          const p = layout.nodes[i];
          return (
            <g
              key={stage.label + i}
              className={`${styles.node} ${
                i < current ? styles.done : i === current ? styles.current : ""
              }`}
            >
              <rect x={p.x} y={p.y} width={NODE_W} height={NODE_H} rx={8} />
              <text x={p.x + 14} y={p.y + (stage.detail ? 24 : 33)}>
                {stage.label}
              </text>
              {stage.detail && (
                <text className={styles.sub} x={p.x + 14} y={p.y + 41}>
                  {stage.detail}
                </text>
              )}
            </g>
          );
        })}
        <circle ref={dotRef} className={styles.dot} r={4} />
      </svg>
      <figcaption id={`${id}-cap`} className={styles.caption}>
        <p>
          {current >= 0 && (
            <span className="text-faint">
              {current + 1} / {stages.length} ·{" "}
            </span>
          )}
          {note}
        </p>
        <div className={styles.controls}>
          <Control
            label={playing ? "Pause" : "Play"}
            onClick={() => {
              if (playing) return setPlaying(false);
              if (current >= stages.length - 1) setCurrent(0);
              else if (current < 0) setCurrent(0);
              setPlaying(true);
            }}
          >
            {playing ? <Pause /> : <Play />}
          </Control>
          <Control
            label="Step"
            onClick={() => {
              setPlaying(false);
              setCurrent((c) => (c + 1) % stages.length);
            }}
          >
            <StepForward />
          </Control>
          <Control
            label="Reset"
            onClick={() => {
              setPlaying(false);
              setCurrent(-1);
            }}
          >
            <RotateCcw />
          </Control>
        </div>
      </figcaption>
    </figure>
  );
}

function Control({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-7 place-items-center rounded-[var(--radius-md)] border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground [&>svg]:size-3.5"
    >
      {children}
    </button>
  );
}

/* ---- parsing & layout ---- */

const split = (s: string) =>
  s
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);

function parseSteps(steps: string) {
  return split(steps).map((s) => {
    const i = s.indexOf(":");
    return i === -1
      ? { label: s, detail: "" }
      : { label: s.slice(0, i).trim(), detail: s.slice(i + 1).trim() };
  });
}

const NODE_W = 132;
const NODE_H = 56;
const GAP_X = 40;
const GAP_Y = 44;
const PAD = 12;
const PER_ROW = 4;

/** Nodes in rows of four, snaking (left→right, then right→left) so every
 *  connector is a short straight line: horizontal within a row, vertical
 *  between rows. */
function layoutSnake(n: number) {
  const rows = Math.max(1, Math.ceil(n / PER_ROW));
  const cols = Math.min(n, PER_ROW);
  const width = PAD * 2 + cols * NODE_W + (cols - 1) * GAP_X;
  const height = PAD * 2 + rows * NODE_H + (rows - 1) * GAP_Y;
  const nodes = Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / PER_ROW);
    const col = i % PER_ROW;
    const visualCol = row % 2 === 0 ? col : cols - 1 - col;
    return {
      x: PAD + visualCol * (NODE_W + GAP_X),
      y: PAD + row * (NODE_H + GAP_Y),
      row,
    };
  });
  const edges = nodes.slice(1).map((b, i) => {
    const a = nodes[i];
    if (a.row === b.row) {
      const y = a.y + NODE_H / 2;
      return a.x < b.x
        ? `M${a.x + NODE_W} ${y} H${b.x}`
        : `M${a.x} ${y} H${b.x + NODE_W}`;
    }
    const x = a.x + NODE_W / 2;
    return `M${x} ${a.y + NODE_H} V${b.y}`;
  });
  return { width, height, nodes, edges };
}
