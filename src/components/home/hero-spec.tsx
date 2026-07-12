import type { ReactNode } from "react";

function Check({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12l4.5 4.5L19 6.5" />
    </svg>
  );
}

function Dots() {
  return (
    <span className="flex items-center gap-1.5" aria-hidden>
      <span className="size-2.5 rounded-full border border-border-strong" />
      <span className="size-2.5 rounded-full border border-border-strong" />
      <span className="size-2.5 rounded-full border border-border-strong" />
    </span>
  );
}

/* ---- Left card: the spec manifest ---- */
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

function ManifestCard() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <Dots />
          <span className="mono text-[12px] text-muted-foreground">
            manifest<span className="text-faint">.yaml</span>
          </span>
        </div>
        <span className="mono inline-flex items-center gap-1.5 rounded-full border border-success-border bg-success-bg px-2 py-0.5 text-[10.5px] font-medium text-success">
          <Check />
          spec-lint passed
        </span>
      </div>
      <div className="mono flex gap-4 px-4 py-4 text-[12.5px] leading-[1.7]">
        <div aria-hidden className="select-none text-right text-faint">
          {LINES.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="whitespace-pre">
          {LINES.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Right card: the tooling terminal ---- */
const TERM: ReactNode[] = [
  <><span className={P}>$ </span><span className={K}>dotnet new goldpath</span><span className={P}> -n </span><span className={V}>Orders</span></>,
  <><span className="text-success">✓ </span><span className="text-muted-foreground">scaffolded golden path</span></>,
  <><span className="text-faint">&nbsp;</span></>,
  <><span className={P}>$ </span><span className={K}>specdrift check</span></>,
  <><span className="text-success">✓ </span><span className="text-muted-foreground">0 drift · 12 invariants ok</span></>,
  <><span className={P}>$ </span><span className="caret" /></>,
];

function TerminalCard() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <Dots />
          <span className="mono text-[12px] text-muted-foreground">
            ~/orders <span className="text-faint">— zsh</span>
          </span>
        </div>
        <span className="mono inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2 py-0.5 text-[10.5px] text-muted-foreground">
          AI-native
        </span>
      </div>
      <div className="mono flex flex-col gap-0.5 px-4 py-4 text-[12.5px] leading-[1.7]">
        {TERM.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}

/* ---- Unifying pipeline (full width, below both cards) ---- */
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
    return <Check className="size-3.5 text-muted-foreground" />;
  return <span className="size-2.5 rounded-full border border-border-strong" aria-label="ready" />;
}

function PipelineBar() {
  return (
    <div className="mono flex items-center gap-2.5 rounded-[var(--radius-2xl)] border border-border bg-background px-5 py-3 text-[11px] text-muted-foreground">
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
  );
}

/** The hero signature: two cards (spec manifest + tooling terminal) spanning the
 *  full width, unified by a pipeline bar. Tells the whole story: spec-driven,
 *  AI-native, .NET, golden path. */
export function HeroSignature() {
  return (
    <div className="mt-12 flex w-full flex-col gap-4">
      <div className="grid items-stretch gap-4 md:grid-cols-2">
        <ManifestCard />
        <TerminalCard />
      </div>
      <PipelineBar />
    </div>
  );
}
