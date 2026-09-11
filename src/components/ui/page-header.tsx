import { type ReactNode } from "react";

/** Title block shared by every inner page, so headings sit at the same place
 *  and scale everywhere. Pair with PAGE_PADDING on the page's Container. */
export function PageHeader({
  title,
  subtitle,
  eyebrow,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="intro flex flex-col gap-3 pb-10">
      {eyebrow}
      <h1 className="text-h1 font-medium text-balance">{title}</h1>
      {subtitle && (
        <p className="max-w-xl text-body text-muted-foreground">{subtitle}</p>
      )}
      {children}
    </header>
  );
}

/** Vertical rhythm for inner pages: room under the sticky header, and a
 *  modest gap before the footer. */
export const PAGE_PADDING = "pt-14 pb-16 sm:pt-20";
