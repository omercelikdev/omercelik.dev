import type { ReactNode } from "react";

/* ---- Custom line-art icons ---- */
const ic = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "size-4",
};
const SpecI = () => (
  <svg {...ic} aria-hidden>
    <path d="M6 2.5h7l5 5V21a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 21z" />
    <path d="M13 2.5V7a.5.5 0 0 0 .5.5H18" />
    <path d="M9.5 13h5M9.5 16.5h5" />
  </svg>
);
const GenI = () => (
  <svg {...ic} aria-hidden>
    <path d="M12 3l1.7 5.1a2 2 0 0 0 1.2 1.2L20 11l-5.1 1.7a2 2 0 0 0-1.2 1.2L12 19l-1.7-5.1a2 2 0 0 0-1.2-1.2L4 11l5.1-1.7a2 2 0 0 0 1.2-1.2z" />
  </svg>
);
const VerI = () => (
  <svg {...ic} aria-hidden>
    <path d="M12 2.8l7 2.6v5.4c0 4.2-3 7.2-7 8.4-4-1.2-7-4.2-7-8.4V5.4z" />
    <path d="M9 11.8l2.2 2.2L15.2 10" />
  </svg>
);
const PkgI = () => (
  <svg {...ic} aria-hidden>
    <path d="M21 8L12 3 3 8l9 5 9-5Z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </svg>
);

/* ---- YAML manifest (left panel) ---- */
const K = "text-foreground";
const V = "text-brand-accent";
const P = "text-faint";
const LINES: ReactNode[] = [
  <><span className={P}># golden-path manifest</span></>,
  <><span className={K}>service</span><span className={P}>: </span><span className={V}>orders</span></>,
  <><span className={K}>contracts</span><span className={P}>:</span></>,
  <><span className={P}>{"  - "}</span><span className={K}>openapi</span><span className={P}>: </span><span className={V}>./api/orders.yaml</span></>,
  <><span className={K}>invariants</span><span className={P}>:</span></>,
  <><span className={P}>{"  - "}</span><span className={K}>idempotency</span><span className={P}>: </span><span className={V}>required</span></>,
  <><span className={P}>{"  - "}</span><span className={K}>auth</span><span className={P}>: </span><span className={V}>bearer</span></>,
];

/* ---- Golden-path pillars (right panel) ---- */
const PILLARS: { icon: ReactNode; label: string; tag: string }[] = [
  { icon: <SpecI />, label: "manifest", tag: "spec-driven" },
  { icon: <GenI />, label: "AI skills", tag: "AI-native" },
  { icon: <VerI />, label: "guardrails", tag: "verified" },
  { icon: <PkgI />, label: "packages", tag: ".NET" },
];

/* ---- Footer pipeline with per-stage state ---- */
type State = "done" | "running" | "ready";
const STAGES: { label: string; state: State }[] = [
  { label: "Spec", state: "done" },
  { label: "Generate", state: "done" },
  { label: "Verify", state: "running" },
  { label: "Ship", state: "ready" },
];

function StageMark({ state }: { state: State }) {
  if (state === "running")
    return (
      <span className="relative flex size-2.5" aria-label="running">
        <span className="absolute inline-flex h-full w-full rounded-full bg-brand-accent" style={{ animation: "node-ring 1.7s ease-out infinite" }} />
        <span className="relative inline-flex size-2.5 rounded-full bg-brand-accent" />
      </span>
    );
  if (state === "done")
    return (
      <svg viewBox="0 0 24 24" className="size-3.5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-label="done">
        <path d="M5 12l4.5 4.5L19 6.5" />
      </svg>
    );
  return <span className="size-2.5 rounded-full border border-border-strong" aria-label="ready" />;
}

export function SpecCard() {
  return (
    <div className="mt-8 w-full max-w-3xl">
      <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-background">
        {/* window header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full border border-border-strong" />
              <span className="size-2.5 rounded-full border border-border-strong" />
              <span className="size-2.5 rounded-full border border-border-strong" />
            </span>
            <span className="mono text-[12px] text-muted-foreground">
              manifest<span className="text-faint">.yaml</span>
            </span>
          </div>
          <span className="mono inline-flex items-center gap-1.5 rounded-full border border-success-border bg-success-bg px-2 py-0.5 text-[10.5px] font-medium text-success">
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12l4.5 4.5L19 6.5" />
            </svg>
            spec-lint passed
          </span>
        </div>

        {/* two panels: spec (left) + golden-path pillars (right) */}
        <div className="grid sm:grid-cols-[1.15fr_1fr]">
          <div className="mono flex gap-4 border-b border-border px-4 py-4 text-[12.5px] leading-[1.7] sm:border-b-0 sm:border-e">
            <div aria-hidden className="select-none text-right text-faint">
              {LINES.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <div className="whitespace-pre">
              {LINES.map((line, i) => (
                <div key={i}>
                  {line}
                  {i === LINES.length - 1 && <span className="caret" aria-hidden />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 px-5 py-4">
            <div className="mono text-[11px] text-faint">// golden path</div>
            {PILLARS.map((p) => (
              <div key={p.label} className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2.5 text-[13px] text-foreground">
                  <span className="text-muted-foreground">{p.icon}</span>
                  {p.label}
                </span>
                <span className="mono rounded-[var(--radius-sm)] border border-border bg-muted px-1.5 py-0.5 text-[10.5px] text-muted-foreground">
                  {p.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* full-width pipeline footer */}
        <div className="mono flex items-center gap-2.5 border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
          {STAGES.map((stage, i) => (
            <div key={stage.label} className="flex flex-1 items-center gap-2.5 last:flex-none">
              <span className="inline-flex items-center gap-1.5">
                <StageMark state={stage.state} />
                {stage.label}
              </span>
              {i < STAGES.length - 1 && <span className="h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
