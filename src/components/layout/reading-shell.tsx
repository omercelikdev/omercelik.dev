import type { ReactNode } from "react";
import { PAGE_PADDING } from "@/components/ui/page-header";

/** The shell every reading page shares — essays, case studies, labs. It sits
 *  in the same 1080px frame as the header, so the text starts where the logo
 *  starts and, from `lg` up, a 16rem rail (the facts and the outline) ends
 *  where the header's buttons end: pages don't shift as you move between
 *  them. Below `lg` the rail follows the text. Pages without a rail keep the
 *  same column, so text always starts and wraps at the same place. */
export function ReadingShell({
  children,
  aside,
  before,
}: {
  children: ReactNode;
  /** Rail content; omit it and the rail's column simply stays empty. */
  aside?: ReactNode;
  /** Anything that must sit outside the grid (progress bar, JSON-LD). */
  before?: ReactNode;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1080px] px-5 sm:px-7 ${PAGE_PADDING}`}
    >
      {before}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-x-12">
        <article className="mx-auto min-w-0 max-w-2xl lg:mx-0 lg:max-w-none">
          {children}
        </article>
        {aside && (
          <aside className="mt-12 lg:mt-0">
            <div className="flex flex-col gap-6 lg:sticky lg:top-24">
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
