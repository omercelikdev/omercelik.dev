import { FileText, Sparkles, ShieldCheck, Rocket, type LucideIcon } from "lucide-react";

type Stage = { label: string; Icon: LucideIcon };

const STAGES: Stage[] = [
  { label: "Spec", Icon: FileText },
  { label: "Generate", Icon: Sparkles },
  { label: "Verify", Icon: ShieldCheck },
  { label: "Ship", Icon: Rocket },
];

/** A larger, animated spec-driven pipeline: labelled nodes joined by connectors
 *  with particles flowing left → right. Monochrome, with the accent reserved
 *  for the moving flow and the final "Ship" node. */
export function HeroPipeline() {
  return (
    <div className="mt-10 overflow-x-auto">
      <div className="flex min-w-[520px] items-start">
        {STAGES.map((stage, i) => {
          const last = i === STAGES.length - 1;
          return (
            <div key={stage.label} className="flex flex-1 items-start last:flex-none">
              {/* Node */}
              <div className="flex flex-col items-center gap-2.5">
                <div className="relative">
                  {last && (
                    <span
                      className="absolute inset-0 rounded-[var(--radius-lg)] bg-brand-accent/30"
                      style={{ animation: "node-ring 2.2s ease-out infinite" }}
                    />
                  )}
                  <div
                    className={`relative grid size-11 place-items-center rounded-[var(--radius-lg)] border ${
                      last
                        ? "border-brand-accent/40 bg-brand-accent/10 text-brand-accent"
                        : "border-border bg-background text-foreground"
                    }`}
                  >
                    <stage.Icon className="size-5" strokeWidth={1.75} />
                  </div>
                </div>
                <span className="mono text-[11px] text-muted-foreground">
                  {stage.label}
                </span>
              </div>

              {/* Connector with flowing particles */}
              {!last && (
                <div className="relative mx-1 mt-[22px] h-px flex-1 bg-border">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent"
                      style={{
                        animation: "pipe-flow 2.6s linear infinite",
                        animationDelay: `${i * 0.4 + d * 0.85}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
