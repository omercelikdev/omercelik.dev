import { type ReactNode } from "react";

type Tone = "success" | "info" | "warning" | "danger" | "violet" | "neutral";

const TONE: Record<Tone, string> = {
  success: "text-success bg-success-bg border-success-border",
  info: "text-info bg-info-bg border-info-border",
  warning: "text-warning bg-warning-bg border-warning-border",
  danger: "text-danger bg-danger-bg border-danger-border",
  violet: "text-violet bg-violet-bg border-violet-border",
  neutral: "text-muted-foreground bg-muted border-border",
};

/** Mono chip — the universal status/label pattern from the design system. */
export function Chip({
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
      className={`mono inline-flex items-center rounded-[var(--radius-md)] border px-2 py-0.5 text-[11px] font-bold ${TONE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Soft pill for tags (sans, lighter weight). */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-[var(--radius-md)] border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}
