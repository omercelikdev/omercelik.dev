import { type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

/** Small kicker with a live dot, e.g. the hero eyebrow. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="mono inline-flex items-center gap-2.5 text-[13px] text-muted-foreground">
      <span className="inline-block size-1.5 animate-[caret-blink_2.4s_ease-in-out_infinite] rounded-full bg-brand-accent" />
      {children}
    </span>
  );
}

/** Monospace section header: "01 / label" on the lead side, optional link on
 *  the trailing side. Matches the reference's quiet, indexed sections. */
export function SectionHead({
  index,
  label,
  action,
}: {
  index: string;
  label: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-border pb-4">
      <span className="mono text-[13px] text-muted-foreground">
        <span className="text-faint">{index}</span> / {label}
      </span>
      {action && (
        <Link
          href={action.href}
          className="group mono inline-flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          {action.label}
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
        </Link>
      )}
    </div>
  );
}
