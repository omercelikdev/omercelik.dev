import { type ReactNode } from "react";

/** Centres content on the page body ("oval") with the standard 1080px gutter. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-5 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}
