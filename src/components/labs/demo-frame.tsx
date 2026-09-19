"use client";

import { lazy, Suspense, useState, type ComponentType } from "react";
import { labDemos } from "@/generated/labs";

/** One lazy component per registered demo, made once at module load. */
const DEMOS: Record<string, ComponentType> = Object.fromEntries(
  Object.entries(labDemos).map(([slug, load]) => [slug, lazy(load)]),
);

/** The box a demo runs in. Closed by default inside an essay — its
 *  JavaScript loads only when opened — and open on the lab's own page. */
export function DemoFrame({
  slug,
  title,
  summary,
  href,
  open: initiallyOpen = false,
}: {
  slug: string;
  title: string;
  summary: string;
  /** The lab's page, linked from the header when embedded. */
  href?: string;
  open?: boolean;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const Demo = DEMOS[slug];

  return (
    <section
      className="my-8 overflow-hidden rounded-[var(--radius-xl)] border border-border"
      aria-label={title}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-ui font-medium text-foreground">
            <span className="mono me-2 text-caption text-faint">Demo</span>
            {title}
          </p>
          <p className="text-caption text-muted-foreground">{summary}</p>
        </div>
        <div className="flex items-center gap-2">
          {href && open && (
            <a
              href={href}
              className="mono text-caption text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
            >
              Open full page
            </a>
          )}
          {!initiallyOpen && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="h-8 rounded-[var(--radius-md)] border border-border px-3 text-ui font-medium text-foreground transition-colors hover:border-foreground"
            >
              {open ? "Close" : "Open"}
            </button>
          )}
        </div>
      </div>
      {open && (
        <div className="border-t border-border">
          {Demo ? (
            <Suspense
              fallback={
                <p className="mono p-4 text-caption text-muted-foreground">
                  Loading demo…
                </p>
              }
            >
              <Demo />
            </Suspense>
          ) : (
            <p className="p-4 text-ui text-danger">
              No demo registered for “{slug}”. Run <code>npm run gen</code>.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
