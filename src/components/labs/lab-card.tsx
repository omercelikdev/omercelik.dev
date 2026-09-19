import Link from "next/link";
import type { LabMeta } from "@/lib/labs";

/** A lab in a list: a small picture of what it does, title, one line.
 *  Only the border changes on hover. */
export function LabCard({ lab }: { lab: LabMeta }) {
  return (
    <Link
      href={`/labs/${lab.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border transition-colors hover:border-foreground"
    >
      <div
        aria-hidden
        className="grid h-28 place-items-center border-b border-border px-5 [background-image:radial-gradient(var(--muted)_1px,transparent_1px)] [background-size:14px_14px]"
      >
        <Preview kind={lab.preview} />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-body font-medium text-foreground">{lab.title}</p>
        <p className="text-ui text-muted-foreground">{lab.summary}</p>
        <span className="mono mt-auto flex items-center justify-between pt-3 text-caption text-muted-foreground">
          <span>{lab.topic}</span>
          <span className="transition-colors group-hover:text-foreground">
            Open
          </span>
        </span>
      </div>
    </Link>
  );
}

const BOX =
  "mono rounded-[var(--radius-sm)] border border-border bg-surface px-2 py-1 text-meta text-muted-foreground";

/** Tiny, still pictures — the same vocabulary as the diagrams inside. */
function Preview({ kind }: { kind?: LabMeta["preview"] }) {
  switch (kind) {
    case "bars":
      return (
        <div className="flex items-end gap-1.5">
          {[22, 40, 64, 30].map((h, i) => (
            <span
              key={h}
              className={`block w-6 rounded-t-[3px] ${i === 2 ? "bg-brand-accent" : "bg-foreground/80"}`}
              style={{ height: h }}
            />
          ))}
        </div>
      );
    case "process":
      return (
        <div className="flex items-center gap-1.5">
          <span className={BOX}>order</span>
          <Arrow />
          <span className={`${BOX} border-brand-accent text-brand-accent`}>
            process
          </span>
          <Arrow />
          <span className={BOX}>observe</span>
        </div>
      );
    case "gate":
      return (
        <div className="flex items-center gap-1.5">
          <span className={BOX}>spec</span>
          <Arrow />
          <span className={`${BOX} border-brand-accent text-brand-accent`}>
            drift?
          </span>
          <Arrow />
          <span className={BOX}>gate</span>
        </div>
      );
    case "flow":
    default:
      return (
        <div className="flex items-center gap-1.5">
          <span className={BOX}>in</span>
          <Arrow />
          <span className={`${BOX} border-brand-accent text-brand-accent`}>
            step
          </span>
          <Arrow />
          <span className={BOX}>out</span>
        </div>
      );
  }
}

function Arrow() {
  return <span className="h-px w-3 bg-border-strong" />;
}
