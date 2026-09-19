import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Counter } from "@/components/motion/counter";
import type { WorkMeta } from "@/lib/work";

/** A case study in a list: sector and period, title, one line, outcome
 *  tiles. Only colour changes on hover. */
export function WorkCard({ work }: { work: WorkMeta }) {
  return (
    <Link
      href={`/work/${work.slug}`}
      className="group relative flex h-full flex-col gap-2.5 rounded-[var(--radius-xl)] border border-border p-5 transition-colors hover:border-foreground"
    >
      <ArrowUpRight
        aria-hidden
        className="absolute end-4 top-4 size-4 text-faint transition-colors group-hover:text-foreground"
      />
      <span className="mono text-caption text-faint">
        {work.sector} · {work.period}
      </span>
      <span className="pe-6 text-lead font-medium text-foreground">
        {work.title}
      </span>
      <span className="text-ui text-muted-foreground">{work.summary}</span>
      {work.outcomes && work.outcomes.length > 0 && (
        <span className="mt-auto flex flex-wrap gap-5 border-t border-border pt-3">
          {work.outcomes.map((o) => (
            <span key={o.label} className="flex flex-col">
              <span className="text-h2 font-medium tabular-nums text-foreground">
                {o.countTo !== undefined ? (
                  <Counter
                    to={o.countTo}
                    suffix={o.value.replace(/^[\d.]+/, "")}
                  />
                ) : (
                  o.value
                )}
              </span>
              <span className="text-caption text-muted-foreground">
                {o.label}
              </span>
            </span>
          ))}
        </span>
      )}
    </Link>
  );
}
