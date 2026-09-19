import { type ReactNode } from "react";

/** The single content column used on every page and by the header/footer, so
 *  content starts at the exact same x-position everywhere (no horizontal shift
 *  between routes). Max width 1080px, 28px gutter (20px on small screens). */
export function Container({
  children,
  className = "",
  narrow = false,
}: {
  children: ReactNode;
  className?: string;
  /** List pages: a centred 56rem column instead of the full width. */
  narrow?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-5 sm:px-7 ${narrow ? "max-w-[calc(56rem+3.5rem)]" : "max-w-[1080px]"} ${className}`}
    >
      {children}
    </div>
  );
}
