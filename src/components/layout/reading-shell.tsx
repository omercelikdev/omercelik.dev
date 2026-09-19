import type { ReactNode } from "react";
import { PAGE_PADDING } from "@/components/ui/page-header";

/** The shell every reading page shares — essays, case studies, labs: a
 *  centred column of at most 42rem and, from `lg` up, a rail beside it for
 *  the outline and the facts. Below `lg` the rail follows the text. The
 *  column and rail are centred as a pair, so nothing sits against an edge. */
export function ReadingShell({
  children,
  aside,
  before,
}: {
  children: ReactNode;
  /** Rail content; omit for a plain centred column. */
  aside?: ReactNode;
  /** Anything that must sit outside the grid (progress bar, JSON-LD). */
  before?: ReactNode;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1080px] px-5 sm:px-7 ${PAGE_PADDING}`}
    >
      {before}
      <div className="lg:grid lg:grid-cols-[minmax(0,42rem)_minmax(200px,224px)] lg:justify-center lg:gap-x-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,40rem)_minmax(0,1fr)] xl:gap-x-12">
        <article className="mx-auto min-w-0 max-w-2xl lg:mx-0 lg:max-w-none xl:col-start-2">
          {children}
        </article>
        {aside && (
          <aside className="mt-12 lg:mt-0 xl:col-start-3">
            <div className="flex flex-col gap-6 lg:sticky lg:top-24 xl:max-w-56">
              {aside}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

/** A rail section: a small title over its content. */
export function RailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mono mb-3 text-caption text-faint">{title}</p>
      {children}
    </div>
  );
}
