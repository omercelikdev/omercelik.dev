import type { ReactNode } from "react";

/* ---- Custom line-art icons (not the default set) ---- */
const iconBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "size-[18px]",
};

function SpecIcon() {
  return (
    <svg {...iconBase} aria-hidden>
      <path d="M6 2.5h7l5 5V21a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 21z" />
      <path d="M13 2.5V7a.5.5 0 0 0 .5.5H18" />
      <path d="M9.5 13h5M9.5 16.5h5" />
    </svg>
  );
}
function GenerateIcon() {
  return (
    <svg {...iconBase} aria-hidden>
      <path d="M12 3l1.7 5.1a2 2 0 0 0 1.2 1.2L20 11l-5.1 1.7a2 2 0 0 0-1.2 1.2L12 19l-1.7-5.1a2 2 0 0 0-1.2-1.2L4 11l5.1-1.7a2 2 0 0 0 1.2-1.2z" />
    </svg>
  );
}
function VerifyIcon() {
  return (
    <svg {...iconBase} aria-hidden>
      <path d="M12 2.8l7 2.6v5.4c0 4.2-3 7.2-7 8.4-4-1.2-7-4.2-7-8.4V5.4z" />
      <path d="M9 11.8l2.2 2.2L15.2 10" />
    </svg>
  );
}
function ShipIcon() {
  return (
    <svg {...iconBase} aria-hidden>
      <path d="M21 3L10.5 13.5" />
      <path d="M21 3l-6.6 18-3.9-8.1L2.4 9z" />
    </svg>
  );
}

type Node = {
  title: string;
  sub: string;
  icon: ReactNode;
  status: "done" | "running" | "ready";
};

const NODES: Node[] = [
  { title: "Spec", sub: "manifest.yaml", icon: <SpecIcon />, status: "done" },
  { title: "Generate", sub: "AI-native", icon: <GenerateIcon />, status: "done" },
  { title: "Verify", sub: "guardrails", icon: <VerifyIcon />, status: "running" },
  { title: "Ship", sub: "release", icon: <ShipIcon />, status: "ready" },
];

function Status({ status }: { status: Node["status"] }) {
  if (status === "running") {
    return (
      <span className="relative flex size-2" aria-label="running">
        <span
          className="absolute inline-flex h-full w-full rounded-full bg-brand-accent"
          style={{ animation: "node-ring 1.8s ease-out infinite" }}
        />
        <span className="relative inline-flex size-2 rounded-full bg-brand-accent" />
      </span>
    );
  }
  if (status === "done") {
    return (
      <svg viewBox="0 0 24 24" className="size-3.5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-label="done">
        <path d="M5 12l4.5 4.5L19 6.5" />
      </svg>
    );
  }
  return <span className="size-2 rounded-full border border-border-strong" aria-label="ready" />;
}

function Connector({ delay }: { delay: string }) {
  return (
    <svg
      width="46"
      height="24"
      viewBox="0 0 46 24"
      className="shrink-0 self-center text-brand-accent"
      aria-hidden
    >
      <line x1="1" y1="12" x2="37" y2="12" stroke="var(--border-strong)" strokeWidth="1.5" />
      <line
        x1="1"
        y1="12"
        x2="37"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 7"
        style={{ animation: "dash-flow 0.9s linear infinite", animationDelay: delay }}
      />
      <path
        d="M33 7.5l5 4.5-5 4.5"
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A compact node-graph "flow": connected cards joined by animated flowing
 *  arrows. Monochrome, with the accent reserved for the flow + running node. */
export function HeroFlow() {
  return (
    <div className="-mx-1 mt-10 overflow-x-auto px-1 pb-1">
      <div className="flex w-max items-stretch">
        {NODES.map((node, i) => (
          <div key={node.title} className="flex items-stretch">
            <div className="w-[152px] rounded-[var(--radius-xl)] border border-border bg-background p-3.5 transition-colors duration-200 hover:border-foreground/30">
              <div className="flex items-center justify-between">
                <span className="grid size-8 place-items-center rounded-[var(--radius-md)] border border-border text-foreground">
                  {node.icon}
                </span>
                <Status status={node.status} />
              </div>
              <div className="mt-3 text-[13px] font-medium tracking-tight">
                {node.title}
              </div>
              <div className="mono text-[10.5px] text-faint">{node.sub}</div>
            </div>
            {i < NODES.length - 1 && <Connector delay={`${i * 0.3}s`} />}
          </div>
        ))}
      </div>
    </div>
  );
}
