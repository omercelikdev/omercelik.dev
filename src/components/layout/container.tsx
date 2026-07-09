import { type ReactNode } from "react";

/** The single content column used on every page and by the header/footer, so
 *  content starts at the exact same x-position everywhere (no horizontal shift
 *  between routes). Max width 1080px, 28px gutter (20px on small screens). */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1080px] px-5 sm:px-7 ${className}`}>
      {children}
    </div>
  );
}
