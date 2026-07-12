/** An editor-style card showing a golden-path spec manifest — the signature
 *  artifact of the site's positioning (spec-driven, manifest-as-truth). Pure
 *  CSS: two-tone syntax colours, a blinking cursor, a "lint passed" badge. */

const K = "text-foreground";
const V = "text-brand-accent";
const P = "text-faint";

function CheckDot() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12l4.5 4.5L19 6.5" />
    </svg>
  );
}

const LINES: React.ReactNode[] = [
  <><span className={K}>service</span><span className={P}>: </span><span className={V}>orders</span></>,
  <><span className={K}>contracts</span><span className={P}>:</span></>,
  <><span className={P}>{"  - "}</span><span className={K}>openapi</span><span className={P}>: </span><span className={V}>./api/orders.yaml</span></>,
  <><span className={K}>invariants</span><span className={P}>:</span></>,
  <><span className={P}>{"  - "}</span><span className={K}>idempotency</span><span className={P}>: </span><span className={V}>required</span></>,
  <><span className={P}>{"  - "}</span><span className={K}>auth</span><span className={P}>: </span><span className={V}>bearer</span></>,
];

export function SpecCard() {
  return (
    <div className="mt-8 w-full max-w-lg">
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
            <CheckDot />
            spec-lint passed
          </span>
        </div>

        {/* code body */}
        <div className="mono flex gap-4 px-4 py-4 text-[12.5px] leading-[1.7]">
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

        {/* pipeline footer: the spec flows through generate → verify → ship */}
        <div className="mono flex items-center gap-1.5 border-t border-border px-4 py-3 text-[10.5px] text-muted-foreground">
          {STAGES.map((stage, i) => (
            <span key={stage} className="inline-flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="size-1.5 rounded-full bg-brand-accent"
                  style={{ animation: "stage-pulse 2.4s ease-in-out infinite", animationDelay: `${i * 0.3}s` }}
                />
                {stage}
              </span>
              {i < STAGES.length - 1 && <span className="text-faint">→</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const STAGES = ["Spec", "Generate", "Verify", "Ship"] as const;
