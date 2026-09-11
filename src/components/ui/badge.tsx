import { type ReactNode } from "react";
import Link from "next/link";
import { tagSlug } from "@/lib/writings";

type Tone = "success" | "info" | "warning" | "danger" | "violet" | "neutral";

const TONE: Record<Tone, string> = {
  success: "text-success bg-success-bg border-success-border",
  info: "text-info bg-info-bg border-info-border",
  warning: "text-warning bg-warning-bg border-warning-border",
  danger: "text-danger bg-danger-bg border-danger-border",
  violet: "text-violet bg-violet-bg border-violet-border",
  neutral: "text-muted-foreground border-border",
};

/** Mono label for small facts: language codes, statuses ("EN", "spec-lint
 *  passed"). Every label on the site uses this. */
export function Label({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`mono inline-flex flex-none items-center gap-1.5 rounded-full border px-2 py-0.5 text-meta font-medium ${TONE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

const TAG =
  "inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-caption text-muted-foreground";

/** Topic pill — post tags and repository topics look the same everywhere. */
export function Tag({ children }: { children: ReactNode }) {
  return <span className={TAG}>{children}</span>;
}

/** Clickable tag → the tag's filter page. */
export function TagLink({ tag }: { tag: string }) {
  return (
    <Link
      href={`/writings/tag/${tagSlug(tag)}`}
      className={`${TAG} transition-colors hover:border-border-strong hover:text-foreground`}
    >
      {tag}
    </Link>
  );
}
