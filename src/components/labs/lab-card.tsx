import Link from "next/link";
import type { LabMeta } from "@/lib/labs";

/** A lab in a list. Only the border changes on hover. */
export function LabCard({ lab }: { lab: LabMeta }) {
  return (
    <Link
      href={`/labs/${lab.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border transition-colors hover:border-foreground"
    >
      <div
        aria-hidden
        className="grid h-24 place-items-center border-b border-border [background-image:radial-gradient(var(--muted)_1px,transparent_1px)] [background-size:14px_14px]"
      >
        <span className="mono rounded-[var(--radius-md)] border border-border bg-surface px-2.5 py-1 text-caption text-muted-foreground">
          {lab.topic ?? "demo"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-body font-medium text-foreground">{lab.title}</p>
        <p className="text-ui text-muted-foreground">{lab.summary}</p>
        <span className="mono mt-auto pt-3 text-caption text-muted-foreground transition-colors group-hover:text-foreground">
          Open
        </span>
      </div>
    </Link>
  );
}
