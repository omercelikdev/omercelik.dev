import { type ReactNode } from "react";

/** Scroll-linked entrance, done entirely in CSS (see `.reveal` in
 *  globals.css). Content is visible without JavaScript and in browsers that
 *  lack scroll-driven animations; the rest fade it up as it enters the view. */
export function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  return <Tag className={`reveal ${className}`}>{children}</Tag>;
}
